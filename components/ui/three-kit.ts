import * as THREE from "three";

export const INK = new THREE.Color("#11110f");
export const PAPER = new THREE.Color("#f0efe9");
export const ACID = new THREE.Color("#c7ff36");
export const MUTED = new THREE.Color("#8d8c84");

export interface Stage {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  /** Position du pointeur lissée, de -1 à 1. */
  pointer: { x: number; y: number };
  /** Rotation pilotée par le glisser, avec inertie. */
  drag: { rotation: number; velocity: number; active: boolean; moved: boolean };
  size: { width: number; height: number };
  dispose(): void;
}

interface StageOptions {
  fov?: number;
  onFrame: (time: number, delta: number) => void;
  onResize?: (width: number, height: number) => void;
  onVisible?: () => void;
}

/** Crée une scène three.js transparente qui ne tourne que lorsqu'elle est visible. */
export function createStage(container: HTMLElement, { fov = 35, onFrame, onResize, onVisible }: StageOptions): Stage | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.touchAction = "pan-y";
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  const pointerTarget = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };
  const drag = { rotation: 0, velocity: 0, active: false, moved: false };
  const size = { width: 1, height: 1 };
  let lastX = 0;
  let travel = 0;

  const resize = () => {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    size.width = width;
    size.height = height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    onResize?.(width, height);
  };

  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    if (!drag.active) return;
    const dx = event.clientX - lastX;
    lastX = event.clientX;
    travel += Math.abs(dx);
    if (travel > 4) drag.moved = true;
    drag.velocity = dx * 0.006;
    drag.rotation += drag.velocity;
  };
  const onPointerDown = (event: PointerEvent) => {
    drag.active = true;
    drag.moved = false;
    travel = 0;
    lastX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = "grabbing";
  };
  const onPointerUp = (event: PointerEvent) => {
    drag.active = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    canvas.style.cursor = "";
  };
  const onPointerLeave = () => {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
  };

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);

  let frame = 0;
  let running = false;
  let visible = false;
  let last = performance.now();
  const clockStart = last;

  const loop = (now: number) => {
    const delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    pointer.x += (pointerTarget.x - pointer.x) * Math.min(1, delta * 6);
    pointer.y += (pointerTarget.y - pointer.y) * Math.min(1, delta * 6);
    if (!drag.active) {
      drag.rotation += drag.velocity;
      drag.velocity *= Math.pow(0.9, delta * 60);
    }
    onFrame((now - clockStart) / 1000, delta);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(loop);
  };

  const sync = () => {
    const shouldRun = visible && document.visibilityState === "visible";
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(frame);
    }
  };

  const intersection = new IntersectionObserver(([entry]) => {
    const wasVisible = visible;
    visible = entry.isIntersecting;
    if (visible && !wasVisible) onVisible?.();
    sync();
  }, { threshold: 0.15 });
  intersection.observe(container);
  document.addEventListener("visibilitychange", sync);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  return {
    scene,
    camera,
    canvas,
    pointer,
    drag,
    size,
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      scene.traverse((object) => {
        const item = object as THREE.Mesh;
        item.geometry?.dispose();
        const material = item.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      renderer.dispose();
      canvas.remove();
    },
  };
}

interface InkOptions {
  fill?: boolean;
  threshold?: number;
  dashed?: boolean;
  color?: THREE.Color;
  fillColor?: THREE.Color;
}

/**
 * Rendu « dessin technique » : une face couleur papier qui masque les arêtes
 * cachées, et des arêtes à l'encre par-dessus.
 */
export function ink(geometry: THREE.BufferGeometry, { fill = true, threshold = 20, dashed = false, color = INK, fillColor = PAPER }: InkOptions = {}) {
  const group = new THREE.Group();
  if (fill) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: fillColor, side: THREE.DoubleSide, transparent: true, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }),
    );
    mesh.renderOrder = 0;
    group.add(mesh);
  }
  const edges = new THREE.EdgesGeometry(geometry, threshold);
  const material = dashed
    ? new THREE.LineDashedMaterial({ color, dashSize: 0.05, gapSize: 0.045, transparent: true })
    : new THREE.LineBasicMaterial({ color, transparent: true });
  const lines = new THREE.LineSegments(edges, material);
  if (dashed) lines.computeLineDistances();
  lines.renderOrder = 1;
  group.add(lines);
  return group;
}

/** Cercle ou ellipse en trait, dans le plan XY. */
export function ring(radiusX: number, radiusY = radiusX, { dashed = false, color = INK, segments = 64 } = {}) {
  const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, Math.PI * 2);
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segments));
  const material = dashed
    ? new THREE.LineDashedMaterial({ color, dashSize: 0.05, gapSize: 0.045, transparent: true })
    : new THREE.LineBasicMaterial({ color, transparent: true });
  const line = new THREE.LineLoop(geometry, material);
  if (dashed) line.computeLineDistances();
  return line;
}

/** Sol en grille de points, pour donner la profondeur sans alourdir. */
export function dotFloor(size: number, step: number, y: number) {
  const points: number[] = [];
  for (let x = -size; x <= size + 0.001; x += step) {
    for (let z = -size; z <= size + 0.001; z += step) points.push(x, y, z);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const material = new THREE.PointsMaterial({ color: MUTED, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.55 });
  return new THREE.Points(geometry, material);
}

/** Applique une opacité à tous les matériaux d'un objet. */
export function setOpacity(object: THREE.Object3D, opacity: number) {
  object.traverse((child) => {
    const material = (child as THREE.Mesh).material as THREE.Material | undefined;
    if (!material) return;
    const base = (material.userData.baseOpacity ??= material.opacity);
    material.opacity = base * opacity;
  });
}

export function damp(current: number, target: number, lambda: number, delta: number) {
  return THREE.MathUtils.damp(current, target, lambda, delta);
}
