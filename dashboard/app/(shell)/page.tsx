import { getTranslations } from "next-intl/server";
import { readTracker } from "@/lib/data/tracker";
import { kpis } from "@/lib/domain/kpi";
import {
  byWeek,
  byDay,
  byStatus,
  fitBuckets,
  topBy,
} from "@/lib/domain/aggregate";
import { PageSection, EmptyState } from "@/components/shell/page-shell";
import { KpiCards } from "@/components/dashboard/KpiCard";
import { WeeklyBar } from "@/components/dashboard/WeeklyBar";
import { ActivityCalendar } from "@/components/dashboard/ActivityCalendar";
import { StatusDonut } from "@/components/dashboard/StatusDonut";
import { FitHistogram } from "@/components/dashboard/FitHistogram";
import { TopCompanies } from "@/components/dashboard/TopCompanies";
import { RecentPanel } from "@/components/dashboard/RecentPanel";

// Re-read from disk on every request (file-as-DB; CSV ≤ 1k rows).
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const rows = await readTracker();
  const k = kpis(rows);
  const t = await getTranslations("dashboard");

  return (
    <PageSection
      title={t("overview.title")}
      description={t("overview.description")}
    >
      {rows.length === 0 ? (
        <EmptyState
          title={t("overview.empty.title")}
          hint={t("overview.empty.hint")}
          milestone={t("overview.empty.milestone")}
        />
      ) : (
        <div className="space-y-4">
          <KpiCards k={k} />
          <div className="grid gap-4 lg:grid-cols-2">
            <WeeklyBar data={byWeek(rows)} />
            <StatusDonut data={byStatus(rows)} />
            <FitHistogram data={fitBuckets(rows)} />
            <TopCompanies data={topBy(rows, "company")} />
            <div className="lg:col-span-2">
              <ActivityCalendar data={byDay(rows)} />
            </div>
          </div>
          <RecentPanel rows={rows} />
        </div>
      )}
    </PageSection>
  );
}
