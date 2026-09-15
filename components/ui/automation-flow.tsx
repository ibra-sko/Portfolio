"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Un seul scénario, lisible de haut en bas :
 * un prospect remplit le formulaire → la fiche arrive qualifiée dans le CRM
 * et un premier email part, sans intervention humaine.
 */
const STEPS = [
  {
    title: "Formulaire reçu",
    tool: "Webhook",
    ms: 40,
    output: [
      ["nom", "Camille Martin"],
      ["société", "Atelier Lumen"],
      ["message", "« Refonte de notre site »"],
    ],
  },
  {
    title: "Entreprise identifiée",
    tool: "API Sirene",
    ms: 420,
    output: [
      ["secteur", "Architecture d’intérieur"],
      ["effectif", "12 salariés"],
      ["ville", "Lyon"],
    ],
  },
  {
    title: "Demande qualifiée",
    tool: "IA",
    ms: 1180,
    output: [
      ["besoin", "Site vitrine"],
      ["priorité", "Haute"],
      ["score", "82 / 100"],
    ],
  },
  {
    title: "Fiche créée",
    tool: "CRM",
    ms: 260,
    output: [
      ["contact", "Camille Martin"],
      ["étape", "À rappeler"],
      ["assigné", "Ibrahim"],
    ],
  },
  {
    title: "Email envoyé",
    tool: "Gmail",
    ms: 180,
    output: [
      ["objet", "Votre projet de refonte"],
      ["statut", "Envoyé"],
      ["relance", "Programmée à J+3"],
    ],
  },
] as const;

const TOTAL_MS = STEPS.reduce((sum, step) => sum + step.ms, 0);
const TICK = 1500;
const REST_TICKS = 2;

function formatMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1).replace(".", ",")} s` : `${ms} ms`;
}

export function AutomationFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => {
      setTick((current) => (current + 1) % (STEPS.length + REST_TICKS));
    }, TICK);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  const active = reduce ? STEPS.length : tick;
  const finished = active >= STEPS.length;
  const shown = Math.min(active, STEPS.length - 1);
  const fill = shown / (STEPS.length - 1);

  return (
    <div className="af-card" ref={ref}>
      <div className="af-head">
        <span className="af-name">
          <span className={`af-status ${finished ? "is-done" : "is-live"}`} />
          Nouveau lead → CRM
        </span>
        <span className="af-run">n8n</span>
      </div>

      <ol className="af-steps">
        <span className="af-track" aria-hidden="true">
          <motion.span
            className="af-track-fill"
            animate={{ scaleY: fill }}
            transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
        {STEPS.map((step, index) => {
          const state = index < active ? "done" : index === active ? "running" : "pending";
          return (
            <li key={step.title} className="af-step" data-state={state}>
              <span className="af-dot" aria-hidden="true">
                {state === "done" ? <Check size={9} strokeWidth={3} /> : index + 1}
              </span>
              <span className="af-label">{step.title}</span>
              <span className="af-tool">{step.tool}</span>
              <span className="af-time">{state === "done" ? formatMs(step.ms) : state === "running" ? "…" : ""}</span>
            </li>
          );
        })}
      </ol>

      <div className="af-output">
        <div className="af-output-head">
          <span>Sortie</span>
          <span>{STEPS[shown].tool}</span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.dl
            key={shown}
            className="af-output-body"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {STEPS[shown].output.map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </motion.dl>
        </AnimatePresence>
      </div>

      <div className="af-foot">
        <span>À la main <b>≈ 15 min</b></span>
        <span>Automatisé <b className="af-foot-fast">{formatMs(TOTAL_MS)}</b></span>
      </div>
    </div>
  );
}
