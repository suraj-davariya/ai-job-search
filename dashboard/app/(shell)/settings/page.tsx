import { getConfig, DEFAULT_PORT } from "@/lib/config";
import { readSettings } from "@/lib/settings";
import { PageSection } from "@/components/shell/page-shell";
import { SettingsForm } from "@/components/settings/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const config = getConfig();
  const saved = await readSettings();

  // Persisted preference wins for display; otherwise the live runtime value.
  const initial = {
    repoRoot: saved.repoRoot ?? config.repoRoot,
    port: saved.port ?? config.port ?? DEFAULT_PORT,
    readOnly: saved.readOnly ?? config.readOnly,
  };

  return (
    <PageSection
      title="Settings"
      description="Local preferences only — no secrets, no accounts. Loopback, single-user."
    >
      <SettingsForm initial={initial} />
    </PageSection>
  );
}
