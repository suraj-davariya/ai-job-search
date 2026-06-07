# CareerForge

An open-source, AI-powered job application framework built with Claude Code.
CareerForge automates the research, writing, and tracking work of a job search —
CV tailoring, cover letter generation, interview prep, and salary benchmarking —
while keeping all your personal data on your own machine.

> **Status:** Foundation complete (Epic 1 + 2). Core workflow commands are stubs; full implementation follows in subsequent epics. See [`docs/plan/00-index.md`](docs/plan/00-index.md) for the roadmap.

---

## What it does

| Command | What happens |
|---------|-------------|
| `/setup` | Scans your documents, runs an interview session, and builds your candidate profile |
| `/apply` | Takes a job URL or description → tailors your CV → writes a cover letter → compiles both to PDF |
| `/expand` | Enriches your profile with new skills, courses, or certifications |
| `/reset` | Clears profile sections or resets application state |

All commands are Markdown files in `.claude/commands/` that Claude Code executes as slash commands.

---

## Requirements

### Claude Code
Install from [claude.ai/code](https://claude.ai/code) or via npm:

```bash
npm install -g @anthropic-ai/claude-code
```

### LaTeX (for CV and cover letter compilation)

Two compilers are required — they serve different roles:

| Compiler | Used for | Why |
|----------|----------|-----|
| `lualatex` | CV (`cv/cfcv.cls`) | Required by the `fontawesome` and `lato` CTAN packages |
| `xelatex` | Cover letter (`cover_letters/cfcl.cls`) | Required by `fontspec` for loading bundled TTF fonts |

**Install MacTeX** (macOS, recommended — includes both compilers):

```bash
brew install --cask mactex
```

Or download from [tug.org/mactex](https://www.tug.org/mactex/).

After installing MacTeX, install the additional CTAN packages used by `cfcv.cls`:

```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

> **Cover letter fonts** (Lato, FontAwesome 6 Free) are bundled in
> `cover_letters/OpenFonts/fonts/` — no system font installation needed for `cfcl.cls`.

### Python 3 (optional — for salary benchmarking)

```bash
python3 --version   # 3.10+ required
pip install openpyxl  # only needed for Excel → JSON import
```

---

## Installation

```bash
git clone https://github.com/suraj-davariya/ai-job-search.git
cd ai-job-search
```

Open the project in Claude Code:

```bash
claude
```

Run `/setup` to build your candidate profile.

---

## Directory Structure

```
careerforge/
├── .claude/
│   ├── commands/           # Slash commands: /setup /apply /expand /reset
│   ├── skills/             # AI knowledge files (profile populated by /setup)
│   │   ├── job-application-assistant/
│   │   └── job-scraper/
│   └── settings.local.json # Tool permissions for Claude Code
│
├── cv/
│   ├── cfcv.cls            # Custom LaTeX CV class — compile with lualatex
│   ├── main_example.tex    # One-page CV template with {{TOKEN}} placeholders
│   └── output/             # Generated CV files (gitignored)
│
├── cover_letters/
│   ├── cfcl.cls            # Custom LaTeX cover letter class — compile with xelatex
│   ├── main_example.tex    # One-page cover letter template
│   ├── README.md           # Compilation guide + font licence info
│   ├── OpenFonts/fonts/    # Bundled Lato, Raleway, FontAwesome 6 Free TTFs
│   └── output/             # Generated cover letter files (gitignored)
│
├── documents/              # Your personal source documents (gitignored)
│   ├── cv/                 # Upload your existing CVs here
│   ├── linkedin/           # LinkedIn data export
│   ├── diplomas/
│   ├── references/
│   └── applications/
│
├── tools/
│   └── convert_salary_excel.py   # Excel → salary_data.json (Epic 7)
│
├── salary_lookup.py        # Salary benchmarking CLI (Epic 7)
├── job_search_tracker.csv  # Application log — 14 columns (gitignored)
└── job_scraper/            # Job search deduplication state (gitignored)
```

---

## Compiling the templates manually

**CV** (from `cv/` directory):

```bash
cd cv
lualatex main_example.tex
# → main_example.pdf (1 page)
```

**Cover letter** (from `cover_letters/` directory — path matters for font loading):

```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf (1 page)
```

---

## Privacy

All personal data stays on your machine:

- Your candidate profile (`.claude/skills/job-application-assistant/`)
- Generated CVs and cover letters (`cv/output/`, `cover_letters/output/`)
- Application tracker (`job_search_tracker.csv`)
- Salary data (`salary_data.json`)
- Source documents (`documents/`)

None of these are committed to git. See [`.gitignore`](.gitignore) for the full rules.

---

## Documentation

| Path | Contents |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | Full functional + non-functional requirements (`REQ-####`) |
| [`docs/architecture/`](docs/architecture/) | Technology stack, component design, ADRs |
| [`docs/plan/`](docs/plan/) | Milestones, epics, work breakdown |
| [`docs/development/`](docs/development/) | Coding standards, project structure, contribution guide |
| [`docs/testing/`](docs/testing/) | Test strategy, test cases (`TC-####`) |

---

## Licence

MIT — see [LICENSE](LICENSE) if present, otherwise standard MIT terms apply.
