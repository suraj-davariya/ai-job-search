<div align="center">

# CareerForge

**An AI job-search assistant that finds postings, writes tailored CVs and cover letters, and compiles them to print-ready PDFs — all on your own machine.**

**🌍 Read this in your language** _(alphabetical · 12 available · all beta, English is canonical):_

[العربية (Arabic)](i18n/readme/README.ar.md) · [বাংলা (Bengali)](i18n/readme/README.bn.md) · [简体中文 (Chinese, Simplified)](i18n/readme/README.zh-Hans.md) · [Deutsch (German)](i18n/readme/README.de.md) · [English](README.md) · [Español (Spanish)](i18n/readme/README.es.md) · [Français (French)](i18n/readme/README.fr.md) · [हिन्दी (Hindi)](i18n/readme/README.hi.md) · [Bahasa Indonesia (Indonesian)](i18n/readme/README.id.md) · [日本語 (Japanese)](i18n/readme/README.ja.md) · [Português BR (Portuguese)](i18n/readme/README.pt-BR.md) · [Русский (Russian)](i18n/readme/README.ru.md)

<sub>**Planned** (help translate — [`i18n/CONTRIBUTING.md`](i18n/CONTRIBUTING.md)): Chinese (Traditional), Dutch, Filipino, Hebrew, Italian, Korean, Malay, Marathi, Persian, Polish, Portuguese (Portugal), Romanian, Swahili, Tamil, Telugu, Thai, Turkish, Ukrainian, Urdu, Vietnamese.</sub>

<!-- Try it live — hosted on GitHub Pages, no install needed -->
[![Live Docs](https://img.shields.io/badge/Docs-Live%20site-D97757?logo=githubpages&logoColor=white)](https://suraj-davariya.github.io/ai-job-search/)
[![Live Dashboard Demo](https://img.shields.io/badge/Dashboard-Live%20demo-D97757?logo=nextdotjs&logoColor=white)](https://suraj-davariya.github.io/ai-job-search/dashboard/)

<!-- What it is — AI-native identity -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-D97757?logo=anthropic&logoColor=white)](https://claude.com/claude-code)
[![AI-Native](https://img.shields.io/badge/AI--Native-Agentic%20workflow-8A4FFF)](docs/architecture/architecture-overview.md)
[![Agents](https://img.shields.io/badge/Agents-Reviewer%20%2B%20Research-8A4FFF)](.claude/agents/)
[![Skills](https://img.shields.io/badge/Skills-3-8A4FFF)](.claude/skills/)
[![Commands](https://img.shields.io/badge/Commands-setup%20%C2%B7%20search%20%C2%B7%20apply%20%C2%B7%20upskill%20%C2%B7%20expand%20%C2%B7%20reset-8A4FFF)](.claude/commands/)
[![Prompt-as-code](https://img.shields.io/badge/Architecture-Prompt--as--code-6E56CF)](docs/architecture/)

<!-- How it's built — modern stack, privacy, reach -->
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](dashboard/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](dashboard/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](dashboard/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](dashboard/)
[![LaTeX](https://img.shields.io/badge/PDF-LaTeX-008080?logo=latex&logoColor=white)](cv/)
[![docs-site CI](https://github.com/suraj-davariya/ai-job-search/actions/workflows/docs-site.yml/badge.svg)](https://github.com/suraj-davariya/ai-job-search/actions/workflows/docs-site.yml)
[![Local-first](https://img.shields.io/badge/Privacy-Local--first-2E7D32)](docs/architecture/technology-stack.md)
[![Country-agnostic](https://img.shields.io/badge/Reach-Country--agnostic-1565C0)](docs/requirements/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

> **New here? Start with the guide.** The friendliest way to understand CareerForge is the documentation site — Quick Start, all three commands, the dashboard with live demos, privacy, and FAQ. No programming needed to read it.
>
> - 🌐 **Read it now:** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — hosted, nothing to install.
> - 📊 **Click through the dashboard:** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — the real UI on fictional sample data, read-only.
> - 💻 **Prefer local?** Run `npm run dev` inside [`docs-site/`](docs-site/) (or see [its README](docs-site/README.md) for the one-command static build).

## What is this?

CareerForge is a job-search toolkit you run inside **Claude Code** — an AI assistant that lives in your terminal. You type commands and plain-English prompts; the AI does the work. No programming knowledge required.

Here is what it can do for you today:

| Step | You say | What happens |
|------|---------|-------------|
| **1. Build your profile** | `/setup` | Claude reads your existing CV, LinkedIn export, diplomas, or interviews you — then writes your candidate profile |
| **2. Find new jobs** | `/search` | Claude searches your configured job portals, deduplicates against jobs you've already seen, scores each one for fit, and shows you a ranked table |
| **3. Apply** | `/apply <url or paste>` | Claude scores your fit, tailors your CV, writes a cover letter in the posting's language, has a second AI reviewer critique both, applies the edits, compiles two PDFs, and runs a final verification checklist |

> **Your data never leaves your machine.** Your profile, CVs, cover letters, and application log are all stored locally and are never committed to git.

---

## How it works — the 3-minute version

```
Your documents                  CareerForge                     Output
─────────────    ──────────────────────────────────────    ──────────────
  CV / LinkedIn  →  /setup  →  Candidate profile           Profile files
                                    ↓
  Job portals    →  /search →  Ranked job list              Console table
  (configured)           ↓
                      Pick a job
                           ↓
  Job posting    →  /apply  →  Fit score & verdict
                               Tailored CV  (2 pages)  →  cv/main_<co>.pdf
                               Cover letter (1 page)   →  cover_letters/cover_<co>.pdf
                               Reviewer critique
                               Revision pass
                               Verification checklist
```

**What CareerForge does not do:**
- Submit applications on your behalf (you review and send)
- Invent skills or experience you don't have
- Upload anything to the cloud

---

## What you need

### 1. Claude Code

Claude Code is the AI assistant that runs CareerForge. Install it once:

```bash
npm install -g @anthropic-ai/claude-code
```

Then log in:

```bash
claude
```

Claude Code requires an [Anthropic account](https://claude.ai). The Free and Pro plans both work; Pro is recommended for heavy usage.

> **Not sure what Claude Code is?** Think of it as a smart terminal assistant that can read files, search the web, and run commands — guided by the CareerForge instructions.

### 2. LaTeX (for PDF generation)

CareerForge compiles your CV and cover letter to PDF using LaTeX. Two compilers are needed:

| Compiler | Used for | Why |
|----------|----------|-----|
| `lualatex` | CV | Required by the `fontawesome` and `lato` packages |
| `xelatex` | Cover letter | Required by `fontspec` for bundled fonts |

**macOS** (recommended — installs both compilers):
```bash
brew install --cask mactex
```
Or download from [tug.org/mactex](https://www.tug.org/mactex/).

After installing, add the extra CV packages:
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux (TeX Live):**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows:** Install [MiKTeX](https://miktex.org/download) — it fetches missing packages automatically.

### 3. Python 3.10+ _(optional — for salary benchmarking)_

```bash
python3 --version    # must be 3.10+
pip install openpyxl # only needed if importing salary data from Excel
```

### 4. pandoc & poppler _(optional — for ATS-safe CV exports)_

```bash
pandoc --version     # generates the .docx export (and higher-fidelity .txt)
pdftotext -v         # poppler — runs the ATS parse self-check
```

Without these, `/apply` still produces the polished PDF **and** a plain-text `.txt`; only
the `.docx` export and the PDF parse-check are skipped (graceful degradation).

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/suraj-davariya/ai-job-search.git
cd ai-job-search

# 2. Open CareerForge in Claude Code
claude

# 3. Build your profile (answer Claude's questions or point it at your documents)
/setup

# 4. Search for jobs
/search

# 5. Apply to one
/apply https://company.com/jobs/your-role
```

---

## Commands in depth

### `/setup` — Build your candidate profile

Populates seven profile files from your real data. Claude asks questions or reads your documents — no typing if you have files.

**Three onboarding paths:**

| Path | When to use |
|------|-------------|
| **A — Scan documents** | You have CVs, a LinkedIn export, diplomas, or reference letters in the `documents/` folder |
| **B — Import a CV** | You have a single clean CV and want a fast start |
| **C — Live interview** | Starting fresh; Claude interviews you |

**Example prompts:**

```
/setup
```
```
/setup --section search
```
> _(Jumps straight to updating your target job portals and location preferences without re-running the full interview.)_

```
/setup --section experience
```
> _(Updates just your work history — useful after a job change.)_

**What gets built:**

| File | Contents |
|------|---------|
| `01-candidate-profile.md` | Identity, education, work history, skills, projects |
| `02-behavioral-profile.md` | Working style, culture preferences, motivations |
| `03-writing-style.md` | _(static framework — no personal data)_ |
| `04-job-evaluation.md` | Your strong/weak areas, career goals |
| `05-cv-templates.md` | Profile statements per role type |
| `06-cover-letter-templates.md` | _(static templates)_ |
| `07-interview-prep.md` | STAR stories from your experience |
| `search-queries.md` | Your target job portals, queries, location tiers |

---

### `/search` — Find new job postings

Searches your configured job portals via web search, deduplicates against jobs you've already seen, assigns a fit signal (High / Medium / Low), and presents a ranked table. When you pick a number, the job is handed straight to `/apply`.

**Arguments:**

| Syntax | Behaviour |
|--------|-----------|
| `/search` | Runs your top 3 priority query categories |
| `/search data science` | Prioritises categories matching "data science" |
| `/search broad` | Runs all configured query categories |

**Example prompts:**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**Example output:**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **All portals come from your config.** Nothing is hardcoded — add any job board (LinkedIn, Indeed, Jobindex, Stepstone, etc.) to `search-queries.md` and it is automatically included.

---

### `/apply` — Produce a tailored CV and cover letter

Takes a job URL or pasted description and runs the full application pipeline:

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**Arguments:**

| Argument | Behaviour |
|----------|-----------|
| _(default)_ | Full pipeline with reviewer (`--review=full`) |
| `--review=quick` | Reviewer skips company research — faster, lower cost |
| `--review=none` | Skip reviewer entirely — fastest, lowest cost |

**Example prompts:**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

Or paste the job description directly:

```
/apply
[paste job description here]
```

**What you get:**

| Output | Location |
|--------|---------|
| CV (PDF, 2 pages, English) | `cv/main_<company>.pdf` |
| Cover letter (PDF, 1 page, posting language) | `cover_letters/cover_<company>_<role>.pdf` |
| Application row | `job_search_tracker.csv` |
| Fit evaluation | In conversation |

**Fit scoring (5 dimensions):**

| Dimension | Weight |
|-----------|--------|
| Technical Skills Match | 30% |
| Career Alignment | 30% |
| Experience Match | 25% |
| Behavioural / Culture Fit | 15% |
| Location & Logistics | Pass / Fail |

Verdict: **Strong** (75+) · **Good** (60–74) · **Moderate** (45–59) · **Weak** (30–44) · **Poor** (<30)

> **Language rule:** the cover letter is always written in the job posting's language. A Danish posting → Danish cover letter. The CV is always in English.

---

### `/upskill` — Find your skill gaps and a plan to close them

Compares your profile against demand and produces a prioritised gap heatmap, a
learning plan built from **real, web-searched** resources, and a dependency-aware study
order — then saves it all as a report the dashboard can show you.

**Two modes:**

| Syntax | Mode | What it analyses |
|--------|------|------------------|
| `/upskill` | Aggregate | Every job in your tracker, weighted so the roles you fit *least* count most |
| `/upskill <url>` | Targeted | One posting (paste the text if the URL won't fetch) |

**What you get:**

| Output | Location |
|--------|---------|
| Gap heatmap (Critical / High / Medium / Low) | In conversation |
| Learning plan — 2–3 resources per gap, with study direction + time estimate | In the report |
| Study order with total time | In the report |
| Saved report (with since-last-run delta in aggregate mode) | `upskill/report-*.md` |

Reports appear in the dashboard's **Upskill** tab. Nothing is fabricated — every
resource comes from a live web search, and an empty tracker gets an honest nudge toward
targeted mode rather than an empty report.

---

### `/expand` — Grow your profile from everything you've already done

Finds competencies you have but haven't written down — from your documents, your public
**GitHub** repos, and the web — and **adds** them to your profile. It never edits or
removes what's already there.

**How it works:**

1. **Scans** `documents/`, your GitHub repositories (READMEs, languages, topics), and
   other profile links (portfolio, Kaggle, Scholar).
2. **Enriches** each find via web search — both a direct lookup (course syllabi,
   certification skill lists, tool docs) and inference about the methods and toolchains
   the work implies.
3. **Shows you a competency map** grouped by category, each item traced to its source and
   marked direct / inferred — for your review *before* anything is written.
4. **Adds only what you approve**, each with a source note like *(Coursera — Deep
   Learning Specialisation)*. Those notes make re-runs idempotent, and inferred
   behavioural traits are clearly labelled.

**Example prompts:**

```
/expand
```
```
/expand github
```
> _(Prioritises your GitHub repositories as the source to mine.)_

Because every addition is additive and source-annotated, you can run `/expand` again
after a new course or project and it only brings in what's genuinely new.

---

### `/reset` — Start over, safely

Clears your personal data so you can begin again — a new career direction, a fresh
profile, or handing the repo to someone else — **without** touching the framework that
makes CareerForge work.

**Scopes:**

| Syntax | Clears |
|--------|--------|
| `/reset profile` | Your profile skill files (back to blank templates) |
| `/reset documents` | Your files in `documents/` (folder structure + README kept) |
| `/reset all` | Both |

It always **shows you an inventory first** (what will be cleared vs. what's preserved),
and **nothing happens until you type `RESET`** in capitals — any other reply cancels. The
writing-style guide, scoring framework, cover-letter templates, and the interview-prep
framework are never touched; only your data is. There's no undo, so it points you at your
git history as the only recovery, then suggests running `/setup` to rebuild.

---

## The tracking dashboard

A local-only web UI that **reads and atomically writes your `job_search_tracker.csv` as the single source of truth**, visualises your pipeline, and can drive the CLI (`/apply`, `/upskill`, salary lookups) from the browser. It is an optional companion — deleting it leaves your data and the `/apply` pipeline untouched.

> **Try it without installing →** [**Live demo**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — a read-only walkthrough with fictional sample data. Editing, the Console, and PDF previews are disabled there (they need the app running locally); everything else is the real UI.

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| Surface | What it does |
|---------|--------------|
| **Applications** | Sort/filter/search the tracker; inline status + notes edits (atomic, state-machine-guarded); `+ New`; detail drawer with guarded PDF preview |
| **Overview** | KPI cards (total, applied 7d/30d, avg fit, interview rate) + weekly/status/fit/calendar charts — honest `—` when a sample floor isn't met |
| **Console** | Run allowlisted commands and stream their output live; per-company re-run `/apply`, `/upskill`, and salary lookups |
| **Companies · Salary · Upskill · Profile · Settings** | Grouped/benchmarked/report/profile views; theme + read-only preferences |

**Local by design:** binds `127.0.0.1` only (no LAN, no auth, no accounts), makes no outbound network calls, runs commands via a fixed allowlist with no shell, and stores no secrets. A `--read-only` mode disables every edit and action. See [`dashboard/README.md`](dashboard/README.md) and [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md).

> Requires Node 18+. The action layer (running commands from the browser) needs the `claude` and/or `python3` binaries on `PATH`; when absent, those triggers are disabled and the rest keeps working.

---

> **All planned commands have shipped.** `/setup`, `/search`, `/apply`, `/upskill`,
> `/expand`, and `/reset` are all live (v1.0–v1.2). See the [Roadmap](#roadmap) for what's
> next.

---

## Example session

Here is a realistic end-to-end walkthrough.

**1. First-time setup**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. Searching for jobs**

```
you:   /search
claude: Searching your configured portals for the last 14 days…
        Found 9 new positions (3 high, 4 medium, 2 low match)

         #  Fit     Title                Company      Location
         1  High    ML Engineer          Acme Corp    Amsterdam
         2  High    Data Scientist       BetaTech     Remote (EU)
         3  Medium  Analytics Engineer   Gamma GmbH   Berlin
        …
        Want me to evaluate any of these? Just give me the number(s).

you:   1
```

**3. Applying**

```
claude: Running full pipeline for Acme Corp — ML Engineer.

        Fit Evaluation
        ──────────────────────────────────────────────
        Technical Skills Match    92/100  Strong
        Career Alignment          85/100  Strong
        Experience Match          78/100  Good
        Behavioural Fit           80/100  Strong
        Location & Logistics      Pass
        ──────────────────────────────────────────────
        Weighted Total            84 — Strong Fit ✓

        Proceed with drafting?

you:   Yes

claude: Drafting CV and cover letter…
        Spawning reviewer agent…
        Applying reviewer edits…
        Compiling cv/main_acme_corp.tex → main_acme_corp.pdf ✓ (2 pages)
        Compiling cover_letters/cover_acme_corp_ml_engineer.tex → …pdf ✓ (1 page)
        Verification checklist: all 15 items passed.

        Files ready for review:
          • cv/main_acme_corp.pdf
          • cover_letters/cover_acme_corp_ml_engineer.pdf
```

---

## Privacy

| Data | Where it lives | Committed to git? |
|------|----------------|-------------------|
| Candidate profile | `.claude/skills/job-application-assistant/` | No |
| Generated CVs & cover letters | `cv/output/`, `cover_letters/output/` | No |
| Application tracker | `job_search_tracker.csv` | No |
| Seen-jobs registry | `job_scraper/seen_jobs.json` | No |
| Source documents | `documents/` | No |
| Salary data | `salary_data.json` | No |

The `.gitignore` enforces all of these exclusions. If you push your fork to GitHub, **use a private repository** so your profile files are never exposed.

---

## Directory structure

```
ai-job-search/
│
├── .claude/
│   ├── commands/              # Slash commands you type in Claude Code
│   │   ├── setup.md           # /setup  — build your profile
│   │   ├── apply.md           # /apply  — full application pipeline
│   │   ├── search.md          # /search — discover new job postings
│   │   ├── upskill.md         # /upskill — skill-gap analysis + learning plan
│   │   ├── expand.md          # /expand — competency expansion (additive)
│   │   └── reset.md           # /reset  — clear data, preserve framework
│   │
│   └── skills/
│       ├── job-application-assistant/   # AI knowledge for CV/CL/interview work
│       │   ├── 01-candidate-profile.md  # Your identity, experience, skills
│       │   ├── 02-behavioral-profile.md # Working style, culture fit
│       │   ├── 03-writing-style.md      # Rules: no em-dashes, no buzzwords…
│       │   ├── 04-job-evaluation.md     # 5-dimension scoring framework
│       │   ├── 05-cv-templates.md       # LaTeX CV guide + tailoring rules
│       │   ├── 06-cover-letter-templates.md
│       │   └── 07-interview-prep.md     # STAR stories + practice questions
│       │
│       ├── job-scraper/
│       │   ├── SKILL.md                 # Job-search workflow (REQ-1001–1012)
│       │   └── search-queries.md        # Your portals, queries, location tiers
│       │
│       └── career-development/
│           └── SKILL.md                 # Skill-gap analysis (REQ-3001–3011)
│
├── cv/
│   ├── cfcv.cls               # Custom LaTeX CV class (compile with lualatex)
│   └── main_example.tex       # CV template — copy per application
│
├── cover_letters/
│   ├── cfcl.cls               # Custom LaTeX cover letter class (xelatex)
│   ├── main_example.tex       # Cover letter template
│   └── OpenFonts/fonts/       # Bundled Lato, Raleway, FontAwesome 6 Free TTFs
│
├── i18n/                      # Localization tree — UI/README in 12 languages
│   ├── _meta/languages.json   # Language registry (12 Tier-1 + 20 Tier-2)
│   ├── ui/<lang>/             # ICU UI strings (en = source of truth)
│   └── readme/                # Localized READMEs (English is canonical)
│
├── locale-packs/              # Per-market CV conventions (us, de, jp, br, in, eu…)
│
├── trust-safety/              # Scam-pattern catalog for the legitimacy gate
│
├── documents/                 # Drop your source docs here (gitignored)
│   ├── cv/                    # Existing CVs (PDF or DOCX)
│   ├── linkedin/              # LinkedIn data export
│   ├── diplomas/
│   ├── references/
│   └── applications/
│
├── dashboard/                 # Local tracking dashboard (Next.js, loopback-only)
│   ├── app/                   #   App Router pages + API routes
│   ├── lib/                   #   pure core: parsers, atomic writer, allowlist…
│   ├── components/            #   applications · dashboard · console · views
│   ├── README.md              #   how to launch + security/privacy model
│   └── ARCHITECTURE.md        #   layers, file contracts, perf baseline
│
├── docs-site/                 # Documentation website (newcomer-first guide)
├── upskill/                   # Upskill reports (report-*.md)
│
├── tools/
│   └── convert_salary_excel.py   # Excel → salary_data.json (Epic 7, stub)
│
├── salary_lookup.py           # Salary benchmarking CLI (used by the dashboard)
├── job_search_tracker.csv     # 14-column application log (gitignored)
└── job_scraper/               # Deduplication state (gitignored)
```

---

## Compiling templates manually

If you want to test the LaTeX templates independently:

**CV** (run from the `cv/` directory):
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**Cover letter** (run from `cover_letters/` — the working directory matters for font loading):
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## Roadmap

| Milestone | Status | What ships |
|-----------|--------|-----------|
| **MVP** (Epics 1–5) | ✅ Complete | `/setup`, `/apply` (no reviewer), PDF compilation |
| **v1.0** (Epics 6–8) | ✅ Complete | Reviewer agent, `/search`, application tracker |
| **v1.0 — Dashboard** (Epic 9) | ✅ Complete | Local tracking dashboard at `127.0.0.1:4480` — view/edit tracker, analytics, run commands from the browser |
| **v1.1** (Epics 10–11) | ✅ Complete | `/upskill` skill-gap analysis + learning plan, and `/expand` competency expansion from your docs, GitHub, and the web |
| **v1.2** (Epic 12) | ✅ Complete | `/reset`, interview-prep framework, ADR-0004 portal-adapter pattern + example, research agent |
| **v1.3 — Global Reach & Trust** (Epics 13–19) | ✅ Complete | UI + README in 12 languages (beta) + pluggable locale packs (CV conventions per market); posting-legitimacy gate (scam/ghost-job shield); ATS-safe CV exports (`.txt`/`.docx`) + parse self-check; fabrication-audit **Provenance** panel; token-free scan tier |
| **v2.0** | 💡 Future | Template marketplace, community portal adapters, GUI |

See the full plan in [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md).

---

## Documentation

**Start here →** [`docs-site/`](docs-site/) — the documentation **website**: a newcomer-first guide to the whole product (Quick Start, all three commands, the dashboard with live demos, your data, privacy, FAQ, glossary). Run it locally with `npm run dev` inside `docs-site/`, or build it static with `npm run build`.

Engineering documentation (specifications, architecture, plans):

| Path | Contents |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | Complete functional requirements (`REQ-####` IDs) |
| [`docs/architecture/`](docs/architecture/) | Technology stack, component design, ADRs |
| [`docs/plan/`](docs/plan/) | Milestones, epics, work breakdown |
| [`docs/development/`](docs/development/) | Coding standards, project structure, contribution guide |
| [`docs/testing/`](docs/testing/) | Test strategy, test cases (`TC-####` IDs) |
| [`docs/glossary.md`](docs/glossary.md) | Canonical terms |

---

## Contributing

Contributions are welcome — new CV/cover-letter templates, locale packs, portal adapters, bug fixes, and documentation improvements all help.

> ⚠️ **Use a private fork.** Your candidate profile lives in the same directory as the source code. Always work in a private GitHub repository to keep your personal data out of the public internet.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide, branch naming, PR checklist, and how to add a new job portal or locale.

---

## Licence

MIT — see [LICENSE](LICENSE). ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
