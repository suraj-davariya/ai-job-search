"use client";

import { useState } from "react";
import Link from "next/link";
import type { TrackerRow } from "@/lib/domain/status";
import { StatusPill } from "@/components/applications/StatusPill";
import { cn } from "@/lib/utils";

type Mode = "applications" | "changes";
const LIMIT = 8;

/**
 * Recent activity (REQ-5009). Toggles between newest applications (ordered by
 * `date`) and most recently updated (ordered by `last_updated`). Each row links
 * to the Applications surface, filtered to that company so its detail is one
 * click away.
 */
export function RecentPanel({ rows }: { rows: TrackerRow[] }) {
  const [mode, setMode] = useState<Mode>("applications");
  const key: keyof TrackerRow = mode === "applications" ? "date" : "last_updated";

  const recent = rows
    .filter((r) => r[key])
    .slice()
    .sort((a, b) => String(b[key]).localeCompare(String(a[key])))
    .slice(0, LIMIT);

  return (
    <section className="rounded-xl border border-border bg-card/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent activity</h3>
        <div className="flex gap-1" role="group" aria-label="Recent activity mode">
          {(
            [
              ["applications", "New"],
              ["changes", "Updated"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded px-2 py-0.5 text-xs",
                mode === m
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-border/60">
        {recent.map((r, i) => (
          <li key={`${r.company}-${r._row ?? i}`}>
            <Link
              href={`/applications?q=${encodeURIComponent(r.company)}`}
              className="flex items-center gap-3 py-2 text-sm hover:bg-muted/30"
            >
              <span className="w-20 shrink-0 tabular-nums text-xs text-muted-foreground">
                {String(r[key])}
              </span>
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium">{r.company}</span>{" "}
                <span className="text-muted-foreground">· {r.role}</span>
              </span>
              <StatusPill status={r.status} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
