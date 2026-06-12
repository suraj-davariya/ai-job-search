import Link from "next/link";
import { Play } from "lucide-react";
import { readUpskillReports, readUpskillReport } from "@/lib/data/upskill";
import { PageSection, EmptyState } from "@/components/shell/page-shell";

export const dynamic = "force-dynamic";

export default async function UpskillPage() {
  const reports = await readUpskillReports();
  const withContent = await Promise.all(
    reports.map(async (r) => ({ ...r, content: await readUpskillReport(r.path) })),
  );

  return (
    <PageSection
      title="Upskill"
      description="Your upskill reports, plus a trigger to generate a new one."
    >
      <div className="mb-4">
        <Link
          href="/console"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Play className="h-4 w-4" aria-hidden />
          Run /upskill in console
        </Link>
      </div>

      {withContent.length === 0 ? (
        <EmptyState
          title="No upskill reports yet"
          hint="Run /upskill (above) to generate a skills-gap report. New reports appear here once written to upskill/report-*.md."
          milestone="Upskill"
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
                {r.content ?? "(could not read this report)"}
              </pre>
            </details>
          ))}
        </div>
      )}
    </PageSection>
  );
}
