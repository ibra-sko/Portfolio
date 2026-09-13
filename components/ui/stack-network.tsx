"use client";

import "./stack-network.css";

import { motion, useReducedMotion } from "motion/react";
import { Braces, Boxes, Cloud, Code2, Container, Database, GitBranch, Workflow } from "lucide-react";
import { useId, type ComponentType } from "react";

type StackItem = {
  id: string;
  name: string;
  short: string;
  category: string;
  x: number;
  y: number;
  path: string;
  delay: number;
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
};

const stack: StackItem[] = [
  { id: "react", name: "React / React Native", short: "React", category: "Front & mobile", x: 92, y: 76, path: "M 282 205 V 92 Q 282 76 266 76 H 92", delay: 0.05, icon: Code2 },
  { id: "next", name: "Next.js", short: "Next.js", category: "Web", x: 454, y: 70, path: "M 296 205 V 86 Q 296 70 312 70 H 454", delay: 0.12, icon: Boxes },
  { id: "typescript", name: "TypeScript", short: "TS", category: "Language", x: 88, y: 205, path: "M 250 205 H 88", delay: 0.18, icon: Braces },
  { id: "express", name: "Express / APIs", short: "Express", category: "Back-end", x: 476, y: 205, path: "M 314 205 H 476", delay: 0.24, icon: GitBranch },
  { id: "java", name: "Java", short: "Java", category: "Back-end", x: 120, y: 336, path: "M 268 217 V 320 Q 268 336 252 336 H 120", delay: 0.3, icon: Code2 },
  { id: "supabase", name: "Supabase / PostgreSQL", short: "DB", category: "Data", x: 444, y: 340, path: "M 298 217 V 324 Q 298 340 314 340 H 444", delay: 0.36, icon: Database },
  { id: "docker", name: "Docker", short: "Docker", category: "Delivery", x: 282, y: 382, path: "M 282 229 V 382", delay: 0.42, icon: Container },
  { id: "automation", name: "n8n / AI / Webhooks", short: "n8n", category: "Automation", x: 506, y: 306, path: "M 310 215 H 380 Q 396 215 396 231 V 290 Q 396 306 412 306 H 506", delay: 0.48, icon: Workflow },
];

function AnimatedPath({ d, gradientId, delay }: { d: string; gradientId: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <>
      <path d={d} className="stack-path-base" />
      {!reduce && (
        <motion.path d={d} className="stack-path-flow" stroke={`url(#${gradientId})`} strokeDasharray="34 150" initial={{ strokeDashoffset: 190 }} animate={{ strokeDashoffset: -190 }} transition={{ duration: 3.6, repeat: Infinity, ease: "linear", delay }} />
      )}
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="45%" stopColor="#c7ff36" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#c7ff36" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </>
  );
}

export default function StackNetwork() {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();

  return (
    <div className="stack-network" aria-label="Stack technique d’Ibrahim Sako">
      <div className="stack-network-grid" aria-hidden="true" />
      <svg className="stack-network-lines" viewBox="0 0 564 410" aria-hidden="true">
        {stack.map((item) => <AnimatedPath key={item.id} d={item.path} gradientId={`${id}-${item.id}`} delay={item.delay} />)}
      </svg>

      <motion.div className="stack-core" initial={reduce ? false : { opacity: 0, scale: 0.88 }} whileInView={reduce ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
        <div className="stack-core-mark">IS</div>
        <div className="stack-core-copy"><span>FULL-STACK</span><b>BUILD / SHIP</b></div>
        {!reduce && <motion.i aria-hidden="true" animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0, 0.45] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />}
      </motion.div>

      {stack.map((item) => {
        const Icon = item.icon ?? Cloud;
        return (
          <motion.div key={item.id} className="stack-node" style={{ left: `${(item.x / 564) * 100}%`, top: `${(item.y / 410) * 100}%` }} initial={reduce ? false : { opacity: 0, scale: 0.8, y: 8 }} whileInView={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: item.delay, ease: [0.22, 1, 0.36, 1] }} title={item.name}>
            <div className="stack-node-icon"><Icon size={17} strokeWidth={1.8} /></div>
            <div className="stack-node-copy"><b>{item.short}</b><span>{item.category}</span></div>
          </motion.div>
        );
      })}
    </div>
  );
}
