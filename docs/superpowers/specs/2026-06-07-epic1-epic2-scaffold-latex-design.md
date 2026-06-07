# Epic 1 + 2: Repository Scaffolding & LaTeX Templates — Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the physical repository skeleton (Epic 1) and the CV + cover letter LaTeX templates (Epic 2) that every downstream epic depends on.

**Architecture:** File-as-DB (ADR-0001), prompt-as-code (ARCH-0001). No compiled binary, no package.json at repo root. Templates are LaTeX source files compiled on demand by the AI agent via shell commands.

**Tech Stack:** LaTeX (lualatex for CV, xelatex for cover letter), FontAwesome 6 Free (bundled TTF), Lato font (bundled TTF), xelatex + fontspec for cover letter typography.

---

## Scope

This spec covers **two independent but co-required epics**:

| Epic | Deliverable | Compiler |
|------|-------------|----------|
| 1 | Repository skeleton — directories, seed files, gitignore, settings template | N/A |
| 2a | CV template — `cfcv.cls` + `cv/main_example.tex` | `lualatex` |
| 2b | Cover letter template — `cfcl.cls` + `cover_letters/main_example.tex` | `xelatex` |

Side task (Epic 1): Rewrite `docs/development/project-structure.md` to reflect the correct Claude Code skill-based layout (removes stale TypeScript-CLI structure).

---

## Epic 1: Repository Scaffolding

### 1.1 Directory Layout

The authoritative layout is `docs/architecture/data-architecture.md §File System Layout`. This spec captures the portions created in this epic.

```
<repo-root>/
├── .claude/
│   ├── commands/
│   │   ├── setup.md                    # stub — Epic 4
│   │   ├── apply.md                    # stub — Epic 5
│   │   ├── expand.md                   # stub — Epic 9
│   │   └── reset.md                    # stub — future
│   ├── skills/
│   │   ├── job-application-assistant/
│   │   │   └── .gitkeep               # skill files created in Epic 3
│   │   └── job-scraper/
│   │       └── .gitkeep               # skill files created in Epic 8
│   ├── agents/
│   │   └── .gitkeep                   # research-agent.md added in Epic 6
│   └── settings.local.json            # tool-permission template (see §1.4)
├── cv/
│   ├── cfcv.cls                       # Epic 2a
│   ├── main_example.tex               # Epic 2a
│   └── output/                        # gitignored — generated CVs
├── cover_letters/
│   ├── cfcl.cls                       # Epic 2b
│   ├── main_example.tex               # Epic 2b
│   ├── README.md                      # Epic 2b
│   └── OpenFonts/
│       └── fonts/
│           ├── Lato/                  # Epic 2b — bundled TTFs
│           ├── Raleway/               # Epic 2b — bundled TTFs
│           └── FontAwesome6Free/      # Epic 2b — fa-solid-900.ttf, fa-brands-400.ttf
├── documents/
│   ├── README.md                      # usage guide (§1.5)
│   ├── cv/                            # gitignored — user uploads
│   ├── linkedin/                      # gitignored
│   ├── diplomas/                      # gitignored
│   ├── references/                    # gitignored
│   └── applications/                  # gitignored — past application records
├── tools/
│   ├── README_SALARY_TOOL.md          # salary tool usage instructions
│   └── convert_salary_excel.py        # stub (see §1.7) — implemented in Epic 7
├── upskill/                           # gitignored — generated reports
├── salary_lookup.py                   # stub (see §1.7) — implemented in Epic 7
├── job_search_tracker.csv             # gitignored — 14-column header only
└── job_scraper/
    └── seen_jobs.json                 # gitignored — seed: {"seen": {}}
```

### 1.2 Seed Files

**`job_search_tracker.csv`** — header row only (gitignored; never committed):
```
date,company,sector,role,role_type,channel,status,contact_person,fit_rating,notes,cv_file,cover_letter_file,source,last_updated
```

**`job_scraper/seen_jobs.json`** — empty registry (gitignored):
```json
{"seen": {}}
```

**`.claude/commands/setup.md`** — minimal stub:
```markdown
# /setup

> **Status:** Stub — implementation in Epic 4.

This command will guide you through candidate profile onboarding.
```
(Same minimal stub pattern for `apply.md`, `expand.md`, `reset.md`.)

### 1.3 .gitignore

Key exclusions (personal data must never be committed):

```gitignore
# Generated documents
cv/output/
cover_letters/output/

# Personal source documents
documents/cv/
documents/linkedin/
documents/diplomas/
documents/references/
documents/applications/

# Profile content (populated by /setup)
.claude/skills/job-application-assistant/0*.md

# Application state
job_search_tracker.csv
job_scraper/seen_jobs.json
salary_data.json
upskill/

# LaTeX build artefacts
*.aux
*.log
*.out
*.toc
*.fls
*.fdb_latexmk
*.synctex.gz

# macOS
.DS_Store
```

### 1.4 `.claude/settings.local.json`

Tool-permission template for Claude Code workspace. Controls which shell commands the AI may run:

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

### 1.5 `documents/README.md`

Content sections:
1. **Purpose** — Explains that `documents/` holds source materials the AI reads during `/setup` (Path A: document folder scanner).
2. **Subdirectory guide** — One line per subfolder: what to put there, accepted formats (`.pdf`, `.txt`, `.md`, `.docx`).
3. **Privacy note** — All subdirectories except this README are gitignored; contents never leave your machine.
4. **Usage** — Run `/setup` after placing files here; the AI will scan and build your profile.

### 1.7 Python Stub Files

Both `salary_lookup.py` (repo root) and `tools/convert_salary_excel.py` are created as minimal stubs so the directory structure is complete and the gitignore rules are testable. Each stub contains:

```python
# Stub — implementation in Epic 7 (Salary Benchmarking)
# See: docs/requirements/functional-requirements-salary.md
raise NotImplementedError("This tool is not yet implemented.")
```

### 1.8 `project-structure.md` Rewrite

`docs/development/project-structure.md` currently describes a stale TypeScript-CLI architecture (`settings/`, `tools/commands/*.ts`, `package.json`). It must be replaced with the correct Claude Code skill-based layout matching this spec's §1.1 tree, with a code-path walkthrough covering:
- `.claude/commands/*.md` — what each command file does
- `.claude/skills/` — Plane 1 vs Plane 2 distinction
- `cv/` and `cover_letters/` — template files and output directories
- `job_scraper/seen_jobs.json` and `job_search_tracker.csv` — state files
- `salary_lookup.py` and `tools/` — utility scripts

---

## Epic 2a: CV Template (`cfcv.cls` + `cv/main_example.tex`)

### 2a.1 Class File: `cv/cfcv.cls`

Adapted from the author's personal `cvsuuraj.cls`. All visual design is preserved exactly. Changes:

| Change | Detail |
|--------|--------|
| Class name | `\ProvidesClass{cfcv}` (was `cvsuuraj`) |
| Author block | Comment header crediting original author + GitHub URL placeholder |
| `\cvachievement` | Fixed from 3 args to 4: `{icon}{title}{date}{description}` |
| No other changes | All colours, macros, and layout preserved verbatim |

**Colour palette (unchanged):**
```latex
\definecolor{DodgerBlue}{HTML}{4F83FF}   % \colorlet{accent}
\definecolor{SlateGrey}{HTML}{2E2E2E}
\definecolor{LightGrey}{HTML}{555555}
\definecolor{Black}{HTML}{000000}        % \colorlet{body}
```

**Key macros exposed to templates:**
- `\name{...}` · `\tagline{...}` · `\personalinfo{...}` · `\makecvheader`
- `\cvsection{...}` · `\divider` · `\dividergray`
- `\company{name}{position}{location}{date}`
- `\project{name}{client}{role}{technologies}`
- `\education{degree}{institution}{location}{date}`
- `\skillset{category}{items}`
- `\cvachievement{icon}{title}{date}{description}`
- `\cvtag{...}` · `\button{...}`

**Compiler:** `lualatex` (FontAwesome + lato package compatibility).

> **FontAwesome version note:** `cfcv.cls` uses the LaTeX `fontawesome` package (FA4-era icons loaded as a Type1 font). `cfcl.cls` uses FontAwesome 6 Free TTFs via fontspec. The icons are visually similar but not pixel-identical across the two documents. The implementation plan may choose to unify both to FA6 Free (updating `cfcv.cls` to drop `\RequirePackage{fontawesome}` and load `fa-solid-900.ttf` via fontspec) — this is left as an implementation decision since it requires compiler-mode testing.

### 2a.2 Template File: `cv/main_example.tex`

Generic, fully anonymised example. Personal data replaced with clearly marked placeholder tokens.

**Placeholder token format:** `% {{TOKEN_NAME}}` as a LaTeX comment on the same line as the value, so the file compiles as-is with example data and the AI knows what to replace.

```latex
\name{Jane Smith}          % {{CANDIDATE_NAME}}
\tagline{ML Engineer $\bullet$ Python Developer}  % {{TAGLINE}}
```

**Compile instruction block** at top of file (LaTeX comment):
```latex
% =============================================================================
% CareerForge CV Template
% Compile: lualatex main_example.tex
% Generated copies: cv/main_<Company>.tex  (gitignored)
% Token reference: see .claude/skills/job-application-assistant/05-cv-templates.md
% =============================================================================
```

**Content sections** (all with example data + placeholder comments):
1. Header (`\makecvheader`)
2. Professional Summary (`\cvsection{Summary}`)
3. Professional Experience — 2 entries, each with `\company` + `\project` + bullets
4. Skills (`\cvsection{Skills}` using `\skillset`)
5. Certificates (`\cvsection{Certificates}` using `\cvachievement`)
6. Two-column block: Education + Languages

---

## Epic 2b: Cover Letter Template (`cfcl.cls` + `cover_letters/main_example.tex`)

### 2b.1 Class File: `cover_letters/cfcl.cls`

New class, designed from scratch to match `cfcv` visually.

**Base class:** `article`

**Required packages:** `geometry`, `fontspec`, `xcolor`, `microtype`, `hyperref`, `parskip`, `tabularx`, `eso-pic` (for optional background elements).

**Colour palette:** Identical to `cfcv.cls` — same `\definecolor` block, same `\colorlet{accent}` and `\colorlet{body}`.

**Font loading (fontspec):**
```latex
\setmainfont[Path=OpenFonts/fonts/Lato/, ...]{Lato-Regular.ttf}
\newfontfamily\FAsolid [Path=OpenFonts/fonts/FontAwesome6Free/]{fa-solid-900.ttf}
\newfontfamily\FAbrands[Path=OpenFonts/fonts/FontAwesome6Free/]{fa-brands-400.ttf}
```

**FontAwesome 6 Free icon macros:**
```latex
\newcommand{\faEnvelope}   {{\FAsolid \char"F0E0}}  % envelope
\newcommand{\faPhone}      {{\FAsolid \char"F095}}  % phone
\newcommand{\faLocationDot}{{\FAsolid \char"F3C5}}  % location-dot
\newcommand{\faGlobe}      {{\FAsolid \char"F0AC}}  % globe
\newcommand{\faLinkedinIn} {{\FAbrands\char"F0E1}}  % linkedin-in
\newcommand{\faGithub}     {{\FAbrands\char"F09B}}  % github
```

**Contact layout — two bold rows:**

| Row | Fields | Weight |
|-----|--------|--------|
| Primary | email · phone · LinkedIn | `\footnotesize\bfseries` |
| Secondary | location · GitHub · portfolio · any extra links | `\footnotesize\bfseries` |

Macros: `\primarycontact{...}` and `\secondarycontact{...}` — each takes a free-form argument so the AI can include/exclude fields based on the candidate profile. All links wrapped in `\href{URL}{text}` for clickability.

**Contact item helper:**
```latex
\newcommand{\citem}[2]{{\color{accent}#1}~{\small #2}}
```

**Header macros:**
- `\clname{...}` — large bold uppercase name (matches `\makecvheader` rhythm in cfcv)
- `\cltagline{...}` — small bold accent-coloured tagline, **no letter-spacing** (plain mixed-case)
- `\primarycontact{...}` / `\secondarycontact{...}` — centred contact rows
- `\clheadrule` — 1.2pt DodgerBlue `\rule{\linewidth}{1.2pt}` with `\medskip` above and below

**Section header:**
```latex
\newcommand{\clsection}[1]{%
  \medskip
  {\color{accent}\small\bfseries\MakeUppercase{#1}}\\[-1ex]%
  {\color{accent}\rule{\linewidth}{1.2pt}}\medskip}
```
No letter-spacing — `\MakeUppercase` only, tight rendering.

**Letter macros:**
- `\recipient{Company}{Address line}{City, State ZIP, Country}` — right-aligned recipient block
- `\letterdate{...}` — small light-grey date
- `\opening{...}` — salutation paragraph
- `\closing{body text}{Candidate Name}` — sign-off with 20pt gap before name

**Footer rule** (in text flow, not background layer):
```latex
\vfill
\noindent\textcolor{accent}{\rule{\linewidth}{1.2pt}}
```
Placed at end of document body — pushes to page bottom, respects `\linewidth` margins exactly matching the header rule.

**Page geometry:** `left=1.2cm, right=1.2cm, top=1.2cm, bottom=1.2cm` (identical to CV).

**Compiler:** `xelatex` (fontspec for bundled Lato + FontAwesome).

> **Compilation directory:** `xelatex` must be invoked from inside `cover_letters/` (not from repo root) because fontspec resolves `Path=OpenFonts/fonts/...` relative to the working directory. The AI skill must `cd cover_letters/` before running the compiler. Generated output goes to `cover_letters/output/`.

### 2b.2 Template File: `cover_letters/main_example.tex`

One-page letter with full placeholder token coverage.

**Compile instruction block** at top:
```latex
% =============================================================================
% CareerForge Cover Letter Template
% Compile: xelatex main_example.tex
% Generated copies: cover_letters/main_<Company>_<Role>.tex  (gitignored)
% Token reference: see .claude/skills/job-application-assistant/06-cover-letter-templates.md
% =============================================================================
```

**Content structure:**
```
\clname{Jane Smith}                          % {{CANDIDATE_NAME}}
\cltagline{Machine Learning Engineer · ...}  % {{TAGLINE}}
\primarycontact{email · phone · linkedin}    % {{PRIMARY_CONTACT}}
\secondarycontact{location · github · site}  % {{SECONDARY_CONTACT}}
\clheadrule

\recipient{Company Name}{Street, Suite}      % {{RECIPIENT_*}}
           {City, State ZIP, Country}
\letterdate{Month DD, YYYY}                  % {{DATE}}

\clsection{Re: Role Title}                   % {{ROLE_TITLE}}

\opening{Dear Hiring Manager,}               % {{SALUTATION}}

[Intro paragraph — who you are + why applying]  % {{INTRO_PARA}}
[Skills/fit paragraph — concrete evidence]       % {{BODY_PARA_1}}
[Company connection — research-based hook]       % {{BODY_PARA_2}}

\closing{[Sign-off sentence]}{Jane Smith}    % {{CLOSING}} / {{CANDIDATE_NAME}}

\vfill
\noindent\textcolor{accent}{\rule{\linewidth}{1.2pt}}
```

### 2b.3 Bundled Fonts: `cover_letters/OpenFonts/fonts/`

**Lato** (body font):
- `Lato/Lato-Regular.ttf`
- `Lato/Lato-Bold.ttf`
- `Lato/Lato-Italic.ttf`
- `Lato/Lato-BoldItalic.ttf`

**Raleway** (optional display use):
- `Raleway/Raleway-Regular.ttf`
- `Raleway/Raleway-Bold.ttf`

**FontAwesome 6 Free** (icons):
- `FontAwesome6Free/fa-solid-900.ttf`
- `FontAwesome6Free/fa-brands-400.ttf`

Source: Google Fonts (Lato, Raleway — OFL licence); FontAwesome (fa-solid, fa-brands — FA Free licence). All licences permit bundling.

### 2b.4 `cover_letters/README.md`

Sections:
1. **Purpose** — what this directory contains and why
2. **Files** — one-line description per file (`cfcl.cls`, `main_example.tex`, `OpenFonts/`)
3. **Compiling** — `xelatex main_example.tex` → PDF output
4. **Generating a new cover letter** — how the AI skill uses this template; generated files are gitignored
5. **Font sources** — where Lato, Raleway, and FontAwesome came from + licence notes
6. **Adding a new icon** — how to look up a FontAwesome 6 Free codepoint and add a `\faXxx` macro

---

## Consistency Constraints

- DodgerBlue `#4F83FF` is the single accent colour in both `cfcv` and `cfcl`. Never hardcode it twice — both classes define `\colorlet{accent}{DodgerBlue}`.
- All three horizontal rules (header, section, footer in cover letter) use `\rule{\linewidth}{1.2pt}` — same width, same thickness.
- Margins are `1.2cm` all sides in both templates.
- FontAwesome icons in the cover letter header must match the icons used in the CV's `\personalinfo` block (same icon set, same version).
- Generated files (`cv/main_<Company>.tex`, `cover_letters/main_<Company>_<Role>.tex`) are gitignored; only the `main_example.tex` templates are tracked.

---

## Acceptance Criteria

| # | Check |
|---|-------|
| AC-1 | `lualatex cv/main_example.tex` exits 0 and produces a single-page PDF |
| AC-2 | `xelatex cover_letters/main_example.tex` exits 0 and produces a single-page PDF |
| AC-3 | `job_search_tracker.csv` exists with exactly the 14-column header row |
| AC-4 | `job_scraper/seen_jobs.json` exists and contains `{"seen": {}}` |
| AC-5 | `.gitignore` excludes `job_search_tracker.csv`, `seen_jobs.json`, `salary_data.json`, `upskill/`, and all `documents/` subdirs |
| AC-6 | `git status` on a clean checkout shows no untracked personal data |
| AC-7 | `docs/development/project-structure.md` contains no references to `settings/`, `tools/commands/*.ts`, `package.json` |
| AC-8 | `cfcv.cls` defines `\cvachievement` with 4 parameters |
| AC-9 | Cover letter contact section renders two bold rows with clickable `\href` links |
| AC-10 | Footer rule width matches header rule width (both `\linewidth`) |
