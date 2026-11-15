import type { MetadataRoute } from "next";
import { identity, projects } from "@/content/content";

// static export (GitHub Pages): render once at build time
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = identity.siteUrl.replace(/\/$/, "");
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}/`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
