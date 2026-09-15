"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { BookOpen, Clapperboard, Dumbbell, Gamepad2, MoveUpRight, Plane } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Journey3D } from "./journey-3d";
import { Passion3D } from "./passion-3d";

const MILESTONES = [
  { year: "2021 — 2022", title: "Début des études", text: "Premiers pas en développement : algorithmique, web et bases de données." },
  { year: "2023", title: "Alternance en entreprise", text: "Le code en conditions réelles, au sein d’une équipe et sur de vrais projets." },
  { year: "2025", title: "Polewin", text: "Une app mobile de pronostics F1, conçue et développée de bout en bout." },
  { year: "Ensuite", title: "Ton projet ?", text: "La prochaine ligne reste à écrire.", next: true },
];

const PASSIONS = [
  { name: "Cinéma", icon: Clapperboard, note: "Le sens du rythme, du cadrage et du détail qui fait tenir une scène." },
  { name: "Lecture", icon: BookOpen, note: "Prendre le temps, et apprécier une idée exprimée clairement." },
  { name: "Jeux vidéo", icon: Gamepad2, note: "Là où j’ai appris ce qu’est une interface qui répond au quart de seconde." },
  { name: "Voyages", icon: Plane, note: "Changer de repères, s’adapter vite et regarder comment les autres font." },
  { name: "Sport", icon: Dumbbell, note: "La régularité plutôt que les coups d’éclat. Comme sur un projet." },
];

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const sectionInView = useInView(ref, { amount: 0.2 });
  const shown = reduce || inView;
  const ease = [0.22, 1, 0.36, 1] as const;
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Parcours automatique tant que personne n'a choisi une étape.
  useEffect(() => {
    if (reduce || pinned || hovering || !sectionInView) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % MILESTONES.length), 3200);
    return () => window.clearInterval(id);
  }, [reduce, pinned, hovering, sectionInView]);

  const select = useCallback((index: number) => {
    setActive(index);
    setPinned(true);
  }, []);

  return (
    <div className="journey" onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}>
      <div className="journey-aside">
        <p className="journey-label">Parcours</p>
        <p className="journey-hint">Clique une étape ou fais pivoter la scène.</p>
      </div>
      <div className="journey-main">
        <div className="journey-stage-wrap">
          <Journey3D active={active} onSelect={select} />
          <div className="fig-caption">
            <span>fig. {String(active + 1).padStart(2, "0")}</span>
            <span>{MILESTONES[active].year} · {MILESTONES[active].title}</span>
          </div>
        </div>
        <ol className="journey-list" ref={ref}>
          {MILESTONES.map((step, index) => (
            <li
              key={step.title}
              className={`journey-step${step.next ? " is-next" : ""}${index === active ? " is-active" : ""}`}
              onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
            >
              <span className="journey-rule" aria-hidden="true">
                <motion.span
                  className="journey-rule-fill"
                  initial={false}
                  animate={{ scaleX: shown ? 1 : 0, scaleY: shown ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : index * 0.35, ease }}
                />
                <motion.span
                  className="journey-tick"
                  initial={false}
                  animate={{ opacity: shown ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : index * 0.35 }}
                />
              </span>
              <motion.div
                className="journey-body"
                initial={false}
                animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 10 }}
                transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : index * 0.35 + 0.15, ease }}
              >
                <button type="button" className="journey-select" onClick={() => select(index)} aria-pressed={index === active}>
                  <span className="journey-year">{step.year}</span>
                  <h3>{step.title}</h3>
                </button>
                <p>{step.text}</p>
                {step.next && (
                  <a href="#contact" className="journey-link">En parler <MoveUpRight size={13} /></a>
                )}
              </motion.div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function Passions() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (open !== null) setShown(open);
  }, [open]);

  return (
    <div className="passions">
      <div className="passions-head">
        <span>HORS ÉCRAN</span>
        <p>Ce qui m’occupe quand je ne code pas, et qui finit toujours par nourrir ce que je construis.</p>
        <Passion3D index={shown} label={PASSIONS[shown].name} />
      </div>
      <ul className="passion-list">
        {PASSIONS.map((passion, index) => {
          const Icon = passion.icon;
          const isOpen = open === index;
          return (
            <motion.li
              key={passion.name}
              className={`passion-row${isOpen ? " is-open" : ""}`}
              onPointerEnter={(event) => event.pointerType === "mouse" && setOpen(index)}
              onPointerLeave={(event) => event.pointerType === "mouse" && setOpen(null)}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                className="passion-trigger"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span className="passion-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="passion-name">{passion.name}</span>
                <span className="passion-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span>
              </button>
              <motion.div
                className="passion-note"
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p>{passion.note}</p>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
