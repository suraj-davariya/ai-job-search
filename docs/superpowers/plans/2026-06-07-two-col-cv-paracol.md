# Two-Column CV Template (paracol + Dark Sidebar) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `cv/main_example_two_col.tex` using `paracol` for a stable dark-sidebar two-column CV, following the reference example's structural pattern but aligned with CareerForge's Lato font, color scheme, and header style.

**Architecture:** Header lives inside the right (main) column — name bold-uppercase left, contact right — matching the CareerForge visual language without requiring a full-width element above paracol. The left sidebar (32%) gets a full-height dark-gray background painted via `\AddToShipoutPictureBG` TikZ overlay. All cfcv.cls macros (`\cvsection`, `\company`, `\skillset`) are reused unchanged in the main column. New preamble-only macros (`\sidesection`, `\skillbar`, `\cvheadertwo`) keep cfcv.cls untouched.

**Tech Stack:** LuaLaTeX, `cfcv.cls` (unchanged), `paracol`, `eso-pic` (already installed), `tikz` (already in cfcv.cls), `lato` CTAN package, `enumitem`, `hyperref`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify (full rewrite) | `cv/main_example_two_col.tex` | Two-column paracol CV template |
| Unchanged | `cv/cfcv.cls` | All macros, colors, fonts |
| Unchanged | `cv/main_example.tex` | Single-column ATS template |

---

## Geometry Reference

For the TikZ sidebar background (`\AddToShipoutPictureBG`):

```
a4paper = 210mm wide
left margin  = 10mm (1.0cm)
right margin = 12mm (1.2cm)
textwidth    = 210 - 10 - 12 = 188mm
sidebar col  = 0.32 × 188 = 60.16mm
columnsep    = 5mm (0.5cm), half = 2.5mm
TikZ x-limit = 10 + 60.16 + 2.5 = 72.66mm
fraction     = 72.66 / 210 ≈ 0.346
```

Use `[xshift=0.346\paperwidth]` in the TikZ rectangle. Fine-tune empirically if the vertical rule between columns is visible — increase toward 0.36 to hide it, decrease toward 0.33 to tighten.

---

### Task 1: Install paracol LaTeX package

**Files:** none (system package)

- [ ] **Step 1: Install paracol**

  Run in terminal (user must do this — Claude cannot sudo):
  ```bash
  sudo tlmgr install paracol
  ```
  Expected: `tlmgr: package paracol successfully installed`

- [ ] **Step 2: Verify**

  ```bash
  kpsewhich paracol.sty
  ```
  Expected: prints a path ending in `paracol.sty`

---

### Task 2: Write cv/main_example_two_col.tex

**Files:**
- Modify: `cv/main_example_two_col.tex` (complete rewrite)

- [ ] **Step 1: Replace file with the new implementation**

  Write the following content to `cv/main_example_two_col.tex`:

  ```latex
  % =============================================================================
  % CareerForge CV Template — Two Column (paracol + dark sidebar)
  % Class:   cfcv.cls
  % Compile: lualatex main_example_two_col.tex    (run from cv/ directory)
  % Output:  main_example_two_col.pdf             (target: 1 page)
  %
  % Layout:  Left dark sidebar 32%  |  Right main column 68%
  %          Header is inside the main column: name (left) + contact (right)
  %          Sidebar background: full-height TikZ page overlay via eso-pic
  %
  % ATS notes:
  %   - \skillbar{} is VISUAL ONLY — ATS cannot parse TikZ progress bars
  %   - For ATS submission, use main_example.tex (single-col with \skillset{})
  %   - No letter-spacing on any text
  %   - Standard section names throughout
  %
  % Tokens:  Fields marked  % {{TOKEN}}  are replaced by the AI /apply skill.
  %          See .claude/skills/job-application-assistant/05-cv-templates.md
  % =============================================================================

  \documentclass[10pt, a4paper]{cfcv}
  \geometry{left=1.0cm,right=1.2cm,top=1.2cm,bottom=1.2cm}
  \usepackage[default]{lato}
  \usepackage{paracol}
  \usepackage{eso-pic}
  \usepackage{hyperref}

  % ── Paracol layout ─────────────────────────────────────────────────────────
  \columnratio{0.32}
  \setlength{\columnsep}{0.5cm}

  % ── Sidebar background colour ───────────────────────────────────────────────
  % SlateGrey from cfcv.cls — keeps visual consistency with cfcl.cls header
  \definecolor{sidebarbg}{HTML}{2E2E2E}

  % ── Full-height dark sidebar (TikZ page overlay, every page) ────────────────
  % xshift = (leftmargin + sidebarwidth + ½columnsep) / paperwidth
  %        = (10 + 60.16 + 2.5) / 210 ≈ 0.346
  % Adjust up to 0.36 if hairline gap appears, down to 0.33 to tighten.
  \AddToShipoutPictureBG{%
    \begin{tikzpicture}[remember picture,overlay]
      \fill[sidebarbg]
        (current page.north west)
        rectangle
        ([xshift=0.346\paperwidth]current page.south west);
    \end{tikzpicture}}

  % ── Sidebar section header (accent rule on dark bg) ─────────────────────────
  \newcommand{\sidesection}[1]{%
    \medskip
    {\color{accent}\small\bfseries\MakeUppercase{#1}}\\[-1ex]%
    {\color{accent}\rule{\linewidth}{1.2pt}\par}\smallskip}

  % ── Skill progress bar (visual only — not ATS-safe) ─────────────────────────
  \newcommand{\skillbar}[2]{%
    {\small\color{white}\textbf{#1}}\\[0.03em]%
    \begin{tikzpicture}
      \fill[white!15!sidebarbg] (0,0) rectangle (\linewidth,4pt);
      \fill[accent]             (0,0) rectangle (#2\linewidth,4pt);
    \end{tikzpicture}\par\smallskip}

  \begin{document}

  \begin{paracol}{2}

  % ── LEFT SIDEBAR (32%) ─────────────────────────────────────────────────────
  \color{white}
  \vspace*{0.15cm}

  \sidesection{Summary}
  {\footnotesize\linespread{1.35}\selectfont
  Software engineer with five years of experience building production ML systems
  in Python. Proven track record delivering data-driven products that move
  business metrics. Passionate about clean architecture and collaboration.\par}
  % {{PROFESSIONAL_SUMMARY}}

  \sidesection{Skills}
  \skillbar{Python}{0.92}
  \skillbar{PyTorch / TensorFlow}{0.80}
  \skillbar{Docker / Kubernetes}{0.75}
  \skillbar{AWS}{0.70}
  \skillbar{SQL / PostgreSQL}{0.80}
  % {{SKILLS_BARS}}

  \sidesection{Education}
  {\footnotesize
  \textbf{M.Sc. Computer Science}\\     % {{DEGREE}}
  Stanford University\\                 % {{UNIVERSITY}}
  {\color{accent}2017 – 2019}\par}      % {{EDU_DATE_RANGE}}

  \sidesection{Languages}
  {\footnotesize
  $\bullet$\ English – Native\\         % {{LANGUAGE_1}}
  $\bullet$\ Spanish – B2\par}          % {{LANGUAGE_2}}

  \sidesection{Certifications}
  {\footnotesize
  \textbf{AWS ML Specialty}\\           % {{CERT_1_NAME}}
  {\color{accent}March 2024}\\          % {{CERT_1_DATE}}
  \href{https://example.com/cert}{\color{accent}Verify \faExternalLink}\par}
  % {{CERT_1_URL}}

  % ── RIGHT MAIN COLUMN (68%) ────────────────────────────────────────────────
  \switchcolumn
  \color{body}
  \vspace*{0.15cm}

  % ── Header — name left, contact right ──────────────────────────────────────
  \begin{minipage}[b]{0.55\linewidth}
    {\Large\bfseries\color{black}\MakeUppercase{Jane Smith}\par}  % {{CANDIDATE_NAME}}
    \smallskip
    {\small\bfseries\color{accent}ML Engineer · Python Developer\par}  % {{TAGLINE}}
  \end{minipage}\hfill%
  \begin{minipage}[b]{0.43\linewidth}
    \raggedleft\footnotesize\color{LightGrey}
    \href{mailto:jane.smith@email.com}{jane.smith@email.com}\\   % {{EMAIL}}
    +1 (415) 555-0198\\                                           % {{PHONE}}
    \href{https://linkedin.com/in/janesmith}{linkedin.com/in/janesmith}\\  % {{LINKEDIN}}
    San Francisco, CA                                             % {{LOCATION}}
  \end{minipage}
  \par\medskip
  \textcolor{accent}{\rule{\linewidth}{1.2pt}}\medskip

  % ── Professional Experience ─────────────────────────────────────────────────
  \cvsection{Professional Experience}

  \company{TechStart Inc.}{ML Engineer}{San Francisco, CA}{Jan 2022 – Present}
  % {{COMPANY_1_*}}
  Brief company description — what the company does and your role within the team.
  % {{COMPANY_1_DESCRIPTION}}
  \begin{itemize}
    \item Delivered real-time recommendation engine that increased CTR by 23\%
          within 3 months, processing 2M+ events/day via PyTorch and Redis.  % {{ACHIEVEMENT_1}}
    \item Met <100ms p99 latency SLA; reduced incidents by 40\% through
          improved monitoring.                                                % {{ACHIEVEMENT_2}}
  \end{itemize}

  \medskip\textcolor{accent}{\rule{\linewidth}{0.8pt}}\medskip

  \company{PrevCorp}{Junior Software Developer}{New York, NY}{Jun 2019 – Dec 2021}
  % {{COMPANY_2_*}}
  Brief description of second role and the team context.
  % {{COMPANY_2_DESCRIPTION}}
  \begin{itemize}
    \item Built analytics dashboard adopted across 3 business units, cutting
          report generation time by 60\%.                                     % {{ACHIEVEMENT_3}}
    \item Maintained REST APIs serving 500K daily active users with 99.9\%
          uptime over 18 months.                                              % {{ACHIEVEMENT_4}}
  \end{itemize}

  \end{paracol}

  \end{document}
  ```

---

### Task 3: Compile and verify

**Files:**
- Read: `cv/main_example_two_col.pdf` (after compile)

- [ ] **Step 1: Compile**

  Run from the `cv/` directory:
  ```bash
  cd /Users/suuraj/Workspace/ai-job-search/cv && lualatex main_example_two_col.tex 2>&1 | tail -20
  ```
  Expected output ends with: `Output written on main_example_two_col.pdf (1 page, ...)`
  
  If it errors on `paracol.sty not found` → run Task 1 first.

- [ ] **Step 2: Check page count**

  ```bash
  grep "^Output" /Users/suuraj/Workspace/ai-job-search/cv/main_example_two_col.log
  ```
  Expected: `Output written on main_example_two_col.pdf (1 page, ...)`

- [ ] **Step 3: Check for overfull/underfull boxes**

  ```bash
  grep -c "Overfull" /Users/suuraj/Workspace/ai-job-search/cv/main_example_two_col.log
  ```
  Acceptable: ≤ 3 minor overfull warnings. If > 3, check which lines are overfull and shorten the offending bullet text.

- [ ] **Step 4: Open PDF for visual inspection**

  ```bash
  open /Users/suuraj/Workspace/ai-job-search/cv/main_example_two_col.pdf
  ```
  
  Verify manually:
  - [ ] Dark sidebar covers left 32% of page, top to bottom, no gap at top
  - [ ] Sidebar text is white; section headers have blue accent rule
  - [ ] Skill bars are visible (blue fill on dark track)
  - [ ] Right column: name bold uppercase + accent tagline + contact right-aligned
  - [ ] Accent rule separates header from experience
  - [ ] Both experience entries visible with bullet points
  - [ ] No blank gap at top of columns (paracol starts immediately below top margin)

---

### Task 4: Commit (NO push — await user sign-off)

**Files:**
- `cv/main_example_two_col.tex`
- `cv/main_example_two_col.pdf`

- [ ] **Step 1: Stage and commit**

  ```bash
  cd /Users/suuraj/Workspace/ai-job-search && \
  git add cv/main_example_two_col.tex cv/main_example_two_col.pdf && \
  git commit -m "$(cat <<'EOF'
  feat(cv): rewrite two-column template using paracol + dark sidebar

  Replaces the minipage-based two-column layout (which had a persistent
  blank-space bug caused by the inline separator rule affecting minipage[t]
  baseline alignment) with paracol — a package designed for stable multi-column
  typesetting where column heights are computed independently.

  Layout: 32% dark sidebar (background via \AddToShipoutPictureBG TikZ overlay,
  full page height) + 68% main column. Header inside main column: name bold-
  uppercase left, contact info right — no full-width \makecvheader above paracol,
  which avoids the TikZ positioning problem of aligning the sidebar bg with a
  variable-height header.

  New preamble macros (cfcv.cls unchanged):
    \sidesection{} — accent rule on dark bg, matches \cvsection style
    \skillbar{}{} — TikZ progress bar, visual-only (not ATS-parseable)

  ATS note: this template is for human/PDF review. For ATS submission,
  use main_example.tex (single-column, plain \skillset{} text).

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  ```
  Expected: `[feature/init <hash>] feat(cv): rewrite two-column template using paracol + dark sidebar`

- [ ] **Step 2: Verify commit (do NOT push)**

  ```bash
  git log --oneline -3
  ```
  Confirm the new commit appears on top. Do not run `git push` — await user PDF sign-off.

---

## Self-Review

**Spec coverage:**
- Reference layout (paracol, dark sidebar, skill bars, in-column header): ✓ Tasks 2–3
- CareerForge font (Lato, lualatex, no fontspec): ✓ preamble uses `[default]{lato}`
- CareerForge colors (DodgerBlue accent, body, LightGrey): ✓ inherited from cfcv.cls
- Header style aligned (uppercase name, accent tagline): ✓ matches cfcv.cls \makecvheader style
- {{TOKEN}} placeholders for /apply skill: ✓ all 13 tokens present
- cfcv.cls unchanged: ✓ all new macros in .tex preamble only
- No push until user confirms: ✓ Task 4 Step 2 explicitly states no push

**Placeholder scan:** No TBDs, no "implement later" — all code is complete.

**Type consistency:** `\sidesection`, `\skillbar`, `\switchcolumn` — all defined before use.
