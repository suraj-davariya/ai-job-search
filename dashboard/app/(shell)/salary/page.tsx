import { PageSection, EmptyState } from "@/components/shell/page-shell";

export default function SalaryPage() {
  return (
    <PageSection
      title="Salary"
      description="Browse salary_data.json and run salary lookups (build-prompt §5/§9)."
    >
      <EmptyState
        title="Salary view coming in M5"
        milestone="M5 — Secondary views"
      />
    </PageSection>
  );
}
