import type { MetadataRoute } from "next";
import { identity } from "@/content/content";

// static export (GitHub Pages): render once at build time
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = identity.siteUrl.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
