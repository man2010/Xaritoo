import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import ImmersiveEffects from "@/components/effects/immersive-effects";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import XaritooChat from "@/components/chat/xaritoo-chat";
import { absoluteUrl, defaultDescription, defaultSocialImage, globalKeywords, siteName, siteUrl, socialProfiles } from "@/lib/seo";
import "../index.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Xaritoo | Mentorship, Culture & Connection",
    template: "%s | Xaritoo",
  },
  description: defaultDescription,
  applicationName: siteName,
  manifest: "/manifest.webmanifest",
  keywords: globalKeywords,
  authors: [{ name: "Xaritoo", url: siteUrl }],
  creator: "Xaritoo",
  publisher: "Xaritoo",
  category: "Youth Development",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/favicon-48.png", type: "image/png", sizes: "48x48" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Xaritoo",
    title: "Xaritoo | Every Seed Deserves the Opportunity to Grow",
    description: "Helping young people grow through mentorship, culture, and connection.",
    url: "/",
    images: [{ url: defaultSocialImage, width: 1824, height: 1368, alt: "Xaritoo youth, mentors, and community members together" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xaritoo | Mentorship, Culture & Connection",
    description: "Helping young people grow through mentorship, culture, and connection.",
    images: [defaultSocialImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#32194D",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: absoluteUrl("/images/xaritoo-logo.jpeg"),
    image: absoluteUrl(defaultSocialImage),
    description: defaultDescription,
    email: "mamediaw@xaritoo.org",
    telephone: "+1-312-804-3857",
    sameAs: socialProfiles,
    parentOrganization: { "@type": "Organization", name: "Sen Path Community" },
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    description: defaultDescription,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-US",
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]).replace(/</g, "\\u003c") }} />
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <ImmersiveEffects />
        <Header />
        {children}
        <Footer />
        <XaritooChat />
      </body>
    </html>
  );
}
