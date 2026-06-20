import { getTranslations } from "next-intl/server";
import { readProfile } from "@/lib/data/profile";
import { PageSection, EmptyState } from "@/components/shell/page-shell";

export const dynamic = "force-dynamic";

/** Turn a profile filename into a readable heading. */
function prettyName(name: string): string {
  return name
    .replace(/^0\d-/, "")
    .replace(/\.md$/, "")
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default async function ProfilePage() {
  const sections = await readProfile();
  const t = await getTranslations("dashboard");

  return (
    <PageSection
      title={t("profile.title")}
      description={t("profile.description")}
    >
      {sections.length === 0 ? (
        <EmptyState
          title={t("profile.empty.title")}
          hint={t("profile.empty.hint")}
          milestone={t("profile.empty.milestone")}
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
                {s.name === "CLAUDE.md"
                  ? t("profile.projectMemory")
                  : prettyName(s.name)}
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
