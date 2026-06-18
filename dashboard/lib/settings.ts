/**
 * Local, non-secret dashboard preferences (REQ-5016), persisted to a gitignored
 * `.dashboard.local.json`. The schema is a strict whitelist — only repoRoot,
 * port, readOnly, and locale are ever stored, so a stray API key or token can't
 * leak into the file. Read tolerates a missing/corrupt file with `{}`
 * (ARCH-0005).
 */
import { promises as fs } from "node:fs";
import { paths } from "@/lib/paths";

export interface DashboardSettings {
  repoRoot?: string;
  port?: number;
  readOnly?: boolean;
  /** Active UI locale code (REQ-7002). Defaults to English when unset. */
  locale?: string;
}

/** Keep only the allowed, well-typed fields — drops everything else. */
function sanitize(raw: unknown): DashboardSettings {
  const r = (raw ?? {}) as Record<string, unknown>;
  const out: DashboardSettings = {};
  if (typeof r.repoRoot === "string") out.repoRoot = r.repoRoot;
  if (typeof r.port === "number" && Number.isFinite(r.port)) out.port = r.port;
  if (typeof r.readOnly === "boolean") out.readOnly = r.readOnly;
  if (typeof r.locale === "string" && r.locale.trim()) out.locale = r.locale;
  return out;
}

export async function readSettings(
  file: string = paths.settingsFile(),
): Promise<DashboardSettings> {
  try {
    return sanitize(JSON.parse(await fs.readFile(file, "utf8")));
  } catch {
    return {};
  }
}

/** Merge a patch over the current settings and persist (whitelisted). */
export async function writeSettings(
  patch: DashboardSettings,
  file: string = paths.settingsFile(),
): Promise<DashboardSettings> {
  const next = sanitize({ ...(await readSettings(file)), ...patch });
  await fs.writeFile(file, JSON.stringify(next, null, 2), "utf8");
  return next;
}
