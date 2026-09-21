export const CONTACT_EMAIL = "Xaritoomentorship@gmail.com";
export const WHATSAPP_NUMBER = "13128043857";

export const whatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const emailUrl = (subject: string, message: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
