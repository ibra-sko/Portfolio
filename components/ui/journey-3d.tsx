"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ACID, INK, MUTED, createStage, damp, dotFloor, ink, ring, setOpacity } from "./three-kit";

const POINTS = [
  new THREE.Vector3(-2.3, -0.1, 0.45),
  new THREE.Vector3(-0.75, 0.3, -0.45),
  new THREE.Vector3(0.8, -0.05, 0.4),
  new THREE.Vector3(2.3, 0.35, -0.3),
];
const START = new THREE.Vector3(-3.4, -0.45, 0.9);
const FLOOR_Y = -0.95;

/** Étape 1 : les fondations, un cube dans un cube. */
function buildStudy() {
  const group = new THREE.Group();
  group.add(ink(new THREE.BoxGeometry(0.46, 0.46, 0.46)));
  const core = ink(new THREE.BoxGeometry(0.2, 0.2, 0.2), { fill: false });
  core.name = "spin";
  group.add(core);
  return group;
}

/** Étape 2 : l'alternance, deux maillons liés. */
function buildWork() {
  const group = new THREE.Group();
  const geometry = () => new THREE.TorusGeometry(0.2, 0.05, 4, 40);
  const a = ink(geometry());
  a.position.x = -0.12;
  const b = ink(geometry());
  b.position.x = 0.12;
  b.rotation.y = Math.PI / 2;
  group.add(a, b);
  group.rotation.z = 0.35;
  return group;
}

/** Étape 3 : Polewin, un téléphone avec un circuit et une voiture qui tourne. */
function buildPolewin() {
  const group = new THREE.Group();
  group.add(ink(new THREE.BoxGeometry(0.36, 0.7, 0.05)));
  const track = ring(0.11, 0.22, { segments: 48 });
  track.position.z = 0.03;
  group.add(track);
  const car = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 8), new THREE.MeshBasicMaterial({ color: INK, transparent: true }));
  car.name = "car";
  car.position.z = 0.035;
  group.add(car);
  group.rotation.y = -0.35;
  return group;
}

/** Étape 4 : le prochain projet, une forme encore en pointillés. */
function buildNext() {
  const group = new THREE.Group();
  const shape = ink(new THREE.IcosahedronGeometry(0.3, 0), { fill: false, dashed: true, threshold: 1, color: MUTED });
  shape.name = "spin";
  group.add(shape);
  return group;
}

interface Journey3DProps {
  active: number;
  onSelect: (index: number) => void;
}

export function Journey3D({ active, onSelect }: Journey3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const selectRef = useRef(onSelect);
  const reduce = useReducedMotion();

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const world = new THREE.Group();
    let reveal = reduce ? 1 : 0;
    let revealing = false;
    const lookTarget = new THREE.Vector3();
    let cameraDistance = 5;

    const stage = createStage(container, {
      fov: 32,
      onVisible: () => {
        revealing = true;
      },
      onResize: (width, height) => {
        const aspect = width / height;
        cameraDistance = aspect < 1.1 ? 9.6 : aspect < 1.6 ? 8 : aspect < 2.2 ? 6.2 : 5;
      },
      onFrame: (time, delta) => update(time, delta),
    });
    if (!stage) return;

    const { scene, camera, drag, pointer, canvas } = stage;
    camera.position.set(0, 1.05, cameraDistance);
    scene.add(world);
    world.add(dotFloor(3.6, 0.3, FLOOR_Y));

    // Le chemin : plein jusqu'à Polewin, en pointillés vers la suite.
    const curve = new THREE.CatmullRomCurve3([START, ...POINTS], false, "centripetal");
    const splitT = 3 / 4;
    const solidPoints = Array.from({ length: 121 }, (_, i) => curve.getPoint((i / 120) * splitT));
    const dashedPoints = Array.from({ length: 41 }, (_, i) => curve.getPoint(splitT + (i / 40) * (1 - splitT)));
    const solidGeometry = new THREE.BufferGeometry().setFromPoints(solidPoints);
    const solid = new THREE.Line(solidGeometry, new THREE.LineBasicMaterial({ color: INK, transparent: true }));
    const dashed = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(dashedPoints),
      new THREE.LineDashedMaterial({ color: MUTED, dashSize: 0.06, gapSize: 0.05, transparent: true }),
    );
    dashed.computeLineDistances();
    world.add(solid, dashed);

    // Les objets de chaque étape, avec leur trait de projection au sol.
    const builders = [buildStudy, buildWork, buildPolewin, buildNext];
    const anchors = POINTS.map((point, index) => {
      const anchor = new THREE.Group();
      anchor.position.copy(point);
      const model = builders[index]();
      anchor.add(model);

      const drop = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(point.x, point.y - 0.45, point.z), new THREE.Vector3(point.x, FLOOR_Y, point.z)]),
        new THREE.LineDashedMaterial({ color: MUTED, dashSize: 0.04, gapSize: 0.04, transparent: true }),
      );
      drop.computeLineDistances();
      world.add(drop);

      const hit = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
      hit.userData.index = index;
      anchor.add(hit);

      world.add(anchor);
      return { anchor, model, drop, hit, scale: 1.2, glow: 0 };
    });

    // Repère vert au sol sous l'étape active.
    const marker = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 0.3, 48),
      new THREE.MeshBasicMaterial({ color: ACID, transparent: true, side: THREE.DoubleSide }),
    );
    marker.rotation.x = -Math.PI / 2;
    marker.position.set(POINTS[0].x, FLOOR_Y + 0.002, POINTS[0].z);
    world.add(marker);
    marker.add(ring(0.3, 0.3, { segments: 48 }));

    // Survol et clic sur les objets.
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let hovered = -1;
    const pick = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(anchors.map((a) => a.hit), false)[0];
      return hit ? (hit.object.userData.index as number) : -1;
    };
    const onMove = (event: PointerEvent) => {
      if (drag.active) return;
      hovered = pick(event);
      canvas.style.cursor = hovered >= 0 ? "pointer" : "grab";
    };
    const onClick = (event: PointerEvent) => {
      if (drag.moved) return;
      const index = pick(event);
      if (index >= 0) selectRef.current(index);
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onClick);

    const update = (time: number, delta: number) => {
      const current = activeRef.current;
      const motion = reduce ? 0 : 1;

      if (revealing && reveal < 1) reveal = Math.min(1, reveal + delta / 1.8);
      const eased = 1 - Math.pow(1 - reveal, 3);
      solidGeometry.setDrawRange(0, Math.floor(solidPoints.length * Math.min(1, eased / splitT)));
      setOpacity(dashed, THREE.MathUtils.clamp((eased - splitT) / (1 - splitT), 0, 1));

      anchors.forEach((item, index) => {
        const appear = THREE.MathUtils.clamp((eased - (index / 4) * 0.85) * 4, 0, 1);
        const isActive = index === current;
        const isHovered = index === hovered;
        item.scale = damp(item.scale, isActive ? 1.65 : isHovered ? 1.4 : 1.2, 8, delta);
        item.glow = damp(item.glow, isActive ? 1 : 0.38, 6, delta);
        item.anchor.scale.setScalar(item.scale * (0.6 + appear * 0.4));
        item.anchor.position.y = POINTS[index].y + Math.sin(time * 1.1 + index * 1.7) * 0.05 * motion;
        item.model.rotation.y += delta * (isActive ? 0.55 : 0.18) * motion;
        setOpacity(item.model, appear * item.glow);
        setOpacity(item.drop, appear * item.glow * 0.8);

        const spin = item.model.getObjectByName("spin");
        if (spin) {
          spin.rotation.x += delta * 0.6 * motion;
          spin.rotation.z += delta * 0.4 * motion;
        }
        const car = item.model.getObjectByName("car");
        if (car) {
          const angle = time * 2.2 * motion;
          car.position.x = Math.cos(angle) * 0.11;
          car.position.y = Math.sin(angle) * 0.22;
        }
      });

      const target = POINTS[current];
      marker.position.x = damp(marker.position.x, target.x, 6, delta);
      marker.position.z = damp(marker.position.z, target.z, 6, delta);
      marker.scale.setScalar(1 + Math.sin(time * 2.4) * 0.06 * motion);
      setOpacity(marker, eased);

      // Retour doux vers l'axe quand on lâche la scène.
      if (!drag.active && Math.abs(drag.velocity) < 0.001) drag.rotation = damp(drag.rotation, 0, 1.2, delta);
      drag.rotation = THREE.MathUtils.clamp(drag.rotation, -1.1, 1.1);
      world.rotation.y = drag.rotation;

      lookTarget.x = damp(lookTarget.x, target.x * 0.4, 3, delta);
      lookTarget.y = damp(lookTarget.y, target.y * 0.3 - 0.2, 3, delta);
      camera.position.x = damp(camera.position.x, target.x * 0.5 + pointer.x * 0.35, 3, delta);
      camera.position.y = damp(camera.position.y, 0.85 + pointer.y * 0.25, 3, delta);
      camera.position.z = damp(camera.position.z, cameraDistance, 3, delta);
      camera.lookAt(lookTarget);
    };

    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onClick);
      stage.dispose();
    };
  }, [reduce]);

  return <div ref={containerRef} className="journey-stage" />;
}
