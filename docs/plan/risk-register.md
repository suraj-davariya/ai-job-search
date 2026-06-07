# Plan — Risk Register

> **Purpose:** Identifies, assesses, and provides mitigations for risks associated with building and deploying CareerForge.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Technical Program Manager

---

## Risk Assessment Matrix

Risks are evaluated on **Probability** (1–5, Low to High) and **Impact** (1–5, Low to High) to calculate a **Severity Score** (Probability × Impact).

| ID | Category | Risk Description | Prob | Imp | Severity | Primary Mitigation |
|---|---|---|---|---|---|---|
| **RISK-0001** | Security | Accidental leak of PII (resumes, cover letters, salaries) via Git commits. | 4 | 5 | **20 (Critical)** | Pre-commit hooks to block keys & check gitignore rules. |
| **RISK-0002** | Technical | LaTeX installation or compiler issues on diverse client platforms. | 4 | 4 | **16 (High)** | Containerized build options and detailed local environment validation. |
| **RISK-0003** | AI Integrity | "Hallucination" or embellishment of candidate skills in generated PDFs. | 3 | 5 | **15 (High)** | Fact-checking verification checklists and strict system prompt constraints. |
| **RISK-0004** | API / Costs | Escalating LLM token costs or rate limits during long iterations. | 3 | 4 | **12 (Medium)** | Token caching, draft reuse, and size-limit validation. |
| **RISK-0005** | Technical | Scraping breaks due to target site UI/markup changes. | 4 | 3 | **12 (Medium)** | Decoupled adapter layers and modular selector structures. |
| **RISK-0006** | Formatting | Generated CVs or letters exceed page budget (2 page / 1 page). | 3 | 4 | **12 (Medium)** | Automated content-cutting loops and compile-and-inspect validation. |

---

## Detailed Risk Mitigation Plans

### RISK-0001: Accidental Leak of Personal Data (PII)
- **Problem:** Users run CareerForge locally and mistakenly commit their generated `cv/output.pdf` or source `documents/my_secrets.txt` to public GitHub forks.
- **Mitigation:**
  1. The `.gitignore` file includes strict catch-all patterns (e.g., `/cv/*.pdf`, `/documents/*`, `/settings/*.json`, `/upskill/*`).
  2. Implement an automated repository setup script (`/tools/bootstrap.sh`) that installs a pre-commit hook. The hook scans files staged for commit and halts if it detects paths outside the approved list.
  3. Include loud warnings in `README.md` and CLI startup output emphasizing the local-first nature and fork safety.

### RISK-0002: LaTeX Installation & Dependency Overhead
- **Problem:** LaTeX distributions (MacTeX, TeX Live) are large, and compilation fails due to missing fonts (Raleway, Lato) or packages (`moderncv`).
- **Mitigation:**
  1. Scaffolding commits all custom font assets (`.ttf` or `.otf`) in `cv/templates/OpenFonts/fonts/`.
  2. Setup guides explicitly target specific minimal TeX packages (e.g., `BasicTeX` on macOS, `texlive-xetex` on Linux).
  3. Support a secondary compilation mode that checks for a Docker container (`docker run --rm -v ... dxjoke/tectonic`) as a fallback if local LaTeX is absent.

### RISK-0003: AI Skill Fabrication (Hallucination)
- **Problem:** An LLM invents a job title, cert, or project to improve matching score metrics.
- **Mitigation:**
  1. Prompt structures utilize "Strict Source Anchoring". Every generated bullet point or claim must trace back to a specific line/fact in `01-candidate-profile.md` or `02-behavioral-profile.md`.
  2. The Reviewer Agent runs a distinct validation step comparing the generated draft against the candidate profiles, flagging any semantic mismatch or new skill additions.
  3. The final CLI command prints a verification checklist highlighting elements that must be manually inspected.

### RISK-0004: Escalating LLM Token Costs
- **Problem:** Multi-step agent loops (draft-review-rewrite) repeat indefinitely, running up API costs.
- **Mitigation:**
  1. Hard cap the revision loop at a maximum of two iteration rounds.
  2. Cache context tokens locally where possible (e.g. sharing system instructions and static profiles across API calls).
  3. Provide a dry-run flag (`--dry-run`) showing prompts and token estimates without executing calls.

### RISK-0005: Job Scraping Failures
- **Problem:** Targets change their layouts, breaking regex or selectors.
- **Mitigation:**
  1. Encapsulate portal scrapers behind a pluggable adapter interface (ADR-0004).
  2. Build scrapers using simple fallback mechanisms (e.g. if specific DOM selector fails, fall back to extracting and parsing page markdown or text content directly using an LLM).
  3. Provide a fallback tool where users can save a job posting HTML file locally and direct `/apply` to process the file.

### RISK-0006: Page Budget Overflows
- **Problem:** Long job descriptions cause generated cover letters to stretch into two pages.
- **Mitigation:**
  1. Implement a character-limit tracker on CV/cover letter generated texts before sending to LaTeX.
  2. If LaTeX logs contain `Overfull \vbox` warnings or generate a PDF with extra pages, the compile loop triggers a "Content-Cutting Algorithm" that reduces bullet size or drops lower-priority sections and re-compiles.
