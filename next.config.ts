import type { NextConfig } from "next";

/**
 * Deployed on Vercel. Pages are still prerendered at build time; the only
 * server code is the contact form's route handler (src/app/api/contact).
 * A static export (`output: "export"`) can't serve that POST route.
 */
const nextConfig: NextConfig = {
  // keep the existing /work/answeriq/ style URLs
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
