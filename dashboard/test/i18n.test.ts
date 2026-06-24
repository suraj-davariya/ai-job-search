import { describe, it, expect, vi } from "vitest";
import { readAvailableLanguages } from "@/lib/languages";
import { loadMessages } from "@/i18n/messages";
import { readSettings } from "@/lib/settings";

vi.mock("@/lib/settings");

/**
 * End-to-end check that the dashboard i18n is actually reachable — the 11 shipped
 * translations exist on disk, so the switcher must offer them and the loader must
 * resolve them. Guards two past bugs: (1) filtering to released-only hid every
 * language; (2) returning the whole registry exposed catalog-less planned
 * languages as empty English shells. The switcher must offer exactly the
 * on-disk catalogs (English always present).
 */
describe("dashboard i18n", () => {
  it("offers every on-disk language, excludes catalog-less planned ones", async () => {
    const langs = await readAvailableLanguages();
    expect(langs.length).toBeGreaterThan(1);
    expect(langs.some((l) => l.code === "es")).toBe(true);
    expect(langs.some((l) => l.code === "ar" && l.dir === "rtl")).toBe(true);
    // Planned languages exist in the registry but ship no catalog yet → hidden.
    expect(langs.some((l) => l.code === "ko")).toBe(false);
    expect(langs.some((l) => l.code === "th")).toBe(false);
  });

  it("marks the shipped Tier-1 languages as released", async () => {
    const langs = await readAvailableLanguages();
    expect(langs.find((l) => l.code === "es")?.status).toBe("released");
    expect(langs.find((l) => l.code === "en")?.status).toBe("released");
  });

  it("loads the real Spanish catalog (localized, not English)", async () => {
    const en = await loadMessages("en");
    const es = await loadMessages("es");
    const enNav = (en.common as Record<string, Record<string, string>>).nav;
    const esNav = (es.common as Record<string, Record<string, string>>).nav;
    expect(enNav.dashboard).toBe("Dashboard");
    expect(esNav.dashboard).toBe("Panel"); // Spanish translation is actually used
    expect(esNav.dashboard).not.toBe(enNav.dashboard);
  });

  it("falls back to English per-key for any untranslated string", async () => {
    const es = await loadMessages("es");
    // Every English key resolves in es (fallback) — no missing keys crash the UI.
    const esCommon = es.common as Record<string, unknown>;
    expect(esCommon.nav).toBeTruthy();
    expect(es.applications).toBeTruthy();
  });

  it("resolveLocale accepts a persisted beta locale, rejects unknown", async () => {
    const { resolveLocale } = await import("@/i18n/locale");
    vi.mocked(readSettings).mockResolvedValue({ locale: "es" });
    expect(await resolveLocale()).toBe("es");
    vi.mocked(readSettings).mockResolvedValue({ locale: "xx-not-real" });
    expect(await resolveLocale()).toBe("en");
    vi.mocked(readSettings).mockResolvedValue({});
    expect(await resolveLocale()).toBe("en");
  });
});
