# Technology Stack

> **Purpose:** Documents the technology choices for CareerForge and their rationale.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Software Architect

---

## Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | AI Coding Assistant CLI | Workflow execution, LLM inference, tool invocation |
| Workflow Definition | Markdown | Command and skill file format (`.claude/commands/`, `.claude/skills/`) |
| Document Generation | LaTeX (lualatex + xelatex) | Publication-quality PDF CVs and cover letters |
| CV Template | moderncv (banking style) | Professional CV formatting |
| Cover Letter Template | Custom LaTeX class (fontspec) | Professional cover letter formatting |
| Typography | Lato + Raleway (bundled) | Cover letter fonts |
| Utility Scripts | Python 3.10+ | Salary lookup (`salary_lookup.py` at repo root), data conversion |
| Job Portal Adapters | TypeScript + Bun | Job board CLI scrapers (`.agents/skills/<portal>/cli/`, Plane 2 per ARCH-0008) |
| Tracking Dashboard | Bun + Hono + HTMX + Pico.css | Localhost-only web UI over application tracker CSV (ADR-0005) |
| Data Storage | Markdown, JSON, CSV | Profile files, state, tracking |
| Version Control | Git | Distribution, history, collaboration |
| Package Management | npm/bun (JS), pip (Python) | Dependency installation |

---

## Detailed Rationale

### AI Coding Assistant CLI

**Why:** CareerForge is not a standalone application — it's a structured capability layer on top of an AI coding assistant. The platform provides:
- Natural language understanding for user commands
- Web search and web fetch for job discovery and research
- File system operations for reading/writing profile and template files
- Sub-agent spawning for the reviewer pattern
- Terminal command execution for LaTeX compilation and Python tools

**Trade-off:** Platform-specific. Migrating to a different AI assistant would require reformatting command and skill files.

### Markdown for Workflow Definition

**Why:** Commands and skills are defined in Markdown because:
- Human-readable and auditable
- Naturally fits the AI platform's prompt format
- Easy to modify without programming knowledge
- Version-control friendly (clean diffs)

**File types:**
- `.claude/commands/*.md` → Entry-point slash commands (4 total: `/apply`, `/setup`, `/expand`, `/reset`)
- `.claude/skills/<name>/SKILL.md` → Plane 1 skill orchestrators with `name`, `description`, `allowed-tools` frontmatter (ARCH-0008, ARCH-0010)
- `.claude/agents/<name>.md` → Named sub-agent definitions with optional `model:` for multi-model routing (ARCH-0009)
- `.agents/skills/<name>/SKILL.md` + `cli/` → Plane 2 sub-agent CLI skills (TypeScript + Bun)
- `CLAUDE.md` → Main context document (Role A: framework dev; Role B: user candidate profile after `/setup`)

### LaTeX for Document Generation

**Why:** LaTeX produces superior typography compared to HTML-to-PDF or word processor approaches. See [ADR-0003](adr-0003-latex-generation.md) for the full decision record.

**Two compilers required:**
- `lualatex` for CVs — Handles fontawesome5 correctly (pdflatex fails on modern installs)
- `xelatex` for cover letters — Required by fontspec for custom font loading

**Key packages:**
| Package | Purpose |
|---------|---------|
| moderncv | CV document class |
| hyperref | Clickable URLs and metadata |
| geometry | Page margins |
| needspace | Prevent page-break orphaning |
| fontspec | Custom font loading (cover letter) |
| fancyhdr | Page headers/footers (cover letter) |
| textpos | Absolute positioning (cover letter date) |

### Python 3.10+

**Why:** Python handles the salary benchmarking tools — fuzzy string matching, JSON processing, and Excel parsing. Standard library covers most needs; only openpyxl is an external dependency (and only for Excel import).

**Scripts:**
- `salary_lookup.py` — CLI tool for company salary lookup
- `tools/convert_salary_excel.py` — Excel-to-JSON converter

### TypeScript + Bun

**Why:** Job portal adapters need to scrape and parse web pages, which TypeScript handles well with modern async patterns. Bun provides fast execution and built-in TypeScript support without a compilation step.

**Structure:** Each adapter is a self-contained CLI with its own `package.json` and dependencies. See [ADR-0004](adr-0004-pluggable-portals.md).

### File-Based Data Storage

**Why:** Files over databases because the data model is small, human-readable formats enable manual editing, and git tracks history naturally. See [ADR-0001](adr-0001-file-based-data.md).

**Formats by purpose:**
| Format | Used for |
|--------|----------|
| Markdown | Profile files, reports, documentation |
| JSON | Seen jobs, salary data |
| CSV | Application tracker |
| LaTeX | Templates and generated documents |

---

## Dependency Installation

### Prerequisites (User must install)
```
1. AI coding assistant CLI (npm install -g ...)
2. Python 3.10+
3. LaTeX distribution (TeX Live / MacTeX / MiKTeX)
4. Bun (for job portal adapters)
5. Git
```

### Project Dependencies (Installed via package managers)
```bash
# Job portal adapters (per adapter)
cd .agents/skills/<adapter>/cli && bun install

# Salary Excel import (optional)
pip install openpyxl
```

No global build step. No monorepo tooling. Each component is independently installable.
