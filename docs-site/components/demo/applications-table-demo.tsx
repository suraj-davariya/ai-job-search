"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { DEMO_ROWS } from "./demo-data";
import {
  ALLOWED_NEXT,
  MUTED,
  STATUSES,
  type Status,
} from "./domain/status";

/** Status pill — label + color, never color alone (NFR-0015). */
function StatusPill({ status }: { status: Status }) {
  const muted = MUTED.has(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
        muted
          ? "border-border text-muted-foreground"
          : "border-primary/40 bg-primary/10 text-primary",
      )}
    >
      {status}
    </span>
  );
}

/** A small read-only snapshot of the applications table, on fictional rows. */
export function ApplicationsTableDemo() {
  const rows = [...DEMO_ROWS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <ScrollReveal className="not-prose">
      <div className="overflow-x-auto rounded-xl border border-border bg-card/50">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Recent applications (fictional demo data)
          </caption>
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">Date</th>
              <th scope="col" className="px-3 py-2 font-medium">Company</th>
              <th scope="col" className="px-3 py-2 font-medium">Role</th>
              <th scope="col" className="px-3 py-2 font-medium">Status</th>
              <th scope="col" className="px-3 py-2 font-medium">Fit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={`${r.date}-${r.company}-${r.role}`}
                className={cn(
                  "border-b border-border/60 last:border-0",
                  MUTED.has(r.status) && "opacity-60",
                )}
              >
                <td className="px-3 py-2 tabular-nums text-muted-foreground">
                  {r.date}
                </td>
                <td className="px-3 py-2">{r.company}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.role}</td>
                <td className="px-3 py-2">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-3 py-2 tabular-nums">{r.fit_rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        A snapshot with fictional data. In the real dashboard every column
        sorts, filters apply live, and status and notes edit inline.
      </p>
    </ScrollReveal>
  );
}

/**
 * Interactive status state machine — pick a status, see exactly which moves
 * the dashboard allows from there. Driven by the copied ALLOWED_NEXT map, so
 * it can never disagree with the product (parity-tested).
 */
export function StatusFlowDemo() {
  const [from, setFrom] = useState<Status>("Draft");
  const next = ALLOWED_NEXT[from];

  return (
    <ScrollReveal className="not-prose">
      <div className="rounded-xl border border-border bg-card/50 p-4">
        <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
          Pick a current status
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Current status">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={from === s}
              onClick={() => setFrom(s)}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs transition-colors",
                from === s
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted/50",
                MUTED.has(s) && from !== s && "opacity-60",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-4 border-t border-border pt-3 text-sm" aria-live="polite">
          {next.length === 0 ? (
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{from}</span> is a
              final state — the dashboard offers no further moves, and the row
              stays visible (dimmed) in your history.
            </p>
          ) : (
            <p className="text-muted-foreground">
              From <span className="font-medium text-foreground">{from}</span>{" "}
              the dashboard lets you move to{" "}
              {next.map((s, i) => (
                <span key={s}>
                  <span className="font-medium text-primary">{s}</span>
                  {i < next.length - 1 ? " or " : ""}
                </span>
              ))}
              . Anything else is rejected before it is written.
            </p>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
