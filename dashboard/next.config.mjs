/**
 * Two build targets from one app:
 *  - default (`next build` / `npm run serve`) → the real local server:
 *    server components read your CSV from disk, API routes run commands.
 *  - demo (`npm run build:demo`, sets DASHBOARD_DEMO=1) → a static export for
 *    GitHub Pages: bundled sample data, every mutating surface disabled, served
 *    read-only under a project-page base path. See lib/demo/flags.ts and
 *    scripts/export-demo.mjs (which excludes the server-only routes/actions).
 *
 * DASHBOARD_DEMO_BASE_PATH lets the same demo deploy at the repo-name subpath
 * (GitHub Pages) or at root (e.g. `npx serve out`).
 */
const isDemo = process.env.DASHBOARD_DEMO === "1";
const demoBasePath =
  process.env.DASHBOARD_DEMO_BASE_PATH ?? (isDemo ? "/ai-job-search/dashboard" : "");

/** @type {import('next').NextConfig} */
const baseConfig = {
  // No remote images, no Google Fonts network fetch — fully local (REQ-5008 / NFR-0017).
  images: { remotePatterns: [] },
  // Disable Next telemetry-style analytics by convention; no external calls.
  poweredByHeader: false,
};

/** @type {import('next').NextConfig} */
const demoConfig = {
  ...baseConfig,
  output: "export",
  basePath: demoBasePath || undefined,
  assetPrefix: demoBasePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true, remotePatterns: [] },
  env: {
    // Inlined so client components (banner, gating) see the demo flag.
    NEXT_PUBLIC_DASHBOARD_DEMO: "1",
  },
};

export default isDemo ? demoConfig : baseConfig;
