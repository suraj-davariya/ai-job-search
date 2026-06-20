"use client";

import { ResponsiveBar } from "@nivo/bar";
import { useTranslations } from "next-intl";
import type { Bin } from "@/lib/domain/aggregate";
import { ChartFrame, chartColor } from "./ChartFrame";

/** Applications per ISO week (REQ-5009). */
export function WeeklyBar({ data }: { data: Bin[] }) {
  const t = useTranslations("dashboard");
  return (
    <ChartFrame
      title={t("charts.weekly.title")}
      empty={data.length === 0}
      caption={t("charts.weekly.caption")}
      head={[t("charts.weekly.colWeek"), t("charts.weekly.colApplications")]}
      body={data.map((d) => [d.key, d.count])}
    >
      <ResponsiveBar
        data={data.map((d) => ({ week: d.key, applications: d.count }))}
        keys={["applications"]}
        indexBy="week"
        margin={{ top: 8, right: 8, bottom: 40, left: 32 }}
        padding={0.3}
        colors={[chartColor(0)]}
        axisBottom={{ tickRotation: -45 }}
        enableLabel={false}
        animate={false}
        role="img"
        ariaLabel={t("charts.weekly.title")}
      />
    </ChartFrame>
  );
}
