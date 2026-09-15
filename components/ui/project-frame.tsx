"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

interface ProjectFrameProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  hidden?: boolean;
}

/**
 * Cadre de projet : la carte s'incline légèrement vers le curseur, les écrans
 * à l'intérieur se décalent en parallaxe (souris + scroll) via des variables CSS.
 */
export function ProjectFrame({ children, className = "", label, hidden }: ProjectFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 120, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), spring);
  const dx = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), spring);
  const dy = useSpring(useTransform(my, [-0.5, 0.5], [-10, 10]), spring);
  const sheenX = useSpring(useTransform(mx, [-0.5, 0.5], [15, 85]), spring);
  const sheenY = useSpring(useTransform(my, [-0.5, 0.5], [10, 90]), spring);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sy = useTransform(scrollYProgress, [0, 1], [26, -26]);

  const dxVar = useTransform(dx, (v) => `${v.toFixed(2)}px`);
  const dyVar = useTransform(dy, (v) => `${v.toFixed(2)}px`);
  const syVar = useTransform(sy, (v) => `${v.toFixed(2)}px`);
  const sheenXVar = useTransform(sheenX, (v) => `${v.toFixed(1)}%`);
  const sheenYVar = useTransform(sheenY, (v) => `${v.toFixed(1)}%`);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const style = reduce
    ? undefined
    : ({
        rotateX,
        rotateY,
        "--dx": dxVar,
        "--dy": dyVar,
        "--sy": syVar,
        "--sheen-x": sheenXVar,
        "--sheen-y": sheenYVar,
      } as React.CSSProperties);

  return (
    <div className="project-frame-perspective">
      <motion.div
        ref={ref}
        className={`project-art project-frame ${className}`}
        style={style}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        aria-label={label}
        aria-hidden={hidden || undefined}
        initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
        <span className="project-frame-sheen" aria-hidden="true" />
        <span className="project-frame-corner tl" aria-hidden="true" />
        <span className="project-frame-corner br" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
