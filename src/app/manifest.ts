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
    background_color: "#031f19",
    theme_color: "#06352b",
    categories: ["business", "productivity"],
    icons: [
      { src: "/192x192%20new.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/512x512%20new.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/512x512%20new.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
