import { PageSection, EmptyState } from "@/components/shell/page-shell";

export default function SettingsPage() {
  return (
    <PageSection
      title="Settings"
      description="Theme, repo path, read-only mode, default port. No secrets, no accounts."
    >
      <EmptyState
        title="Settings coming in M5"
        milestone="M5 — Secondary views"
      />
    </PageSection>
  );
}
