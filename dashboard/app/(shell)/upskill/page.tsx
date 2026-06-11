import { PageSection, EmptyState } from "@/components/shell/page-shell";

export default function UpskillPage() {
  return (
    <PageSection
      title="Upskill"
      description="Render upskill/report-*.md and trigger /upskill runs (build-prompt §5/§9)."
    >
      <EmptyState
        title="Upskill view coming in M5"
        milestone="M5 — Secondary views"
      />
    </PageSection>
  );
}
