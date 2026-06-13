/**
 * Pure chart aggregators (REQ-5009, NFR-0015). Stack-agnostic and unit-tested so
 * the Nivo/SVG wrappers stay dumb and every chart has a verifiable data source
 * (the accessible <table> renders straight from these). Bad/empty dates are
 * skipped, never coerced — charts must not fabricate a series (ARCH-0007).
 */
import { format, parseISO, startOfWeek } from "date-fns";
import { STATUSES, type Status, type TrackerRow } from "./status";

export interface Bin {
  key: string;
  count: number;
}
export interface CalendarDay {
  day: string; // yyyy-MM-dd (Nivo calendar shape)
  value: number;
}
export interface StatusBin {
  status: Status;
  count: number;
}
export interface FitBucket {
  range: string;
  count: number;
}

function validDate(date: string): Date | null {
  if (!date) return null;
  const d = parseISO(date);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Applications per ISO week (Monday start), ascending by week-start date. */
export function byWeek(rows: TrackerRow[]): Bin[] {
  const m = new Map<string, number>();
  for (const r of rows) {
    const d = validDate(r.date);
    if (!d) continue;
    const week = format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-MM-dd");
    m.set(week, (m.get(week) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({ key, count }));
}

/** Applications per calendar day, in Nivo-calendar `{day,value}` shape. */
export function byDay(rows: TrackerRow[]): CalendarDay[] {
  const m = new Map<string, number>();
  for (const r of rows) {
    const d = validDate(r.date);
    if (!d) continue;
    m.set(r.date, (m.get(r.date) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, value]) => ({ day, value }));
}

/** Count per status, every status present (incl. zeros), in canonical order. */
export function byStatus(rows: TrackerRow[]): StatusBin[] {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<
    Status,
    number
  >;
  for (const r of rows) {
    if (r.status in counts) counts[r.status] += 1;
  }
  return STATUSES.map((status) => ({ status, count: counts[status] }));
}

const FIT_BANDS: ReadonlyArray<[string, number, number]> = [
  ["0–19", 0, 20],
  ["20–39", 20, 40],
  ["40–59", 40, 60],
  ["60–79", 60, 80],
  ["80–100", 80, 101],
];

/** Histogram of fit_rating into 5 bands of 20 (100 falls in the top band). */
export function fitBuckets(rows: TrackerRow[]): FitBucket[] {
  const out = FIT_BANDS.map(([range]) => ({ range, count: 0 }));
  for (const r of rows) {
    const f = r.fit_rating;
    const i = FIT_BANDS.findIndex(([, lo, hi]) => f >= lo && f < hi);
    if (i >= 0) out[i].count += 1;
  }
  return out;
}

/** Top `n` values of a key by count, ties broken alphabetically. Blanks skipped. */
export function topBy(
  rows: TrackerRow[],
  key: "company" | "sector",
  n = 5,
): Bin[] {
  const m = new Map<string, number>();
  for (const r of rows) {
    const v = r[key];
    if (!v) continue;
    m.set(v, (m.get(v) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort(([ak, av], [bk, bv]) => bv - av || ak.localeCompare(bk))
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}
