"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Play, Square, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogLine {
  stream: "stdout" | "stderr";
  data: string;
}
interface Status {
  ok: boolean;
  code: number | null;
  error?: string;
}

/** Parse whole SSE blocks out of a buffer; returns events + the unconsumed tail. */
function drainSSE(buffer: string) {
  const blocks = buffer.split("\n\n");
  const rest = blocks.pop() ?? "";
  const events = blocks
    .filter(Boolean)
    .map((b) => ({
      event: /event: (.*)/.exec(b)?.[1] ?? "message",
      data: JSON.parse(/data: (.*)/.exec(b)?.[1] ?? "{}"),
    }));
  return { events, rest };
}

/**
 * Live run console (REQ-5010/5011/5014/5015). Triggers an allowlisted command
 * over /api/run/<command>, streams its SSE output into a terminal-style log,
 * and shows the real exit code + duration. Buttons are disabled (with a
 * tooltip) when the required binary is missing or in read-only mode.
 */
export function RunLog({
  claudeOk,
  pythonOk,
  readOnly,
}: {
  claudeOk: boolean;
  pythonOk: boolean;
  readOnly: boolean;
}) {
  const params = useSearchParams();
  const t = useTranslations("console");
  const te = useTranslations("errors");
  const prefillUrl =
    params.get("command") === "apply" ? (params.get("url") ?? "") : "";

  const [lines, setLines] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [company, setCompany] = useState("");
  const startedRef = useRef<number>(0);

  async function run(command: string, input: Record<string, unknown>) {
    if (running) return;
    setLines([]);
    setStatus(null);
    setElapsed(null);
    setRunning(true);
    startedRef.current = Date.now();

    try {
      const res = await fetch(`/api/run/${command}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok || !res.body) {
        const msg = await res.text();
        setLines([{ stream: "stderr", data: msg }]);
        setStatus({ ok: false, code: null, error: msg });
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const { events, rest } = drainSSE(buf);
        buf = rest;
        for (const e of events) {
          if (e.event === "output") {
            setLines((prev) => [...prev, e.data as LogLine]);
          } else if (e.event === "status") {
            setStatus(e.data as Status);
          }
        }
      }
    } catch (err) {
      setStatus({
        ok: false,
        code: null,
        error: err instanceof Error ? err.message : te("requestFailed"),
      });
    } finally {
      setElapsed(Date.now() - startedRef.current);
      setRunning(false);
    }
  }

  async function stop() {
    await fetch("/api/runs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "stop" }),
    });
  }

  const blocked = (binOk: boolean) =>
    readOnly || !binOk || running;
  const tip = (binOk: boolean, bin: string) =>
    readOnly
      ? t("tip.readOnly")
      : !binOk
        ? t("tip.binMissing", { bin })
        : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card/50 p-3">
        {prefillUrl ? (
          <button
            type="button"
            disabled={blocked(claudeOk)}
            title={tip(claudeOk, "claude")}
            onClick={() => run("apply", { url: prefillUrl })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            <Play className="h-4 w-4" aria-hidden /> {t("rerunApply")}
          </button>
        ) : null}

        <button
          type="button"
          disabled={blocked(claudeOk)}
          title={tip(claudeOk, "claude")}
          onClick={() => run("upskill", {})}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          <Play className="h-4 w-4" aria-hidden /> {t("runUpskill")}
        </button>

        <div className="flex items-end gap-2">
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">
              {t("salaryLookup")}
            </span>
            <input
              aria-label={t("company")}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t("companyPlaceholder")}
              className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
            />
          </label>
          <button
            type="button"
            disabled={blocked(pythonOk) || company.trim() === ""}
            title={tip(pythonOk, "python3")}
            onClick={() => run("salary-lookup", { company })}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm disabled:opacity-50"
          >
            {t("lookUp")}
          </button>
        </div>

        {running ? (
          <button
            type="button"
            onClick={stop}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 text-sm text-destructive"
          >
            <Square className="h-3.5 w-3.5" aria-hidden /> {t("stop")}
          </button>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-background">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted-foreground">
          <Terminal className="h-3.5 w-3.5" aria-hidden />
          {running
            ? t("running")
            : status
              ? t("status", {
                  code: status.code ?? "—",
                  result: status.ok ? t("ok") : t("failed"),
                }) +
                (elapsed != null
                  ? t("elapsed", { seconds: (elapsed / 1000).toFixed(1) })
                  : "")
              : t("idle")}
        </div>
        <pre
          data-testid="run-output"
          className="max-h-80 overflow-auto p-3 font-mono text-xs leading-relaxed"
        >
          {lines.length === 0 && !running ? (
            <span className="text-muted-foreground">{t("noOutput")}</span>
          ) : (
            lines.map((l, i) => (
              <span key={i} className={cn(l.stream === "stderr" && "text-destructive")}>
                {l.data}
              </span>
            ))
          )}
        </pre>
      </div>
    </div>
  );
}
