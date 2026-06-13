"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Orange→gold chart ramp, sourced from the CSS tokens in global.css.
 * Mirrors dashboard/components/dashboard/ChartFrame.tsx. */
export const CHART_TOKENS = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
] as const;
export const chartColor = (i: number) =>
  `hsl(var(${CHART_TOKENS[i % CHART_TOKENS.length]}))`;

/** Quiet Nivo theme so axis labels stay readable on the warm-dark surface. */
export const nivoTheme = {
  text: { fill: "hsl(var(--muted-foreground))", fontSize: 11 },
  axis: {
    ticks: { text: { fill: "hsl(var(--muted-foreground))", fontSize: 10 } },
  },
  grid: { line: { stroke: "hsl(var(--border))" } },
  tooltip: {
    container: {
      background: "hsl(var(--popover))",
      color: "hsl(var(--popover-foreground))",
      fontSize: 12,
      borderRadius: 8,
      border: "1px solid hsl(var(--border))",
    },
  },
} as const;

/**
 * Demo chart shell — replicates the dashboard's ChartFrame contract
 * (mount-gate for Nivo + always-rendered sr-only table) and adds the docs
 * behaviors from build-prompt §6:
 *  - the chart mounts only after hydration (Nivo needs the DOM; the static
 *    export must never render it server-side),
 *  - it appears when scrolled into view, so its entry animation plays then,
 *  - with prefers-reduced-motion it renders immediately in its final state,
 *  - without JS, the sr-only table is the chart.
 *
 * `children` receives `animate` — pass it to Nivo's `animate` prop.
 */
export function ChartFrame({
  title,
  empty,
  caption,
  head,
  body,
  children,
}: {
  title: string;
  empty: boolean;
  caption: string;
  head: string[];
  body: (string | number)[][];
  children: (animate: boolean) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const showChart = mounted && (reduced ? true : inView);

  return (
    <section className="not-prose rounded-xl border border-border bg-card/50 p-4">
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      {empty ? (
        <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          No data yet
        </p>
      ) : (
        <>
          <div ref={ref} className="h-64 w-full">
            {showChart ? children(!reduced) : null}
          </div>
          <table className="sr-only">
            <caption>{caption}</caption>
            <thead>
              <tr>
                {head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
