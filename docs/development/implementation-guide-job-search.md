# Development — Implementation Guide: Job Search Engine

> **Purpose:** Detailed implementation guide for the job search engine, adapter pattern, scraping mechanisms, and deduplication logic.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Staff Engineer

---

## 1. Plane-1 Web-Search Model

The job-search engine is a **Plane-1 skill** (ARCH-0008, ARCH-0010): it uses the AI assistant's built-in `WebSearch` and `WebFetch` tools to discover job postings. There is no compiled scraper, no binary adapter, and no headless browser — the skill is a Markdown knowledge anchor at `.claude/skills/job-scraper/SKILL.md`.

**Why Plane-1?** Country-agnostic coverage (DEC-012, ADR-0004, NFR-0007) requires a universal mechanism. Web search works everywhere; compiled portal adapters would require a new binary per country. Plane-1 ships now with zero infrastructure; Plane-2 TypeScript portal adapters (optional, v1.2+) are a future extension for high-volume or authenticated portals.

**Country-agnostic by design:** no portal name, `site:` string, country, or locale is hardcoded in the skill. Every search target comes from the user's `search-queries.md` config (data-req §17). Adding support for a new job board or geography means editing the config, not the skill.

**Plane-2 (optional, v1.2 scope):** structured TypeScript portal adapters live at `.agents/skills/<portal>/cli/` and implement a pluggable provider interface (ADR-0004). They are out of scope for the current release and do not affect Plane-1 behavior.

---

## 2. Search & Fetch Mechanism

### Web Search
- The skill builds `WebSearch` queries by combining the user's configured **portals** (from `search-queries.md` Search Sites), **query strings** (Priority groups), and **geography** — verbatim from the user's config.
- Queries are constrained to the last 14 days (the Date Filter Rule in `search-queries.md`).
- Multiple queries run in parallel where useful.

### Fetch & Parse
- Pre-filter on snippet text to discard obvious non-matches before fetching (token efficiency).
- `WebFetch` promising posting URLs. Extract: title, company, location, posting date (or "recent"), URL, key requirements, application deadline.
- **On a fetch failure** (gated portal, auth wall, dead link): prompt the user to paste the posting. Pasted text is a first-class input, processed identically to a fetched page (DEC-011). Never abort on a single fetch failure.

### No compiled scraper
Plane-1 requires no binary scraper or adapter module. If a Plane-2 portal adapter is later contributed, it lives at `.agents/skills/<portal>/cli/` with its own `package.json`.

---

## 3. Deduplication Strategy (`seen_jobs.json`)

To prevent the skill from presenting the same posting on repeated runs:

1. **State store**: a local JSON registry at `job_scraper/seen_jobs.json`. Create it with `{"seen": {}}` if missing (REQ-1002).
2. **Dedup key** (data-req §10): `<url_or_company_title_key>` — the posting URL when stable, or a `<company>_<title>` string when no stable URL exists. The key is a plain string, not a computed hash.
3. **Filter**:
   - Before presenting results, skip any job whose key already appears in `seen_jobs.json` **or** whose company+role pair exists in `job_search_tracker.csv`.
   - Record **every** fetched job — new and skipped — in the registry. The registry grows monotonically; entries are never removed.
4. **Schema** (data-req §10):
   ```json
   { "seen": { "<url_or_company_title_key>": { "title": "...", "company": "...", "url": "...", "first_seen": "YYYY-MM-DD", "fit": "high|medium|low", "status": "new|skipped|evaluated" } } }
   ```
   - `status` transitions: `new` → `evaluated` when handed to `/apply`; `skipped` for filtered-out jobs.
   - `first_seen` is set on first record and never overwritten on later runs.

---

## 4. Job Evaluation & Ranking

The skill assigns each new job a **three-level quick-fit signal** (REQ-1005) used only for sorting. This is explicitly not a numeric score and not the full 5-dimension evaluation that happens later in `/apply`.

| Signal | Meaning |
|--------|---------|
| **High** | Role directly involves the user's core skills |
| **Medium** | Role is adjacent to the user's experience |
| **Low** | Role requires significant skills the user lacks |

The fit signal is derived from the candidate's core skills in `01-candidate-profile.md` and the job's key requirements. There is no weighted formula — the signal is a qualitative sort key, not a percentage.

Results are presented in a table sorted High → Medium → Low (REQ-1007).

---

## 5. Application Tracker Log

When the user decides to apply to a job, the system appends a new row to `job_search_tracker.csv` (at the repo root). The canonical schema is defined in `docs/requirements/data-requirements.md §11`.

### CSV Columns (canonical)

```
date, company, sector, role, role_type, channel, status, contact_person,
fit_rating, notes, cv_file, cover_letter_file, source, last_updated
```

- **date**: ISO-8601 date the row was created (e.g., `2026-06-05`)
- **status**: One of the Application Status Enum values: `Draft`, `Sent`, `Interview`, `Offer`, `Rejected`, `Withdrawn`, `Closed` — see `business-rules-and-validation.md §9`
- **cv_file / cover_letter_file**: Relative paths to the generated PDF files
- **last_updated**: Updated automatically whenever a field is changed (by `/apply` on creation; by the tracking dashboard on subsequent edits)

### Write discipline

- `/apply` **appends only** — never mutates existing rows
- The tracking dashboard mutates only `status`, `notes`, and `last_updated`
- All writes are atomic (tempfile + fsync + rename) per NFR-0016

### Implementation note

Do **not** use the old schema (`Date,Company,Title,URL,FitScore,Status,CV_Path,CL_Path`) or status enum (`Generated`, `Applied`, `Interviewing`, `Rejected`, `Offered`). Those were pre-spec definitions superseded by the canonical schema above. Any existing implementation using the old schema must be migrated.
