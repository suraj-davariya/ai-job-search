"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { updateRowAction } from "@/app/actions/tracker";
import type { TrackerRow } from "@/lib/domain/status";
import { toast } from "@/lib/toast";

/**
 * Inline notes editor (REQ-5004): an expand-on-focus input that persists on
 * blur or Enter, optimistically, and reverts + toasts on failure. Escape
 * cancels the edit. Read-only mode (M2.5) renders the text only.
 */
export function NotesCell({
  row,
  readOnly = false,
}: {
  row: TrackerRow;
  readOnly?: boolean;
}) {
  const [value, setValue] = useState(row.notes);
  const [draft, setDraft] = useState(row.notes);
  const [pending, startTransition] = useTransition();

  if (readOnly) {
    return (
      <span className="block max-w-[16rem] truncate text-muted-foreground">
        {value || "—"}
      </span>
    );
  }

  function commit() {
    if (draft === value) return;
    const prev = value;
    setValue(draft); // optimistic

    startTransition(async () => {
      const res = await updateRowAction(row._row!, { notes: draft });
      if ("error" in res) {
        setValue(prev);
        setDraft(prev); // revert the field too
        toast(`Couldn't save notes: ${res.error}`, "error");
      } else {
        toast(`Updated · ${format(new Date(), "h:mm")}`);
      }
    });
  }

  return (
    <input
      aria-label={`Notes for ${row.company}`}
      value={draft}
      disabled={pending}
      onChange={(e) => setDraft(e.target.value)}
      onClick={(e) => e.stopPropagation()} // don't open the row drawer
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLInputElement).blur();
        } else if (e.key === "Escape") {
          setDraft(value); // cancel
          (e.target as HTMLInputElement).blur();
        }
      }}
      className="w-40 truncate rounded-md border border-transparent bg-transparent px-2 py-1 text-xs focus:w-64 focus:border-border focus:bg-card disabled:opacity-60"
      placeholder="—"
    />
  );
}
