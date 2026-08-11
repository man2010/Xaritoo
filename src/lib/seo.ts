const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xaritoo.org";

export const siteUrl = configuredUrl.replace(/\/$/, "");
export const siteName = "Xaritoo";
export const defaultDescription =
  "Xaritoo is a youth development program of Sen Path Community helping young people grow through mentorship, culture, education, leadership, and community connection.";
export const defaultSocialImage = "/images/xaritoo-summer-program.jpeg";

export const socialProfiles = [
  "https://www.instagram.com/xaritoomentorship/",
  "https://www.facebook.com/XaritooMentorship",
  "https://www.tiktok.com/@xaritoomentorship",
];

export const globalKeywords = [
  "Xaritoo",
  "youth mentorship",
  "mentoring program",
  "youth development",
  "student support",
  "cultural connection",
  "community mentorship",
  "youth leadership",
  "Chicago youth programs",
  "Sen Path Community",
];

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}
