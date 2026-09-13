"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  Braces,
  Check,
  Mail,
  Menu,
  MoveUpRight,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import CursorTrail from "./ui/cursor-trail";
import OrbitStack from "./ui/orbit-stack";
import { SplineScene } from "./ui/spline-scene";

function Github({ size = 24, className = "" }: { size?: number | string; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5 0-1.4-.5-2.5-1.5-3.4.1-.3.4-1.6-.1-3.3 0 0-1.2-.4-3.8 1.4a12.8 12.8 0 0 0-7 0C6 1.8 4.8 2.2 4.8 2.2c-.5 1.7-.2 3 .1 3.3-1 1-1.5 2-1.5 3.4 0 5 3 6.2 6 6.5-.8.9-1.2 2-1.2 3.1v4" />
      <path d="M9 18c-2 1-4 1-6-2" />
    </svg>
  );
}

const services = [
  {
    number: "01",
    title: "Site vitrine",
    price: "490 €",
    description: "Pour une présence claire, rapide et crédible qui donne envie de te contacter.",
    details: ["Design responsive", "Jusqu’à 5 pages", "Formulaire de contact", "Mise en ligne"],
  },
  {
    number: "02",
    title: "Application web",
    price: "1 200 €",
    description: "Pour transformer un besoin métier en interface utile, connectée et sur mesure.",
    details: ["Authentification", "Base de données", "Dashboard", "Logique métier"],
  },
  {
    number: "03",
    title: "MVP / SaaS",
    price: "1 800 €",
    description: "Pour passer d’une idée à une première version testable par de vrais utilisateurs.",
    details: ["Cadrage produit", "Fonctions clés", "Back-office", "Déploiement"],
  },
  {
    number: "04",
    title: "Automatisation",
    price: "290 €",
    description: "Pour supprimer des tâches répétitives et connecter les outils que tu utilises déjà.",
    details: ["n8n", "API", "Emails / CRM", "Workflows IA"],
  },
];

const projects = [
  {
    index: "01",
    name: "Polewin",
    label: "Mobile product",
    headline: "Une app mobile de pronostics F1, pensée comme un vrai produit.",
    description:
      "Conception du produit, expérience mobile, logique de pronostics et architecture API. Un projet complet, de l’idée jusqu’à une application destinée aux stores.",
    stack: ["React Native", "Express", "TypeScript", "API"],
    type: "mobile",
  },
  {
    index: "02",
    name: "Ysferia — WEI",
    label: "Event platform",
    headline: "Une plateforme événementielle utilisée pour organiser un WEI.",
    description:
      "Inscriptions, profils, tribus, classements, rôles administrateurs et expérience mobile-first dans une interface pensée pour être utilisée en conditions réelles.",
    stack: ["Next.js", "Supabase", "PWA", "Vercel"],
    type: "dashboard",
  },
  {
    index: "03",
    name: "Automations",
    label: "Systems",
    headline: "Des workflows qui font le travail répétitif à ta place.",
    description:
      "Prospection, CRM, emailing, webhooks et appels API orchestrés dans des workflows robustes pour faire gagner du temps à une équipe.",
    stack: ["n8n", "APIs", "Webhooks", "AI"],
    type: "flow",
  },
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProjectVisual({ type }: { type: string }) {
  if (type === "mobile") {
    return (
      <div className="project-art mobile-art polewin-art" aria-label="Trois écrans de l’application Polewin : connexion, accueil et classement">
        <div className="polewin-screen polewin-screen-login">
          <Image src="/polewin/login.png" alt="Écran de connexion Polewin" width={946} height={2048} sizes="(max-width: 720px) 130px, 190px" />
        </div>
        <div className="polewin-screen polewin-screen-ranking">
          <Image src="/polewin/classement.png" alt="Classement des pilotes Polewin" width={946} height={2048} sizes="(max-width: 720px) 130px, 190px" />
        </div>
        <div className="polewin-screen polewin-screen-home">
          <Image src="/polewin/accueil.png" alt="Accueil de Polewin avec le prochain Grand Prix" width={946} height={2048} sizes="(max-width: 720px) 150px, 220px" />
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="project-art dashboard-art" aria-hidden="true">
        <div className="dash-shell">
          <div className="dash-sidebar"><b>Y</b><span /><span /><span /><span /></div>
          <div className="dash-main">
            <div className="dash-header"><span>Tribus</span><i /></div>
            <div className="dash-stats"><div><small>Participants</small><strong>96</strong></div><div><small>Tribus</small><strong>08</strong></div></div>
            <div className="dash-table"><span /><span /><span /><span /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-art flow-art" aria-hidden="true">
      <div className="flow-grid" />
      <div className="flow-line line-a" />
      <div className="flow-line line-b" />
      <div className="flow-node node-a"><Mail size={18} /><span>Lead</span></div>
      <div className="flow-node node-b"><Braces size={18} /><span>API</span></div>
      <div className="flow-node node-c"><Sparkles size={18} /><span>AI</span></div>
      <div className="flow-node node-d"><Workflow size={18} /><span>CRM</span></div>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <main id="top">
      <CursorTrail />

      <header className="nav-wrap">
        <nav className="nav container">
          <a href="#top" className="wordmark" aria-label="Retour en haut">
            <span>IBRAHIM</span><span>SAKO</span>
          </a>
          <div className="nav-center desktop-only">
            <a href="#work">Projets</a>
            <a href="#services">Prestations</a>
            <a href="#about">À propos</a>
          </div>
          <a className="nav-contact desktop-only" href="#contact">Me contacter <ArrowDownRight size={15} /></a>
          <button className="menu-toggle" aria-label="Ouvrir le menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        {menuOpen && (
          <motion.div className="mobile-nav container" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <a href="#work" onClick={() => setMenuOpen(false)}>Projets</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Prestations</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>À propos</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Me contacter</a>
          </motion.div>
        )}
      </header>

      <section className="hero container">
        <div className="hero-index">FR / 2026</div>
        <motion.div
          className="hero-main"
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-title-wrap">
            <motion.p className="hero-role" initial={reduce ? false : { opacity: 0, y: 14 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ delay: .05 }}>
              Développeur full-stack freelance
            </motion.p>
            <motion.h1 initial={reduce ? false : { opacity: 0, y: 30 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: .75, delay: .08, ease: [.22, 1, .36, 1] }}>
              Je conçois et développe<br /><span>des produits numériques.</span>
            </motion.h1>
          </div>

          <motion.div className="hero-side" initial={reduce ? false : { opacity: 0, y: 22 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }}>
            <p>
              Sites, applications web, produits mobiles et automatisations — avec une attention particulière portée au produit, à la performance et aux détails.
            </p>
            <a href="#contact" className="text-link">Démarrer un projet <MoveUpRight size={17} /></a>
          </motion.div>
        </motion.div>

        <motion.div
          className="spline-stage"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: .85, delay: .22, ease: [.22, 1, .36, 1] }}
        >
          <div className="spline-copy">
            <span className="spline-eyebrow">INTERACTIVE / 3D</span>
            <h2>Des interfaces qui<br />réagissent vraiment.</h2>
            <p>
              Je construis des expériences web et produit où le mouvement sert l’interface, pas juste la décoration.
            </p>
            <div className="spline-meta">
              <span>Web</span><span>Mobile</span><span>API</span><span>Motion</span>
            </div>
          </div>
          <div className="spline-canvas-wrap">
            <div className="spline-grid" />
            <div className="spline-fade" />
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="spline-canvas"
            />
            <div className="spline-hint"><span /> Drag / explore</div>
          </div>
        </motion.div>
      </section>

      <section className="work-section container" id="work">
        <Reveal className="section-intro">
          <div><span className="section-no">01</span><p>Selected work</p></div>
          <h2>Des projets utilisés,<br />pas juste des maquettes.</h2>
        </Reveal>

        <div className="project-list">
          {projects.map((project, index) => (
            <Reveal key={project.name} delay={index * 0.05}>
              <article className="project-row">
                <div className="project-number">{project.index}</div>
                <div className="project-copy">
                  <p className="project-label">{project.label}</p>
                  <h3>{project.name}</h3>
                  <h4>{project.headline}</h4>
                  <p className="project-description">{project.description}</p>
                  <div className="project-stack">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
                <ProjectVisual type={project.type} />
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="container">
          <Reveal className="section-intro inverted">
            <div><span className="section-no">02</span><p>Prestations</p></div>
            <h2>Un périmètre clair.<br />Un prix lisible.</h2>
          </Reveal>

          <div className="service-list">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * .04}>
                <motion.article className="service-line" whileHover={reduce ? undefined : { x: 8 }} transition={{ type: "spring", stiffness: 360, damping: 28 }}>
                  <span className="service-number">{service.number}</span>
                  <div className="service-name"><h3>{service.title}</h3><p>{service.description}</p></div>
                  <div className="service-details">{service.details.map((d) => <span key={d}><Check size={13} />{d}</span>)}</div>
                  <div className="service-price"><small>à partir de</small><strong>{service.price}</strong></div>
                  <ArrowDownRight className="service-arrow" size={25} />
                </motion.article>
              </Reveal>
            ))}
          </div>

          <Reveal className="service-foot">
            <p>Besoin ponctuel ? <b>Intervention dès 100 €</b></p>
            <p>Maintenance <b>dès 39 €/mois</b></p>
            <p>Renfort entreprise / agence <b>335 €/jour</b></p>
          </Reveal>
        </div>
      </section>

      <section className="about-section container" id="about">
        <Reveal className="section-intro">
          <div><span className="section-no">03</span><p>À propos</p></div>
          <h2>Je développe.<br />Mais je pense produit.</h2>
        </Reveal>

        <div className="about-grid about-grid-orbit">
          <Reveal className="about-copy">
            <p className="about-lead">
              Mon rôle ne s’arrête pas à écrire du code. Je cherche d’abord à comprendre ce qui doit être construit, pourquoi, et comment le rendre simple à utiliser.
            </p>
            <p>
              Je travaille sur des interfaces, des APIs, des bases de données, des produits mobiles et des automatisations. L’objectif reste le même : livrer quelque chose de propre, maintenable et réellement utile.
            </p>
          </Reveal>
          <Reveal className="orbit-panel" delay={.08}>
            <div className="orbit-panel-head">
              <span>STACK / OUTILS</span>
              <p>Une stack polyvalente qui tourne autour du produit à construire.</p>
            </div>
            <OrbitStack />
          </Reveal>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="container contact-inner">
          <Reveal>
            <p className="contact-kicker">UN PROJET EN TÊTE ?</p>
            <h2>On peut le construire<br /><span>proprement.</span></h2>
          </Reveal>
          <Reveal className="contact-actions" delay={.08}>
            <a href="mailto:ton-email@example.com" className="contact-button">Parler du projet <ArrowRight size={19} /></a>
            <p>Décris-moi simplement ton idée, ton objectif et ton budget approximatif. Je te réponds avec une première direction.</p>
          </Reveal>
          <div className="contact-bottom">
            <span>© 2026 Ibrahim Sako</span>
            <div><a href="https://github.com/ibra-sko"><Github size={16} /> GitHub</a><a href="#">LinkedIn <MoveUpRight size={14} /></a></div>
          </div>
        </div>
      </section>
    </main>
  );
}
