"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateSettingsAction } from "@/app/actions/settings";
import { toast } from "@/lib/toast";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import type { Language } from "@/lib/languages";

const FALLBACK_LANGUAGES: Language[] = [
  { code: "en", name: "English", endonym: "English", dir: "ltr", status: "released" },
];

/**
 * Local preferences form (REQ-5016, REQ-7002): theme (next-themes), display
 * language, repo path, default port, and a read-only toggle mirroring the
 * --read-only launch flag. Persists to .dashboard.local.json via the server
 * action. No secrets, no accounts. Repo path / port / read-only apply on the
 * next dashboard launch; the language switch applies immediately (full reload
 * so the server re-resolves the locale and `<html dir>`).
 */
export function SettingsForm({
  initial,
  languages = FALLBACK_LANGUAGES,
}: {
  initial: { repoRoot: string; port: number; readOnly: boolean; locale?: string };
  languages?: Language[];
}) {
  const t = useTranslations("settings");
  const [repoRoot, setRepoRoot] = useState(initial.repoRoot);
  const [port, setPort] = useState(String(initial.port));
  const [readOnly, setReadOnly] = useState(initial.readOnly);
  const [locale, setLocale] = useState(initial.locale ?? "en");
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await updateSettingsAction({
        repoRoot,
        port: Number(port),
        readOnly,
      });
      if ("error" in res)
        toast(t("saveError", { error: res.error }), "error");
      else toast(t("saved"));
    });
  }

  function changeLocale(next: string) {
    setLocale(next);
    startTransition(async () => {
      await updateSettingsAction({ locale: next });
      // The locale is resolved server-side from the persisted setting, so a full
      // reload re-renders every server component (and `<html lang/dir>`).
      if (typeof window !== "undefined") window.location.reload();
    });
  }

  return (
    <div className="max-w-xl space-y-5">
      <Row label={t("theme")} hint={t("themeHint")}>
        <ThemeToggle />
      </Row>

      <Row label={t("language")} hint={t("languageHint")}>
        <select
          aria-label={t("language")}
          value={locale}
          onChange={(e) => changeLocale(e.target.value)}
          disabled={pending}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm disabled:opacity-50"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.endonym}
            </option>
          ))}
        </select>
      </Row>

      <Row label={t("repoPath")} hint={t("repoPathHint")}>
        <input
          aria-label={t("repoPath")}
          value={repoRoot}
          onChange={(e) => setRepoRoot(e.target.value)}
          className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
        />
      </Row>

      <Row label={t("port")} hint={t("portHint")}>
        <input
          aria-label={t("port")}
          type="number"
          min={1}
          max={65535}
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="h-9 w-32 rounded-lg border border-input bg-background px-2 text-sm"
        />
      </Row>

      <Row label={t("readOnly")} hint={t("readOnlyHint")}>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            aria-label={t("readOnly")}
            checked={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
            className="h-4 w-4"
          />
          {readOnly ? t("on") : t("off")}
        </label>
      </Row>

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {pending ? t("saving") : t("save")}
      </button>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{label}</span>
        <div className="shrink-0">{children}</div>
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
