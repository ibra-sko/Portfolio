"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const screens = [
  { src: "/polewin/login.webp", alt: "Polewin — écran de connexion", x: -120, rotate: -7, z: 1 },
  { src: "/polewin/home.webp", alt: "Polewin — écran d'accueil", x: 0, rotate: 0, z: 3 },
  { src: "/polewin/ranking.webp", alt: "Polewin — classement des pilotes", x: 120, rotate: 7, z: 2 },
];

export default function PolewinShowcase() {
  const reduce = useReducedMotion();

  return (
    <a
      href="https://polewin.fr"
      target="_blank"
      rel="noreferrer"
      aria-label="Découvrir Polewin"
      style={{
        position: "relative",
        minHeight: 410,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "radial-gradient(circle at 50% 42%, rgba(255,31,24,.16), transparent 30%), #090a0c",
        border: "1px solid rgba(255,255,255,.08)",
        isolation: "isolate",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          opacity: 0.8,
        }}
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduce ? undefined : { scale: 1.015 }}
        style={{ position: "relative", width: "100%", height: 410, display: "grid", placeItems: "center" }}
      >
        {screens.map((screen, index) => (
          <motion.div
            key={screen.src}
            style={{
              position: "absolute",
              width: index === 1 ? 188 : 170,
              aspectRatio: "280 / 606",
              borderRadius: 24,
              overflow: "hidden",
              border: index === 1 ? "1px solid rgba(255,255,255,.26)" : "1px solid rgba(255,255,255,.13)",
              boxShadow: index === 1 ? "0 34px 70px rgba(0,0,0,.58)" : "0 24px 50px rgba(0,0,0,.42)",
              zIndex: screen.z,
              transformOrigin: "50% 82%",
            }}
            initial={reduce ? false : { x: screen.x * 0.7, rotate: screen.rotate * 0.6, opacity: 0 }}
            whileInView={reduce ? undefined : { x: screen.x, rotate: screen.rotate, opacity: 1 }}
            whileHover={
              reduce
                ? undefined
                : {
                    x: index === 0 ? -145 : index === 2 ? 145 : 0,
                    y: index === 1 ? -8 : -3,
                    rotate: index === 0 ? -9 : index === 2 ? 9 : 0,
                  }
            }
            transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={screen.src}
              alt={screen.alt}
              loading={index === 1 ? "eager" : "lazy"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </motion.div>
        ))}
      </motion.div>

      <div
        style={{
          position: "absolute",
          left: 18,
          bottom: 16,
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 12px",
          borderRadius: 999,
          background: "rgba(9,10,12,.76)",
          border: "1px solid rgba(255,255,255,.14)",
          backdropFilter: "blur(10px)",
          color: "#f4f3ef",
          font: '500 9px/1 "DM Mono", monospace',
          textTransform: "uppercase",
          letterSpacing: ".08em",
        }}
      >
        polewin.fr <ArrowUpRight size={13} />
      </div>
    </a>
  );
}
