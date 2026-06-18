import { getLocale, getTranslations } from "next-intl/server";
import { getConfig, DEFAULT_PORT } from "@/lib/config";
import { readSettings } from "@/lib/settings";
import { readAvailableLanguages } from "@/lib/languages";
import { PageSection } from "@/components/shell/page-shell";
import { SettingsForm } from "@/components/settings/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const config = getConfig();
  const saved = await readSettings();
  const [t, locale, languages] = await Promise.all([
    getTranslations("settings"),
    getLocale(),
    readAvailableLanguages(),
  ]);

  // Persisted preference wins for display; otherwise the live runtime value.
  const initial = {
    repoRoot: saved.repoRoot ?? config.repoRoot,
    port: saved.port ?? config.port ?? DEFAULT_PORT,
    readOnly: saved.readOnly ?? config.readOnly,
    locale,
  };

  return (
    <PageSection title={t("title")} description={t("description")}>
      <SettingsForm initial={initial} languages={languages} />
    </PageSection>
  );
}
