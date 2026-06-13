"use client";

import { Search, X } from "lucide-react";
import { STATUSES, type TrackerRow } from "@/lib/domain/status";
import {
  type FilterState,
  emptyFilter,
} from "@/lib/domain/filter";
import { cn } from "@/lib/utils";

function distinct(rows: TrackerRow[], key: "role_type" | "channel"): string[] {
  return Array.from(new Set(rows.map((r) => r[key]).filter(Boolean))).sort();
}

export function FilterBar({
  value,
  onChange,
  rows,
  resultCount,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  rows: TrackerRow[];
  resultCount: number;
}) {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });

  const toggleStatus = (s: (typeof STATUSES)[number]) => {
    const has = value.status.includes(s);
    set({
      status: has
        ? value.status.filter((x) => x !== s)
        : [...value.status, s],
    });
  };

  const active =
    value.q ||
    value.status.length ||
    value.fit_min != null ||
    value.fit_max != null ||
    value.role_type ||
    value.channel ||
    value.from ||
    value.to;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            aria-label="Search applications"
            placeholder="Search company, role, or notes…"
            value={value.q}
            onChange={(e) => set({ q: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Escape") onChange(emptyFilter());
            }}
            className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <select
          aria-label="Role type"
          value={value.role_type}
          onChange={(e) => set({ role_type: e.target.value })}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
        >
          <option value="">All types</option>
          {distinct(rows, "role_type").map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          aria-label="Channel"
          value={value.channel}
          onChange={(e) => set({ channel: e.target.value })}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
        >
          <option value="">All channels</option>
          {distinct(rows, "channel").map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          aria-label="Minimum fit"
          placeholder="Fit ≥"
          min={0}
          max={100}
          value={value.fit_min ?? ""}
          onChange={(e) =>
            set({ fit_min: e.target.value === "" ? null : Number(e.target.value) })
          }
          className="h-9 w-20 rounded-lg border border-input bg-background px-2 text-sm"
        />

        <input
          type="date"
          aria-label="From date"
          value={value.from}
          onChange={(e) => set({ from: e.target.value })}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
        />
        <input
          type="date"
          aria-label="To date"
          value={value.to}
          onChange={(e) => set({ to: e.target.value })}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
        />

        {active ? (
          <button
            type="button"
            onClick={() => onChange(emptyFilter())}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-2.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Clear
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {STATUSES.map((s) => {
          const on = value.status.includes(s);
          return (
            <button
              key={s}
              type="button"
              aria-pressed={on}
              onClick={() => toggleStatus(s)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                on
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-muted-foreground">
          {resultCount} of {rows.length}
        </span>
      </div>
    </div>
  );
}
