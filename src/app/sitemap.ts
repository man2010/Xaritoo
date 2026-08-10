import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xaritoo.org";

  return [
    { url: origin, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...["about", "programs", "framework", "impact", "get-involved", "contact"].map((slug) => ({
      url: `${origin}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
