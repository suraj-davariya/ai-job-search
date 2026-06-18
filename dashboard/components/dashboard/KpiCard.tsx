"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Kpis } from "@/lib/domain/kpi";

/** Single KPI tile. `value` is pre-formatted; "—" signals an unmet sample floor. */
export function KpiCard({
  label,
  value,
  hint,
  action,
}: {
  label: string;
  value: string;
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

const fit = (v: number | null) => (v == null ? "—" : String(Math.round(v)));
const rate = (v: number | null) =>
  v == null ? "—" : `${Math.round(v * 100)}%`;

/**
 * The KPI card row for the analytics home (REQ-5009). Honesty rule: cards whose
 * floor isn't met show "—" (driven by null from `kpis`), never a fabricated
 * number. The "Applied" card toggles between the 7- and 30-day windows.
 */
export function KpiCards({ k }: { k: Kpis }) {
  const [window, setWindow] = useState<7 | 30>(30);
  const t = useTranslations("dashboard");

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiCard label={t("kpi.total")} value={String(k.total)} />
      <KpiCard
        label={t("kpi.applied", { window })}
        value={String(window === 7 ? k.applied7 : k.applied30)}
        action={
          <div
            className="flex gap-1"
            role="group"
            aria-label={t("kpi.appliedWindow")}
          >
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
                {t("kpi.windowDays", { days: w })}
              </button>
            ))}
          </div>
        }
      />
      <KpiCard
        label={t("kpi.avgFit30")}
        value={fit(k.avgFit30)}
        hint={k.avgFit30 == null ? t("kpi.floorHint") : undefined}
      />
      <KpiCard
        label={t("kpi.interviewRate90")}
        value={rate(k.interviewRate90)}
        hint={k.interviewRate90 == null ? t("kpi.floorHint") : undefined}
      />
    </div>
  );
}
