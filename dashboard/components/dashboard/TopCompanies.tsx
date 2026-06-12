"use client";

import type { Bin } from "@/lib/domain/aggregate";
import { ChartFrame, chartColor } from "./ChartFrame";

/**
 * Top companies (or sectors) by application count (REQ-5009). Hand-rolled
 * horizontal bars — no chart lib needed for a simple ranked list.
 */
export function TopCompanies({
  data,
  title = "Top companies",
  label = "Company",
}: {
  data: Bin[];
  title?: string;
  label?: string;
}) {
  const max = data[0]?.count ?? 1;
  return (
    <ChartFrame
      title={title}
      empty={data.length === 0}
      caption={`${label} by application count`}
      head={[label, "Applications"]}
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
