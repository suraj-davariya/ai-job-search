import { PageSection, EmptyState } from "@/components/shell/page-shell";

export default function ConsolePage() {
  return (
    <PageSection
      title="Console"
      description="Terminal-style live + past CLI runs (apply/search/upskill/salary)."
    >
      <EmptyState
        title="Run console coming in M4"
        hint="The action layer spawns allowlisted commands and streams stdout here."
        milestone="M4 — Action layer"
      />
    </PageSection>
  );
}
