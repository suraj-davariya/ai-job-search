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

/**
 * Client shell for the applications surface: owns filter state, keeps it in the
 * URL (REQ-5002, shareable within a session), and filters rows live. The server
 * page hands it the full row set; filtering is in-memory (CSV ≤ 1k rows).
 */
export function ApplicationsView({ rows }: { rows: TrackerRow[] }) {
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

  return (
    <div className="space-y-4">
      <FilterBar
        value={filter}
        onChange={update}
        rows={rows}
        resultCount={filtered.length}
      />
      <DataTable rows={filtered} />
    </div>
  );
}
