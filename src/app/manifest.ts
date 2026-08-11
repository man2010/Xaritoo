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
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
