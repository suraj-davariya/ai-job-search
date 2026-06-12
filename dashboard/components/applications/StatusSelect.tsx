"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { updateRowAction } from "@/app/actions/tracker";
import {
  transitionOptions,
  type Status,
  type TrackerRow,
} from "@/lib/domain/status";
import { toast } from "@/lib/toast";
import { StatusPill } from "./StatusPill";

/**
 * Inline status editor (REQ-5004). Offers ONLY the current status plus its
 * allowed forward transitions (terminal states show just the pill — nothing to
 * change to). Updates optimistically and reverts + toasts on failure.
 *
 * When `readOnly`, renders a static pill (mutators are disabled in M2.5).
 */
export function StatusSelect({
  row,
  readOnly = false,
}: {
  row: TrackerRow;
  readOnly?: boolean;
}) {
  const [value, setValue] = useState<Status>(row.status);
  const [pending, startTransition] = useTransition();

  const options = transitionOptions(value); // [current, ...allowed-next]

  // Terminal status (no forward moves) or read-only → not editable.
  if (readOnly || options.length === 1) {
    return <StatusPill status={value} />;
  }

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Status;
    if (next === value) return;
    const prev = value;
    setValue(next); // optimistic

    startTransition(async () => {
      const res = await updateRowAction(row._row!, { status: next });
      if ("error" in res) {
        setValue(prev); // revert
        toast(`Couldn't update status: ${res.error}`, "error");
      } else {
        toast(`Updated · ${format(new Date(), "h:mm")}`);
      }
    });
  }

  return (
    <select
      aria-label={`Status for ${row.company}`}
      value={value}
      disabled={pending}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()} // don't open the row drawer
      className="rounded-md border border-border bg-card px-2 py-1 text-xs disabled:opacity-60"
    >
      {options.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
