"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ACID, INK, MUTED, createStage, damp, dotFloor, ink, ring, setOpacity } from "./three-kit";

const FLOOR_Y = -0.78;

function roundedRect(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

type Animate = (time: number, delta: number, motion: number) => void;
interface Model {
  group: THREE.Group;
  animate: Animate;
}

/** Cinéma : deux bobines de film qui tournent. */
function buildCinema(): Model {
  const group = new THREE.Group();
  const reel = (radius: number) => {
    const wheel = new THREE.Group();
    wheel.add(ink(new THREE.CylinderGeometry(radius, radius, 0.1, 48)));
    for (let i = 0; i < 5; i += 1) {
      const angle = (i / 5) * Math.PI * 2;
      const hole = ink(new THREE.CylinderGeometry(radius * 0.22, radius * 0.22, 0.104, 24), { fill: false });
      hole.position.set(Math.cos(angle) * radius * 0.56, 0, Math.sin(angle) * radius * 0.56);
      wheel.add(hole);
    }
    wheel.add(ink(new THREE.CylinderGeometry(radius * 0.12, radius * 0.12, 0.18, 20)));
    wheel.rotation.x = Math.PI / 2;
    return wheel;
  };
  const big = reel(0.5);
  big.position.set(-0.2, -0.12, 0);
  const small = reel(0.34);
  small.position.set(0.5, 0.42, -0.25);
  group.add(big, small);
  return {
    group,
    animate: (_time, delta, motion) => {
      big.rotation.y += delta * 1.1 * motion;
      small.rotation.y += delta * 1.6 * motion;
    },
  };
}

/** Lecture : un livre ouvert dont une page se tourne. */
function buildReading(): Model {
  const group = new THREE.Group();
  const open = 0.38;
  const cover = (side: 1 | -1) => {
    const pivot = new THREE.Group();
    const board = ink(new THREE.BoxGeometry(0.62, 0.86, 0.025));
    board.position.x = side * 0.31;
    pivot.add(board);
    for (let i = 0; i < 4; i += 1) {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(side * 0.1, 0.22 - i * 0.12, 0.016), new THREE.Vector3(side * 0.5, 0.22 - i * 0.12, 0.016)]),
        new THREE.LineBasicMaterial({ color: MUTED, transparent: true }),
      );
      pivot.add(line);
    }
    pivot.rotation.y = -side * open;
    return pivot;
  };
  group.add(cover(-1), cover(1));

  const page = new THREE.Group();
  const sheet = ink(new THREE.PlaneGeometry(0.58, 0.82), { threshold: 1 });
  sheet.position.set(0.29, 0, 0.02);
  page.add(sheet);
  group.add(page);
  group.rotation.x = -0.35;

  return {
    group,
    animate: (time, _delta, motion) => {
      if (!motion) {
        page.rotation.y = -Math.PI / 2;
        return;
      }
      const cycle = (time % 3.2) / 3.2;
      const turn = THREE.MathUtils.smoothstep(cycle, 0.25, 0.75);
      page.rotation.y = -open - turn * (Math.PI - open * 2);
    },
  };
}

/** Jeux vidéo : une manette dont les touches s'enfoncent. */
function buildGaming(): Model {
  const group = new THREE.Group();
  const bodyGeometry = new THREE.ExtrudeGeometry(roundedRect(1.4, 0.72, 0.28), { depth: 0.12, bevelEnabled: false, curveSegments: 10 });
  bodyGeometry.translate(0, 0, -0.06);
  group.add(ink(bodyGeometry));

  const cross = new THREE.Shape();
  const a = 0.05;
  const b = 0.15;
  cross.moveTo(-a, b);
  [[a, b], [a, a], [b, a], [b, -a], [a, -a], [a, -b], [-a, -b], [-a, -a], [-b, -a], [-b, a], [-a, a], [-a, b]].forEach(([x, y]) => cross.lineTo(x, y));
  const dpad = ink(new THREE.ExtrudeGeometry(cross, { depth: 0.06, bevelEnabled: false }));
  dpad.position.set(-0.36, 0, 0.06);
  group.add(dpad);

  const buttons = [
    [0.3, 0.1],
    [0.44, -0.04],
  ].map(([x, y], index) => {
    const button = ink(new THREE.CylinderGeometry(0.065, 0.065, 0.07, 24), index === 0 ? { fillColor: ACID } : {});
    button.rotation.x = Math.PI / 2;
    button.position.set(x, y, 0.08);
    group.add(button);
    return button;
  });
  group.rotation.x = -0.4;

  return {
    group,
    animate: (time, _delta, motion) => {
      const beat = Math.floor(time * 2.5 * motion);
      buttons.forEach((button, index) => {
        const pressed = motion && beat % 3 === index;
        button.position.z = damp(button.position.z, pressed ? 0.05 : 0.08, 20, 1 / 60);
      });
      dpad.rotation.y = motion ? Math.sin(time * 2.5) * 0.12 : 0;
    },
  };
}

/** Voyages : un globe et un avion en orbite. */
function buildTravel(): Model {
  const group = new THREE.Group();
  const globe = new THREE.Group();
  const radius = 0.5;
  const mask = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 0.985, 32, 24),
    new THREE.MeshBasicMaterial({ color: new THREE.Color("#f0efe9"), transparent: true }),
  );
  globe.add(mask);
  [-0.5, 0, 0.5].forEach((lat) => {
    const r = Math.cos(lat) * radius;
    const circle = ring(r, r, { segments: 64 });
    circle.rotation.x = Math.PI / 2;
    circle.position.y = Math.sin(lat) * radius;
    globe.add(circle);
  });
  for (let i = 0; i < 4; i += 1) {
    const meridian = ring(radius, radius, { segments: 64 });
    meridian.rotation.y = (i / 4) * Math.PI;
    globe.add(meridian);
  }
  globe.rotation.z = 0.4;
  group.add(globe);

  const orbit = new THREE.Group();
  orbit.rotation.set(1.15, 0, -0.35);
  orbit.add(ring(0.82, 0.82, { dashed: true, color: MUTED, segments: 96 }));
  const plane = ink(new THREE.ConeGeometry(0.06, 0.18, 3), { fillColor: ACID, threshold: 1 });
  orbit.add(plane);
  group.add(orbit);

  return {
    group,
    animate: (time, delta, motion) => {
      globe.rotation.y += delta * 0.35 * motion;
      const angle = motion ? time * 0.9 : 0.8;
      plane.position.set(Math.cos(angle) * 0.82, Math.sin(angle) * 0.82, 0);
      plane.rotation.z = angle;
    },
  };
}

/** Sport : un ballon qui rebondit. */
function buildSport(): Model {
  const group = new THREE.Group();
  const ball = ink(new THREE.IcosahedronGeometry(0.34, 1), { threshold: 1 });
  group.add(ball);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.3, 40), new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.12 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = FLOOR_Y + 0.004;
  group.add(shadow);

  return {
    group,
    animate: (time, delta, motion) => {
      const phase = motion ? Math.abs(Math.sin(time * 2.6)) : 0.5;
      const height = phase * 0.75;
      const squash = motion ? THREE.MathUtils.clamp(1 - phase * 6, 0, 1) * 0.18 : 0;
      ball.position.y = FLOOR_Y + 0.34 * (1 - squash) + height;
      ball.scale.set(1 + squash, 1 - squash, 1 + squash);
      ball.rotation.z -= delta * 1.8 * motion;
      shadow.scale.setScalar(1 - phase * 0.45);
      setOpacity(shadow, 1 - phase * 0.5);
    },
  };
}

const BUILDERS = [buildCinema, buildReading, buildGaming, buildTravel, buildSport];

export function Passion3D({ index, label }: { index: number; label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(index);
  const reduce = useReducedMotion();

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stage = createStage(container, {
      fov: 30,
      onFrame: (time, delta) => update(time, delta),
    });
    if (!stage) return;
    const { scene, camera, drag, pointer } = stage;
    camera.position.set(0, 0.55, 4.2);

    const world = new THREE.Group();
    scene.add(world);
    world.add(dotFloor(1.5, 0.25, FLOOR_Y));

    const models = BUILDERS.map((build, i) => {
      const model = build();
      world.add(model.group);
      const on = i === indexRef.current;
      return { ...model, presence: on ? 1 : 0, kick: 0, wasOn: on };
    });

    const update = (time: number, delta: number) => {
      const motion = reduce ? 0 : 1;
      const current = indexRef.current;

      models.forEach((model, i) => {
        const on = i === current;
        if (on && !model.wasOn) model.kick = -1.4;
        model.wasOn = on;
        model.presence = reduce ? (on ? 1 : 0) : damp(model.presence, on ? 1 : 0, on ? 7 : 10, delta);
        model.kick = damp(model.kick, 0, 5, delta);
        model.group.visible = model.presence > 0.01;
        if (!model.group.visible) return;
        const eased = model.presence < 1 ? 1 - Math.pow(1 - model.presence, 3) : 1;
        model.group.scale.setScalar(0.4 + eased * 0.6);
        model.group.position.y = (1 - eased) * -0.3;
        setOpacity(model.group, eased);
        model.animate(time, delta, motion);
      });

      const kick = models[current].kick;
      world.rotation.y = drag.rotation + kick + (motion ? Math.sin(time * 0.4) * 0.25 : 0.3) + pointer.x * 0.25;
      world.rotation.x = -pointer.y * 0.08;
      camera.lookAt(0, -0.05, 0);
    };

    return () => stage.dispose();
  }, [reduce]);

  return (
    <div className="passion-stage">
      <div ref={containerRef} className="passion-canvas" />
      <div className="fig-caption">
        <span>fig. {String(index + 1).padStart(2, "0")}</span>
        <span>{label}</span>
      </div>
    </div>
  );
}
