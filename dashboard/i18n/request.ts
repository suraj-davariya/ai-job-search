/**
 * next-intl request configuration (ADR-0007). No i18n routing — the locale is a
 * dashboard-local preference, not a URL segment — so this resolves the locale
 * from settings and loads the merged (English-fallback) catalogs.
 *
 * Wired via `createNextIntlPlugin("./i18n/request.ts")` in next.config.mjs.
 */
import { getRequestConfig } from "next-intl/server";
import { loadMessages } from "./messages";
import { resolveLocale } from "./locale";

export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  return {
    locale,
    messages: await loadMessages(locale),
  };
});
