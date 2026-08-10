import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import ImmersiveEffects from "@/components/effects/immersive-effects";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://xaritoo.org"),
  title: {
    default: "Xaritoo | Mentorship, Culture & Connection",
    template: "%s | Xaritoo",
  },
  description:
    "Xaritoo helps young people grow through mentorship, culture, education, leadership, and community.",
  applicationName: "Xaritoo",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Xaritoo",
    title: "Xaritoo | Every Seed Deserves the Opportunity to Grow",
    description: "Helping young people grow through mentorship, culture, and connection.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xaritoo | Mentorship, Culture & Connection",
    description: "Helping young people grow through mentorship, culture, and connection.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#32194D",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <ImmersiveEffects />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
