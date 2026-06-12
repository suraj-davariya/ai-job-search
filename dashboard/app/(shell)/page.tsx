import { readTracker } from "@/lib/data/tracker";
import { kpis } from "@/lib/domain/kpi";
import { PageSection, EmptyState } from "@/components/shell/page-shell";
import { KpiCards } from "@/components/dashboard/KpiCard";

// Re-read from disk on every request (file-as-DB; CSV ≤ 1k rows).
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const rows = await readTracker();
  const k = kpis(rows);

  return (
    <PageSection
      title="Overview"
      description="Pipeline health at a glance, computed live from your tracker."
    >
      {rows.length === 0 ? (
        <EmptyState
          title="No applications yet"
          hint="Run /apply <posting> or use + New application on the Applications page. Your KPIs and charts appear here once the tracker has rows."
          milestone="Overview"
        />
      ) : (
        <KpiCards k={k} />
      )}
    </PageSection>
  );
}
