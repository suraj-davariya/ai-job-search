import { cn } from "@/lib/utils";

/** Fit-rating cell: number + a thin proportional bar (0..100). */
export function FitBadge({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 text-right text-sm tabular-nums">{value}</span>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <span
          className={cn(
            "block h-full rounded-full",
            pct >= 80
              ? "bg-emerald-500"
              : pct >= 60
                ? "bg-primary"
                : "bg-muted-foreground",
          )}
          style={{ width: `${pct}%` }}
        />
      </span>
    </div>
  );
}
