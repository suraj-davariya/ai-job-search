"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { DEMO_ROWS } from "./demo-data";
import { kpis } from "./domain/kpi";
import { MUTED, STATUSES, type Status } from "./domain/status";

/**
 * Live pipeline-strip demo — per-status counts with clickable filter buckets,
 * mirroring the dashboard's PipelineStrip. Click a status to filter the
 * counts, exactly as it works above the real applications table.
 */
export function PipelineStripDemo() {
  const [active, setActive] = useState<Status[]>([]);

  const rows =
    active.length === 0
      ? DEMO_ROWS
      : DEMO_ROWS.filter((r) => active.includes(r.status));
  const { byStatus, total } = kpis(rows);

  const toggle = (s: Status) =>
    setActive((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s],
    );

  return (
    <ScrollReveal className="not-prose">
      <div
        role="group"
        aria-label="Pipeline counts"
        className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/80 p-2"
      >
        {STATUSES.map((s) => {
          const on = active.includes(s);
          const muted = MUTED.has(s);
          return (
            <button
              key={s}
              type="button"
              aria-pressed={on}
              aria-label={`${s}: ${byStatus[s]}`}
              onClick={() => toggle(s)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors",
                on
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted/50",
                muted && !on && "opacity-60",
              )}
            >
              <span>{s}</span>
              <span className="rounded bg-muted px-1 font-semibold tabular-nums">
                {byStatus[s]}
              </span>
            </button>
          );
        })}
        <span className="ml-auto text-xs text-muted-foreground">
          {total} total
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Live demo — click a status to filter, exactly as in the dashboard.
        Terminal statuses are dimmed but never hidden.
      </p>
    </ScrollReveal>
  );
}
