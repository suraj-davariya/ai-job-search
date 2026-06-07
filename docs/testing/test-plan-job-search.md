# Testing — Test Plan: Job Search

> **Purpose:** Test cases and verification steps for the job search command, deduplication logic, and tracker updates.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** QA Lead

---

## 1. Feature Under Test: `/search`

The `/search` command fetches lists of jobs, runs quick compatibility filtering, and logs applications in `job_search_tracker.csv` (at repo root).

---

## 2. Test Cases

### Adapter Scrapers
- **TC-SEA-001**: Verify that if a target page is a single page application (SPA), the scraper successfully extracts the raw body text after DOM hydration.
- **TC-SEA-002**: Verify that if the scraper times out or is blocked (e.g. 403 Forbidden), the adapter catches the exception, prints a readable error, and halts.

### Deduplication
- **TC-SEA-003**: Verify that if a job's hash (MD5 of Title + Company + URL) exists in `seen_jobs.json`, the job is hidden from the final command output.
- **TC-SEA-004**: Verify that when a new search runs, any newly discovered jobs are appended to the console output while existing records remain untouched in `seen_jobs.json`.

### Evaluation & Ranking
- **TC-SEA-005**: Verify that search results are printed in descending order of their fit level (High, Medium, Low).
- **TC-SEA-006**: Verify that if keywords match specific writing style constraints, they are matched correctly in calculations.

### Tracker Updates
- **TC-SEA-007**: Verify that when a user decides to apply to a job, a new row is appended to `job_search_tracker.csv` with status `Draft` and the correct cv_file/cover_letter_file paths.
- **TC-SEA-008**: Verify that the tracking dashboard status update mutates only the `status`, `notes`, and `last_updated` fields without adding duplicate rows.
- **TC-SEA-009**: Verify that if `job_search_tracker.csv` does not exist, `/apply` initializes the file with the canonical header columns (date, company, sector, role, role_type, channel, status, contact_person, fit_rating, notes, cv_file, cover_letter_file, source, last_updated).
