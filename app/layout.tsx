import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ibrahim Sako — Développeur Full-Stack Freelance",
  description:
    "Sites web, applications, MVP et automatisations IA pour entrepreneurs, associations et entreprises.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
