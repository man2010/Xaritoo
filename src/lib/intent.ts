export async function classifyIntent(text: string): Promise<{ domain: string | null }> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            'Tu analyses le message d\'un étudiant. S\'il cherche un tuteur, extrais le domaine (ex: Mathématiques, Java, Anglais, SAT). Réponds uniquement en JSON : {"domain": "..."} ou {"domain": null} s\'il ne cherche pas de tuteur.',
        },
        { role: "user", content: text.slice(0, 600) },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) return { domain: null };
  const data = await res.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return { domain: null };
  }
}
