/**
 * The 14-column tracker contract — copied from dashboard/lib/domain/csv.ts
 * (only the constant; the papaparse helpers stay in the dashboard). Order
 * matters: this is the exact CSV header your tracker file uses.
 * Guarded against drift by test/domain-parity.test.ts.
 */
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
