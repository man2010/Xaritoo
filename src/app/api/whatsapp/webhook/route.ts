import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { classifyIntent } from "@/lib/intent";
import { findTutor } from "@/lib/tutors";
import { sendWhatsAppMessage, buildReply } from "@/lib/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", process.env.WHATSAPP_APP_SECRET!).update(rawBody).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Vérification du webhook par Meta
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  if (
    p.get("hub.mode") === "subscribe" &&
    p.get("hub.verify_token") === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new NextResponse(p.get("hub.challenge"), { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

// Messages entrants
export async function POST(request: NextRequest) {
  const raw = await request.text();

  if (!isValidSignature(raw, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  try {
    const body = JSON.parse(raw);
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message?.type === "text") {
      const from: string = message.from;
      const text: string = message.text.body;

      const { domain } = await classifyIntent(text);
      const tutor = domain ? await findTutor(domain) : null;
      await sendWhatsAppMessage(from, buildReply(tutor, domain));
    }
  } catch (err) {
    console.error("WhatsApp webhook error:", err);
  }

  // Toujours répondre 200, sinon Meta réessaie en boucle
  return NextResponse.json({ ok: true });
}
