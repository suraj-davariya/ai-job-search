"use client";

import { useState, useTransition } from "react";
import { updateSettingsAction } from "@/app/actions/settings";
import { toast } from "@/lib/toast";
import { ThemeToggle } from "@/components/shell/theme-toggle";

/**
 * Local preferences form (REQ-5016): theme (next-themes), repo path, default
 * port, and a read-only toggle mirroring the --read-only launch flag. Persists
 * to .dashboard.local.json via the server action. No secrets, no accounts.
 * Repo path / port / read-only apply on the next dashboard launch.
 */
export function SettingsForm({
  initial,
}: {
  initial: { repoRoot: string; port: number; readOnly: boolean };
}) {
  const [repoRoot, setRepoRoot] = useState(initial.repoRoot);
  const [port, setPort] = useState(String(initial.port));
  const [readOnly, setReadOnly] = useState(initial.readOnly);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await updateSettingsAction({
        repoRoot,
        port: Number(port),
        readOnly,
      });
      if ("error" in res) toast(`Couldn't save settings: ${res.error}`, "error");
      else toast("Settings saved");
    });
  }

  return (
    <div className="max-w-xl space-y-5">
      <Row label="Theme" hint="Defaults to dark.">
        <ThemeToggle />
      </Row>

      <Row label="Repo path" hint="Folder the dashboard reads/writes (applies on next launch).">
        <input
          aria-label="Repo path"
          value={repoRoot}
          onChange={(e) => setRepoRoot(e.target.value)}
          className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
        />
      </Row>

      <Row label="Default port" hint="Loopback port (applies on next launch).">
        <input
          aria-label="Default port"
          type="number"
          min={1}
          max={65535}
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="h-9 w-32 rounded-lg border border-input bg-background px-2 text-sm"
        />
      </Row>

      <Row label="Read-only mode" hint="Disables all edits and actions.">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            aria-label="Read-only mode"
            checked={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
            className="h-4 w-4"
          />
          {readOnly ? "On" : "Off"}
        </label>
      </Row>

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{label}</span>
        <div className="shrink-0">{children}</div>
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
