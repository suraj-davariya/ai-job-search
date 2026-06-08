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

### Web Search & Fetch
- **TC-SEA-001**: Verify that when `WebSearch` returns results matching the user's configured portals, queries, and geography, the skill pre-filters snippets and fetches only promising postings (REQ-1003, REQ-1004).
- **TC-SEA-002**: Verify that when a `WebFetch` call fails (gated portal, auth wall, dead link), the skill prompts the user to paste the posting text and processes the pasted content identically to a fetched page — the workflow does not abort (DEC-011, REQ-1004).

### Deduplication
- **TC-SEA-003**: Verify that if a job's `<url_or_company_title_key>` already exists as a key in `seen_jobs.json` (data-req §10), the job is excluded from the presented results (REQ-1006).
- **TC-SEA-004**: Verify that when a new search runs, any newly discovered jobs are appended to the console output while existing records remain untouched in `seen_jobs.json`.

### Evaluation & Ranking
- **TC-SEA-005**: Verify that search results are printed in descending order of their fit level (High, Medium, Low).
- **TC-SEA-006**: Verify that the quick-fit signal is assigned as one of three levels (High / Medium / Low) based on alignment between the job's key requirements and the candidate's core skills, with no numeric formula involved (REQ-1005).

### Tracker Updates
- **TC-SEA-007**: Verify that when a user decides to apply to a job, a new row is appended to `job_search_tracker.csv` with status `Draft` and the correct cv_file/cover_letter_file paths.
- **TC-SEA-008**: Verify that the tracking dashboard status update mutates only the `status`, `notes`, and `last_updated` fields without adding duplicate rows.
- **TC-SEA-009**: Verify that if `job_search_tracker.csv` does not exist, `/apply` initializes the file with the canonical header columns (date, company, sector, role, role_type, channel, status, contact_person, fit_rating, notes, cv_file, cover_letter_file, source, last_updated).
