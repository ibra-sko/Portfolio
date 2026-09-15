const recipient = "ibrahim.sakotraore@gmail.com";
const projectLabels: Record<string, string> = {
  site: "Site vitrine",
  application: "Application web",
  mvp: "MVP / SaaS",
  automatisation: "Automatisation",
  autre: "Autre projet",
};

function readField(value: unknown, maxLength: number) {
  return typeof value === "string" && value.length <= maxLength ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Format invalide." }, { status: 415 });
  }

  let payload: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 12_000) return Response.json({ error: "Message trop long." }, { status: 413 });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid payload");
    payload = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Données invalides." }, { status: 400 });
  }

  // Invisible field filled by basic spambots; answer normally without sending.
  if (readField(payload.website, 500)) return Response.json({ ok: true });

  const name = readField(payload.name, 100);
  const email = readField(payload.email, 254);
  const project = readField(payload.project, 50);
  const message = readField(payload.message, 5000);
  if (
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !Object.hasOwn(projectLabels, project) ||
    message.length < 20
  ) {
    return Response.json({ error: "Veuillez vérifier les champs du formulaire." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return Response.json({ error: "L’envoi d’email n’est pas encore configuré." }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `Nouveau projet portfolio — ${projectLabels[project]}`,
        text: `Nom : ${name}\nEmail : ${email}\nProjet : ${projectLabels[project]}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Contact email delivery failed:", response.status);
      return Response.json({ error: "L’envoi a échoué. Réessayez plus tard." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "L’envoi a échoué. Réessayez plus tard." }, { status: 502 });
  }
}
