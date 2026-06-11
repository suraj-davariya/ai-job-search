import { PageSection, EmptyState } from "@/components/shell/page-shell";

export default function ApplicationsPage() {
  return (
    <PageSection
      title="Applications"
      description="The tracker table — sortable, filterable, inline-editable (REQ-5001–5007)."
    >
      <EmptyState
        title="Table coming in M1"
        hint="The read-only TanStack table over job_search_tracker.csv lands in M1; inline editing and + New arrive in M2."
        milestone="M1 — Read layer + Applications table"
      />
    </PageSection>
  );
}
