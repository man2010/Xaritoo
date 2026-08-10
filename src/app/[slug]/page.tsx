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

type RouteConfig = {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  components: ComponentType[];
};

const routes: Record<string, RouteConfig> = {
  about: {
    eyebrow: "Who We Are",
    title: "A Community Built Around Every Young Person's Potential",
    description: "Xaritoo empowers young people through mentorship, education, leadership development, and community connection.",
    icon: "seed",
    components: [About, Pillars, Team],
  },
  programs: {
    eyebrow: "Our Programs",
    title: "Programs Designed for Every Season of Growth",
    description: "Mentorship, student support, and community experiences designed to help young people grow.",
    icon: "book",
    components: [Programs, CommunityPartners],
  },
  framework: {
    eyebrow: "Our Model",
    title: "The Seed–Gardener–Garden Framework",
    description: "A unique model connecting young people with mentors and community in a living ecosystem of growth.",
    icon: "tree",
    components: [Framework],
  },
  impact: {
    eyebrow: "Our Impact",
    title: "Impact That Goes Beyond Numbers",
    description: "Every mentorship relationship helps young people build confidence, strengthen leadership, and feel connected.",
    icon: "users",
    components: [Impact, Testimonials],
  },
  "get-involved": {
    eyebrow: "Get Involved",
    title: "Be Part of the Garden.",
    description: "Every young person deserves a Gardener. Whether you mentor, volunteer, partner, or give—there is a place for you.",
    icon: "handshake",
    components: [CtaBand],
  },
  contact: {
    eyebrow: "Get In Touch",
    title: "We'd Love to Hear From You",
    description: "Whether you're a student, parent, potential mentor, or community partner—reach out. Every connection is a seed.",
    icon: "mail",
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
  return { title: page.eyebrow, description: page.description, alternates: { canonical: `/${slug}` } };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = routes[slug];
  if (!page) notFound();

  return (
    <main id="main-content">
      <InnerPageHero eyebrow={page.eyebrow} title={page.title} description={page.description} icon={page.icon} />
      <div id="page-content">
        {page.components.map((Section, index) => <Section key={`${slug}-${index}`} />)}
      </div>
      {slug === "get-involved" && <EngagementForm />}
    </main>
  );
}
