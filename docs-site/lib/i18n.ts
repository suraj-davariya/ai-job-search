import type { I18nConfig } from "fumadocs-core/i18n";
import { defineI18nUI } from "fumadocs-ui/i18n";

/**
 * Internationalization config for the docs site (build-prompt §i18n).
 *
 * - `defaultLanguage: "en"` + `hideLocale: "default-locale"` keeps every
 *   English URL exactly where it is today (`/docs/...`, no prefix). Only the
 *   non-default languages get a path prefix (`/es/docs/...`).
 * - `parser: "dot"` means translations live in the SAME `content/docs` tree
 *   as dot-locale files — `apply.es.mdx` sits next to `apply.mdx`. The English
 *   files keep their plain names. No duplicated directory tree.
 * - `fallbackLanguage: "en"` (the default for `defaultLanguage`) makes every
 *   missing translation fall back to the English page. Because of this, every
 *   configured language resolves every page — untranslated ones simply render
 *   the English content — so the switcher can offer all languages now even
 *   though only `en` + `es` have real content.
 *
 * The full language list is configured up front so the switcher offers them;
 * only `en` and `es` ship content in this pilot. The rest fall back to English.
 */
export const i18n: I18nConfig = {
  defaultLanguage: "en",
  hideLocale: "default-locale",
  parser: "dot",
  languages: [
    "en",
    "es",
    "zh-Hans",
    "hi",
    "ar",
    "pt-BR",
    "fr",
    "de",
    "ja",
    "ru",
    "id",
    "bn",
  ],
};

/** Languages that read right-to-left — used to flip `dir` on <html>. */
export const RTL_LANGUAGES = new Set<string>(["ar"]);

export function isRtlLocale(locale: string): boolean {
  return RTL_LANGUAGES.has(locale);
}

/**
 * UI config consumed by `<RootProvider i18n={...}>`. `defineI18nUI` builds a
 * `provider(locale)` that yields `{ locale, locales, translations }`; the
 * `displayName` of each entry is what the language switcher shows.
 *
 * Only Spanish ships translated UI chrome for now; the other languages fall
 * back to Fumadocs' English UI strings (their page content still falls back to
 * English too). Adding more is purely additive here — no code changes needed.
 */
export const { provider } = defineI18nUI(i18n, {
  en: { displayName: "English" },
  es: {
    displayName: "Español",
    "Search(search dialog)": "Buscar",
    "Search(search trigger)": "Buscar",
    "No results found(search dialog)": "No se encontraron resultados",
    "On this page(table of contents)": "En esta página",
    "Table of Contents(inline table of contents)": "Tabla de contenidos",
    "Last updated on(page footer)": "Última actualización el",
    "Next Page(pagination)": "Siguiente",
    "Previous Page(pagination)": "Anterior",
    "Choose a language(language switcher)": "Elegir un idioma",
  },
  "zh-Hans": { displayName: "简体中文" },
  hi: { displayName: "हिन्दी" },
  ar: { displayName: "العربية" },
  "pt-BR": { displayName: "Português (Brasil)" },
  fr: { displayName: "Français" },
  de: { displayName: "Deutsch" },
  ja: { displayName: "日本語" },
  ru: { displayName: "Русский" },
  id: { displayName: "Bahasa Indonesia" },
  bn: { displayName: "বাংলা" },
});

const LANGUAGE_SET = new Set<string>(i18n.languages);

/**
 * Extract the active locale from a Next.js pathname (already basePath-stripped
 * by `next/navigation`). Non-default languages are prefixed (`/es/docs/...`);
 * the default language is unprefixed (`/docs/...`), so anything that doesn't
 * start with a known non-default code is English.
 */
export function localeFromPathname(pathname: string): string {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && first !== i18n.defaultLanguage && LANGUAGE_SET.has(first)) {
    return first;
  }
  return i18n.defaultLanguage;
}

/**
 * Build an in-app path for a given locale, mirroring `hideLocale:
 * "default-locale"`: the default language gets no prefix, others get `/<lang>`.
 * `next/link` / `next/navigation` add the basePath automatically, so callers
 * must NOT include it here.
 */
export function localizedPath(locale: string, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  if (locale === i18n.defaultLanguage) {
    return clean ? `/${clean}` : "/";
  }
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/** Convenience: the docs root URL for a locale (`/docs` or `/es/docs`). */
export function localizedDocsUrl(locale: string): string {
  return localizedPath(locale, "docs");
}
