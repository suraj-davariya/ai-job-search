/**
 * Tracker CSV serialize/parse helpers — shared by the read and write layers.
 * Pure (no file IO), so it is unit-testable without Next.js.
 *
 * The 14 columns are an exact contract (data-architecture §11). Order matters:
 * the write layer must round-trip a row back to the same column order.
 */
import Papa from "papaparse";
import { isStatus, type Status, type TrackerRow } from "./status";

export const TRACKER_COLUMNS = [
  "date",
  "company",
  "sector",
  "role",
  "role_type",
  "channel",
  "status",
  "contact_person",
  "fit_rating",
  "notes",
  "cv_file",
  "cover_letter_file",
  "source",
  "last_updated",
] as const;

type RawRow = Record<string, string>;

function str(v: unknown): string {
  return v == null ? "" : String(v).trim();
}

/** Map a raw CSV record to a typed TrackerRow with coercion + migration. */
function toRow(raw: RawRow): TrackerRow {
  const date = str(raw.date);
  const rawStatus = str(raw.status);
  // Unknown status is kept as-is (flagged by not matching STATUSES) per spec.
  const status = (isStatus(rawStatus) ? rawStatus : rawStatus) as Status;

  const fitNum = Number(str(raw.fit_rating));
  const fit_rating = Number.isFinite(fitNum) ? fitNum : 0;

  const rawLastUpdated = str(raw.last_updated);
  const legacy = rawLastUpdated === "";
  const last_updated = legacy ? date : rawLastUpdated;

  return {
    date,
    company: str(raw.company),
    sector: str(raw.sector),
    role: str(raw.role),
    role_type: str(raw.role_type),
    channel: str(raw.channel),
    status,
    contact_person: str(raw.contact_person),
    fit_rating,
    notes: str(raw.notes),
    cv_file: str(raw.cv_file),
    cover_letter_file: str(raw.cover_letter_file),
    source: str(raw.source),
    last_updated,
    ...(legacy ? { _legacyLastUpdated: true } : {}),
  };
}

/** True when a raw record has at least one non-empty cell (drops blank lines). */
function hasValue(raw: RawRow): boolean {
  return Object.values(raw).some((v) => str(v) !== "");
}

/** Parse tracker CSV text into typed rows. Throws on malformed CSV structure. */
export function parseTrackerCsv(text: string): TrackerRow[] {
  // Strip a UTF-8 BOM if present so the first header isn't corrupted.
  const clean = text.replace(/^﻿/, "");
  if (clean.trim() === "") return [];

  const parsed = Papa.parse<RawRow>(clean, {
    header: true,
    skipEmptyLines: "greedy",
  });

  return (parsed.data ?? []).filter(hasValue).map(toRow);
}

/** Serialize typed rows back to CSV text in the exact 14-column order. */
export function serializeTrackerCsv(rows: TrackerRow[]): string {
  const records = rows.map((r) =>
    Object.fromEntries(
      TRACKER_COLUMNS.map((c) => [c, c === "fit_rating" ? r[c] : r[c] ?? ""]),
    ),
  );
  // Force Unix newlines: the tracker is git-tracked and shared with the CLI,
  // which writes `\n`. Papa defaults to `\r\n`, which would churn the diff.
  return Papa.unparse(records, {
    columns: TRACKER_COLUMNS as unknown as string[],
    newline: "\n",
  });
}
