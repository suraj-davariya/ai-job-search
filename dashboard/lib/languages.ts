/**
 * Reader for the shared language registry at the repo root
 * (`i18n/_meta/languages.json`). This file is a CONTRACT owned by the i18n
 * tooling, not the dashboard — the dashboard only reads it to populate the
 * language switcher and resolve text direction (REQ-7002, ADR-0007).
 *
 * Server-only (uses node:fs). If the registry is missing or malformed we fall
 * back to an English-only list so the dashboard still builds and runs
 * (ARCH-0005 graceful degradation).
 */
import { promises as fs } from "node:fs";
import path from "node:path";

export type TextDir = "ltr" | "rtl";

export interface Language {
  code: string;
  name: string;
  endonym: string;
  dir: TextDir;
  status: string;
}

export const DEFAULT_LOCALE = "en";

const FALLBACK: Language[] = [
  { code: "en", name: "English", endonym: "English", dir: "ltr", status: "released" },
];

/** Absolute path to the shared language registry (repo-root `i18n/_meta`). */
function registryFile(): string {
  // process.cwd() is the dashboard/ dir when Next runs; the registry lives at
  // the repo root, one level up.
  return path.join(process.cwd(), "..", "i18n", "_meta", "languages.json");
}

function isLanguage(v: unknown): v is Language {
  const l = v as Record<string, unknown>;
  return (
    !!l &&
    typeof l.code === "string" &&
    typeof l.name === "string" &&
    typeof l.endonym === "string" &&
    (l.dir === "ltr" || l.dir === "rtl") &&
    typeof l.status === "string"
  );
}

/** All registered languages, or an English-only fallback. */
export async function readLanguages(): Promise<Language[]> {
  try {
    const raw = JSON.parse(await fs.readFile(registryFile(), "utf8"));
    const list = Array.isArray(raw?.languages) ? raw.languages.filter(isLanguage) : [];
    return list.length > 0 ? list : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

/** Languages a user may switch to (released only). */
export async function readAvailableLanguages(): Promise<Language[]> {
  const all = await readLanguages();
  const released = all.filter((l) => l.status === "released");
  return released.length > 0 ? released : FALLBACK;
}

/** Text direction for a locale, defaulting to ltr when unknown. */
export async function getLanguageDir(code: string): Promise<TextDir> {
  const langs = await readLanguages();
  return langs.find((l) => l.code === code)?.dir ?? "ltr";
}
