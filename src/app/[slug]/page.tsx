import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import InnerPageHero from "@/components/pages/inner-page-hero";
import EngagementForm from "@/components/engagement/engagement-form";
import About from "@/components/sections/about";
import CommunityPartners from "@/components/sections/community-partners";
import Contact from "@/components/sections/contact";
import CtaBand from "@/components/sections/cta-band";
import Framework from "@/components/sections/framework";
import Impact from "@/components/sections/impact";
import Pillars from "@/components/sections/pillars";
import Programs from "@/components/sections/programs";
import Team from "@/components/sections/team";
import Testimonials from "@/components/sections/testimonials";
import { globalKeywords, siteUrl } from "@/lib/seo";

type RouteConfig = {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  seoTitle: string;
  keywords: string[];
  image: string;
  components: ComponentType[];
};

const routes: Record<string, RouteConfig> = {
  about: {
    eyebrow: "Who We Are",
    title: "A Community Built Around Every Young Person's Potential",
    description: "Xaritoo empowers young people through mentorship, education, leadership development, and community connection.",
    icon: "seed",
    seoTitle: "About Xaritoo Youth Mentorship",
    keywords: ["about Xaritoo", "youth mentorship organization", "Sen Path Community"],
    image: "/images/xaritoo-who-we-are.jpeg",
    components: [About, Pillars, Team],
  },
  programs: {
    eyebrow: "Our Programs",
    title: "Programs Designed for Every Season of Growth",
    description: "Mentorship, student support, and community experiences designed to help young people grow.",
    icon: "book",
    seoTitle: "Youth Mentorship & Student Support Programs",
    keywords: ["youth mentorship programs", "student academic support", "summer mentorship program"],
    image: "/images/xaritoo-summer-program.jpeg",
    components: [Programs, CommunityPartners],
  },
  framework: {
    eyebrow: "Our Model",
    title: "The Seed–Gardener–Garden Framework",
    description: "A unique model connecting young people with mentors and community in a living ecosystem of growth.",
    icon: "tree",
    seoTitle: "Our Seed–Gardener–Garden Mentorship Model",
    keywords: ["mentorship model", "mentor mentee framework", "community-supported mentoring"],
    image: "/images/xaritoo-mentor-model.jpeg",
    components: [Framework],
  },
  impact: {
    eyebrow: "Our Impact",
    title: "Impact That Goes Beyond Numbers",
    description: "Every mentorship relationship helps young people build confidence, strengthen leadership, and feel connected.",
    icon: "users",
    seoTitle: "Xaritoo Youth Mentorship Impact",
    keywords: ["youth mentorship impact", "youth confidence and leadership", "community program outcomes"],
    image: "/images/xaritoo-impact.jpeg",
    components: [Impact, Testimonials],
  },
  "get-involved": {
    eyebrow: "Get Involved",
    title: "Be Part of the Garden.",
    description: "Every young person deserves a Gardener. Whether you mentor, volunteer, partner, or give—there is a place for you.",
    icon: "handshake",
    seoTitle: "Become a Mentor or Mentee",
    keywords: ["become a youth mentor", "become a mentee", "volunteer youth program", "partner with Xaritoo"],
    image: "/images/xaritoo-mentors.jpeg",
    components: [CtaBand],
  },
  contact: {
    eyebrow: "Get In Touch",
    title: "We'd Love to Hear From You",
    description: "Whether you're a student, parent, potential mentor, or community partner—reach out. Every connection is a seed.",
    icon: "mail",
    seoTitle: "Contact the Xaritoo Team",
    keywords: ["contact Xaritoo", "youth mentorship inquiry", "Xaritoo Chicago"],
    image: "/images/xaritoo-culture.jpeg",
    components: [Contact],
  },
};

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(routes).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = routes[slug];
  if (!page) return {};
  const canonical = `/${slug}`;

  return {
    title: page.seoTitle,
    description: page.description,
    keywords: [...globalKeywords, ...page.keywords],
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${page.seoTitle} | Xaritoo`,
      description: page.description,
      url: canonical,
      siteName: "Xaritoo",
      locale: "en_US",
      images: [{ url: page.image, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.seoTitle} | Xaritoo`,
      description: page.description,
      images: [page.image],
    },
    robots: { index: true, follow: true },
    other: { "content-language": "en-US" },
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = routes[slug];
  if (!page) notFound();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/${slug}/#webpage`,
    url: `${siteUrl}/${slug}`,
    name: page.seoTitle,
    description: page.description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}${page.image}` },
    inLanguage: "en-US",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: page.eyebrow, item: `${siteUrl}/${slug}` },
    ],
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([webPageSchema, breadcrumbSchema]).replace(/</g, "\\u003c") }} />
      <InnerPageHero eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />
      <div id="page-content">
        {page.components.map((Section, index) => <Section key={`${slug}-${index}`} />)}
      </div>
      {slug === "get-involved" && <EngagementForm />}
    </main>
  );
}
