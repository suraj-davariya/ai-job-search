/**
 * Single source of truth for every repo file path the dashboard reads or writes.
 *
 * The dashboard lives in `<repo>/dashboard/`; all product data lives at the repo
 * root and is a SHARED CONTRACT with the CLI — the dashboard owns none of it.
 * Deleting `dashboard/` must leave these files intact (ARCH-0005, build-prompt §3).
 *
 * Resolution order for the repo root:
 *   1. CAREERFORGE_REPO_ROOT env var (set by scripts/start.mjs --repo)
 *   2. `<dashboard>/..` — the default, dashboard nested one level under the repo.
 */
import path from "node:path";

/** Absolute path to the repo root (parent of `dashboard/`). */
export function repoRoot(): string {
  const fromEnv = process.env.CAREERFORGE_REPO_ROOT;
  if (fromEnv && fromEnv.trim()) return path.resolve(fromEnv);
  // process.cwd() is the dashboard/ dir when Next runs; go up one level.
  return path.resolve(process.cwd(), "..");
}

function atRoot(...segments: string[]): string {
  return path.join(repoRoot(), ...segments);
}

/** Canonical repo data paths. Filenames mirror data-architecture §11. */
export const paths = {
  repoRoot,

  // Tracker CSV — the primary application record (read + atomic write).
  tracker: () => atRoot("job_search_tracker.csv"),
  trackerTmp: (pid: number | string) =>
    atRoot(`.job_search_tracker.csv.tmp.${pid}`),
  trackerBak: () => atRoot(".job_search_tracker.csv.bak"),

  // Search + salary state (read-only from the dashboard's perspective).
  seenJobs: () => atRoot("job_scraper", "seen_jobs.json"),
  salaryData: () => atRoot("salary_data.json"),

  // CLI scripts the action layer may spawn (allowlisted, never a shell string).
  salaryScript: () => atRoot("salary_lookup.py"),
  convertSalaryScript: () => atRoot("tools", "convert_salary_excel.py"),

  // Generated documents + reports.
  applicationsDir: () => atRoot("documents", "applications"),
  applicationDir: (slug: string) =>
    atRoot("documents", "applications", slug),
  cvOutputDir: () => atRoot("cv", "output"),
  coverLetterOutputDir: () => atRoot("cover_letters", "output"),
  upskillDir: () => atRoot("upskill"),

  // Candidate profile skill files (01–07) + root project memory.
  profileSkillDir: () =>
    atRoot(".claude", "skills", "job-application-assistant"),
  projectMemory: () => atRoot("CLAUDE.md"),

  // Dashboard-local state (NOT product data — gitignored).
  runsDir: () => path.join(process.cwd(), ".runs"),
} as const;
