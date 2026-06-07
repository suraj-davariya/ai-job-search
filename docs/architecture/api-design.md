# API Design — Command Interfaces

> **Purpose:** Documents the contracts for each CareerForge command — inputs, outputs, pre-conditions, post-conditions, and error behavior.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Software Architect

---

## Command Summary

| Command | Purpose | Input | Key Output |
|---------|---------|-------|------------|
| `/setup` | Profile onboarding | Documents, CV, or interview | 7 profile files + CLAUDE.md |
| `/apply` | Application pipeline | Job posting URL or text | CV + cover letter (LaTeX + PDF) |
| `/search` | Job discovery | Optional focus area | Ranked results table |
| `/expand` | Profile enrichment | None (scans sources) | Updated profile files |
| `/upskill` | Skill gap analysis | Optional posting URL | Gap report with learning plan |
| `/reset` | Profile clearing | Scope (profile/documents/all) | Blanked files |

---

## `/setup`

### Contract
```
Input:   [--section <name>] | <documents> | <cv-text> | interactive
Output:  Profile files populated; summary presented
Pre:     Repository cloned; commands and skills directories exist
Post:    All 7 profile files + CLAUDE.md populated with user data
Errors:  Unsupported file format → skip with warning; empty documents → offer alternative paths
```

### Arguments
| Argument | Required | Description |
|----------|----------|-------------|
| (none) | Default | Full onboarding, path selection |
| `--section <name>` | Optional | Update specific section only (skills, experience, search) |

### Flow
1. Detect document folder state → recommend path
2. Execute chosen path (A: scan, B: import, C: interview)
3. Cross-reference if applicable
4. Present changes for confirmation
5. Write files
6. Present summary + next steps

---

## `/apply`

### Contract
```
Input:   <url> | <pasted-text>
Output:  Fit evaluation; tailored CV + cover letter (.tex + .pdf); verification report
Pre:     Profile files populated (/setup completed)
Post:    CV + cover letter files created; tracker row added; PDFs verified
Errors:  URL unreachable → prompt for paste; compilation failure → fix loop; salary data missing → skip
```

### Arguments
| Argument | Required | Description |
|----------|----------|-------------|
| `<url>` | One required | URL of job posting |
| `<text>` | One required | Pasted job posting content |

### Flow
1. Parse posting (extract company, role, language)
2. Evaluate fit (5 dimensions + optional salary)
3. Present evaluation → user approval gate
4. Draft CV + cover letter
5. Spawn reviewer → apply feedback
6. Compile PDFs → inspect → fix loop
7. Run verification checklist → present output

### Approval Gate
After Step 2, user must explicitly approve. Options:
- "Yes" → proceed to drafting
- "No" → stop (no files created)
- "Yes but..." → proceed with user constraints

---

## `/search`

### Contract
```
Input:   [<focus-area>] [--broad]
Output:  Ranked results table; updated seen_jobs.json
Pre:     Search queries configured (/setup completed)
Post:    New jobs added to seen registry; results presented
Errors:  Portal unreachable → skip with note; no results → report honestly
```

### Arguments
| Argument | Required | Description |
|----------|----------|-------------|
| `<focus-area>` | Optional | Prioritize matching query category |
| `--broad` | Optional | Run all query categories |

### Flow
1. Load state (seen_jobs, tracker, queries)
2. Execute searches across portals
3. Fetch and parse promising results
4. Deduplicate against seen + tracker
5. Quick fit assessment (High/Medium/Low)
6. Update seen_jobs.json
7. Present ranked results table
8. Optional: user picks a number → hand off to `/apply`

---

## `/expand`

### Contract
```
Input:   None (auto-discovers sources)
Output:  Competency map; updated profile files (with confirmation)
Pre:     Profile files exist (at least partially populated)
Post:    Profile files updated with new competencies (additive only)
Errors:  GitHub unreachable → skip source; no new competencies → report "up to date"
```

### Flow
1. Read existing profile files
2. Scan sources: documents/, GitHub, portfolio URLs
3. Web enrichment for discovered items
4. Build deduplicated competency map
5. Remove items already in profile
6. Present for user confirmation
7. Write confirmed additions with source annotations
8. Present summary report

### Confirmation Options
- "all" — add everything
- "review" — walk through each group
- "skip" — cancel
- Specific groups to skip

---

## `/upskill`

### Contract
```
Input:   [<url>]
Output:  Gap heatmap + learning plan + study order; saved report
Pre:     Profile files exist; tracker has entries (aggregate) or URL provided (targeted)
Post:    Report saved to upskill/ directory
Errors:  Empty tracker in aggregate mode → suggest targeted mode; URL unreachable → prompt for paste
```

### Arguments
| Argument | Required | Description |
|----------|----------|-------------|
| (none) | Default | Aggregate mode (all tracked jobs) |
| `<url>` | Optional | Targeted mode (single posting) |

### Flow
1. Load data (tracker or posting + profile)
2. Pass 1: Hard skill diff
3. Pass 2: LLM synthesis
4. Build gap heatmap
5. Generate learning plan with web-searched resources
6. Suggest study order
7. Show delta (aggregate, if previous report exists)
8. Save report

---

## `/reset`

### Contract
```
Input:   [profile | documents | all]
Output:  Confirmation of cleared data; next steps
Pre:     Repository exists
Post:    Target data cleared; framework structure preserved
Errors:  User does not type RESET → cancelled, nothing changed
```

### Arguments
| Argument | Required | Description |
|----------|----------|-------------|
| `profile` | One required | Clear profile skill files only |
| `documents` | One required | Clear documents folder contents |
| `all` | One required | Clear both |
| (none) | Default | System asks user to choose |

### Flow
1. Determine scope (ask if not provided)
2. Show inventory of what will be cleared vs. preserved
3. Require exact `RESET` confirmation
4. Execute clearing
5. Report results + suggest next steps

---

## Tool Interfaces

### `salary_lookup.py`

```
Usage:   python salary_lookup.py "<company>" [--city "<city>"] [--json] [--list-all]
Input:   Company name string; optional city filter
Output:  Formatted salary table or JSON
Pre:     salary_data.json exists in repo root
Errors:  Missing data file → error message with setup instructions; no match → "No results found"
Return:  Exit 0 (success) | Exit 1 (error/no results)
```

### `convert_salary_excel.py`

```
Usage:   python tools/convert_salary_excel.py <excel-file> [--source <name>] [--baseline <n>] [--baseline-desc <text>]
Input:   Excel file path
Output:  salary_data.json written to repo root
Pre:     openpyxl installed; Excel file has Company/Firma column
Errors:  Missing openpyxl → install instructions; no parseable data → error
```
