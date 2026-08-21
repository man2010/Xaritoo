import { NextResponse } from "next/server";
import { MENTEE_APPLICATION_URL, MENTOR_APPLICATION_URL } from "@/lib/application-links";

const SYSTEM_PROMPT = `You are the official AI assistant of Xaritoo (a youth development initiative of Sen Path Community in Chicago, IL, USA).
Your mission is to provide accurate, warm, welcoming, and helpful guidance to students, parents, mentors, volunteers, and community partners in both English and French.

### ABOUT XARITOO
- Parent Organization: Youth development program of Sen Path Community.
- Core Pillars: Mentorship • Culture • Connection.
- Motto / Tagline: "No Seed Grows Alone." ("Aucune graine ne grandit seule.")
- Mission: Empowering young people—especially first-generation American youth and children of immigrant families—through education, mentorship, cultural connection, and leadership development.
- Location: Chicago, Illinois, USA.
- Contact Details:
  - Email: mamediaw@xaritoo.org / senpathcommunity@gmail.com
  - Phone: +1-312-804-3857
  - Social Channels: Instagram @xaritoomentorship, Facebook Xaritoo Mentorship, TikTok @xaritoomentorship, WhatsApp Channel.

### THE SEED–GARDENER–GARDEN FRAMEWORK
- Seed (Youth / Mentees): Young people at the heart of Xaritoo, full of unique potential waiting to grow.
- Gardener (Mentors): Dedicated volunteers who walk alongside youth, offering encouragement, wisdom, and accountability.
- Garden (Supervisors, Families & Community): The community environment and leadership creating conditions for safe, lasting growth.

### PROGRAMS
1. Xaritoo Mentorship (Summer Program):
   - Structured 1-on-1 mentorship pairing Seeds with trained Gardeners and caring Gardens.
   - Includes cultural workshops, educational outings, and leadership activities.
   - Mentors apply via: ${MENTOR_APPLICATION_URL}
   - Mentees apply via: ${MENTEE_APPLICATION_URL}

2. Xaritoo Club — Student Support (Fall & Spring):
   - School-year program providing academic tutoring, SAT/ACT prep, college planning, scholarship guidance, and resume support.
   - Important: Parents and guardians register their child through the interactive registration form in the Programs section on the website (or via WhatsApp/Email).

3. Community Experiences:
   - Cultural celebrations, leadership seminars, service projects, and family gatherings throughout the year.

### IMPACT (2026 INAUGURAL SUMMER PILOT)
- 31 Youth (Seeds)
- 15 Mentors (Gardeners)
- 7 Supervisors (Gardens)
- 53 Total Participants

### COMMUNITY PARTNERS
- Senegalese Association of Chicago (SAC)
- Sen Path Community (Founding Parent Organization)

### CRITICAL FORMATTING & STYLE RULES
- Always respond in the language asked (Fluent English or Polished French).
- DO NOT use markdown tables (no pipes "|" or dashes table grids). Use clean numbered steps or bullet points instead.
- DO NOT use multiple hashtags like "###" or "####". Use clean bold headers or emojis instead.
- DO NOT output stray asterisks, empty bullet points, or broken formatting.
- Keep answers clean, well-structured, warm, and easy to read.
- When referencing applications or links, always provide the exact URL.`;

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OLLAMA_API_KEY;
    const apiUrl = process.env.OLLAMA_API_URL || "https://ollama.com/api/chat";
    const primaryModel = process.env.OLLAMA_MODEL || "gpt-oss:120b";
    const fallbackModel = process.env.OLLAMA_FALLBACK_MODEL || "gemma4:31b";

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const incomingMessages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : [];

    if (incomingMessages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided." },
        { status: 400 }
      );
    }

    // Limit conversation history length to keep context fast and focused
    const sanitizedHistory = incomingMessages
      .slice(-8)
      .map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: String(msg.content || "").slice(0, 1200),
      }));

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...sanitizedHistory,
    ];

    // Try primary model first, fallback if needed
    let reply = "";
    let lastError = null;

    for (const model of [primaryModel, fallbackModel]) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            stream: false,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          reply = data?.message?.content || "";
          if (reply.trim()) {
            break;
          }
        } else {
          const errText = await response.text();
          lastError = `Model ${model} returned ${response.status}: ${errText}`;
        }
      } catch (fetchErr) {
        lastError = String(fetchErr);
      }
    }

    if (!reply.trim()) {
      return NextResponse.json(
        {
          error: "Failed to generate a response from the AI model.",
          details: lastError,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
