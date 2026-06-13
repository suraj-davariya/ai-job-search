import Link from "next/link";
import { readTracker } from "@/lib/data/tracker";
import { readSalary } from "@/lib/data/salary";
import { summarizeCompanies } from "@/lib/domain/companies";
import { PageSection, EmptyState } from "@/components/shell/page-shell";
import { StatusPill } from "@/components/applications/StatusPill";
import { FitBadge } from "@/components/applications/FitBadge";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const [rows, salary] = await Promise.all([readTracker(), readSalary()]);
  const companies = summarizeCompanies(rows);

  return (
    <PageSection
      title="Companies"
      description={`${companies.length} compan${companies.length === 1 ? "y" : "ies"} across your tracker.`}
    >
      {companies.length === 0 ? (
        <EmptyState
          title="No companies yet"
          hint="Companies are derived from the tracker. Add an application to populate this view."
          milestone="Companies"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">Company</th>
                <th className="px-3 py-2.5">Sector</th>
                <th className="px-3 py-2.5">Apps</th>
                <th className="px-3 py-2.5">Best fit</th>
                <th className="px-3 py-2.5">Status mix</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.company} className="border-b border-border/60 last:border-0">
                  <td className="px-3 py-2.5 font-medium">{c.company}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {c.sector || "—"}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">{c.count}</td>
                  <td className="px-3 py-2.5">
                    <FitBadge value={c.bestFit} />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap items-center gap-1">
                      {c.statusMix.map((s) => (
                        <span key={s.status} className="inline-flex items-center gap-1">
                          <StatusPill status={s.status} />
                          <span className="text-xs text-muted-foreground">
                            ×{s.count}
                          </span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <h3 className="mb-2 text-sm font-medium">Salary benchmarks</h3>
        {salary ? (
          <p className="text-sm text-muted-foreground">
            Benchmark data is available —{" "}
            <Link href="/salary" className="text-primary hover:underline">
              browse it on the Salary page
            </Link>
            .
          </p>
        ) : (
          <EmptyState
            title="No salary data"
            hint="Add salary_data.json (or run a lookup on the Salary page) to enrich companies with benchmarks."
            milestone="REQ-5012"
          />
        )}
      </div>
    </PageSection>
  );
}
