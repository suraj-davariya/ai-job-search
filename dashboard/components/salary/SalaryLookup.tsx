"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface Match {
  company?: string;
  [k: string]: unknown;
}

/**
 * Salary lookup box (REQ-5014): runs `python3 salary_lookup.py "<company>"
 * --json` through the action layer and renders the parsed JSON honestly —
 * including an explicit "no match" when `matches` is empty (ARCH-0007). The
 * button is disabled with a tooltip when python3 is missing or in read-only.
 */
export function SalaryLookup({
  pythonOk,
  readOnly,
}: {
  pythonOk: boolean;
  readOnly: boolean;
}) {
  const [company, setCompany] = useState("");
  const [running, setRunning] = useState(false);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [raw, setRaw] = useState("");
  const [searched, setSearched] = useState("");

  async function run() {
    if (running || company.trim() === "") return;
    setRunning(true);
    setMatches(null);
    setRaw("");
    setSearched(company);

    let out = "";
    try {
      const res = await fetch("/api/run/salary-lookup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ company }),
      });
      if (!res.ok || !res.body) {
        setRaw(await res.text());
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const blocks = buf.split("\n\n");
        buf = blocks.pop() ?? "";
        for (const b of blocks.filter(Boolean)) {
          const event = /event: (.*)/.exec(b)?.[1];
          const data = JSON.parse(/data: (.*)/.exec(b)?.[1] ?? "{}");
          if (event === "output" && data.stream === "stdout") out += data.data;
        }
      }
      try {
        const parsed = JSON.parse(out);
        setMatches(Array.isArray(parsed.matches) ? parsed.matches : []);
      } catch {
        setRaw(out || "No output.");
      }
    } catch (err) {
      setRaw(err instanceof Error ? err.message : "lookup failed");
    } finally {
      setRunning(false);
    }
  }

  const disabled = readOnly || !pythonOk;
  const tip = readOnly
    ? "Read-only mode — actions are disabled"
    : !pythonOk
      ? "python3 not found on PATH"
      : undefined;

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <h3 className="mb-3 text-sm font-medium">Look up a company</h3>
      <div className="flex gap-2">
        <input
          aria-label="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder="Company name"
          className="h-9 flex-1 rounded-lg border border-input bg-background px-2 text-sm"
        />
        <button
          type="button"
          disabled={disabled || running || company.trim() === ""}
          title={tip}
          onClick={run}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          <Search className="h-4 w-4" aria-hidden /> {running ? "Looking…" : "Look up"}
        </button>
      </div>

      {matches !== null ? (
        matches.length === 0 ? (
          <p data-testid="salary-result" className="mt-3 text-sm text-muted-foreground">
            No match found for “{searched}”.
          </p>
        ) : (
          <ul data-testid="salary-result" className="mt-3 space-y-2">
            {matches.map((m, i) => (
              <li key={i} className="rounded-lg border border-border bg-background p-3">
                <p className="text-sm font-medium">{m.company ?? "(unnamed)"}</p>
                <pre className="mt-1 whitespace-pre-wrap break-words text-xs text-muted-foreground">
                  {JSON.stringify(m, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        )
      ) : null}

      {raw ? (
        <pre
          data-testid="salary-result"
          className="mt-3 whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground"
        >
          {raw}
        </pre>
      ) : null}
    </div>
  );
}
