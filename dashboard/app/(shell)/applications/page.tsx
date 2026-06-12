import { readTracker } from "@/lib/data/tracker";
import { getConfig } from "@/lib/config";
import { PageSection } from "@/components/shell/page-shell";
import { ApplicationsView } from "@/components/applications/ApplicationsView";

// Re-read from disk on every request (no long-lived cache in v1; CSV ≤ 1k rows).
export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const rows = await readTracker();
  const { readOnly } = getConfig();

  return (
    <PageSection
      title="Applications"
      description={`${rows.length} application${rows.length === 1 ? "" : "s"} tracked.`}
    >
      <ApplicationsView rows={rows} readOnly={readOnly} />
    </PageSection>
  );
}
