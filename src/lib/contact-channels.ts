export const CONTACT_EMAIL = "Xaritoomentorship@gmail.com";
export const WHATSAPP_NUMBER = "13128043857";

export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const emailUrl = (subject: string, message: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

export type SupportEmailPayload = {
  to?: string;
  subject: string;
  message: string;
  name?: string;
  email?: string;
};

export async function submitSupportEmail({
  to = CONTACT_EMAIL,
  subject,
  message,
  name,
  email,
}: SupportEmailPayload) {
  const response = await fetch("/api/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to,
      subject,
      message,
      name,
      email,
      replyTo: email,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const reason = data?.details ? `${data.error}: ${data.details}` : data?.error || "Unable to send email right now.";
    throw new Error(reason);
  }

  return data;
}
