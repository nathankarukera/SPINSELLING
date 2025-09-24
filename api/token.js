// api/token.js — Node serverless (Vercel)
// Renvoie un token éphémère Realtime et affiche les erreurs en clair.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed (use POST)" });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });
  }

  try {
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Si ce modèle ne passe pas chez toi, essaye "gpt-4o-realtime-preview"
        model: "gpt-4o-realtime-preview",
        voice: null,
        expires_in: 60,
        instructions: `Tu es un coach de vente temps réel spécialisé en SPIN Selling.
Règles:
1) Réponds UNIQUEMENT par 2–3 questions courtes (≤ 18 mots), en français, adaptées au dernier propos du prospect.
2) Préfixe chaque question par [S], [P], [I], ou [N].
3) Évite redites/jargon. Si un problème est exprimé, privilégie [I] puis [N].
4) Pas d’intro ni d’excuses, uniquement les questions.`
      })
    });

    const text = await r.text();
    if (!r.ok) {
      // renvoie l’erreur brute pour debug
      return res.status(500).json({ error: "OpenAI error", detail: text });
    }
    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
