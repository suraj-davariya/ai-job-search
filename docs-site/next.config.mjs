import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/**
 * One build, two deploy targets (build-prompt §8):
 * - DOCS_BASE_PATH unset  → root deploy (Vercel, `npx serve out`)
 * - DOCS_BASE_PATH=/ai-job-search → GitHub Pages project URL
 * The static search index fetch must respect this too — see app/layout.tsx.
 */
const basePath = process.env.DOCS_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    // Exposed so the client-side search knows where the static index lives.
    NEXT_PUBLIC_DOCS_BASE_PATH: basePath,
  },
  reactStrictMode: true,
};

export default withMDX(config);
