import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Xaritoo — Mentorship, Culture & Connection",
    short_name: "Xaritoo",
    description: "Youth development through mentorship, culture, education, leadership, and community connection.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8FC",
    theme_color: "#32194D",
    lang: "en-US",
    icons: [
      { src: "/images/xaritoo-logo.jpeg", sizes: "192x192", type: "image/jpeg", purpose: "any" },
      { src: "/images/xaritoo-logo.jpeg", sizes: "512x512", type: "image/jpeg", purpose: "any" },
      { src: "/images/xaritoo-logo.jpeg", sizes: "512x512", type: "image/jpeg", purpose: "maskable" },
    ],
  };
}
