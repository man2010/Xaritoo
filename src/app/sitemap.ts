import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1, images: [`${siteUrl}/images/xaritoo-logo.jpeg`] },
    ...[
      { slug: "about", priority: 0.9, image: "xaritoo-logo.jpeg" },
      { slug: "programs", priority: 0.9, image: "xaritoo-logo.jpeg" },
      { slug: "framework", priority: 0.8, image: "xaritoo-logo.jpeg" },
      { slug: "impact", priority: 0.9, image: "xaritoo-logo.jpeg" },
      { slug: "get-involved", priority: 0.9, image: "xaritoo-logo.jpeg" },
      { slug: "contact", priority: 0.7, image: "xaritoo-logo.jpeg" },
    ].map(({ slug, priority, image }) => ({
      url: `${siteUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      images: [`${siteUrl}/images/${image}`],
    })),
  ];
}
