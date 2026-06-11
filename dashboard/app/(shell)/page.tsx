import { PageSection, EmptyState } from "@/components/shell/page-shell";

export default function DashboardPage() {
  return (
    <PageSection
      title="Overview"
      description="KPI cards, pipeline funnel, and activity charts land here in M3."
    >
      <EmptyState
        title="Stats coming in M3"
        hint="Once the read layer (M1) is wired, this page renders totals, average fit, interview rate, and the activity heatmap from job_search_tracker.csv."
        milestone="M3 — Dashboard stats"
      />
    </PageSection>
  );
}
