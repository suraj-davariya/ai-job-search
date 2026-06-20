<!-- Framework static (preserved through /reset). Profile-statement templates = tokens populated by /setup. CV compiles with lualatex (ARCH-0003). -->

# CV Templates

## Template Definition

**Class file:** `cv/cfcv.cls` — the CareerForge CV class. All CV documents must use `\documentclass[10pt, a4paper]{cfcv}`.

**Compiler:** `lualatex` (ARCH-0003). Never use `pdflatex` or `xelatex` for the CV. The `fontawesome` CTAN package loaded by `cfcv.cls` requires LuaTeX.

**Base template:** `cv/main_example.tex` — the working example. Copy this file as the starting point for every new application CV (see Compile-and-Inspect Instructions below).

**Geometry override used in the base template:**
```latex
\geometry{left=1.2cm,right=1.2cm,top=1.2cm,bottom=1.2cm}
```

### Key Commands from `cv/cfcv.cls`

#### Header

```latex
\name{Full Name}
\tagline{Role Title · Descriptor}
\personalinfo{%
  \mailaddress{email@example.com}
  \phone{+1 (415) 555-0000}
  \linkedin{linkedin.com/in/handle}{https://linkedin.com/in/handle}
  \github{github.com/handle}{https://github.com/handle}
  \location{City, Country}
}
\makecvheader
```

`\makecvheader` renders the name (large bold uppercase black), tagline (small bold accent), contact line (footnotesize bold centred), and a 1.2pt DodgerBlue rule.

#### Section Header

```latex
\cvsection{Section Title}
```

Renders small bold uppercase accent text followed by a 1.2pt accent rule.

#### Experience Entry

```latex
\company{Company Name}{Job Title}{Location}{Date Range}
```

Four positional arguments. Renders company name and title in large bold body colour, location with `\faMapMarker` accent icon, date with `\faCalendar` accent icon.

#### Education Entry

```latex
\education{Degree}{Institution}{Location}{Date Range}
```

Four positional arguments. Renders degree in bold body, institution in small text, location with accent icon, date with `\faCalendar` accent icon.

#### Achievement Row

```latex
\cvachievement{icon}{title}{date}{description}
```

Four positional arguments. `icon` is a FontAwesome 4 symbol command (the `fontawesome` CTAN package, not `fontawesome5`). Use symbol aliases defined in the class:

| Alias | Underlying | Typical use |
|-------|------------|-------------|
| `\certificatesymbol` | `\faCertificate` | Certifications |
| `\devsymbol` | `\faCode` | Dev projects |
| `\linkedinsymbol` | `\faLinkedinSquare` | LinkedIn |
| `\githubsymbol` | `\faGithub` | GitHub |

Other FontAwesome 4 icons (e.g. `\faBriefcase`, `\faTrophy`, `\faBook`, `\faFlask`) may be used directly.

#### Skill Tags

```latex
\cfcvtag{Python}                        % single pill
\splitoncomma{Python, PyTorch, Docker}  % comma list → multiple pills
```

`\cfcvtag` renders a filled blue rounded pill. `\splitoncomma` splits on comma and calls `\cfcvtag` for each item. These are visual only — ATS parsers may not read them. Always accompany tag blocks with a `\skillset` plain-text row.

#### Plain-Text Skill Row (ATS-safe)

```latex
\skillset{Programming}{Python, JavaScript, TypeScript, SQL}
\skillset{Machine Learning}{PyTorch, scikit-learn, MLflow}
```

Two positional arguments: category label and comma-separated skill list. Preferred over tag-only rows for machine-readable sections.

#### Dividers

```latex
\divider       % dashed accent rule — use between experience entries
\dividergray   % lighter dashed rule — use for visual breaks within a section
```

#### Certificate Button

```latex
\button{\href{https://example.com/cert}{{\color{accent}\linksymbol}\hspace{0.4em}Verify}}
```

Renders a tcolorbox button with accent border for certification verification links.

#### Project Block (available but unused in default templates)

```latex
\project{Project Name}{Client}{Role(s)}{Technologies}
```

Available in the class but intentionally omitted from the default templates (consulting pattern; adds too much vertical weight for a 2-page CV). Use only when explicitly required for consulting-focused applications.

### Color Definitions

| Name | Hex | Usage |
|------|-----|-------|
| `accent` (DodgerBlue) | `#4F83FF` | Rules, icons, tags, section headers |
| `body` (Black 80%) | `#000000` at 80% opacity | Body text, company names |
| `LightGrey` | `#555555` | Secondary text (e.g. achievement dates) |
| `SlateGrey` | `#2E2E2E` | Alternate dark text |

---

## ATS-Safe Exports (TXT + DOCX)

The compiled LaTeX **PDF is the primary, human-facing CV** and is never replaced. Because
some applicant-tracking systems parse typeset PDFs poorly (and many prefer Word or plain
text), every CV is **also** exported as `.txt` and `.docx` (REQ-2063), generated from one
ATS-safe Markdown source so all three stay content-equivalent.

- **Source:** write `cv/main_<company>.ats.md` with the same tailored content as the
  `.tex`, in a flat parseable structure — standard headings (`Summary`, `Experience`,
  `Education`, `Skills`), name + contact at the top, plain text, **no tables, columns, or
  graphics**, no letter-spacing tricks.
- **Generate + verify:** `node scripts/ats-export.mjs --md cv/main_<company>.ats.md --out cv/output --pdf <pdf> --name "<name>" --keywords "<kw>"`
  produces the `.txt`/`.docx` and runs an **ATS parse self-check** (REQ-2064) confirming
  name, section headers, and top keywords are recoverable from the PDF.
- **Optional tools (graceful, ARCH-0005):** `.txt` always works; `.docx` needs `pandoc`;
  the parse check needs `pdftotext` (poppler). Missing tools are noted, never fatal.
- **No fabrication (ARCH-0007):** the exports contain exactly the claims in the PDF.

---

## Locale Adaptation (Locale Packs)

CV conventions differ by **target market**, not by language (REQ-7009, REQ-7010,
ADR-0007). A locale pack is a data file under `locale-packs/<code>.json` describing one
region's conventions. Language (what the CV is written in) and locale (the market's
conventions) are **separate**: a Spanish speaker applying in Germany writes in their
chosen language but follows the `de` locale pack.

### Resolving the active locale pack

1. Determine the target market from the posting (employer country / job location) or an
   explicit user preference.
2. Load `locale-packs/<code>.json` (e.g. `us`, `gb`, `de`, `fr`, `jp`, `br`, `in`, `eu`).
3. If no pack matches, fall back to `locale-packs/default.json` — a neutral, conservative
   profile (A4, no photo, no personal fields). Never crash on a missing pack (ARCH-0005).

### Applying the pack

| Pack field | How to apply |
|------------|--------------|
| `pageSize` | `\documentclass[10pt, a4paper]{cfcv}` for A4, `letterpaper` for Letter. Default A4. |
| `pageCountExpectation` | Sets the page budget below (overrides the default "2"). |
| `photo` | `forbidden` → never include a photo. `optional` → omit unless the user supplies one. `expected`/`required` → include the user's photo in the header per `photoSpec`; if the user has **not** provided a photo, prompt — never fabricate or use a placeholder (ARCH-0007). |
| `includedPersonalFields` | Add only fields the user has actually provided (e.g. `dateOfBirth`, `maritalStatus`, `nationalId`). Never invent a value to satisfy a field (ARCH-0007); if missing, ask the user. |
| `discouragedPersonalFields` | Omit these even if present in the profile (e.g. US/UK: no photo, DOB, marital status — anti-discrimination norms). |
| `documentTerm` | Use the local term where a label is needed (Résumé / Lebenslauf / Rirekisho / Currículo). |
| `nameOrder` | `family-given` (e.g. Japan) reorders the displayed name. |
| `dateFormat` | Format experience/education dates per the pack (e.g. `MM.yyyy` for DE, `yyyy/MM` for JP). |
| `legalClauses` | `gdpr-consent` → add a short data-processing consent line at the foot (EU markets). |
| `documentSystem` | Honor multi-document conventions (e.g. Japan's Rirekisho + Shokumukeirekisho). |

**Hard rule (ARCH-0007):** locale packs may *require* a field, but a required field is
never a license to fabricate. If the candidate has not supplied a photo, date of birth,
national ID, etc., prompt for it — do not invent or placeholder it.

---

## Color Override Rules

The class defines the accent color as DodgerBlue (`#4F83FF`). The `\colorlet{accent}{DodgerBlue}` definition in `cfcv.cls` is the single source of truth.

- Always keep the blue scheme consistent across CV and cover letter (`cfcl.cls` uses identical color definitions by design).
- Never override the color scheme in a generated CV without explicit user instruction.
- If a user requests a different accent color, add `\colorlet{accent}{<ColorName>}` after `\documentclass` in the company-specific `.tex` file — do not modify `cfcv.cls`.

---

## Spacing Rules

- **No `\vspace` inside `itemize` blocks.** Inter-item spacing inside lists must come from `\itemsep` set at the environment level. The class sets this globally via `\setlist{...,itemsep=0.15\baselineskip,...}` — do not override it inline.
- Do not add `\vspace` between `\begin{itemize}` and the first `\item`, or between the last `\item` and `\end{itemize}`.
- Use `\divider` between experience entries, not `\vspace`.
- Use `\smallskip` or `\medskip` (not `\vspace`) only outside list environments, and only when absolutely necessary.
- **If in doubt, cut content rather than squeeze spacing.** Tightening spacing to force-fit content makes the CV look cramped.

---

## Profile Statement Templates

<!-- Populated by /setup — one template per role type that applies to this candidate -->
- **Technical:** [PROFILE_STATEMENT_TECHNICAL]
- **Domain:** [PROFILE_STATEMENT_DOMAIN]
- **Consulting:** [PROFILE_STATEMENT_CONSULTING]
- **Leadership:** [PROFILE_STATEMENT_LEADERSHIP]

Use the template matching the target role type. These tokens are 3–4 line profile statements placed in the `\cvsection{Summary}` block. They are the only tokens in this file; all other content is static framework text.

---

## Section Tailoring Guidelines

| Section | Guidance |
|---------|----------|
| **Profile statement** | Tailored to the specific role — not generic. References the role title or company name. Replace the matching `[PROFILE_STATEMENT_*]` token; do not use a generic statement. |
| **Core competencies** | 5 items that are the strongest matches to this posting. Reorder to put the most posting-relevant item first. |
| **Experience bullets** | Lead with the most posting-relevant bullet per role. Cut low-relevance bullets before anything else when trimming for page budget. |
| **Skills section** | Reorder `\skillset` rows to put the most posting-relevant skill category first. |
| **Publications / Awards** | Include only if relevant to the posting. Omit the entire section if no entries match — do not include a section with irrelevant entries. |

---

## Employment Gap Handling

- **Gaps under 3 months:** No explanation needed in the CV unless the interviewer asks during screening.
- **Gaps of 3–12 months:** Brief optional note (e.g. "Career break — upskilling in X") in the relevant date period field of the `\company{}` entry or as a standalone single-line entry.
- **Gaps over 12 months:** A one-line explanation is required. Frame positively: consulting engagement, caregiving responsibility, formal study, health recovery.
- **Never fabricate an activity to fill a gap (ARCH-0007).** If the candidate cannot describe an activity accurately in an interview, it must not appear in the CV.

---

## Page Budget

### 2.1 Page Limit (locale-aware)

The CV must compile to the page count the active locale pack specifies in
`pageCountExpectation` (default **2** when no pack applies — e.g. US/UK markets). Some
markets expect 2–3 pages (DE, BR, IN); the US expects 1–2. Treat the resolved number as
a hard limit — no exceptions. The budget table below assumes the default 2-page target;
scale it to the resolved page count.

| Section | Maximum Budget |
|---------|---------------|
| Profile statement | 3–4 lines |
| Core competencies | 5 items, each 1–2 lines |
| Most recent role | 4–5 bullets |
| Previous role | 2–3 bullets |
| Older roles | 2 bullets (1 line each) |
| Education | 2–3 entries |
| Publications | 2–3 entries |
| Awards | 3 entries, single line each |
| References | "Available upon request." (single line) |

**Hard limit at the locale pack's page count (default 2). No exceptions.** If in doubt, cut rather than squeeze. Reducing spacing or margins to force-fit content makes the CV look cramped.

---

## Relevance-Weighted Cutting

### 2.2 Algorithm

When the CV exceeds 2 pages, content is cut by signal quality rather than mechanical section priority.

**For every candidate line, score three dimensions:**

1. **Relevance** — Does the line hit a named tool, keyword, or stated responsibility in the job posting?
2. **Uniqueness** — Is it the only place this claim appears, or is it duplicated elsewhere?
3. **Narrative Load** — Does the cover letter depend on it? If cutting would force a cover letter rewrite, it is load-bearing.

**Cut the lowest-total-score line first, regardless of section.**

### 2.3 Practical Cutting Order (Easiest to Last Resort)

1. **Redundancy** — Achievement appears in both Core Competencies AND a role bullet → cut the Core Competencies version
2. **Profile statement fluff** — Sentences that restate what other sections show
3. **Low-relevance experience bullets** — Bullets not touching posting keywords, from any role
4. **Low-relevance supporting content** — Older-role bullets, certifications, language entries that don't match the posting
5. **Low-relevance publications** — Keep 1–2 best-matching publications
6. **Last-resort structural cuts** — Oldest education, oldest role compression, certification collapse

### 2.4 Cutting Pitfalls

- Do NOT mechanically cut from the bottom of a static section list without checking relevance
- Do NOT cut the concrete example the cover letter depends on
- For borderline cases (2.02 pages), prefer `\enlargethispage` over content cuts

---

## Compile-and-Inspect Instructions

This step is **mandatory** — never skip it.

```bash
# Name the output file after the company
cp cv/main_example.tex cv/main_<company>.tex
# Edit cv/main_<company>.tex with the tailored content
cd cv
lualatex main_<company>.tex
# Open the PDF and inspect:
# - Exactly 2 pages
# - No orphaned section titles (title on one page, content on next)
# - Consistent font and spacing
# - No \vspace inside itemize blocks
```

If the PDF is more than 2 pages, apply Relevance-Weighted Cutting (see section above) before any geometry adjustments. Do not reduce margins as the first response to overflow.

---

## Section Order Variants

| Role Type | Section Order |
|-----------|--------------|
| **Technical** | Profile → Core Competencies → Experience → Technical Skills → Education → Publications → Awards |
| **Domain** | Profile → Core Competencies → Experience → Education → Domain Skills → Publications → Awards |
| **Consulting / Strategy** | Profile → Core Competencies → Experience → Education → Skills |
| **Leadership** | Profile → Core Competencies → Experience → Education → Skills (team metrics in role bullets) |
