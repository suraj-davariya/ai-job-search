/**
 * Active-locale resolution for the dashboard (REQ-7002, ADR-0007).
 *
 * The dashboard uses next-intl WITHOUT locale-prefixed routing (it is a
 * single-user, statically-exportable app — no per-URL locale). The active
 * locale is a dashboard-local preference stored in `.dashboard.local.json`,
 * defaulting to English. Resolution is validated against the released languages
 * so a stale or hand-edited value can never select a locale we can't render.
 */
import { readSettings } from "@/lib/settings";
import { DEFAULT_LOCALE, readAvailableLanguages } from "@/lib/languages";

export { DEFAULT_LOCALE };

/** The persisted UI locale, falling back to English when unset/unknown. */
export async function resolveLocale(): Promise<string> {
  try {
    const saved = (await readSettings()).locale;
    if (!saved) return DEFAULT_LOCALE;
    const available = await readAvailableLanguages();
    return available.some((l) => l.code === saved) ? saved : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}
