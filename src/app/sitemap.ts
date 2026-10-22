import type { MetadataRoute } from "next";

const SITE = "https://www.darshmode.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/recipes`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/spine`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
