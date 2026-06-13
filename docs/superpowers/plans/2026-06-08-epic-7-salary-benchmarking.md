# Epic 7 — Salary Benchmarking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the salary benchmarking subsystem — a Python `salary_lookup.py` CLI at repo root, a fully-implemented `tools/convert_salary_excel.py`, updated README docs, and a clean wire-up in `/apply` — so users can benchmark target companies against their own salary data during fit evaluation.

**Architecture:** Pure Python (stdlib + optional `openpyxl`). No build step. Two standalone scripts. Data stored in `salary_data.json` (gitignored — already in `.gitignore:22`). Integration is instruction-driven in `/apply` (already partially wired). Per REQ-4001: gracefully skips when data file absent.

**Canonical refs:** REQ-4001–4006, REQ-2011, data-req §12 (`salary_data.json` schema), business-rules §1.

**Runtime constraint (VERIFIED):** the default `python3` on this machine is **3.9.6**, not 3.10+. Both scripts are invoked as `python3 <script>`, so they MUST be 3.9-compatible: no `match` statements, no PEP 604 runtime unions (`int | None` in annotations is fine only under `from __future__ import annotations`; prefer `Optional[int]` from `typing`), no `tomllib`. Stdlib only for `salary_lookup.py`.

**Canonical CLI signature (VERIFIED against `docs/development/project-structure.md:116`):** lookup is **by company**, e.g. `python3 salary_lookup.py "Company" --city "City" --json`. The current instruction text in `apply.md` and `04-job-evaluation.md` wrongly passes `"<role>" "<location>"` — Task 4 corrects both.

**Note on TDD adaptation:** Python scripts are testable, but per existing CareerForge pattern, verification is grep-based requirement/consistency checks plus manual smoke-test notes.

---

### Task 1: Implement `salary_lookup.py` (T-060)

**File:** Create `salary_lookup.py` at repo root (NOT in `tools/`).

**Schema reminder (`salary_data.json`):**
```json
{
  "metadata": { "source": "string", "index_baseline": 100, "index_label": "string", "baseline_description": "string" },
  "companies": [{ "company": "string", "city": "string (optional)", "categories": { "<name>": { "count": "number|null", "index": "number|null" } } }]
}
```

- [ ] **Step 1 — CLI entrypoint:** `argparse` with positional `company` (optional when `--list`), `--city`, `--json`, `--list`, `--threshold` (default 60). Shebang `#!/usr/bin/env python3`. **Python 3.9-compatible** (use `typing.Optional`, no `match`). Stdlib only. (REQ-4004)
- [ ] **Step 2 — Load data:** read `salary_data.json` from the directory containing the script; if absent print `"Salary data not available (salary_data.json not found)"` and exit 0 — never abort the caller. (REQ-4001, REQ-4006)
- [ ] **Step 3 — Fuzzy matching engine (REQ-4003):**
  - `normalize(name)`: lowercase; strip legal suffixes (`a/s`, `aps`, `inc`, `ltd`, `llc`, `gmbh`, `as`, `limited`, `corp`, `corporation`, `co`); strip noise words (`holding`, `group`, `international`, `global`, `regional`); strip parenthetical sub-entities `(...)` and post-comma descriptions; normalize Nordic/special chars (`æ→ae`, `ø→oe`, `å→aa`, `ü→ue`, `ö→oe`, `ä→ae`); strip punctuation; collapse whitespace.
  - `score(query, candidate)`: compute token overlap ratio — `len(query_tokens ∩ candidate_tokens) / max(len(query_tokens), len(candidate_tokens))` × 100; return as integer 0–100.
  - `find_matches(query, companies, city, threshold)`: normalize query; score each company; if `--city` provided additionally filter to same city (case-insensitive); return list sorted by score desc, filtered to `score >= threshold`.
- [ ] **Step 4 — Human-readable output (REQ-4004):**
  - `--list` mode: print all companies as `Company | City` table, sorted A-Z.
  - Match mode: for each match print a block: match score header, then a table with columns `Category | Count | Index | vs Baseline`; compute `vs Baseline` as `index - metadata.index_baseline` with `+`/`-` sign; if `count` is `null` or `count < 5` append `(privacy — too few employees)` to that row; print source + baseline description footer.
  - No matches: print `"No salary data found for '<query>' (threshold: N)"`.
- [ ] **Step 5 — JSON output mode (REQ-4004):** when `--json`, print `json.dumps({matches: [...]}, indent=2)` instead of tables; each match: `{company, city, score, categories: {<name>: {count, index, vs_baseline}}}`.
- [ ] **Step 6 — Verify REQ-4001 graceful skip:** `grep -n 'exit\|salary_data.json' salary_lookup.py` → both present.
- [ ] **Step 7 — Verify REQ-4003 normalizer handles legal suffixes + Nordic chars:** `grep -n 'a/s\|aps\|æ\|ø\|å' salary_lookup.py` → present.
- [ ] **Step 8 — Commit** `feat(salary): implement salary_lookup.py with fuzzy matching (Epic 7, T-060)`.

---

### Task 2: Implement `tools/convert_salary_excel.py` (T-061)

**File:** Replace stub at `tools/convert_salary_excel.py`.

- [ ] **Step 1 — CLI entrypoint:** `argparse` with positional `excel_file`, `--source` (default: filename stem), `--baseline` (int, default 100), `--baseline-label` (default "index"), `--baseline-desc` (default "Median = 100"), `--output` (default `salary_data.json` at repo root). **Python 3.9-compatible.** Wrap `import openpyxl` in `try/except ImportError` → print `"Requires openpyxl: pip install openpyxl"` and exit 1. (NOTE: openpyxl is **not installed** here; manual smoke-test of this script requires `pip install openpyxl` first — grep verification in Step 6 does not.) (REQ-4002)
- [ ] **Step 2 — Header row detection (REQ-4002):** scan first 10 rows; find the row where ≥2 cells are non-empty strings; use that as header row.
- [ ] **Step 3 — Column detection (REQ-4002):**
  - Company column: match headers containing `company`, `virksomhed`, `firma`, `employer`, `organization` (case-insensitive); if none found, use column 0.
  - City column: match `city`, `location`, `by`, `sted`; optional.
  - Category columns: for each remaining header, detect if it looks like a count (`count`, `antal`, `n`) or index (`index`, `indeks`, `score`) column; pair adjacent `count`+`index` columns into categories; fallback: treat any numeric column as a standalone index category named after its header.
- [ ] **Step 4 — Row extraction:** iterate data rows; skip empty company cells; build `{company, city?, categories: {<name>: {count, index}}}` per row; coerce numeric cells to `int/float`, leave `null` for blank. (REQ-4002)
- [ ] **Step 5 — Output:** write `salary_data.json` with `metadata` + `companies` per schema; print `"Wrote N companies to salary_data.json"`. (REQ-4001)
- [ ] **Step 6 — Verify no hardcoded column names reach the output schema:** `grep -n 'virksomhed\|antal\|indeks' tools/convert_salary_excel.py` → only in detection patterns, never in output keys.
- [ ] **Step 7 — Commit** `feat(salary): implement convert_salary_excel.py Excel importer (Epic 7, T-061)`.

---

### Task 3: Update `tools/README_SALARY_TOOL.md` (T-062)

**File:** Overwrite stub at `tools/README_SALARY_TOOL.md`.

- [ ] **Step 1 — Document actual usage:** replace "(once implemented)" hedges with real CLI examples matching the implemented flags: `salary_lookup.py`, `--city`, `--json`, `--list`, `--threshold`; `convert_salary_excel.py` with `--source`, `--baseline`, `--baseline-desc`, `--output`.
- [ ] **Step 2 — Add `salary_data.json` schema snippet** (from data-req §12) so users know what format to create manually.
- [ ] **Step 3 — Add privacy note:** explain gitignore, why never to commit `salary_data.json`.
- [ ] **Step 4 — Verify no "(once implemented)" hedges remain:** `grep -n 'once implemented\|Stub' tools/README_SALARY_TOOL.md` → none.
- [ ] **Step 5 — Commit** `docs(salary): update README_SALARY_TOOL.md with real usage (Epic 7, T-062)`.

---

### Task 4: Wire integration — fix signature + remove Epic 7 stubs in BOTH instruction files (T-063)

**Files (VERIFIED both carry the wrong signature + stale "Epic 7" wording):**
- Modify: `.claude/commands/apply.md` (line ~95)
- Modify: `.claude/skills/job-application-assistant/04-job-evaluation.md` (line ~91)

> **Why two files:** `04-job-evaluation.md` is the framework `/apply` reads to run the evaluation; it independently documents the salary invocation. Fixing only `apply.md` would leave a contradicting, wrong-signature instruction in the skill. `docs/development/project-structure.md:116` already shows the correct `salary_lookup.py "Company" --json` form — these two files must match it.

- [ ] **Step 1 — Fix `apply.md`:** change `python3 salary_lookup.py "<role>" "<location>"` → `python3 salary_lookup.py "<company>" --city "<city>"` (drop `--city` clause if no city is known). Remove the `(Epic 7)` parenthetical from the "If the tool or data is unavailable (Epic 7)" sentence — the tool now exists; keep the graceful-skip instruction itself.
- [ ] **Step 2 — Fix `04-job-evaluation.md`:** change `python3 salary_lookup.py "<Role Title>" "<Location>"` → `python3 salary_lookup.py "<company>" --city "<city>"`. Replace "This tool is wired in Epic 7;" with a plain present-tense sentence (e.g. "If salary data is unavailable, note ... and proceed.").
- [ ] **Step 3 — Verify (covers BOTH files):**
  - `grep -rn 'Epic 7' .claude/commands/apply.md .claude/skills/job-application-assistant/04-job-evaluation.md` → none.
  - `grep -rn '"<role>"\|"<Role Title>"\|"<Location>"\|"<location>"' .claude/commands/apply.md .claude/skills/job-application-assistant/04-job-evaluation.md` → none.
  - `grep -rn 'salary_lookup.py "<company>"' .claude/commands/apply.md .claude/skills/job-application-assistant/04-job-evaluation.md` → present in both.
- [ ] **Step 4 — Commit** `fix(apply): correct salary_lookup signature to company-based, drop Epic 7 stub notes (T-063)`.

---

## Self-Review

- **Spec coverage:** REQ-4001→T1 graceful-skip · 4002→T2 Excel import · 4003→T1 fuzzy-match · 4004→T1 output · 4005→T4 apply+framework integration · 4006→already in `.gitignore:22`, documented in T3. REQ-2011→T4. All covered.
- **Signature consistency (VERIFIED):** canonical form `salary_lookup.py "<company>" [--city] [--json]` is fixed in `apply.md` + `04-job-evaluation.md` (T4) and already correct in `project-structure.md:116`. No file left passing role/location.
- **Runtime (VERIFIED):** Python 3.9.6 default → both scripts target 3.9; openpyxl absent → converter degrades gracefully.
- **No placeholders:** each task names exact files, CLI flags, and a concrete grep verification.
- **Sizing from WBS:** T-060=L, T-061=L, T-062=S, T-063=S. ~6–8 hours total.

## Out of scope

Salary data source acquisition (user provides their own per REQ-4001). No test-plan document needed (TC-APP-002 already catalogued; grep verifications are the analogue).
