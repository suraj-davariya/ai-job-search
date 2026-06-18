"use client";

import { useTranslations } from "next-intl";
import type { Bin } from "@/lib/domain/aggregate";
import { ChartFrame, chartColor } from "./ChartFrame";

/**
 * Top companies (or sectors) by application count (REQ-5009). Hand-rolled
 * horizontal bars — no chart lib needed for a simple ranked list. `title` and
 * `label` default to the translated "Top companies"/"Company" strings; pass
 * overrides to reuse the chart for another dimension (e.g. sectors).
 */
export function TopCompanies({
  data,
  title,
  label,
}: {
  data: Bin[];
  title?: string;
  label?: string;
}) {
  const t = useTranslations("dashboard");
  const resolvedTitle = title ?? t("charts.top.title");
  const resolvedLabel = label ?? t("charts.top.label");
  const max = data[0]?.count ?? 1;
  return (
    <ChartFrame
      title={resolvedTitle}
      empty={data.length === 0}
      caption={t("charts.top.caption", { label: resolvedLabel })}
      head={[resolvedLabel, t("charts.top.colApplications")]}
      body={data.map((d) => [d.key, d.count])}
    >
      <ul className="flex h-full flex-col justify-center gap-2">
        {data.map((d, i) => (
          <li key={d.key} className="flex items-center gap-2 text-xs">
            <span className="w-28 truncate text-muted-foreground" title={d.key}>
              {d.key}
            </span>
            <div className="h-4 flex-1 overflow-hidden rounded bg-muted/40">
              <div
                className="h-full rounded"
                style={{
                  width: `${(d.count / max) * 100}%`,
                  backgroundColor: chartColor(i),
                }}
              />
            </div>
            <span className="w-6 text-right tabular-nums">{d.count}</span>
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}
