# Testing — Test Plan: Onboarding

> **Purpose:** Test cases, assertions, and boundary checks for the profile onboarding commands (`/setup`).
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** QA Lead

---

## 1. Feature Under Test: `/setup`

The `/setup` command handles the parsing, validation, and serialization of user experiences into `settings/profile.json`.

---

## 2. Test Cases

### Path A: Document Folder Scan
- **TC-ONB-001**: Verify that if a directory contains unsupported files (e.g. `.png`, `.zip`), they are skipped without error.
- **TC-ONB-002**: Verify that if files contain conflicting dates for the same employer, the parsing logic flags a warning and prompts the user to input the correct date.
- **TC-ONB-003**: Verify that a successfully scanned folder creates a populated `settings/profile.json` with correct keys (education, work_history, skills).

### Path B: Single CV Import
- **TC-ONB-004**: Verify that importing a single PDF resume parses all headers (experience, tools, education) accurately.
- **TC-ONB-005**: Verify that when gaps are detected by the analyzer, the CLI prompts exactly 3–5 interactive follow-up questions.
- **TC-ONB-006**: Verify that answering the follow-up questions merges the inputs cleanly into the draft profile.

### Path C: Interactive Interview Shell
- **TC-ONB-007**: Verify that running the interactive interview sequences through all 9 sections outputs a valid JSON structure.
- **TC-ONB-008**: Verify that interrupting the shell (e.g. `Ctrl+C` or exit) preserves progress inside `settings/setup_temp.json`.
- **TC-ONB-009**: Verify that restarting `/setup` after an interruption prompts the user to resume from the last completed section.

### Section-Level Re-Runs
- **TC-ONB-010**: Verify that running `/setup --section "skills"` updates only the skills array in `settings/profile.json` while keeping all other sections unchanged.
- **TC-ONB-011**: Verify that providing an invalid section name (e.g., `--section "invalid"`) prints an error and halts execution.

### Additive Merger & Validation
- **TC-ONB-012**: Verify that merging duplicate skill names (e.g., `git` and `Git`) performs a case-insensitive deduplication, keeping the title-cased version.
- **TC-ONB-013**: Verify that missing required fields (e.g. candidate Name) triggers a validation error during the merge step, halting compilation.
