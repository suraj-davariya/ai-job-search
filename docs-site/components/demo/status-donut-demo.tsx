"use client";

import { motion, useReducedMotion } from "motion/react";
import { ChartFrame, chartColor } from "./chart-frame";
import { DEMO_ROWS } from "./demo-data";
import { byStatus } from "./domain/aggregate";

const R = 64;
const CIRC = 2 * Math.PI * R;

/**
 * Live status-mix demo — hand-rolled SVG donut, mirroring the dashboard's
 * StatusDonut (which deliberately avoids a pie library). Segments fade in
 * with a small stagger when the chart appears.
 */
export function StatusDonutDemo() {
  const data = byStatus(DEMO_ROWS);
  const reduced = useReducedMotion();
  const total = data.reduce((a, b) => a + b.count, 0);
  const startFrac = (i: number) =>
    data.slice(0, i).reduce((a, b) => a + b.count, 0) / total;

  return (
    <ChartFrame
      title="Status mix"
      empty={total === 0}
      caption="Applications by status"
      head={["Status", "Count"]}
      body={data.map((d) => [d.status, d.count])}
    >
      {(animate) => (
        <div className="flex h-full items-center justify-center gap-6">
          <svg
            viewBox="0 0 180 180"
            className="h-44 w-44"
            role="img"
            aria-label="Status mix"
          >
            <g transform="rotate(-90 90 90)">
              {data.map((d, i) => {
                if (d.count === 0) return null;
                const frac = d.count / total;
                const dash = frac * CIRC;
                const offset = -startFrac(i) * CIRC;
                return (
                  <motion.circle
                    key={d.status}
                    cx={90}
                    cy={90}
                    r={R}
                    fill="none"
                    stroke={chartColor(i)}
                    strokeWidth={18}
                    strokeDasharray={`${dash} ${CIRC - dash}`}
                    strokeDashoffset={offset}
                    initial={animate && !reduced ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.12 * i, duration: 0.4 }}
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
                    <span className="text-muted-foreground">{d.status}</span>
                    <span className="tabular-nums">{d.count}</span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </ChartFrame>
  );
}
