// api/token.js — Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: null,
        expires_in: 60,
        instructions: `Tu es un coach de vente temps réel spécialisé en SPIN Selling.
Règles:
1) Réponds UNIQUEMENT par 2–3 questions courtes (≤ 18 mots), en français, adaptées au dernier propos du prospect.
2) Préfixe chaque question par [S], [P], [I], ou [N].
3) Évite redites et jargon. Si un problème est exprimé, privilégie [I] puis [N].
4) Pas d’intro ni d’explications, juste les questions.`
      })
    });
    if (!r.ok) {
      const t = await r.text();
      return res.status(500).json({ error: "OpenAI error", detail: t });
    }
    const data = await r.json(); // contient client_secret.value
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
