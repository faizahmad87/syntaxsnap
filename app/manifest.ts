import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SyntaxSnap",
    short_name: "SyntaxSnap",
    description: "Daily syntax practice for developers",
    start_url: "/",
    display: "standalone",
    background_color: "#171717",
    theme_color: "#171717",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
