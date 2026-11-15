import type { NextConfig } from "next";

/**
 * Static export: `next build` writes plain HTML/CSS/JS to `out/`, which GitHub
 * Pages serves at mannahalpara.me (see .github/workflows/deploy.yml).
 * Pages has no server, so no image optimizer and no custom headers.
 */
const nextConfig: NextConfig = {
  output: "export",
  // emit work/answeriq/index.html, not answeriq.html next to an answeriq/ folder,
  // which GitHub Pages would resolve to the folder and 404
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
