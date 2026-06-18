import Link from "next/link";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("dashboard");

  return (
    <PageSection
      title={t("companies.title")}
      description={t("companies.description", { count: companies.length })}
    >
      {companies.length === 0 ? (
        <EmptyState
          title={t("companies.empty.title")}
          hint={t("companies.empty.hint")}
          milestone={t("companies.empty.milestone")}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">{t("companies.col.company")}</th>
                <th className="px-3 py-2.5">{t("companies.col.sector")}</th>
                <th className="px-3 py-2.5">{t("companies.col.apps")}</th>
                <th className="px-3 py-2.5">{t("companies.col.bestFit")}</th>
                <th className="px-3 py-2.5">{t("companies.col.statusMix")}</th>
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
        <h3 className="mb-2 text-sm font-medium">{t("companies.salaryHeading")}</h3>
        {salary ? (
          <p className="text-sm text-muted-foreground">
            {t("companies.salaryAvailable")}
            <Link href="/salary" className="text-primary hover:underline">
              {t("companies.salaryLink")}
            </Link>
            .
          </p>
        ) : (
          <EmptyState
            title={t("companies.noSalary.title")}
            hint={t("companies.noSalary.hint")}
            milestone={t("companies.noSalary.milestone")}
          />
        )}
      </div>
    </PageSection>
  );
}
