import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/booked", "/schedule", "/api/"],
    },
    sitemap: "https://www.darshmode.com/sitemap.xml",
  };
}
