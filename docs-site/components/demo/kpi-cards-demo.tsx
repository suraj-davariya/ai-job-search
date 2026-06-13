"use client";

import { useState } from "react";
import { CountUp } from "@/components/site/count-up";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { DEMO_NOW, DEMO_ROWS } from "./demo-data";
import { kpis } from "./domain/kpi";

/** Single KPI tile — markup mirrors dashboard/components/dashboard/KpiCard.tsx. */
function KpiCard({
  label,
  value,
  hint,
  action,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {action}
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * Live KPI card row (build-prompt §6) — same four cards, same honesty rule,
 * same 7d/30d toggle as the real dashboard, computed by the copied KPI math
 * over fictional demo rows. Numbers count up when scrolled into view.
 */
export function KpiCardsDemo() {
  const [window, setWindow] = useState<7 | 30>(30);
  const k = kpis(DEMO_ROWS, DEMO_NOW);

  return (
    <ScrollReveal className="not-prose">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Total applications"
          value={<CountUp value={k.total} />}
        />
        <KpiCard
          label={`Applied · ${window}d`}
          value={
            <CountUp
              key={window}
              value={window === 7 ? k.applied7 : k.applied30}
            />
          }
          action={
            <div className="flex gap-1" role="group" aria-label="Applied window">
              {([7, 30] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  aria-pressed={window === w}
                  onClick={() => setWindow(w)}
                  className={
                    "rounded px-1.5 py-0.5 text-xs " +
                    (window === w
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {w}d
                </button>
              ))}
            </div>
          }
        />
        <KpiCard
          label="Avg fit · 30d"
          value={
            k.avgFit30 == null ? "—" : <CountUp value={Math.round(k.avgFit30)} />
          }
          hint={k.avgFit30 == null ? "Needs ≥3 in window" : undefined}
        />
        <KpiCard
          label="Interview rate · 90d"
          value={
            k.interviewRate90 == null ? (
              "—"
            ) : (
              <CountUp
                value={Math.round(k.interviewRate90 * 100)}
                format={(n) => `${Math.round(n)}%`}
              />
            )
          }
          hint={k.interviewRate90 == null ? "Needs ≥3 in window" : undefined}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Live demo with fictional data — try the 7d/30d toggle.
      </p>
    </ScrollReveal>
  );
}
