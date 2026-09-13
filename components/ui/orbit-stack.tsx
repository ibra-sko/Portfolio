"use client";

import { motion, useReducedMotion } from "motion/react";
import { Braces, Boxes, Code2, Container, Database, GitBranch, Workflow, Wrench } from "lucide-react";

const items = [
  { label: "React Native", icon: Code2 },
  { label: "Next.js", icon: Boxes },
  { label: "TypeScript", icon: Braces },
  { label: "Express", icon: GitBranch },
  { label: "Java", icon: Wrench },
  { label: "Supabase", icon: Database },
  { label: "Docker", icon: Container },
  { label: "n8n", icon: Workflow },
];

export default function OrbitStack() {
  const reduce = useReducedMotion();

  return (
    <div className="orbit-stack" aria-label="Technologies principales">
      <div className="orbit-ring orbit-ring-outer" />
      <div className="orbit-ring orbit-ring-inner" />

      <motion.div
        className="orbit-track"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, index) => {
          const angle = (360 / items.length) * index;
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="orbit-node-wrap"
              style={{ transform: `rotate(${angle}deg) translateX(var(--orbit-radius))` }}
            >
              <motion.div
                className="orbit-node"
                animate={reduce ? undefined : { rotate: -360 - angle }}
                initial={{ rotate: -angle }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              >
                <Icon size={17} strokeWidth={1.55} />
                <span>{item.label}</span>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      <div className="orbit-core">
        <span>STACK</span>
        <strong>FULL<br />STACK</strong>
        <small>mobile · web · api</small>
      </div>
    </div>
  );
}
