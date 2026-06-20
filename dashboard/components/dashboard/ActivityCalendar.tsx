"use client";

import { ResponsiveCalendar } from "@nivo/calendar";
import { useTranslations } from "next-intl";
import type { CalendarDay } from "@/lib/domain/aggregate";
import { ChartFrame, chartColor } from "./ChartFrame";

/** Day-by-day application activity heatmap, binned by `date` (REQ-5009). */
export function ActivityCalendar({ data }: { data: CalendarDay[] }) {
  const t = useTranslations("dashboard");
  const from = data[0]?.day ?? "";
  const to = data[data.length - 1]?.day ?? "";
  return (
    <ChartFrame
      title={t("charts.activity.title")}
      empty={data.length === 0}
      caption={t("charts.activity.caption")}
      head={[t("charts.activity.colDay"), t("charts.activity.colApplications")]}
      body={data.map((d) => [d.day, d.value])}
    >
      <ResponsiveCalendar
        data={data}
        from={from}
        to={to}
        emptyColor="hsl(var(--muted))"
        colors={[chartColor(3), chartColor(1), chartColor(0), chartColor(2)]}
        margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
        monthBorderColor="hsl(var(--border))"
        dayBorderColor="hsl(var(--background))"
      />
    </ChartFrame>
  );
}
