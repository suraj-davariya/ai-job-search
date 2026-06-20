"use client";

import { ResponsiveBar } from "@nivo/bar";
import { useTranslations } from "next-intl";
import type { FitBucket } from "@/lib/domain/aggregate";
import { ChartFrame, chartColor } from "./ChartFrame";

/** Distribution of fit ratings across 5 bands (REQ-5009). */
export function FitHistogram({ data }: { data: FitBucket[] }) {
  const t = useTranslations("dashboard");
  const total = data.reduce((a, b) => a + b.count, 0);
  return (
    <ChartFrame
      title={t("charts.fit.title")}
      empty={total === 0}
      caption={t("charts.fit.caption")}
      head={[t("charts.fit.colRange"), t("charts.fit.colCount")]}
      body={data.map((d) => [d.range, d.count])}
    >
      <ResponsiveBar
        data={data.map((d) => ({ range: d.range, count: d.count }))}
        keys={["count"]}
        indexBy="range"
        margin={{ top: 8, right: 8, bottom: 32, left: 32 }}
        padding={0.3}
        colors={[chartColor(1)]}
        enableLabel={false}
        animate={false}
        role="img"
        ariaLabel={t("charts.fit.title")}
      />
    </ChartFrame>
  );
}
