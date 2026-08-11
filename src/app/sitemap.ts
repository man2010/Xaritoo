import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1, images: [`${siteUrl}/images/xaritoo-summer-program.jpeg`] },
    ...[
      { slug: "about", priority: 0.9, image: "xaritoo-who-we-are.jpeg" },
      { slug: "programs", priority: 0.9, image: "xaritoo-summer-program.jpeg" },
      { slug: "framework", priority: 0.8, image: "xaritoo-mentor-model.jpeg" },
      { slug: "impact", priority: 0.9, image: "xaritoo-impact.jpeg" },
      { slug: "get-involved", priority: 0.9, image: "xaritoo-mentors.jpeg" },
      { slug: "contact", priority: 0.7, image: "xaritoo-culture.jpeg" },
    ].map(({ slug, priority, image }) => ({
      url: `${siteUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      images: [`${siteUrl}/images/${image}`],
    })),
  ];
}
