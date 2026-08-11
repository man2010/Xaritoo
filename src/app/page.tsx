import type { Metadata } from "next";
import App from "@/App";
import { defaultDescription, defaultSocialImage, globalKeywords, siteUrl } from "@/lib/seo";
import { questions } from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "Youth Mentorship, Culture & Connection",
  description: defaultDescription,
  alternates: { canonical: "/" },
  keywords: [...globalKeywords, "mentor a young person", "become a mentee"],
  openGraph: {
    title: "Xaritoo | Every Seed Deserves the Opportunity to Grow",
    description: defaultDescription,
    url: "/",
    images: [{ url: defaultSocialImage, width: 1824, height: 1368, alt: "The Xaritoo community growing together" }],
  },
  twitter: { card: "summary_large_image", title: "Xaritoo | Mentorship, Culture & Connection", description: defaultDescription, images: [defaultSocialImage] },
};

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} /><App /></>;
}
