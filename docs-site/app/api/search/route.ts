import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

// Static search (build-prompt §8): the index is generated at build time and
// exported as a plain file — no server. The client (RootProvider, type:
// "static") fetches it once and searches in the browser via Orama, and the
// search dialog scopes results to the active locale automatically.
export const revalidate = false;

// With i18n enabled, `createFromSource` builds one index per language and asks
// Orama for a tokenizer matching each locale code. Orama only knows a fixed set
// of language names, so map our locale codes onto a supported tokenizer.
// Languages Orama can't stem (Chinese, Japanese, Bengali) fall back to the
// "english" tokenizer — search still works (those pages are English fallback
// content for now anyway), just without language-specific stemming.
export const { staticGET: GET } = createFromSource(source, {
  localeMap: {
    en: "english",
    es: "spanish",
    "zh-Hans": "english",
    hi: "indian",
    ar: "arabic",
    "pt-BR": "portuguese",
    fr: "french",
    de: "german",
    ja: "english",
    ru: "russian",
    id: "indonesian",
    bn: "english",
  },
});
