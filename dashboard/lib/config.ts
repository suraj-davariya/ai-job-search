/**
 * Runtime configuration: repo path, port, read-only mode.
 * Sourced from env vars (set by scripts/start.mjs); a settings file is phase 2+.
 * Kept server-only — never import into client components.
 */
import { repoRoot } from "./paths";

export const DEFAULT_PORT = 4480;

export interface DashboardConfig {
  /** Absolute repo root the dashboard reads/writes against. */
  repoRoot: string;
  /** Port the server is bound to (loopback only). */
  port: number;
  /** When true, all mutations and action triggers are disabled (REQ-5007). */
  readOnly: boolean;
}

function envFlag(name: string): boolean {
  const v = process.env[name];
  return v === "1" || v === "true";
}

export function getConfig(): DashboardConfig {
  return {
    repoRoot: repoRoot(),
    port: Number(process.env.PORT) || DEFAULT_PORT,
    readOnly: envFlag("CAREERFORGE_READ_ONLY"),
  };
}

/** Convenience for guarding writes/actions. */
export function isReadOnly(): boolean {
  return envFlag("CAREERFORGE_READ_ONLY");
}
