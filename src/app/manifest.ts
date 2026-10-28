import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Crescent RFI",
    short_name: "Crescent RFI",
    description: "Crescent RFI and quality inspection portal",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#091426",
    theme_color: "#091426",
    categories: ["business", "productivity"],
    icons: [
      { src: "/crescent-rfi-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/crescent-rfi-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/crescent-rfi-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
