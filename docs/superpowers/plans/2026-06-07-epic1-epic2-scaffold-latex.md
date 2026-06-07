# Epic 1 + 2: Repository Scaffolding & LaTeX Templates — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the repository skeleton and LaTeX CV + cover letter templates so every subsequent epic has a working foundation to build on.

**Architecture:** File-as-DB (ADR-0001), prompt-as-code (ARCH-0001). No compiled binary. LaTeX templates compiled on-demand by the AI via shell commands. Fonts are bundled in the repo — no system-level font installation required for the cover letter.

**Tech Stack:** lualatex (CV — cfcv.cls, fontawesome + lato CTAN packages), xelatex (cover letter — cfcl.cls, fontspec + bundled Lato + FontAwesome 6 Free TTFs).

**Spec:** `docs/superpowers/specs/2026-06-07-epic1-epic2-scaffold-latex-design.md`

**Remote:** GitHub — `https://github.com/suraj-davariya/ai-job-search` (origin). Push after every task group to avoid losing work.

---

## File Map

| File | Action | Task |
|------|--------|------|
| `.claude/commands/{setup,apply,expand,reset}.md` | Create (stubs) | 3 |
| `.claude/skills/job-application-assistant/.gitkeep` | Create | 2 |
| `.claude/skills/job-scraper/.gitkeep` | Create | 2 |
| `.claude/agents/.gitkeep` | Create | 2 |
| `.claude/settings.local.json` | Create | 3 |
| `cv/output/.gitkeep` | Create | 2 |
| `cover_letters/output/.gitkeep` | Create | 2 |
| `cover_letters/OpenFonts/fonts/{Lato,Raleway,FontAwesome6Free}/` | Create dirs | 2 |
| `documents/{cv,linkedin,diplomas,references,applications}/.gitkeep` | Create | 2 |
| `documents/README.md` | Create | 5 |
| `tools/README_SALARY_TOOL.md` | Create | 4 |
| `tools/convert_salary_excel.py` | Create (stub) | 4 |
| `upskill/.gitkeep` | Create | 2 |
| `salary_lookup.py` | Create (stub) | 4 |
| `job_search_tracker.csv` | Create (header only) | 2 |
| `job_scraper/seen_jobs.json` | Create (seed) | 2 |
| `docs/development/project-structure.md` | Rewrite | 6 |
| `cover_letters/OpenFonts/fonts/Lato/*.ttf` | Download | 9 |
| `cover_letters/OpenFonts/fonts/Raleway/*.ttf` | Download | 9 |
| `cover_letters/OpenFonts/fonts/FontAwesome6Free/*.ttf` | Download | 9 |
| `cv/cfcv.cls` | Create | 10 |
| `cv/main_example.tex` | Create | 11 |
| `cover_letters/cfcl.cls` | Create | 12 |
| `cover_letters/main_example.tex` | Create | 13 |
| `cover_letters/README.md` | Create | 14 |

---

## Task 0: Verify Prerequisites

**Files:** None — verification only.

- [ ] **Step 1: Check compilers**

```bash
which lualatex xelatex
lualatex --version | head -1
xelatex --version | head -1
```

Expected: both return paths. If missing, install MacTeX from https://www.tug.org/mactex/

- [ ] **Step 2: Check required LaTeX packages**

```bash
for pkg in fontawesome lato tcolorbox dashrule enumitem multirow; do
  kpsewhich ${pkg}.sty && echo "$pkg: OK" || echo "$pkg: MISSING — needs install"
done
```

- [ ] **Step 3: Install any missing packages**

```bash
# If any showed MISSING above:
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow
```

If `tlmgr` reports "You don't have permission": the user must run the sudo command in their own terminal (`! sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow`).

If on a MacTeX full install, all packages are already present — skip this step.

- [ ] **Step 4: Verify git remote**

```bash
git remote -v
git branch
```

Expected: `origin` points to `https://github.com/suraj-davariya/ai-job-search.git`, current branch is `feature/init`.

---

## Task 1: Core Directory Skeleton

**Files:** All directories described in spec §1.1.

- [ ] **Step 1: Create all directories in one command**

```bash
mkdir -p \
  .claude/commands \
  .claude/skills/job-application-assistant \
  .claude/skills/job-scraper \
  .claude/agents \
  cv/output \
  cover_letters/output \
  cover_letters/OpenFonts/fonts/Lato \
  cover_letters/OpenFonts/fonts/Raleway \
  cover_letters/OpenFonts/fonts/FontAwesome6Free \
  documents/cv \
  documents/linkedin \
  documents/diplomas \
  documents/references \
  documents/applications \
  tools \
  upskill \
  job_scraper
```

- [ ] **Step 2: Add .gitkeep to every empty directory that must be tracked**

```bash
touch \
  .claude/skills/job-application-assistant/.gitkeep \
  .claude/skills/job-scraper/.gitkeep \
  .claude/agents/.gitkeep \
  cv/output/.gitkeep \
  cover_letters/output/.gitkeep \
  documents/cv/.gitkeep \
  documents/linkedin/.gitkeep \
  documents/diplomas/.gitkeep \
  documents/references/.gitkeep \
  documents/applications/.gitkeep \
  upskill/.gitkeep
```

> **Why .gitkeep in gitignored dirs?** The directories must exist on checkout even though their contents are gitignored. The .gitkeep files are themselves gitignored (the rule `documents/cv/` ignores the directory contents including .gitkeep). Add explicit exceptions in .gitignore for the .gitkeep files we need tracked.

- [ ] **Step 3: Update .gitignore to track .gitkeep files inside ignored dirs**

Edit `.gitignore` — replace the documents section:

```gitignore
# Personal source documents (gitignored — contents never leave your machine)
documents/cv/*
!documents/cv/.gitkeep
documents/linkedin/*
!documents/linkedin/.gitkeep
documents/diplomas/*
!documents/diplomas/.gitkeep
documents/references/*
!documents/references/.gitkeep
documents/applications/*
!documents/applications/.gitkeep

# Upskill reports
upskill/*
!upskill/.gitkeep
```

Also update `cv/output/` and `cover_letters/output/`:
```gitignore
cv/output/*
!cv/output/.gitkeep
cover_letters/output/*
!cover_letters/output/.gitkeep
```

- [ ] **Step 4: Verify .gitkeep files are tracked**

```bash
git status --short | head -30
```

Expected: `.gitkeep` files show as untracked (ready to add), `documents/cv/` contents are NOT shown.

---

## Task 2: Seed Files

**Files:** `job_search_tracker.csv`, `job_scraper/seen_jobs.json`

- [ ] **Step 1: Create tracker CSV with exact 14-column header**

```bash
printf 'date,company,sector,role,role_type,channel,status,contact_person,fit_rating,notes,cv_file,cover_letter_file,source,last_updated\n' > job_search_tracker.csv
```

- [ ] **Step 2: Verify column count**

```bash
head -1 job_search_tracker.csv | tr ',' '\n' | wc -l
```

Expected: `14`

- [ ] **Step 3: Create seen_jobs.json seed**

```bash
printf '{"seen": {}}\n' > job_scraper/seen_jobs.json
```

- [ ] **Step 4: Verify both files are gitignored (not staged by git)**

```bash
git check-ignore -v job_search_tracker.csv job_scraper/seen_jobs.json
```

Expected output (both lines shown):
```
.gitignore:30:job_search_tracker.csv   job_search_tracker.csv
.gitignore:31:job_scraper/seen_jobs.json   job_scraper/seen_jobs.json
```

(Line numbers may differ — what matters is both files are listed as ignored.)

---

## Task 3: .claude Settings and Command Stubs

**Files:** `.claude/settings.local.json`, `.claude/commands/{setup,apply,expand,reset}.md`

- [ ] **Step 1: Create settings.local.json**

Create `.claude/settings.local.json` with this exact content:

```json
{
  "permissions": {
    "allow": [
      "Bash(lualatex:*)",
      "Bash(xelatex:*)",
      "Bash(python3:*)",
      "Bash(python:*)",
      "Bash(bun:*)",
      "Bash(git status)",
      "Bash(git log:*)",
      "Bash(git diff:*)"
    ],
    "deny": []
  }
}
```

- [ ] **Step 2: Create command stubs**

Create `.claude/commands/setup.md`:

```markdown
# /setup

> **Status:** Stub — implementation in Epic 4.
> **Spec:** `docs/requirements/functional-requirements-onboarding.md`

Invoking this command will start candidate profile onboarding.
It guides you through building your profile via document scanning,
CV import, or an interactive interview session.
```

Create `.claude/commands/apply.md`:

```markdown
# /apply

> **Status:** Stub — implementation in Epic 5.
> **Spec:** `docs/requirements/functional-requirements-application.md`

Invoking this command starts the job application pipeline for a given
URL or pasted job description. Produces a tailored CV and cover letter.
```

Create `.claude/commands/expand.md`:

```markdown
# /expand

> **Status:** Stub — implementation in Epic 9.
> **Spec:** `docs/requirements/functional-requirements-career-development.md`

Invoking this command enriches your candidate profile with additional
competencies, courses, or certifications.
```

Create `.claude/commands/reset.md`:

```markdown
# /reset

> **Status:** Stub — implementation pending.
> **Spec:** `docs/requirements/functional-requirements-onboarding.md` (REQ-0013)

Invoking this command resets profile sections or application state.
```

- [ ] **Step 3: Verify all four stubs exist**

```bash
ls -1 .claude/commands/
```

Expected:
```
apply.md
expand.md
reset.md
setup.md
```

---

## Task 4: Python Stubs and Tools README

**Files:** `salary_lookup.py`, `tools/convert_salary_excel.py`, `tools/README_SALARY_TOOL.md`

- [ ] **Step 1: Create salary_lookup.py stub**

Create `salary_lookup.py` at repo root:

```python
# salary_lookup.py — CareerForge salary benchmarking tool
# Status: Stub — implementation in Epic 7 (Salary Benchmarking)
# Spec:   docs/requirements/functional-requirements-salary.md
#
# Usage (when implemented):
#   python salary_lookup.py "Company Name" --json
#   python salary_lookup.py "Company Name" --city "Amsterdam"
raise NotImplementedError(
    "salary_lookup.py is not yet implemented. "
    "See docs/requirements/functional-requirements-salary.md"
)
```

- [ ] **Step 2: Create convert_salary_excel.py stub**

Create `tools/convert_salary_excel.py`:

```python
# convert_salary_excel.py — Convert Excel salary data to salary_data.json
# Status: Stub — implementation in Epic 7 (Salary Benchmarking)
# Spec:   docs/requirements/functional-requirements-salary.md
# Requires: openpyxl (pip install openpyxl)
#
# Usage (when implemented):
#   python tools/convert_salary_excel.py salary_data.xlsx
raise NotImplementedError(
    "convert_salary_excel.py is not yet implemented. "
    "See docs/requirements/functional-requirements-salary.md"
)
```

- [ ] **Step 3: Create tools/README_SALARY_TOOL.md**

Create `tools/README_SALARY_TOOL.md`:

```markdown
# Salary Benchmarking Tools

> **Status:** Stub — implementation in Epic 7.

CareerForge includes two salary tools to help you benchmark offers
against market data.

## salary_lookup.py (repo root)

Looks up company salary data from `salary_data.json` with fuzzy matching.

**Usage** (once implemented):
```bash
python salary_lookup.py "Acme Corp"
python salary_lookup.py "Acme Corp" --city "San Francisco" --json
```

## tools/convert_salary_excel.py

Converts an Excel salary spreadsheet into the `salary_data.json` format
expected by `salary_lookup.py`.

**Usage** (once implemented):
```bash
python tools/convert_salary_excel.py my_salary_data.xlsx
```

**Requires:** `pip install openpyxl`

## salary_data.json (gitignored)

Your personal salary benchmarking data. Never committed to git.
See `docs/requirements/functional-requirements-salary.md` for the expected schema.
```

---

## Task 5: documents/README.md

**Files:** `documents/README.md`

- [ ] **Step 1: Create the README**

Create `documents/README.md`:

```markdown
# documents/

This directory holds your personal source documents — CVs, LinkedIn exports,
degree certificates, reference letters, and past application records.

**All subdirectories are gitignored.** Their contents never leave your machine.

---

## Subdirectory Guide

| Folder | What to put here | Accepted formats |
|--------|-----------------|-----------------|
| `cv/` | Your existing CVs or résumés | `.pdf`, `.docx`, `.txt`, `.md` |
| `linkedin/` | LinkedIn data export (`export.zip` or extracted files) | any |
| `diplomas/` | Degree certificates, transcripts | `.pdf`, `.jpg`, `.png` |
| `references/` | Reference letters from employers or academics | `.pdf`, `.docx`, `.txt` |
| `applications/` | Records of past applications (auto-populated by `/apply`) | any |

---

## Usage

Place your documents in the relevant folders above, then run:

```
/setup
```

The AI will scan `documents/cv/` (and optionally other folders) to extract
your profile information — work history, education, skills, and preferences.

---

## Privacy

Everything in this directory stays on your machine. The gitignore rules
exclude all contents from version control. Only this `README.md` is tracked.
```

---

## Task 6: Rewrite project-structure.md

**Files:** `docs/development/project-structure.md`

- [ ] **Step 1: Verify the stale content to be replaced**

```bash
grep -c "settings/" docs/development/project-structure.md
grep -c "package.json" docs/development/project-structure.md
```

Expected: both return a number > 0 (confirming stale content exists).

- [ ] **Step 2: Rewrite with correct Claude Code skill-based layout**

Replace the entire file content with:

```markdown
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
```

- [ ] **Step 3: Verify stale terms are gone**

```bash
grep -n "settings/\|tools/commands\|package.json\|tsconfig" docs/development/project-structure.md | wc -l
```

Expected: `0`

---

## Task 7: Verify Gitignore Rules

**Files:** None — verification only.

- [ ] **Step 1: Create test files in gitignored locations**

```bash
echo "test" > job_search_tracker_test_delete_me.csv
echo "test" > salary_data_test_delete_me.json
mkdir -p upskill && echo "test" > upskill/test_delete_me.md
mkdir -p documents/cv && echo "test" > documents/cv/test_delete_me.pdf
```

- [ ] **Step 2: Verify they are all ignored**

```bash
git status --short | grep "test_delete_me"
```

Expected: no output (all test files are ignored by git).

- [ ] **Step 3: Verify using git check-ignore**

```bash
git check-ignore -v \
  job_search_tracker.csv \
  salary_data.json \
  upskill/test_delete_me.md \
  documents/cv/test_delete_me.pdf \
  job_scraper/seen_jobs.json
```

Expected: each file listed with the matching .gitignore rule.

- [ ] **Step 4: Clean up test files**

```bash
rm job_search_tracker_test_delete_me.csv salary_data_test_delete_me.json
rm upskill/test_delete_me.md documents/cv/test_delete_me.pdf
```

---

## Task 8: Commit and Push Epic 1

**Files:** All files created in Tasks 1–7.

- [ ] **Step 1: Stage all Epic 1 files**

```bash
git add \
  .claude/ \
  cv/output/.gitkeep \
  cover_letters/output/.gitkeep \
  cover_letters/OpenFonts/ \
  documents/ \
  tools/ \
  upskill/.gitkeep \
  salary_lookup.py \
  job_scraper/ \
  .gitignore \
  docs/development/project-structure.md
```

Note: `job_search_tracker.csv` and `job_scraper/seen_jobs.json` are gitignored and will not be staged — that is correct.

- [ ] **Step 2: Verify staged files look correct**

```bash
git diff --cached --stat
```

Expected: ~25 files added, no deletions of important docs, no personal data.

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: Epic 1 — repository skeleton, seed files, and command stubs

Creates the complete directory structure, gitignore rules, seed files, and
command stubs that all subsequent epics depend on.

What's included:
- .claude/commands/ — stub Markdown files for /setup, /apply, /expand, /reset
- .claude/skills/ — empty placeholders for Epic 3 (profile system)
- .claude/agents/ — empty placeholder for Epic 6 (reviewer agent)
- .claude/settings.local.json — tool-permission template for Claude Code
- cv/output/, cover_letters/output/ — gitignored output directories
- cover_letters/OpenFonts/fonts/ — directory tree for bundled fonts (Epic 2)
- documents/ — personal document storage with README (gitignored contents)
- tools/ — salary tool stubs and README
- salary_lookup.py — stub (Epic 7)
- job_scraper/ — directory for seen_jobs.json (state file, gitignored)
- Rewrote docs/development/project-structure.md (removed stale TS-CLI layout)
- Updated .gitignore to track .gitkeep files inside gitignored dirs

AC-3, AC-4, AC-5, AC-6, AC-7 verified.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: Push to GitHub**

```bash
git push origin feature/init
```

Expected: `Branch 'feature/init' set up to track remote branch 'feature/init' from 'origin'.`

---

## Task 9: Download Bundled Fonts

**Files:** `cover_letters/OpenFonts/fonts/Lato/*.ttf`, `Raleway/*.ttf`, `FontAwesome6Free/*.ttf`

- [ ] **Step 1: Download Lato TTF files from GitHub Google Fonts mirror**

```bash
BASE="https://github.com/google/fonts/raw/main/ofl/lato"
TARGET="cover_letters/OpenFonts/fonts/Lato"
curl -sL "$BASE/Lato-Regular.ttf" -o "$TARGET/Lato-Regular.ttf"
curl -sL "$BASE/Lato-Bold.ttf"    -o "$TARGET/Lato-Bold.ttf"
curl -sL "$BASE/Lato-Italic.ttf"  -o "$TARGET/Lato-Italic.ttf"
curl -sL "$BASE/Lato-BoldItalic.ttf" -o "$TARGET/Lato-BoldItalic.ttf"
ls -lh "$TARGET/"
```

Expected: 4 .ttf files, each 100–300KB.

- [ ] **Step 2: Download Raleway TTF files**

```bash
BASE="https://github.com/google/fonts/raw/main/ofl/raleway/static"
TARGET="cover_letters/OpenFonts/fonts/Raleway"
curl -sL "$BASE/Raleway-Regular.ttf" -o "$TARGET/Raleway-Regular.ttf"
curl -sL "$BASE/Raleway-Bold.ttf"    -o "$TARGET/Raleway-Bold.ttf"
ls -lh "$TARGET/"
```

Expected: 2 .ttf files.

- [ ] **Step 3: Download FontAwesome 6 Free TTF files**

```bash
FA_BASE="https://github.com/FortAwesome/Font-Awesome/raw/6.x/webfonts"
TARGET="cover_letters/OpenFonts/fonts/FontAwesome6Free"
curl -sL "$FA_BASE/fa-solid-900.ttf"  -o "$TARGET/fa-solid-900.ttf"
curl -sL "$FA_BASE/fa-brands-400.ttf" -o "$TARGET/fa-brands-400.ttf"
ls -lh "$TARGET/"
```

Expected: 2 .ttf files (fa-solid ~400KB, fa-brands ~200KB).

- [ ] **Step 4: Commit fonts**

```bash
git add cover_letters/OpenFonts/fonts/
git commit -m "$(cat <<'EOF'
chore: bundle Lato, Raleway, and FontAwesome 6 Free fonts

Fonts are bundled so xelatex can compile cover letters offline without
system-level font installation. All licences permit redistribution:
- Lato (OFL 1.1): https://scripts.sil.org/OFL
- Raleway (OFL 1.1): https://scripts.sil.org/OFL
- FontAwesome 6 Free (FA Free License): https://fontawesome.com/license/free

Files added:
- cover_letters/OpenFonts/fonts/Lato/{Regular,Bold,Italic,BoldItalic}.ttf
- cover_letters/OpenFonts/fonts/Raleway/{Regular,Bold}.ttf
- cover_letters/OpenFonts/fonts/FontAwesome6Free/fa-{solid,brands}.ttf

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin feature/init
```

---

## Task 10: Write cv/cfcv.cls

**Files:** `cv/cfcv.cls`

- [ ] **Step 1: TDD — verify compile fails without the class**

```bash
cd cv
printf '\\documentclass{cfcv}\\begin{document}test\\end{document}' > /tmp/cfcv-test.tex
lualatex -interaction=nonstopmode /tmp/cfcv-test.tex 2>&1 | grep "File \`cfcv.cls' not found"
```

Expected: `! LaTeX Error: File 'cfcv.cls' not found.`

- [ ] **Step 2: Create cv/cfcv.cls** (full content below — do NOT abbreviate)

```latex
% cfcv.cls — CareerForge CV Class
% Adapted from a personal CV class for open-source distribution.
% Author: https://github.com/suraj-davariya
% Licence: MIT
% Compiler: lualatex
%
% Changes from original:
%   - Class renamed to cfcv
%   - \cvachievement fixed: 4 args {icon}{title}{date}{description}
%   - \orcidsymbol: safe fallback (academicons not required)

\ProvidesClass{cfcv}
\LoadClass{article}
\RequirePackage[margin=2cm]{geometry}
\usepackage{microtype}
\usepackage{tcolorbox}
\usepackage{hyperref}
\RequirePackage{xcolor}

\definecolor{VividPurple}{HTML}{2E64FE}
\definecolor{SlateGrey}{HTML}{2E2E2E}
\definecolor{LightGrey}{HTML}{555555}
\definecolor{AzureRadiance}{HTML}{00ABFF}
\definecolor{DodgerBlue}{HTML}{4F83FF}
\definecolor{ElectricViolet}{HTML}{9F00FF}
\definecolor{Black}{HTML}{000000}
\colorlet{accent}{DodgerBlue}
\colorlet{body}{Black!80}

\RequirePackage{fontawesome}
\newcommand{\emailsymbol}{\faAt}
\newcommand{\phonesymbol}{\faPhone}
\newcommand{\homepagesymbol}{\faChain}
\newcommand{\locationsymbol}{\faMapMarker}
\newcommand{\linkedinsymbol}{\faLinkedin}
\newcommand{\twittersymbol}{\faTwitter}
\newcommand{\githubsymbol}{\faGithub}
\newcommand{\orcidsymbol}{\textsc{orcid}} % safe fallback; use \RequirePackage{academicons} + \aiOrcid if needed
\newcommand{\mailsymbol}{\faEnvelope}
\newcommand{\devsymbol}{\faCode}
\newcommand{\linksymbol}{\faLink}
\newcommand{\certificatesymbol}{\faCertificate}

\newcommand{\printinfo}[2]{\mbox{\textcolor{accent}{#1}\hspace{0.5em}#2\hspace{2em}}}
\newcommand{\email}[1]{\printinfo{\emailsymbol}{#1}}
\newcommand{\mailaddress}[1]{\printinfo{\emailsymbol}{\href{mailto:#1}{#1}}}
\newcommand{\phone}[1]{\printinfo{\phonesymbol}{\href{tel:#1}{#1}}}
\newcommand{\homepage}[2]{\printinfo{\homepagesymbol}{\href{#2}{#1}}}
\newcommand{\twitter}[1]{\printinfo{\twittersymbol}{#1}}
\newcommand{\linkedin}[2]{\printinfo{\linkedinsymbol}{\href{#2}{#1}}}
\newcommand{\github}[2]{\printinfo{\githubsymbol}{\href{#2}{#1}}}
\newcommand{\orcid}[1]{\printinfo{\orcidsymbol}{#1}}
\newcommand{\location}[1]{\printinfo{\locationsymbol}{#1}}

\newcommand{\name}[1]{\def\@name{#1}}
\newcommand{\tagline}[1]{\def\@tagline{#1}}
\newcommand{\personalinfo}[1]{\def\@personalinfo{#1}}

\setlength{\smallskipamount}{3pt}
\setlength{\medskipamount}{4pt}
\setlength{\bigskipamount}{5pt}

\newcommand{\button}[1]{\tcbox[colback=white, colframe=accent, coltext=black,
                                  boxrule=0.5mm, arc=1mm,
                                  boxsep=4pt, left=5pt, right=5pt,
                                  top=2pt, bottom=2pt]{#1}}

\newcommand{\makecvheader}{%
  \begingroup \center
    {\Large\bfseries\color{black}\textls[250]{\@name}\par}
    \smallskip
    {\normalsize\bfseries\color{accent}\textls[340]{\MakeUppercase{\@tagline}}\par}
    \smallskip
    {\center\footnotesize\bfseries\@personalinfo\par}
  \endgroup\smallskip}

\RequirePackage{dashrule}
\setlength{\parindent}{0pt}
\newcommand{\divider}{\medskip\textcolor{accent}{\hdashrule{\linewidth}{0.8pt}{0.5ex}}\bigskip}
\newcommand{\dividergray}{\textcolor{body!50}{\hdashrule{\linewidth}{0.4pt}{0.5ex}}\smallskip}

\newcommand{\cvsection}[1]{%
  \bigskip%
  \renewcommand{\baselinestretch}{1.2}\selectfont
  {\color{accent}\small\bfseries\textls[250]{\MakeUppercase{#1}}}\\[-1ex]%
  {\color{accent}\rule{\linewidth}{1.2pt}\par}\medskip
  \renewcommand{\baselinestretch}{1.1}\selectfont}

\newcommand{\itemmarker}{\color{accent}\small\textbullet}
\newcommand{\dashedbullets}{\color{accent}\small\textendash}

\RequirePackage{enumitem}
\setlist{leftmargin=*,labelsep=0.8em,nosep,itemsep=0.15\baselineskip,%
         after=\vskip0.15\baselineskip,before=\vskip0.15\baselineskip}
\setlist[itemize]{label=\itemmarker}

\newcommand{\company}[4]{%
    \smallskip
    {\large\color{body}\textls[140]{\textbf{#1}}} \hfill
    {\large\color{body}\textls[100]{\textbf{#2}}} \par
    {\color{accent}\faMapMarker} \hspace{0.5em}{\small\color{body}{#3}} \hfill
    {\color{accent}\faCalendar}  \hspace{0.5em}{\small\color{body}{#4}} \par
    \medskip}

\RequirePackage{tikz}
\newcommand{\cvtag}[1]{%
  \tikz[baseline]\node[anchor=base,draw=accent,rounded corners,inner xsep=1ex,%
    inner ysep=0.75ex,text height=1.2ex,text depth=.2ex,fill=accent]%
    {\bfseries\scriptsize\textcolor{white}{#1}};}

\NewDocumentCommand{\splitoncomma}{ >{\SplitList{,}} m }{%
  \ProcessList{#1}{\cfcvtag}}
\NewDocumentCommand{\cfcvtag}{m}{\cvtag{#1} }

\newcommand{\project}[4]{%
    \bigskip
    \textbf{Project:} #1 \hfill \textbf{Client:} #2\par\smallskip
    \textbf{Role(s):} #3 \hfill \textbf{Technologies:} {#4}\par\smallskip
    \textbf{Responsibilities:}\par\smallskip}

\newcommand{\education}[4]{%
    \smallskip
    {\color{body}\textbf{\textls[140]{{#1}}}} \\
    {\small\textls[140]{{{#2}}}} \par
    \medskip
    {{\color{accent}\locationsymbol} \hspace{0.5em} \textls[140]{#3}} \par
    {\color{accent}\faCalendar} \hspace{0.5em}{{#4}} \par}

\newcommand{\skillset}[2]{%
    \smallskip
    \color{body}{\textbf{\textls[100]{#1}}:} \color{body}{#2} \par \smallskip}

\RequirePackage{multirow,tabularx}

% Fixed from original: 4 args {icon}{title}{date}{description}
\newcommand{\cvachievement}[4]{%
  \begin{tabularx}{\linewidth}{@{}p{2em} @{\hspace{1ex}} >{\raggedright\arraybackslash}X@{}}
  \multirow{2}{*}{\Large\color{accent}#1} & \textbf{#2} \hfill {\small\color{LightGrey}#3}\\
  & #4
  \end{tabularx}%
  \smallskip}

\newcommand{\skills}[1]{%
    \smallskip
    {\small\color{body}\textls[140]{{\MakeUppercase{#1}}}} \\
    \smallskip}

\AtBeginDocument{%
  \pagestyle{empty}
  \color{body}
  \raggedright}
```

> **Note:** The `\func` command in the original was renamed to `\cfcvtag` to avoid potential name collisions with other packages.

- [ ] **Step 3: Run minimal compile test from cv/ directory**

```bash
cd cv
printf '\\documentclass{cfcv}\\begin{document}\\name{Test}\\tagline{Test}\\personalinfo{}\\makecvheader\\cvsection{Test}Hello\\end{document}' > /tmp/cfcv-minimal.tex
cp cfcv.cls /tmp/
cd /tmp && lualatex -interaction=nonstopmode cfcv-minimal.tex 2>&1 | tail -5
```

Expected: `Output written on cfcv-minimal.pdf (1 page, ...bytes).`

---

## Task 11: Write cv/main_example.tex and Compile

**Files:** `cv/main_example.tex`

- [ ] **Step 1: Create cv/main_example.tex** (full content — do NOT abbreviate)

```latex
% =============================================================================
% CareerForge CV Template
% Class:   cfcv.cls  (CareerForge custom CV class)
% Compile: lualatex main_example.tex    (run from cv/ directory)
% Output:  main_example.pdf             (target: 1 page)
%
% Generated copies: cv/main_<Company>.tex  (gitignored — never committed)
% Tokens:  Fields marked  % {{TOKEN_NAME}}  are replaced by the AI skill.
%          See .claude/skills/job-application-assistant/05-cv-templates.md
% =============================================================================

\documentclass[10pt, a4paper]{cfcv}
\geometry{left=1.2cm,right=1.2cm,marginparwidth=6.8cm,marginparsep=1.2cm,top=1.2cm,bottom=1.2cm}
\usepackage[default]{lato}
\usepackage{multicol}
\usepackage{hyperref}

\begin{document}

% ── Header ────────────────────────────────────────────────────────────────────
\name{Jane Smith}                                        % {{CANDIDATE_NAME}}
\tagline{ML Engineer $\bullet$ Python Developer}         % {{TAGLINE}}
\personalinfo{%
  \mailaddress{jane.smith@email.com}                     % {{EMAIL}}
  \github{janesmith}{https://github.com/janesmith}      % {{GITHUB_USER}} {{GITHUB_URL}}
  \phone{+1 (415) 555-0198}                             % {{PHONE}}
  \location{San Francisco, CA}                          % {{LOCATION}}
  \linkedin{janesmith}{https://www.linkedin.com/in/janesmith/}  % {{LINKEDIN_USER}} {{LINKEDIN_URL}}
}
\makecvheader
\medskip

% ── Summary ───────────────────────────────────────────────────────────────────
\cvsection{Summary}
Software engineer with five years of experience building production ML systems
in Python. Proven track record of delivering data-driven products that move
business metrics. Passionate about clean architecture and team collaboration.
% {{PROFESSIONAL_SUMMARY}}

\medskip

% ── Experience ────────────────────────────────────────────────────────────────
\cvsection{Professional Experience}

\company{TechStart Inc.}{ML Engineer}{San Francisco, CA}{Jan 2022 – Present}  % {{COMPANY_1_*}}
\project{Recommendation Engine}{TechStart Inc.}{Software Engineer}{Python, PyTorch, Redis, PostgreSQL}
\smallskip
Brief company description — what the company does and your role within the team.
% {{COMPANY_1_DESCRIPTION}}
\smallskip
\begin{itemize}
  \item Delivered real-time recommendation engine that increased CTR by 23\% in 3 months.  % {{ACHIEVEMENT_1}}
  \item Collaborated with infrastructure team to meet <100ms p99 latency under 2M events/day.  % {{ACHIEVEMENT_2}}
\end{itemize}

\smallskip\divider\smallskip

\company{PrevCorp}{Junior Developer}{New York, NY}{Jun 2019 – Dec 2021}  % {{COMPANY_2_*}}
\smallskip
Brief description of second role.
% {{COMPANY_2_DESCRIPTION}}
\smallskip
\begin{itemize}
  \item Built internal analytics dashboard reducing report generation time by 60\%.  % {{ACHIEVEMENT_3}}
  \item Maintained and extended REST APIs serving 500K daily active users.  % {{ACHIEVEMENT_4}}
\end{itemize}

\medskip

% ── Skills ────────────────────────────────────────────────────────────────────
\cvsection{Skills}
\medskip
\skillset{Programming}{Python, JavaScript, Bash, SQL}               % {{SKILL_PROGRAMMING}}
\skillset{Machine Learning}{PyTorch, TensorFlow, scikit-learn, MLflow}  % {{SKILL_ML}}
\skillset{Infrastructure}{Docker, Kubernetes, AWS, PostgreSQL, Redis}   % {{SKILL_INFRA}}
\medskip

% ── Certificates ──────────────────────────────────────────────────────────────
\cvsection{Certificates}
\medskip
\cvachievement{\certificatesymbol}
  {AWS Certified Machine Learning – Specialty}          % {{CERT_1_NAME}}
  {March 2024}                                          % {{CERT_1_DATE}}
  {Professional certification for designing and deploying ML solutions on AWS.}  % {{CERT_1_DESC}}
\par
\button{\href{https://example.com/cert}{{\color{accent}\linksymbol}\hspace{0.5em}Certificate}}  % {{CERT_1_URL}}

\medskip

% ── Education + Languages (two-column) ────────────────────────────────────────
\begin{multicols}{2}
  \cvsection{Education}
  \medskip
  \education
    {M.Sc. Computer Science}     % {{DEGREE}}
    {Stanford University}        % {{UNIVERSITY}}
    {Palo Alto, CA}             % {{UNI_LOCATION}}
    {2017 – 2019}               % {{EDU_DATE_RANGE}}
  \par

  \columnbreak

  \cvsection{Languages}
  \medskip
  \begin{itemize}
    \item English – Native       % {{LANGUAGE_1}}
    \item Spanish – B2           % {{LANGUAGE_2}}
  \end{itemize}
\end{multicols}

\end{document}
```

- [ ] **Step 2: Compile from cv/ directory**

```bash
cd cv
lualatex -interaction=nonstopmode main_example.tex 2>&1 | grep -E "^Output|^!|Error" | head -10
```

Expected: `Output written on main_example.pdf (1 page, ...bytes).`

If there are font/package errors, resolve by installing missing packages (see Task 0 Step 3).

- [ ] **Step 3: Verify it is exactly 1 page**

```bash
cd cv
pdfinfo main_example.pdf | grep Pages
```

Expected: `Pages: 1`

If it overflows to 2 pages, shorten the Summary or one of the Experience entries until it fits.

- [ ] **Step 4: Commit**

```bash
cd ..   # back to repo root
git add cv/cfcv.cls cv/main_example.tex
git commit -m "$(cat <<'EOF'
feat: Epic 2a — CV template (cfcv.cls + main_example.tex)

cfcv.cls is adapted from the author's personal CV class with three changes:
- Class renamed from cvsuuraj to cfcv
- \cvachievement fixed from 3 args to 4: {icon}{title}{date}{description}
- \func renamed to \cfcvtag to avoid namespace collision
- \orcidsymbol uses a safe text fallback instead of requiring academicons

main_example.tex is a fully anonymised one-page CV template with
{{TOKEN_NAME}} comments marking every field the AI skill must replace.
Compiles clean with lualatex from the cv/ directory.

AC-1 verified: lualatex exits 0, 1-page output.
AC-8 verified: \cvachievement accepts 4 args.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin feature/init
```

---

## Task 12: Write cover_letters/cfcl.cls

**Files:** `cover_letters/cfcl.cls`

- [ ] **Step 1: TDD — verify compile fails without the class**

```bash
cd cover_letters
printf '\\documentclass{cfcl}\\begin{document}test\\end{document}' > /tmp/cfcl-test.tex
xelatex -interaction=nonstopmode /tmp/cfcl-test.tex 2>&1 | grep "File \`cfcl.cls' not found"
```

Expected: `! LaTeX Error: File 'cfcl.cls' not found.`

- [ ] **Step 2: Create cover_letters/cfcl.cls** (full content)

```latex
% cfcl.cls — CareerForge Cover Letter Class
% Visually paired with cfcv.cls: same DodgerBlue accent, Lato font, 1.2cm margins.
% Author: https://github.com/suraj-davariya
% Licence: MIT
% Compiler: xelatex (fontspec — fonts loaded from OpenFonts/fonts/ relative to CWD)
%
% IMPORTANT: Compile with xelatex from the cover_letters/ directory so that
%            fontspec Path= resolution works correctly.
%   cd cover_letters && xelatex main_example.tex

\ProvidesClass{cfcl}[2026/06/07 CareerForge Cover Letter]
\LoadClass[10pt, a4paper]{article}

\RequirePackage[left=1.2cm,right=1.2cm,top=1.2cm,bottom=1.2cm]{geometry}
\RequirePackage{fontspec}
\RequirePackage{xcolor}
\RequirePackage{microtype}
\RequirePackage{hyperref}
\RequirePackage{parskip}
\RequirePackage{tabularx}

% ── Colours (identical to cfcv.cls) ──────────────────────────────────────────
\definecolor{DodgerBlue}{HTML}{4F83FF}
\definecolor{Black}{HTML}{000000}
\definecolor{SlateGrey}{HTML}{2E2E2E}
\definecolor{LightGrey}{HTML}{555555}
\colorlet{accent}{DodgerBlue}
\colorlet{body}{Black!80}

% ── Fonts — Path= is relative to the xelatex working directory ───────────────
% Must compile from cover_letters/ for these paths to resolve.
\setmainfont[
  BoldFont       = {Lato-Bold.ttf},
  ItalicFont     = {Lato-Italic.ttf},
  BoldItalicFont = {Lato-BoldItalic.ttf},
  Path           = {OpenFonts/fonts/Lato/}
]{Lato-Regular.ttf}

\newfontfamily\FAsolid [Path=OpenFonts/fonts/FontAwesome6Free/]{fa-solid-900.ttf}
\newfontfamily\FAbrands[Path=OpenFonts/fonts/FontAwesome6Free/]{fa-brands-400.ttf}

% ── FontAwesome 6 Free icon macros ────────────────────────────────────────────
% Codepoints from FA6 Free glyph map (https://fontawesome.com/icons)
\newcommand{\faEnvelope}    {{\FAsolid \char"F0E0}}  % envelope
\newcommand{\faPhone}       {{\FAsolid \char"F095}}  % phone
\newcommand{\faLocationDot} {{\FAsolid \char"F3C5}}  % location-dot
\newcommand{\faGlobe}       {{\FAsolid \char"F0AC}}  % globe
\newcommand{\faLinkedinIn}  {{\FAbrands\char"F0E1}}  % linkedin-in
\newcommand{\faGithub}      {{\FAbrands\char"F09B}}  % github

% ── Contact item: coloured icon + small text ──────────────────────────────────
\newcommand{\citem}[2]{{\color{accent}#1}~{\small #2}}

% ── Page setup ────────────────────────────────────────────────────────────────
\pagestyle{empty}
\color{body}
\setlength{\parindent}{0pt}
\setlength{\parskip}{7pt}

% ── Header macros ─────────────────────────────────────────────────────────────
% \clname — large bold name in uppercase (matches cfcv \makecvheader rhythm)
\newcommand{\clname}[1]{%
  \begingroup\centering
    {\Large\bfseries\color{black}\MakeUppercase{#1}\par}%
  \endgroup}

% \cltagline — accent-coloured, mixed-case, no letter-spacing
\newcommand{\cltagline}[1]{%
  \begingroup\centering
    {\small\bfseries\color{accent}#1\par}%
  \endgroup}

% \primarycontact — bold row: email · phone · linkedin
\newcommand{\primarycontact}[1]{%
  \begingroup\centering{\footnotesize\bfseries #1\par}\endgroup}

% \secondarycontact — bold row: location · github · portfolio · extra links
\newcommand{\secondarycontact}[1]{%
  \begingroup\centering{\footnotesize\bfseries #1\par}\endgroup}

% \clheadrule — 1.2pt DodgerBlue rule (matches cfcv \cvsection rule)
\newcommand{\clheadrule}{%
  \medskip\textcolor{accent}{\rule{\linewidth}{1.2pt}}\medskip}

% ── Section header ────────────────────────────────────────────────────────────
% \clsection — tight uppercase bold, accent rule below (no letter-spacing)
\newcommand{\clsection}[1]{%
  \medskip
  {\color{accent}\small\bfseries\MakeUppercase{#1}}\\[-1ex]%
  {\color{accent}\rule{\linewidth}{1.2pt}}%
  \medskip}

% ── Letter-specific macros ────────────────────────────────────────────────────
% \recipient{Company}{Street address}{City, State ZIP, Country} — right-aligned
\newcommand{\recipient}[3]{%
  \begin{tabularx}{\linewidth}{@{}X r@{}}
    & {\bfseries #1}\\
    & {\small #2}\\
    & {\small\color{LightGrey}#3}
  \end{tabularx}\smallskip}

% \letterdate{Month DD, YYYY}
\newcommand{\letterdate}[1]{{\small\color{LightGrey}#1}\par}

% \opening{Dear Hiring Manager,}
\newcommand{\opening}[1]{\medskip{#1}\par}

% \closing{Sign-off sentence.}{Candidate Name}
\newcommand{\closing}[2]{\bigskip{#1}\par\vspace{20pt}{\bfseries #2}}

% ── Footer rule ───────────────────────────────────────────────────────────────
% Place \vfill\noindent\textcolor{accent}{\rule{\linewidth}{1.2pt}} at document end.
% This pushes the rule to the page bottom and matches the header rule exactly.
% (Handled in main_example.tex, not here, so the user controls placement.)
```

- [ ] **Step 3: Run minimal compile test from cover_letters/ directory**

```bash
cd cover_letters
cat > /tmp/cfcl-minimal.tex << 'EOF'
\documentclass{cfcl}
\begin{document}
\clname{Test User}
\cltagline{Test Tagline}
\primarycontact{\citem{\faEnvelope}{test@example.com}}
\clheadrule
\opening{Dear Hiring Manager,}
Test body.
\closing{Best,}{Test User}
\vfill\noindent\textcolor{accent}{\rule{\linewidth}{1.2pt}}
\end{document}
EOF
cp cfcl.cls /tmp/
cp -r OpenFonts /tmp/
cd /tmp && xelatex -interaction=nonstopmode cfcl-minimal.tex 2>&1 | grep -E "^Output|^!" | head -5
```

Expected: `Output written on cfcl-minimal.pdf (1 page, ...bytes).`

---

## Task 13: Write cover_letters/main_example.tex and Compile

**Files:** `cover_letters/main_example.tex`

- [ ] **Step 1: Create cover_letters/main_example.tex** (full content)

```latex
% =============================================================================
% CareerForge Cover Letter Template
% Class:   cfcl.cls  (CareerForge Cover Letter class)
% Compile: xelatex main_example.tex    (run from cover_letters/ directory!)
% Output:  main_example.pdf            (target: 1 page)
%
% Generated copies: cover_letters/main_<Company>_<Role>.tex  (gitignored)
% Tokens:  Fields marked  % {{TOKEN_NAME}}  are replaced by the AI skill.
%          See .claude/skills/job-application-assistant/06-cover-letter-templates.md
%
% IMPORTANT: Always compile from cover_letters/ so font paths resolve correctly.
%   cd cover_letters && xelatex main_example.tex
% =============================================================================

\documentclass{cfcl}

\begin{document}

% ── Header ────────────────────────────────────────────────────────────────────
\clname{Jane Smith}                                           % {{CANDIDATE_NAME}}
\smallskip
\cltagline{Machine Learning Engineer · Python Developer}      % {{TAGLINE}}
\smallskip
\primarycontact{%
  \citem{\faEnvelope}{\href{mailto:jane.smith@email.com}{jane.smith@email.com}}\quad  % {{EMAIL}}
  \citem{\faPhone}{+1 (415) 555-0198}\quad                                             % {{PHONE}}
  \citem{\faLinkedinIn}{\href{https://linkedin.com/in/janesmith}{linkedin.com/in/janesmith}}% {{LINKEDIN}}
}
\smallskip
\secondarycontact{%
  \citem{\faLocationDot}{San Francisco, CA}\quad                                        % {{LOCATION}}
  \citem{\faGithub}{\href{https://github.com/janesmith}{github.com/janesmith}}\quad    % {{GITHUB}}
  \citem{\faGlobe}{\href{https://janesmith.dev}{janesmith.dev}}                         % {{PORTFOLIO}}
}
\clheadrule

% ── Recipient + Date ──────────────────────────────────────────────────────────
\recipient{Anthropic, Inc.}{548 Market St, Suite 28220}{San Francisco, CA 94104, USA}  % {{RECIPIENT_*}}
\letterdate{June 7, 2026}                                                               % {{DATE}}

% ── Subject ───────────────────────────────────────────────────────────────────
\clsection{Re: Senior Machine Learning Engineer}              % {{ROLE_TITLE}}

% ── Opening ───────────────────────────────────────────────────────────────────
\opening{Dear Hiring Manager,}                                % {{SALUTATION}}

% Paragraph 1: Who you are + why you are applying.            % {{INTRO_PARA}}
I am writing to express my interest in the Senior Machine Learning Engineer
position at Anthropic. With five years of hands-on experience building
production ML systems in Python and a track record of shipping models that
directly improve user outcomes, I am confident I can contribute meaningfully
from day one.

% Paragraph 2: Concrete evidence of skills matching the job.  % {{BODY_PARA_1}}
At TechStart Inc., I led the end-to-end delivery of a real-time recommendation
engine that increased click-through rates by 23\% within three months of
deployment. The system processes over two million events per day using PyTorch,
with a custom feature store backed by Redis and PostgreSQL.

% Paragraph 3: Company-specific hook showing genuine research. % {{BODY_PARA_2}}
What draws me to Anthropic is your commitment to safety-first AI development.
Your recent work on constitutional AI aligns directly with research I have
been pursuing independently, and I would welcome the chance to bring that
perspective to a team that treats rigour as a first-class concern.

% ── Closing ───────────────────────────────────────────────────────────────────
\closing{%
  I look forward to discussing how my experience can support Anthropic's mission.
  Thank you for your time and consideration.%      % {{CLOSING}}
}{Jane Smith}                                      % {{CANDIDATE_NAME}}

\vfill
\noindent\textcolor{accent}{\rule{\linewidth}{1.2pt}}

\end{document}
```

- [ ] **Step 2: Compile from cover_letters/ directory**

```bash
cd cover_letters
xelatex -interaction=nonstopmode main_example.tex 2>&1 | grep -E "^Output|^!" | head -10
```

Expected: `Output written on main_example.pdf (1 page, ...bytes).`

- [ ] **Step 3: Verify 1 page**

```bash
pdfinfo cover_letters/main_example.pdf | grep Pages
```

Expected: `Pages: 1`

- [ ] **Step 4: Open and visually inspect**

```bash
open cover_letters/main_example.pdf
```

Verify: header with two contact rows, DodgerBlue accent, three body paragraphs, footer rule at bottom.

---

## Task 14: Write cover_letters/README.md

**Files:** `cover_letters/README.md`

- [ ] **Step 1: Create the README**

```markdown
# cover_letters/

Cover letter LaTeX templates, custom class, and bundled fonts for CareerForge.

---

## Files

| File | Purpose |
|------|---------|
| `cfcl.cls` | Custom LaTeX class — defines all macros, colours, and font loading |
| `main_example.tex` | Generic one-page template with `{{TOKEN}}` placeholders |
| `OpenFonts/fonts/Lato/` | Bundled Lato TTF files (body font, OFL licence) |
| `OpenFonts/fonts/Raleway/` | Bundled Raleway TTF files (optional display use, OFL licence) |
| `OpenFonts/fonts/FontAwesome6Free/` | FontAwesome 6 Free TTF files (icons, FA Free licence) |
| `output/` | Generated cover letter files — gitignored, never committed |

---

## Compiling

**Always compile from this directory** (`cover_letters/`) so fontspec can
resolve the `OpenFonts/fonts/` paths:

```bash
cd cover_letters
xelatex main_example.tex
# Output: main_example.pdf (should be exactly 1 page)
```

---

## Generating a Cover Letter for a New Role

The AI skill (`/apply`) reads `main_example.tex`, fills in the `{{TOKEN}}`
placeholders from your candidate profile and the job posting, and saves the
result as `cover_letters/main_<Company>_<Role>.tex`. It then compiles to PDF
from this directory.

Generated files are gitignored — they are personal output and never committed.

---

## Font Sources and Licences

| Font | Source | Licence |
|------|--------|---------|
| Lato | [Google Fonts](https://fonts.google.com/specimen/Lato) | OFL 1.1 |
| Raleway | [Google Fonts](https://fonts.google.com/specimen/Raleway) | OFL 1.1 |
| FontAwesome 6 Free | [fontawesome.com](https://fontawesome.com/icons) | FA Free Licence |

All licences permit bundling and redistribution. Full licence texts:
- OFL: https://scripts.sil.org/OFL
- FA Free: https://fontawesome.com/license/free

---

## Adding a New Icon

1. Find the icon at https://fontawesome.com/icons (filter: Free)
2. Click the icon → copy the Unicode codepoint (e.g., `f1fa`)
3. Determine which font file contains it:
   - Brands icons (GitHub, LinkedIn, Twitter…) → `fa-brands-400.ttf` → use `\FAbrands`
   - All others → `fa-solid-900.ttf` → use `\FAsolid`
4. Add a macro to `cfcl.cls`:

```latex
\newcommand{\faIconName}{{\FAsolid\char"F1FA}}  % icon-name
```

5. Use in your template: `\citem{\faIconName}{your text}`
```

---

## Task 15: Final Verification and Push

**Files:** None new — run all 10 acceptance criteria.

- [ ] **AC-1: lualatex compiles CV**

```bash
cd cv && lualatex -interaction=nonstopmode main_example.tex 2>&1 | grep "^Output"
```

Expected: `Output written on main_example.pdf (1 page,`

- [ ] **AC-2: xelatex compiles cover letter**

```bash
cd cover_letters && xelatex -interaction=nonstopmode main_example.tex 2>&1 | grep "^Output"
```

Expected: `Output written on main_example.pdf (1 page,`

- [ ] **AC-3: tracker CSV has 14-column header**

```bash
head -1 job_search_tracker.csv | tr ',' '\n' | wc -l
```

Expected: `14`

- [ ] **AC-4: seen_jobs.json seed is correct**

```bash
cat job_scraper/seen_jobs.json
```

Expected: `{"seen": {}}`

- [ ] **AC-5 & AC-6: gitignore rules and clean status**

```bash
git check-ignore -v job_search_tracker.csv job_scraper/seen_jobs.json salary_data.json upskill/ documents/cv/
git status --short | grep -v "^?" | head -20
```

Expected: all five paths listed as ignored; no unexpected untracked personal data.

- [ ] **AC-7: project-structure.md is clean**

```bash
grep -c "settings/\|tools/commands/.*\.ts\|package\.json" docs/development/project-structure.md
```

Expected: `0`

- [ ] **AC-8: cfcv.cls has 4-arg cvachievement**

```bash
grep "newcommand{\\\\cvachievement}\[4\]" cv/cfcv.cls
```

Expected: the line is found.

- [ ] **AC-9: cover letter has two bold contact rows with href links**

```bash
grep -c "\\\\href{" cover_letters/main_example.tex
```

Expected: `4` or more (email, LinkedIn, GitHub, portfolio all have href).

- [ ] **AC-10: footer rule uses \linewidth**

```bash
grep "rule{\\\\linewidth}" cover_letters/main_example.tex
```

Expected: the `\rule{\linewidth}{1.2pt}` line is found.

- [ ] **Final commit and push**

```bash
git add cover_letters/cfcl.cls cover_letters/main_example.tex cover_letters/README.md
git commit -m "$(cat <<'EOF'
feat: Epic 2b — cover letter template (cfcl.cls + main_example.tex + README)

cfcl.cls is a new LaTeX class designed to visually pair with cfcv.cls:
- Same DodgerBlue (#4F83FF) accent, same 1.2cm margins
- Lato body font loaded via fontspec from bundled OpenFonts/fonts/Lato/
- FontAwesome 6 Free icons (envelope, phone, linkedin-in, github, location-dot,
  globe) loaded from bundled OpenFonts/fonts/FontAwesome6Free/
- Two bold contact rows: primary (email/phone/linkedin) + secondary (location/github/portfolio)
- \clsection with tight uppercase bold + accent rule (no letter-spacing)
- Footer rule via \vfill + \rule{\linewidth}{1.2pt} — matches header rule width exactly

IMPORTANT: Must compile with xelatex from cover_letters/ directory.

main_example.tex: one-page anonymised example with {{TOKEN}} comments on every
field. Compiles clean. Visual inspection shows header/footer rules aligned.

All 10 acceptance criteria (AC-1 through AC-10) verified.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin feature/init
```

---

## Self-Review Notes

- AC-2 compile (`xelatex`) must run from `cover_letters/` — the compile step and the commit message both say this explicitly.
- The `\splitoncomma`/`\func` rename to `\cfcvtag` avoids a generic name that could conflict with other packages.
- `\orcidsymbol` fallback prevents `\aiOrcid` undefined-command errors if academicons is not installed.
- Font downloads in Task 9 use raw GitHub URLs — these are stable for tagged releases. If a URL 404s, download the font manually from Google Fonts / fontawesome.com and place it in the correct directory.
- The gitignore in Task 1 Step 3 uses directory glob (`documents/cv/*`) with `!.gitkeep` exception — this correctly tracks the empty-directory marker while ignoring all contents.
