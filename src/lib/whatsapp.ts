import type { Tutor } from "./tutors";

export async function sendWhatsAppMessage(to: string, text: string) {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: text } }),
    }
  );
  if (!res.ok) console.error("WhatsApp send failed:", res.status, await res.text());
}

export function buildReply(tutor: Tutor | null, domain: string | null) {
  if (!domain) {
    return "Bonjour 🌱 Merci d'avoir contacté Xaritoo ! Dis-moi ce que tu cherches (un tuteur, un mentor, des infos sur nos programmes) et je t'aide tout de suite.";
  }
  if (!tutor) {
    return `Merci pour ton message ! Nous n'avons pas encore de tuteur disponible en ${domain}, mais l'équipe Xaritoo te recontacte très vite.`;
  }
  return `Bonne nouvelle ! ${tutor.nom} peut t'accompagner en ${tutor.domaine}. Tu peux le/la contacter directement sur WhatsApp : +${tutor.numero.replace(/\D/g, "")} 🌱`;
}
