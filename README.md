# Ibrahim Sako — Freelance Landing Page

Landing page portfolio freelance en Next.js, responsive et animée.

## Stack
- Next.js 16
- React
- TypeScript
- Motion
- Lucide React
- Resend pour le formulaire de contact

## Lancer le projet
```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Formulaire de contact

Le formulaire envoie les messages à `ibrahim.sakotraore@gmail.com` via la route `/api/contact` et l’API Resend. Pour activer l’envoi :

1. Créer une clé API Resend et vérifier un domaine d’expédition dans Resend.
2. Copier `.env.example` vers `.env.local`, puis renseigner `RESEND_API_KEY` et `CONTACT_FROM_EMAIL` avec une adresse du domaine vérifié.
3. Définir les mêmes variables d’environnement sur l’hébergement, puis redéployer.

Sans ces variables, le formulaire affiche une erreur d’envoi et propose un lien email direct. Ne pas envoyer de vraies clés dans le dépôt.

## À personnaliser

Dans `components/landing-page.tsx`, remplacer le lien LinkedIn (`href="#"`) et compléter les liens de projets si souhaité.

## Positionnement
La landing met l'accent sur les projets et le produit, avec Polewin présenté comme une application React Native + Express + TypeScript.
