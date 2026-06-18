"use client";

import { useTranslations } from "next-intl";
import type { StatusBin } from "@/lib/domain/aggregate";
import { ChartFrame, chartColor } from "./ChartFrame";

const R = 64;
const CIRC = 2 * Math.PI * R;

/**
 * Status breakdown as a donut (REQ-5009). Hand-rolled SVG — `@nivo/pie` isn't
 * installed (offline). Segments are arcs on a single ring, sized by share.
 */
export function StatusDonut({ data }: { data: StatusBin[] }) {
  const t = useTranslations("dashboard");
  const ts = useTranslations("common");
  const total = data.reduce((a, b) => a + b.count, 0);
  // Cumulative share before index `i`, computed without render-time mutation.
  const startFrac = (i: number) =>
    data.slice(0, i).reduce((a, b) => a + b.count, 0) / total;

  return (
    <ChartFrame
      title={t("charts.status.title")}
      empty={total === 0}
      caption={t("charts.status.caption")}
      head={[t("charts.status.colStatus"), t("charts.status.colCount")]}
      body={data.map((d) => [ts(`status.${d.status}`), d.count])}
    >
      <div className="flex h-full items-center justify-center gap-6">
        <svg viewBox="0 0 180 180" className="h-44 w-44" role="img" aria-label={t("charts.status.title")}>
          <g transform="rotate(-90 90 90)">
            {data.map((d, i) => {
              if (d.count === 0) return null;
              const frac = d.count / total;
              const dash = frac * CIRC;
              const offset = -startFrac(i) * CIRC;
              return (
                <circle
                  key={d.status}
                  cx={90}
                  cy={90}
                  r={R}
                  fill="none"
                  stroke={chartColor(i)}
                  strokeWidth={18}
                  strokeDasharray={`${dash} ${CIRC - dash}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </g>
          <text
            x={90}
            y={90}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground text-2xl font-semibold"
          >
            {total}
          </text>
        </svg>
        <ul className="space-y-1 text-xs">
          {data
            .filter((d) => d.count > 0)
            .map((d) => {
              const i = data.indexOf(d);
              return (
                <li key={d.status} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: chartColor(i) }}
                    aria-hidden
                  />
                  <span className="text-muted-foreground">{ts(`status.${d.status}`)}</span>
                  <span className="tabular-nums">{d.count}</span>
                </li>
              );
            })}
        </ul>
      </div>
    </ChartFrame>
  );
}
