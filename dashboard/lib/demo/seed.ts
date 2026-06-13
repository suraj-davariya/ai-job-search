/**
 * Bundled sample data for the static demo build (DASHBOARD_DEMO=1).
 *
 * Everything here is FICTIONAL — invented companies, people, and numbers. It is
 * served in place of the real repo files (job_search_tracker.csv, salary_data.json,
 * the profile skill files, upskill reports) so the published demo at
 * /ai-job-search/dashboard/ renders a full, honest pipeline with no real data and
 * no filesystem access. Kept deliberately consistent with the docs-site demo seed
 * (docs-site/components/demo/demo-data.ts) so the two demos tell the same story.
 *
 * The tracker set exercises every status, all five fit bands, repeat companies
 * (for the Top-companies ranking), and enough recent rows that the 7d/30d KPI
 * windows are non-empty relative to mid-June 2026.
 */
import type { TrackerRow } from "@/lib/domain/status";
import type { SalaryData } from "@/lib/data/salary";
import type { ProfileSection } from "@/lib/data/profile";
import type { UpskillReport } from "@/lib/data/upskill";

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
  // March — the slow start
  row("2026-03-04", "Northwind Labs", "Software", "Backend Engineer", "Rejected", 58),
  row("2026-03-09", "Aurora Analytics", "Data", "Data Engineer", "Rejected", 64, {
    channel: "LinkedIn",
  }),
  row("2026-03-17", "Quartz Systems", "Fintech", "Platform Engineer", "Closed", 41),
  row("2026-03-24", "Helio Health", "Healthtech", "Software Engineer", "Withdrawn", 35),

  // April — finding the groove
  row("2026-04-02", "Aurora Analytics", "Data", "Senior Data Engineer", "Rejected", 71, {
    channel: "LinkedIn",
  }),
  row("2026-04-07", "Tidewater Cloud", "Software", "Site Reliability Engineer", "Closed", 49),
  row("2026-04-10", "Mistral Mobility", "Transport", "Data Analyst", "Rejected", 22),
  row("2026-04-15", "Northwind Labs", "Software", "Senior Backend Engineer", "Interview", 76, {
    contact_person: "Jonas Friis",
    channel: "Referral",
    notes: "First round went well — technical screen scheduled.",
  }),
  row("2026-04-21", "Copperline Energy", "Energy", "ML Engineer", "Rejected", 55),
  row("2026-04-28", "Aurora Analytics", "Data", "Analytics Engineer", "Sent", 67, {
    channel: "LinkedIn",
  }),

  // May — momentum
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
    notes: "Verbal offer — written terms pending.",
  }),

  // June — the active window (7d/30d KPIs live here)
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

/** Fictional salary benchmarks — first array property renders as the Salary table. */
export const DEMO_SALARY: SalaryData = {
  benchmarks: [
    { role: "Data Engineer", sector: "Data", p25: 78000, median: 92000, p75: 108000, currency: "EUR" },
    { role: "Senior Data Engineer", sector: "Data", p25: 95000, median: 114000, p75: 132000, currency: "EUR" },
    { role: "Backend Engineer", sector: "Software", p25: 72000, median: 88000, p75: 104000, currency: "EUR" },
    { role: "Site Reliability Engineer", sector: "Software", p25: 88000, median: 105000, p75: 124000, currency: "EUR" },
    { role: "ML Engineer", sector: "Energy", p25: 90000, median: 110000, p75: 130000, currency: "EUR" },
  ],
};

/** A short fictional candidate profile so the Profile page isn't empty. */
export const DEMO_PROFILE: ProfileSection[] = [
  {
    name: "01-candidate-profile.md",
    path: "demo://profile/01-candidate-profile.md",
    content: [
      "# Candidate Profile (sample)",
      "",
      "**Name:** Alex Demo",
      "**Target roles:** Data Engineer, Platform Engineer",
      "**Location:** Remote (EU)",
      "",
      "## Experience",
      "- 6 years building data platforms and backend services.",
      "- Led migration of a batch pipeline to streaming (Kafka + Flink).",
      "",
      "## Skills",
      "Python · TypeScript · SQL · Airflow · Kubernetes · AWS",
      "",
      "_This is fictional sample data shown in the published demo._",
    ].join("\n"),
  },
  {
    name: "04-job-evaluation.md",
    path: "demo://profile/04-job-evaluation.md",
    content: [
      "# Job Evaluation Notes (sample)",
      "",
      "**Strong areas:** data modelling, pipeline reliability, mentoring.",
      "**Growth areas:** front-end depth, public speaking.",
      "**Career goal:** senior/staff data-platform role with ownership.",
    ].join("\n"),
  },
];

/** One fictional upskill report so the Upskill page renders content. */
export const DEMO_UPSKILL: {
  reports: UpskillReport[];
  content: Record<string, string>;
} = {
  reports: [
    {
      name: "report-2026-06-02.md",
      path: "demo://upskill/report-2026-06-02.md",
      mtimeMs: 0,
    },
  ],
  content: {
    "demo://upskill/report-2026-06-02.md": [
      "# Upskill Report — 2026-06-02 (sample)",
      "",
      "Comparing your profile against recent **Senior Data Engineer** postings.",
      "",
      "## Top gaps",
      "1. **Streaming at scale** — 3 of 5 target roles ask for Flink/Beam. Build one end-to-end project.",
      "2. **dbt** — frequently listed; complete the dbt fundamentals course.",
      "3. **Cloud cost optimisation** — mentioned in senior roles; read the AWS well-architected cost pillar.",
      "",
      "## Suggested 4-week plan",
      "- Week 1–2: Flink tutorial + a small CDC pipeline.",
      "- Week 3: dbt fundamentals, refactor one model.",
      "- Week 4: write up the project for your portfolio.",
      "",
      "_Fictional sample report shown in the published demo._",
    ].join("\n"),
  },
};
