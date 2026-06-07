# Development — Project Structure Guide

> **Purpose:** Explains where code, config, documentation, templates, and state files are located in the repository.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Staff Engineer

---

## Directory Tree Map

The directory structure is organized into source code, user data (ignored), documents, and compilation directories:

```
careerforge/
│
├── .github/                      # GitHub issue and PR templates
├── docs/                         # Specifications and documentation
│   ├── requirements/             # Product requirements (Phase 1)
│   ├── architecture/             # Architecture designs (Phase 2)
│   ├── plan/                     # Program plans (Phase 3)
│   ├── development/              # Developer guides (Phase 4)
│   └── testing/                  # Test strategies and cases (Phase 4)
│
├── cv/                           # CV Output and templates
│   ├── templates/                # Standard moderncv banking style files
│   │   ├── moderncv.cls          # Core LaTeX class file
│   │   └── main_example.tex      # Template skeleton with placeholders
│   └── output/                   # Generated CV drafts (.tex, .pdf, logs) [Gitignored]
│
├── cover_letters/                # Cover letter Output and templates
│   ├── templates/                # Class files and OpenFonts
│   │   ├── cover.cls             # Custom fonts class
│   │   └── OpenFonts/            # Raleway and Lato TrueType fonts
│   └── output/                   # Generated Cover Letter drafts [Gitignored]
│
├── documents/                    # Source texts and raw profiles [Gitignored]
│   └── README.md                 # Explains how to seed documents
│
├── settings/                     # User files [Gitignored except template]
│   ├── env.template.json         # Reference env file
│   ├── profile.json              # Main parsed profile output (additive)
│   ├── seen_jobs.json            # Scraping deduplication memory
│   └── tracker.csv               # Job application history logs
│
├── tools/                        # Python/TypeScript scripts and commands
│   ├── commands/                 # Main CLI controller logic
│   │   ├── setup.ts              # Command for profile parsing
│   │   ├── apply.ts              # Command for tailoring & review
│   │   ├── search.ts             # Command for job scraping
│   │   ├── expand.ts             # Command for enriching profiles
│   │   ├── upskill.ts            # Command for gap reports
│   │   └── reset.ts              # Command for state cleanup
│   │
│   ├── adapters/                 # Job portal adapters
│   │   ├── base_adapter.ts       # Adapter interface declaration
│   │   └── generic_scraper.ts    # Fallback text extractor adapter
│   │
│   ├── agent/                    # LLM wrapper & revision engine
│   │   ├── llm_client.ts         # Handles token counting and API calls
│   │   ├── reviewer_agent.ts     # Part A/B feedback agent
│   │   └── revision_engine.ts    # Structured edit replacement logic
│   │
│   ├── latex_compiler.ts         # Handles compiler path, xelatex, tectonic runs
│   └── salary_lookup.py          # Fuzzy matching benchmarking script
│
├── package.json                  # Node dependencies and scripts
└── tsconfig.json                 # TypeScript config
```

---

## Code Path Walkthrough

### CLI Commands (`tools/commands/`)
Every CLI command is defined as a class or command module mapping to one of the CLI routes. For example, `apply.ts` handles the orchestration loop: reading `settings/profile.json`, initiating a scraper, triggering the draft engine, compiling the PDF, running the reviewer, applying edits, and compiling the final output.

### LaTeX Templates (`cv/templates/` & `cover_letters/templates/`)
These contain the template skeleton files that the draft generator reads and populates. Placeholder tokens like `{{FULL_NAME}}`, `{{EXPERIENCE_LIST}}`, and `{{TARGET_COMPANY}}` are embedded in the LaTeX syntax.

### State Files (`settings/`)
These files act as the database.
- `profile.json`: Contains personal data, education, professional projects, and writing style parameters.
- `seen_jobs.json`: Contains a hash array of target postings to prevent double-scraping.
- `tracker.csv`: Track application milestones (Date, Company, Position, Fit Score, PDF paths, Status).
