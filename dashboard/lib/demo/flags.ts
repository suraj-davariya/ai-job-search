/**
 * Demo-mode flag for the static GitHub Pages build.
 *
 * The real dashboard is a local Node server that reads/writes your CSV and runs
 * CLI commands — none of which can exist on a static host. The published demo
 * (`npm run build:demo`) sets DASHBOARD_DEMO=1 so the data layer serves bundled
 * sample data and every mutating surface is disabled. In normal server mode the
 * flag is false and every guard below is a no-op.
 *
 * Two env vars so both sides see it:
 *  - NEXT_PUBLIC_DASHBOARD_DEMO is inlined into client bundles (banner, gating).
 *  - DASHBOARD_DEMO is read by server modules at build time (data loaders).
 */
export const IS_DEMO =
  process.env.NEXT_PUBLIC_DASHBOARD_DEMO === "1" ||
  process.env.DASHBOARD_DEMO === "1";
