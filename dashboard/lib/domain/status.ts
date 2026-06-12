/**
 * Application status state-machine (business-rules §9).
 * Canonical and stack-agnostic — pure data + functions, no Next.js imports.
 */

export const STATUSES = [
  "Draft",
  "Sent",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
  "Closed",
] as const;
export type Status = (typeof STATUSES)[number];

/** Allowed forward transitions from each status. Terminal states have none. */
export const ALLOWED_NEXT: Record<Status, Status[]> = {
  Draft: ["Sent", "Withdrawn"],
  Sent: ["Interview", "Rejected", "Withdrawn", "Closed"],
  Interview: ["Offer", "Rejected", "Withdrawn", "Closed"],
  Offer: [],
  Rejected: [],
  Withdrawn: [],
  Closed: [],
};

/** Terminal statuses — rows muted (but never hidden) in the table (§8). */
export const MUTED: ReadonlySet<Status> = new Set([
  "Rejected",
  "Withdrawn",
  "Closed",
]);

export function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

/**
 * Validate a status change before it is written.
 * A no-op (to === from) is always allowed; otherwise `to` must be in
 * ALLOWED_NEXT[from]. Everything else throws.
 */
export function assertTransition(from: Status, to: Status): void {
  if (to === from) return;
  if (ALLOWED_NEXT[from].includes(to)) return;
  throw new Error(`Transition ${from} → ${to} is not allowed`);
}

/** The choices a status dropdown should offer: current state + its allowed next. */
export function transitionOptions(from: Status): Status[] {
  return [from, ...ALLOWED_NEXT[from]];
}

/**
 * The canonical 14-column tracker record (data-architecture §11).
 * `last_updated` defaults to `date` for legacy rows (filled in-memory on read).
 */
export interface TrackerRow {
  date: string; // YYYY-MM-DD
  company: string;
  sector: string;
  role: string;
  role_type: string;
  channel: string;
  status: Status;
  contact_person: string;
  fit_rating: number; // 0..100
  notes: string;
  cv_file: string;
  cover_letter_file: string;
  source: string;
  last_updated: string; // ISO date
  /** In-memory only: true when last_updated was blank and back-filled from date. */
  _legacyLastUpdated?: boolean;
  /**
   * In-memory only: 0-based position of this row in the parsed tracker. This is
   * the write key — `updateRow(file, _row, …)` addresses rows by file position,
   * so it must survive client-side sorting and filtering. Never serialized.
   */
  _row?: number;
}
