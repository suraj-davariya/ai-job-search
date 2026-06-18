"use client";

import { useTranslations } from "next-intl";
import { kpis } from "@/lib/domain/kpi";
import {
  STATUSES,
  MUTED,
  type Status,
  type TrackerRow,
} from "@/lib/domain/status";
import { cn } from "@/lib/utils";

/**
 * Sticky pipeline strip (REQ-5003): per-status counts over the CURRENTLY
 * FILTERED rows, so the numbers always match the table below. Terminal statuses
 * are muted (never hidden, §8). Each bucket toggles that status in the filter.
 */
export function PipelineStrip({
  rows,
  activeStatuses,
  onToggleStatus,
}: {
  rows: TrackerRow[];
  activeStatuses: Status[];
  onToggleStatus: (s: Status) => void;
}) {
  const t = useTranslations("applications");
  const ts = useTranslations("common");
  const { byStatus, total } = kpis(rows);

  return (
    <div
      role="group"
      aria-label={t("pipeline.group")}
      className="sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/80 p-2 backdrop-blur"
    >
      {STATUSES.map((s) => {
        const on = activeStatuses.includes(s);
        const muted = MUTED.has(s);
        const label = ts(`status.${s}`);
        return (
          <button
            key={s}
            type="button"
            aria-pressed={on}
            aria-label={t("pipeline.statusCount", { status: label, count: byStatus[s] })}
            onClick={() => onToggleStatus(s)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors",
              on
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:bg-muted/50",
              muted && !on && "opacity-60",
            )}
          >
            <span>{label}</span>
            <span className="rounded bg-muted px-1 font-semibold tabular-nums">
              {byStatus[s]}
            </span>
          </button>
        );
      })}
      <span className="ml-auto text-xs text-muted-foreground">
        {t("pipeline.total", { count: total })}
      </span>
    </div>
  );
}
