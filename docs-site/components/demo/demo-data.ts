import type { TrackerRow } from "./domain/status";

/**
 * Fictional demo tracker rows (build-prompt §6). Every company, person, and
 * role here is invented — never replace with real application data. The set
 * deliberately exercises:
 *  - every status at least once,
 *  - all five fit-rating bands,
 *  - repeat companies (for the Top-companies ranking),
 *  - enough recent rows that the 7d/30d/90d KPI windows are all non-empty
 *    relative to DEMO_NOW.
 */

/** Fixed "today" for all demos, so KPIs and charts render the same forever. */
export const DEMO_NOW = new Date("2026-06-11T12:00:00Z");

function row(
  date: string,
  company: string,
  sector: string,
  role: string,
  status: TrackerRow["status"],
  fit_rating: number,
  extra?: Partial<TrackerRow>,
): TrackerRow {
  return {
    date,
    company,
    sector,
    role,
    role_type: "Full-time",
    channel: "Company site",
    status,
    contact_person: "",
    fit_rating,
    notes: "",
    cv_file: "",
    cover_letter_file: "",
    source: "",
    last_updated: date,
    ...extra,
  };
}

export const DEMO_ROWS: TrackerRow[] = [
  // ── March — the slow start ────────────────────────────────────────────
  row("2026-03-04", "Northwind Labs", "Software", "Backend Engineer", "Rejected", 58),
  row("2026-03-09", "Aurora Analytics", "Data", "Data Engineer", "Rejected", 64, {
    channel: "LinkedIn",
  }),
  row("2026-03-17", "Quartz Systems", "Fintech", "Platform Engineer", "Closed", 41),
  row("2026-03-24", "Helio Health", "Healthtech", "Software Engineer", "Withdrawn", 35),

  // ── April — finding the groove ────────────────────────────────────────
  row("2026-04-02", "Aurora Analytics", "Data", "Senior Data Engineer", "Rejected", 71, {
    channel: "LinkedIn",
  }),
  row("2026-04-07", "Tidewater Cloud", "Software", "Site Reliability Engineer", "Closed", 49),
  row("2026-04-10", "Mistral Mobility", "Transport", "Data Analyst", "Rejected", 22),
  row("2026-04-15", "Northwind Labs", "Software", "Senior Backend Engineer", "Interview", 76, {
    contact_person: "Jonas Friis",
    channel: "Referral",
  }),
  row("2026-04-21", "Copperline Energy", "Energy", "ML Engineer", "Rejected", 55),
  row("2026-04-28", "Aurora Analytics", "Data", "Analytics Engineer", "Sent", 67, {
    channel: "LinkedIn",
  }),

  // ── May — momentum ────────────────────────────────────────────────────
  row("2026-05-04", "Brightharbor", "Edtech", "Full-stack Engineer", "Interview", 81, {
    contact_person: "Mette Holm",
  }),
  row("2026-05-07", "Quartz Systems", "Fintech", "Senior Platform Engineer", "Sent", 62),
  row("2026-05-11", "Veldt Robotics", "Robotics", "Software Engineer", "Rejected", 38),
  row("2026-05-13", "Tidewater Cloud", "Software", "Cloud Engineer", "Sent", 59),
  row("2026-05-18", "Northwind Labs", "Software", "Staff Engineer", "Sent", 73, {
    channel: "Referral",
  }),
  row("2026-05-20", "Lumen Logistics", "Logistics", "Data Engineer", "Interview", 84, {
    contact_person: "Sofia Andersen",
    channel: "Job board",
  }),
  row("2026-05-25", "Copperline Energy", "Energy", "Senior ML Engineer", "Sent", 66),
  row("2026-05-28", "Brightharbor", "Edtech", "Senior Full-stack Engineer", "Offer", 88, {
    contact_person: "Mette Holm",
    notes: "Verbal offer — written terms pending",
  }),

  // ── June — the active window (7d/30d KPIs live here) ─────────────────
  row("2026-06-01", "Aurora Analytics", "Data", "Lead Data Engineer", "Sent", 78, {
    channel: "LinkedIn",
  }),
  row("2026-06-03", "Quartz Systems", "Fintech", "Engineering Manager", "Sent", 52),
  row("2026-06-04", "Saffron Studio", "Design", "Creative Technologist", "Draft", 13),
  row("2026-06-05", "Tidewater Cloud", "Software", "Senior SRE", "Interview", 80, {
    contact_person: "Priya Nair",
  }),
  row("2026-06-08", "Veldt Robotics", "Robotics", "Perception Engineer", "Sent", 47),
  row("2026-06-09", "Lumen Logistics", "Logistics", "Senior Data Engineer", "Sent", 90, {
    channel: "Job board",
  }),
  row("2026-06-10", "Northwind Labs", "Software", "Principal Engineer", "Draft", 69, {
    channel: "Referral",
  }),
  row("2026-06-11", "Helio Health", "Healthtech", "Data Platform Engineer", "Draft", 74),
];
