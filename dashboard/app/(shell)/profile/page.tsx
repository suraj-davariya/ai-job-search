import { readProfile } from "@/lib/data/profile";
import { PageSection, EmptyState } from "@/components/shell/page-shell";

export const dynamic = "force-dynamic";

/** Turn a profile filename into a readable heading. */
function prettyName(name: string): string {
  if (name === "CLAUDE.md") return "Project memory";
  return name
    .replace(/^0\d-/, "")
    .replace(/\.md$/, "")
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default async function ProfilePage() {
  const sections = await readProfile();

  return (
    <PageSection
      title="Profile"
      description="Read-only candidate profile, assembled from your skill files."
    >
      {sections.length === 0 ? (
        <EmptyState
          title="No profile found"
          hint="Run /setup to build your candidate profile (01–07 skill files). Once present, its sections render here read-only."
          milestone="Profile"
        />
      ) : (
        <div className="space-y-3">
          {sections.map((s) => (
            <details
              key={s.path}
              open
              className="rounded-xl border border-border bg-card/50 p-4"
            >
              <summary className="cursor-pointer text-sm font-medium">
                {prettyName(s.name)}
              </summary>
              <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm text-muted-foreground">
                {s.content}
              </pre>
            </details>
          ))}
        </div>
      )}
    </PageSection>
  );
}
