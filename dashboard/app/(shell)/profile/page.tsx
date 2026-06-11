import { PageSection, EmptyState } from "@/components/shell/page-shell";

export default function ProfilePage() {
  return (
    <PageSection
      title="Profile"
      description="Read-only candidate profile from the 01–07 skill files (build-prompt §5)."
    >
      <EmptyState
        title="Profile view coming in M5"
        milestone="M5 — Secondary views"
      />
    </PageSection>
  );
}
