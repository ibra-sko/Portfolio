"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Menu,
  MoveUpRight,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import CursorTrail from "./ui/cursor-trail";
import OrbitStack from "./ui/orbit-stack";
import { SplineScene } from "./ui/spline-scene";
import { TextScramble } from "./ui/text-scramble";
import { ProjectFrame } from "./ui/project-frame";
import { AutomationFlow } from "./ui/automation-flow";
import { Passions, Timeline } from "./ui/about-journey";

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
    url: "https://polewin.fr",
  },
  {
    index: "02",
    name: "Ysferia — WEI",
    label: "Web-app événementielle",
    headline: "Une web-app événementielle pour faire vivre et organiser un WEI.",
    description:
      "Une expérience web pensée pour les participants et les organisateurs : profils, tribus, défis photo, activités et outils d’administration, accessibles sur mobile pendant l’événement.",
    stack: ["Next.js", "Supabase", "PWA", "Vercel"],
    type: "dashboard",
    url: undefined,
  },
  {
    index: "03",
    name: "Automatisations",
    label: "Workflows n8n",
    headline: "Un prospect écrit, la suite se fait toute seule.",
    description:
      "Le formulaire est reçu, l’entreprise identifiée, la demande qualifiée par IA, la fiche créée dans le CRM et un premier email envoyé. Quinze minutes de copier-coller remplacées par un workflow de deux secondes.",
    stack: ["n8n", "Webhooks", "API", "IA", "CRM"],
    type: "flow",
    url: undefined,
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
      initial={reduce ? false : { opacity: 0, y: 38, filter: "blur(7px)" }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}



function ProjectVisual({ type }: { type: string }) {
  if (type === "mobile") {
    return (
      <ProjectFrame className="mobile-art polewin-art" label="Trois écrans de l’application Polewin : connexion, accueil et classement">
        <div className="polewin-screen polewin-screen-login">
          <Image src="/polewin/login.png" alt="Écran de connexion Polewin" width={946} height={2048} sizes="(max-width: 720px) 130px, 190px" />
        </div>
        <div className="polewin-screen polewin-screen-ranking">
          <Image src="/polewin/classement.png" alt="Classement des pilotes Polewin" width={946} height={2048} sizes="(max-width: 720px) 130px, 190px" />
        </div>
        <div className="polewin-screen polewin-screen-home">
          <Image src="/polewin/accueil.png" alt="Accueil de Polewin avec le prochain Grand Prix" width={946} height={2048} sizes="(max-width: 720px) 150px, 220px" />
        </div>
      </ProjectFrame>
    );
  }

  if (type === "dashboard") {
    return (
      <ProjectFrame className="ysferia-art" label="Quatre vues de la web-app événementielle Ysferia : profil, défis et administration">
        <div className="ysferia-screen ysferia-screen-challenges">
          <Image src="/evementiel/defis.png" alt="Défis photo des tribus" width={660} height={1428} sizes="(max-width: 720px) 120px, 165px" />
        </div>
        <div className="ysferia-screen ysferia-screen-tribes">
          <Image src="/evementiel/gestion-tribu.png" alt="Gestion des tribus par les organisateurs" width={660} height={1428} sizes="(max-width: 720px) 120px, 165px" />
        </div>
        <div className="ysferia-screen ysferia-screen-activity">
          <Image src="/evementiel/gestion-activite.png" alt="Administration des activités Ysferia" width={660} height={1428} sizes="(max-width: 720px) 120px, 165px" />
        </div>
        <div className="ysferia-screen ysferia-screen-profile">
          <Image src="/evementiel/profil.png" alt="Profil participant et classement des tribus" width={660} height={1428} sizes="(max-width: 720px) 135px, 185px" />
        </div>
      </ProjectFrame>
    );
  }

  return (
    <ProjectFrame className="flow-art" hidden>
      <AutomationFlow />
    </ProjectFrame>
  );
}

function ProjectRow({ project, total }: { project: (typeof projects)[number]; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 45%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0.35, 1, 1, 0.35]);

  return (
    <article className="project-row" ref={ref}>
      <div className="project-number">
        <div className="project-number-sticky">
          <motion.span className="project-number-value" style={reduce ? undefined : { opacity }}>
            {project.index}
            <em>/{String(total).padStart(2, "0")}</em>
          </motion.span>
          <span className="project-number-track" aria-hidden="true">
            <motion.span className="project-number-fill" style={{ scaleY: reduce ? 1 : progress }} />
          </span>
        </div>
      </div>
      <div className="project-copy">
        <p className="project-label">{project.label}</p>
        <h3 className="hover-copy"><TextScramble text={project.name} delay={0.04} reduce={reduce} inView speed={0.045} /></h3>
        <h4 className="hover-copy"><TextScramble text={project.headline} delay={0.06} reduce={reduce} inView speed={0.026} /></h4>
        <p className="project-description">{project.description}</p>
        {project.url && (
          <a href={project.url} target="_blank" rel="noreferrer" className="project-link">
            Découvrir {project.name} <MoveUpRight size={15} />
          </a>
        )}
        <div className="project-stack">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
      <ProjectVisual type={project.type} />
    </article>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 30, restDelta: 0.001 });

  return (
    <main id="top">
      <motion.div className="scroll-progress" style={{ scaleX: reduce ? scrollYProgress : smoothProgress }} aria-hidden="true" />
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
            <h1 className="hover-copy">
              <TextScramble text="Je conçois et développe" delay={0.12} reduce={reduce} />
              <br />
              <TextScramble text="des produits numériques." delay={1.42} reduce={reduce} className="hero-title-muted" />
            </h1>
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
            <h2 className="hover-copy">
              <TextScramble text="Des interfaces qui" delay={0.08} reduce={reduce} inView speed={0.045} />
              <br />
              <TextScramble text="réagissent vraiment." delay={1} reduce={reduce} inView speed={0.045} />
            </h2>
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
            <div className="spline-hint"><span /> Bouge le curseur</div>
          </div>
        </motion.div>
      </section>

      <section className="work-section container" id="work">
        <Reveal className="section-intro">
          <div><span className="section-no">01</span><p>Selected work</p></div>
          <h2 className="hover-copy">
            <TextScramble text="Des projets utilisés," delay={0.04} reduce={reduce} inView speed={0.042} />
            <br />
            <TextScramble text="pas juste des maquettes." delay={0.96} reduce={reduce} inView speed={0.042} />
          </h2>
        </Reveal>

        <div className="project-list">
          {projects.map((project, index) => (
            <Reveal key={project.name} delay={index * 0.05}>
              <ProjectRow project={project} total={projects.length} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="container">
          <Reveal className="section-intro inverted">
            <div><span className="section-no">02</span><p>Prestations</p></div>
            <h2 className="hover-copy">
              <TextScramble text="Un périmètre clair." delay={0.04} reduce={reduce} inView speed={0.044} />
              <br />
              <TextScramble text="Un prix lisible." delay={0.94} reduce={reduce} inView speed={0.044} />
            </h2>
          </Reveal>

          <div className="service-list">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * .04}>
                <motion.article className="service-card" whileHover={reduce ? undefined : { y: -6 }} transition={{ type: "spring", stiffness: 320, damping: 25 }}>
                  <div className="service-card-head">
                    <span className="service-number">/{service.number}</span>
                    <span className="service-scope">Forfait de départ</span>
                  </div>
                  <div className="service-name">
                    <h3><TextScramble text={service.title} delay={0.04} reduce={reduce} inView speed={0.045} /></h3>
                    <p>{service.description}</p>
                  </div>
                  <div className="service-details" aria-label={`Inclus dans l’offre ${service.title}`}>
                    {service.details.map((detail) => <span key={detail}><Check size={14} />{detail}</span>)}
                  </div>
                  <div className="service-card-footer">
                    <div className="service-price"><small>À partir de</small><strong>{service.price}</strong></div>
                    <a className="service-cta" href="#contact" aria-label={`Parler de l’offre ${service.title}`}>
                      Parler du projet <ArrowRight size={16} />
                    </a>
                  </div>
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
          <h2 className="hover-copy">
            <TextScramble text="Je développe." delay={0.04} reduce={reduce} inView speed={0.045} />
            <br />
            <TextScramble text="Mais je pense produit." delay={0.72} reduce={reduce} inView speed={0.045} />
          </h2>
        </Reveal>

        <div className="about-grid about-grid-orbit">
          <Reveal className="about-copy">
            <p className="about-lead hover-copy">
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

        <Timeline />
        <Passions />
      </section>

      <section className="contact-section" id="contact">
        <div className="container contact-inner">
          <Reveal>
            <p className="contact-kicker">UN PROJET EN TÊTE ?</p>
            <h2 className="hover-copy">
              <TextScramble text="On peut le construire" delay={0.04} reduce={reduce} inView speed={0.044} />
              <br />
              <TextScramble text="proprement." delay={1} reduce={reduce} inView speed={0.044} className="contact-title-soft" />
            </h2>
          </Reveal>
          <Reveal className="contact-actions" delay={.08}>
            <div className="contact-intro">
              <p>Décris-moi ton idée, tes objectifs et ton budget approximatif. Je te réponds avec une première direction.</p>
              <a href="mailto:ibrahim.sakotraore@gmail.com" className="contact-email">Écris-moi par email <MoveUpRight size={15} /></a>
            </div>
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
