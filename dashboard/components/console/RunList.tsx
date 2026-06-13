"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";

interface RunRecord {
  id: string;
  command: string;
  startedAt?: string;
  code: number | null;
  ok: boolean;
}

/** Recent run history (REQ-5011), loaded from GET /api/runs. */
export function RunList() {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/runs");
      const body = await res.json();
      setRuns(body.runs ?? []);
    } catch {
      setRuns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load once on mount. setState lives only in the async callbacks, never
  // synchronously in the effect body (matches the FileLink fetch pattern).
  useEffect(() => {
    let active = true;
    fetch("/api/runs")
      .then((r) => r.json())
      .then((b) => active && setRuns(b.runs ?? []))
      .catch(() => active && setRuns([]));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-xl border border-border bg-card/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent runs</h3>
        <button
          type="button"
          onClick={refresh}
          aria-label="Refresh runs"
          className="rounded p-1 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} aria-hidden />
        </button>
      </div>
      {runs.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">
          No runs yet.
        </p>
      ) : (
        <ul className="divide-y divide-border/60 text-sm">
          {runs.map((r) => (
            <li key={r.id} className="flex items-center gap-2 py-2">
              {r.ok ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-destructive" aria-hidden />
              )}
              <span className="font-medium">/{r.command}</span>
              <span className="text-xs text-muted-foreground">
                exit {r.code ?? "—"}
              </span>
              {r.startedAt ? (
                <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                  {r.startedAt.slice(0, 16).replace("T", " ")}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
