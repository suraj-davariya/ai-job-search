/**
 * Pipeline KPI math (REQ-5003/5009, business-rules §9.5). Pure and stack-
 * agnostic so it is unit-testable and reusable by the strip and the analytics
 * home. Honesty rule (ARCH-0007): a KPI whose sample floor isn't met returns
 * `null` (rendered as "—") — never a fabricated number.
 *
 * Windows are measured in calendar days against `now` using each row's `date`.
 */
import { differenceInCalendarDays, parseISO } from "date-fns";
import { STATUSES, type Status, type TrackerRow } from "./status";

export interface Kpis {
  total: number;
  byStatus: Record<Status, number>;
  applied7: number;
  applied30: number;
  /** Mean fit over rows dated within 30d; null when fewer than 3 such rows. */
  avgFit30: number | null;
  /** Interviews ÷ active applications within 90d; null when denom < 3. */
  interviewRate90: number | null;
}

/** Statuses that count as an "active application" for the interview-rate denom. */
const ACTIVE: ReadonlySet<Status> = new Set([
  "Sent",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
  "Closed",
]);

/** Calendar-days between `now` and a row's date, or null for an unparseable date. */
function ageInDays(date: string, now: Date): number | null {
  if (!date) return null;
  const d = parseISO(date);
  if (Number.isNaN(d.getTime())) return null;
  return differenceInCalendarDays(now, d);
}

function withinWindow(age: number | null, days: number): boolean {
  return age !== null && age >= 0 && age <= days;
}

export function kpis(rows: TrackerRow[], now: Date = new Date()): Kpis {
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<
    Status,
    number
  >;
  for (const r of rows) {
    if (r.status in byStatus) byStatus[r.status] += 1;
  }

  let applied7 = 0;
  let applied30 = 0;
  const fit30: number[] = [];
  let denom90 = 0;
  let interview90 = 0;

  for (const r of rows) {
    const age = ageInDays(r.date, now);
    if (withinWindow(age, 7)) applied7 += 1;
    if (withinWindow(age, 30)) {
      applied30 += 1;
      fit30.push(r.fit_rating);
    }
    if (withinWindow(age, 90)) {
      if (ACTIVE.has(r.status)) denom90 += 1;
      if (r.status === "Interview") interview90 += 1;
    }
  }

  const avgFit30 =
    fit30.length >= 3
      ? fit30.reduce((a, b) => a + b, 0) / fit30.length
      : null;

  const interviewRate90 = denom90 >= 3 ? interview90 / denom90 : null;

  return {
    total: rows.length,
    byStatus,
    applied7,
    applied30,
    avgFit30,
    interviewRate90,
  };
}
