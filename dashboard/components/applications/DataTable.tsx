"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import type { TrackerRow } from "@/lib/domain/status";
import { MUTED } from "@/lib/domain/status";
import { cn } from "@/lib/utils";
import { FitBadge } from "./FitBadge";
import { StatusSelect } from "./StatusSelect";
import { NotesCell } from "./NotesCell";

function SortHeader({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
    >
      {label}
      <ArrowUpDown className="h-3 w-3 opacity-50" aria-hidden />
    </button>
  );
}

const dash = <span className="text-muted-foreground">—</span>;

export function DataTable({
  rows,
  onRowSelect,
  readOnly = false,
}: {
  rows: TrackerRow[];
  onRowSelect?: (row: TrackerRow) => void;
  readOnly?: boolean;
}) {
  const t = useTranslations("applications");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true }, // default sort: most recent first
  ]);

  const columns = useMemo<ColumnDef<TrackerRow>[]>(
    () => [
      {
        accessorKey: "date",
        header: ({ column }) => (
          <SortHeader
            label={t("table.date")}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "company",
        header: ({ column }) => (
          <SortHeader
            label={t("table.company")}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) =>
          onRowSelect ? (
            <button
              type="button"
              onClick={() => onRowSelect(row.original)}
              className="text-left font-medium hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {row.original.company}
            </button>
          ) : (
            <span className="font-medium">{row.original.company}</span>
          ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <SortHeader
            label={t("table.role")}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
      },
      { accessorKey: "role_type", header: t("table.type") },
      { accessorKey: "channel", header: t("table.channel") },
      {
        accessorKey: "status",
        header: t("table.status"),
        cell: ({ row }) => <StatusSelect row={row.original} readOnly={readOnly} />,
      },
      {
        accessorKey: "fit_rating",
        header: ({ column }) => (
          <SortHeader
            label={t("table.fit")}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => <FitBadge value={getValue<number>()} />,
      },
      {
        accessorKey: "contact_person",
        header: t("table.contact"),
        cell: ({ getValue }) => getValue<string>() || dash,
      },
      {
        id: "notes",
        header: t("table.notes"),
        cell: ({ row }) => <NotesCell row={row.original} readOnly={readOnly} />,
      },
      {
        accessorKey: "cv_file",
        header: t("table.cv"),
        cell: ({ getValue }) =>
          getValue<string>() ? (
            <span className="inline-flex items-center gap-1 text-primary">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              {t("table.pdf")}
            </span>
          ) : (
            dash
          ),
      },
      {
        accessorKey: "cover_letter_file",
        header: t("table.cover"),
        cell: ({ getValue }) =>
          getValue<string>() ? (
            <span className="inline-flex items-center gap-1 text-primary">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              {t("table.pdf")}
            </span>
          ) : (
            dash
          ),
      },
      {
        accessorKey: "source",
        header: t("table.source"),
        cell: ({ getValue }) => {
          const url = getValue<string>();
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {t("table.open")} <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          ) : (
            dash
          );
        },
      },
    ],
    // `t` is intentionally omitted: next-intl returns a fresh `t` each render, so
    // including it would rebuild the columns (and remount react-table rows) on every
    // render — which breaks row-drawer focus restoration. The active locale is fixed
    // for the lifetime of the page (switching locale triggers a full reload), so the
    // labels captured on mount stay correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [readOnly],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (rows.length === 0) {
    return (
      <div
        data-testid="applications-empty"
        className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-10 text-center"
      >
        <p className="text-sm font-medium">{t("empty.title")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("empty.hintBefore")}{" "}
          <code className="rounded bg-muted px-1 py-0.5">/apply &lt;posting&gt;</code>{" "}
          {t("empty.hintAfter")}
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground opacity-90 hover:opacity-100"
        >
          {t("empty.newApplication")}
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-card text-left text-muted-foreground">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="whitespace-nowrap px-3 py-2.5">
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const muted = MUTED.has(row.original.status);
            return (
              <tr
                key={row.id}
                data-muted={muted ? "true" : undefined}
                className={cn(
                  "border-b border-border/60 last:border-0 hover:bg-muted/40",
                  muted && "opacity-60",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-3 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
