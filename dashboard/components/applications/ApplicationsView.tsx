"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  parse,
  serialize,
  applyFilter,
  type FilterState,
} from "@/lib/domain/filter";
import type { TrackerRow } from "@/lib/domain/status";
import { FilterBar } from "./FilterBar";
import { DataTable } from "./DataTable";
import { RowDrawer } from "./RowDrawer";
import { NewDialog } from "./NewDialog";

/**
 * Client shell for the applications surface: owns filter state, keeps it in the
 * URL (REQ-5002, shareable within a session), and filters rows live. The server
 * page hands it the full row set; filtering is in-memory (CSV ≤ 1k rows).
 */
export function ApplicationsView({
  rows,
  readOnly = false,
}: {
  rows: TrackerRow[];
  readOnly?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<FilterState>(() =>
    parse(searchParams.toString()),
  );

  const update = useCallback(
    (next: FilterState) => {
      setFilter(next);
      const qs = serialize(next);
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router],
  );

  const filtered = useMemo(() => applyFilter(rows, filter), [rows, filter]);
  const [selected, setSelected] = useState<TrackerRow | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <FilterBar
            value={filter}
            onChange={update}
            rows={rows}
            resultCount={filtered.length}
          />
        </div>
        <NewDialog disabled={readOnly} />
      </div>
      <DataTable rows={filtered} onRowSelect={setSelected} readOnly={readOnly} />
      {selected ? (
        <RowDrawer row={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}
