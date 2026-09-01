import type { Metadata } from "next";
import NewsGalleryPage from "@/components/pages/news-gallery-page";
import { defaultDescription, defaultSocialImage, globalKeywords, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "News - Stories from Our Community",
  description: "Follow Xaritoo's journey through our latest news, events, and success stories. See mentorship, culture, and connection come to life.",
  alternates: { canonical: "/news-gallery" },
  keywords: [...globalKeywords, "Xaritoo news", "mentorship updates", "youth program events", "community stories"],
  openGraph: {
    title: "Xaritoo News - Stories from Our Community",
    description: defaultDescription,
    url: "/news-gallery",
    images: [{ url: defaultSocialImage, width: 1824, height: 1368, alt: "Xaritoo community in action" }],
  },
  twitter: { card: "summary_large_image", title: "Xaritoo News", description: "Experience our mentorship journey", images: [defaultSocialImage] },
};

export default function NewsGalleryRoute() {
  return <NewsGalleryPage />;
}