"use client";

import { motion, useReducedMotion } from "motion/react";
import { ChartFrame, chartColor } from "./chart-frame";
import { DEMO_ROWS } from "./demo-data";
import { topBy } from "./domain/aggregate";

/**
 * Live top-companies demo — ranked horizontal bars, mirroring the dashboard's
 * hand-rolled TopCompanies. Bars grow to width when the chart appears.
 */
export function TopCompaniesDemo() {
  const data = topBy(DEMO_ROWS, "company");
  const reduced = useReducedMotion();
  const max = data[0]?.count ?? 1;

  return (
    <ChartFrame
      title="Top companies"
      empty={data.length === 0}
      caption="Company by application count"
      head={["Company", "Applications"]}
      body={data.map((d) => [d.key, d.count])}
    >
      {(animate) => (
        <ul className="flex h-full flex-col justify-center gap-2">
          {data.map((d, i) => (
            <li key={d.key} className="flex items-center gap-2 text-xs">
              <span
                className="w-28 truncate text-muted-foreground"
                title={d.key}
              >
                {d.key}
              </span>
              <div className="h-4 flex-1 overflow-hidden rounded bg-muted/40">
                <motion.div
                  className="h-full rounded"
                  style={{ backgroundColor: chartColor(i) }}
                  initial={
                    animate && !reduced
                      ? { width: 0 }
                      : { width: `${(d.count / max) * 100}%` }
                  }
                  animate={{ width: `${(d.count / max) * 100}%` }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="w-6 text-right tabular-nums">{d.count}</span>
            </li>
          ))}
        </ul>
      )}
    </ChartFrame>
  );
}
