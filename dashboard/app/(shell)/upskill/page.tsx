import Link from "next/link";
import { Play } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { readUpskillReports, readUpskillReport } from "@/lib/data/upskill";
import { PageSection, EmptyState } from "@/components/shell/page-shell";

export const dynamic = "force-dynamic";

export default async function UpskillPage() {
  const reports = await readUpskillReports();
  const withContent = await Promise.all(
    reports.map(async (r) => ({ ...r, content: await readUpskillReport(r.path) })),
  );
  const t = await getTranslations("dashboard");

  return (
    <PageSection
      title={t("upskill.title")}
      description={t("upskill.description")}
    >
      <div className="mb-4">
        <Link
          href="/console"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Play className="h-4 w-4" aria-hidden />
          {t("upskill.run")}
        </Link>
      </div>

      {withContent.length === 0 ? (
        <EmptyState
          title={t("upskill.empty.title")}
          hint={t("upskill.empty.hint")}
          milestone={t("upskill.empty.milestone")}
        />
      ) : (
        <div className="space-y-3">
          {withContent.map((r) => (
            <details
              key={r.path}
              open
              className="rounded-xl border border-border bg-card/50 p-4"
            >
              <summary className="cursor-pointer text-sm font-medium">
                {r.name}
              </summary>
              <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm text-muted-foreground">
                {r.content ?? t("upskill.unreadable")}
              </pre>
            </details>
          ))}
        </div>
      )}
    </PageSection>
  );
}
