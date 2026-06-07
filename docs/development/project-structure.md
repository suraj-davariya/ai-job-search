# Development — Project Structure Guide

> **Purpose:** Explains where commands, skills, templates, state files, and documentation are located in the repository.
>
> **Status:** Current
> **Last updated:** 2026-06-07

---

## Directory Tree

```
careerforge/
│
├── .claude/                           # Claude Code configuration
│   ├── commands/                      # Entry-point commands (Markdown prompts)
│   │   ├── setup.md                   # /setup — candidate profile onboarding
│   │   ├── apply.md                   # /apply — job application pipeline
│   │   ├── expand.md                  # /expand — profile enrichment
│   │   └── reset.md                   # /reset — state cleanup
│   │
│   ├── skills/                        # Skill planes (ARCH-0008)
│   │   ├── job-application-assistant/ # Plane 1: AI knowledge files
│   │   │   ├── SKILL.md               # Orchestrator + activation rules
│   │   │   ├── 01-candidate-profile.md    # [gitignored — personal]
│   │   │   ├── 02-behavioral-profile.md   # [gitignored — personal]
│   │   │   ├── 03-writing-style.md        # [gitignored — personal]
│   │   │   ├── 04-job-evaluation.md       # [gitignored — personal]
│   │   │   ├── 05-cv-templates.md         # [gitignored — personal]
│   │   │   ├── 06-cover-letter-templates.md # [gitignored — personal]
│   │   │   └── 07-interview-prep.md       # [gitignored — personal]
│   │   └── job-scraper/               # Plane 1: search configuration
│   │       ├── SKILL.md
│   │       └── search-queries.md      # [gitignored — personal]
│   │
│   ├── agents/                        # Named sub-agent definitions (ARCH-0009)
│   │   └── research-agent.md          # Reviewer / research agent
│   │
│   └── settings.local.json            # Workspace tool-permission template
│
├── cv/                                # CV templates and generated output
│   ├── cfcv.cls                       # Custom LaTeX CV class (lualatex)
│   ├── main_example.tex               # Generic CV template with placeholder tokens
│   └── output/                        # [gitignored] Generated CV drafts (.tex, .pdf)
│
├── cover_letters/                     # Cover letter templates and output
│   ├── cfcl.cls                       # Custom LaTeX cover letter class (xelatex)
│   ├── main_example.tex               # Generic cover letter template
│   ├── README.md                      # Compilation and usage guide
│   └── OpenFonts/
│       └── fonts/
│           ├── Lato/                  # Bundled Lato TTF (OFL licence)
│           ├── Raleway/               # Bundled Raleway TTF (OFL licence)
│           └── FontAwesome6Free/      # Bundled FA6 Free TTF (FA Free licence)
│
├── documents/                         # [gitignored] Personal source documents
│   ├── README.md                      # Usage guide (tracked)
│   ├── cv/                            # Uploaded CVs / résumés
│   ├── linkedin/                      # LinkedIn data export
│   ├── diplomas/                      # Degree certificates
│   ├── references/                    # Reference letters
│   └── applications/                  # Past application records
│
├── tools/                             # Utility scripts
│   ├── README_SALARY_TOOL.md          # Salary tool usage guide
│   └── convert_salary_excel.py        # Excel → salary_data.json converter
│
├── upskill/                           # [gitignored] Generated skill-gap reports
│
├── salary_lookup.py                   # Salary benchmarking CLI (repo root)
├── salary_data.json                   # [gitignored] User-provided salary data
├── job_search_tracker.csv             # [gitignored] Application tracker
│
└── job_scraper/
    └── seen_jobs.json                 # [gitignored] Search deduplication registry
```

---

## Code-Path Walkthrough

### Commands (`.claude/commands/*.md`)

Each file is a Markdown prompt that Claude Code executes when the user runs the matching slash command.

- **setup.md** → reads `documents/`, asks interview questions, builds the 7 profile files in `.claude/skills/job-application-assistant/`
- **apply.md** → reads profile files, scrapes a job URL, drafts CV + cover letter, compiles PDFs, runs reviewer loop
- **expand.md** → enriches profile with new skills, courses, or certifications
- **reset.md** → clears profile sections or resets state files

### Skills (`.claude/skills/`)

Two types (ARCH-0008 — Two-Plane Architecture):

| Plane | Location | Type |
|-------|----------|------|
| Plane 1 | `.claude/skills/<name>/` | Markdown knowledge files. Read by the AI at runtime. |
| Plane 2 | `.agents/skills/<name>/cli/` | TypeScript + Bun CLI sub-agents. Executed as shell commands. |

### CV and Cover Letter Templates (`cv/`, `cover_letters/`)

- `cfcv.cls` + `main_example.tex` — compiled with `lualatex` from the `cv/` directory
- `cfcl.cls` + `main_example.tex` — compiled with `xelatex` from the `cover_letters/` directory
- Generated files land in `cv/output/` and `cover_letters/output/` (gitignored)

### State Files

| File | Purpose | Gitignored |
|------|---------|-----------|
| `job_search_tracker.csv` | 14-column application log | Yes |
| `job_scraper/seen_jobs.json` | URL deduplication for search | Yes |
| `salary_data.json` | Company salary benchmarks (user-provided) | Yes |

### Utility Scripts

- `salary_lookup.py` at repo root — invoked by the AI via `python salary_lookup.py "Company" --json`
- `tools/convert_salary_excel.py` — one-time data import, requires `openpyxl`
