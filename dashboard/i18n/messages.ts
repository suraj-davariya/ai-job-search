/**
 * Message loader for the dashboard UI catalogs (REQ-7008, ADR-0007).
 *
 * The catalogs are SHARED, repo-root data at `i18n/ui/<locale>/<namespace>.json`
 * — English (`en`) is the source of truth. The dashboard reads them from disk so
 * translations can be added without touching dashboard code. Each requested
 * locale is deep-merged OVER English, giving per-key English fallback for any
 * string a translation hasn't covered yet (graceful degradation, ARCH-0005).
 *
 * Server-only (node:fs). The path is computed relative to the dashboard dir,
 * which is nested one level under the repo root.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_LOCALE } from "@/lib/languages";

/** The namespaces that make up the dashboard catalog. */
export const NAMESPACES = [
  "common",
  "dashboard",
  "applications",
  "console",
  "settings",
  "salary",
  "errors",
] as const;

export type Namespace = (typeof NAMESPACES)[number];

type Tree = Record<string, unknown>;

/** Absolute path to a locale's catalog directory (repo-root `i18n/ui`). */
function uiDir(locale: string): string {
  return path.join(process.cwd(), "..", "i18n", "ui", locale);
}

async function readNamespace(locale: string, ns: string): Promise<Tree> {
  try {
    const file = path.join(uiDir(locale), `${ns}.json`);
    return JSON.parse(await fs.readFile(file, "utf8")) as Tree;
  } catch {
    return {};
  }
}

/** Recursively merge `over` onto `base`; `over` wins per leaf key. */
function deepMerge(base: Tree, over: Tree): Tree {
  const out: Tree = { ...base };
  for (const [key, value] of Object.entries(over)) {
    const prev = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      prev &&
      typeof prev === "object" &&
      !Array.isArray(prev)
    ) {
      out[key] = deepMerge(prev as Tree, value as Tree);
    } else if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Load every namespace for `locale`, with English as the per-key fallback.
 * Returns a namespaced object (`{ common: {...}, dashboard: {...}, ... }`) ready
 * to hand to next-intl.
 */
export async function loadMessages(
  locale: string,
): Promise<Record<Namespace, Tree>> {
  const out = {} as Record<Namespace, Tree>;
  for (const ns of NAMESPACES) {
    const en = await readNamespace(DEFAULT_LOCALE, ns);
    const localized =
      locale === DEFAULT_LOCALE ? {} : await readNamespace(locale, ns);
    out[ns] = deepMerge(en, localized);
  }
  return out;
}
