import { PageSection, EmptyState } from "@/components/shell/page-shell";

export default function CompaniesPage() {
  return (
    <PageSection
      title="Companies"
      description="Derived from the tracker, grouped by company (build-prompt §5)."
    >
      <EmptyState
        title="Companies view coming in M5"
        milestone="M5 — Secondary views"
      />
    </PageSection>
  );
}
