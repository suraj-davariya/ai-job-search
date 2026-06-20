<!-- Static framework — not modified by /setup or /reset. Cover letter compiles with xelatex (ARCH-0003). -->

# Cover Letter Templates

Static framework guide for generating tailored cover letters using the CareerForge LaTeX class. Not modified by `/setup` or `/reset`.

---

## Template Definition

The cover letter system uses two files:

- **`cover_letters/cfcl.cls`** — the custom CareerForge cover letter LaTeX class. Defines all macros, colours, fonts, spacing, and page geometry. Visually paired with the CV class (`cfcv.cls`): same DodgerBlue accent (`#4F83FF`), Lato body font, and 1.2 cm margins.
- **`cover_letters/main_example.tex`** — the working template document. Contains the full document structure with `{{TOKEN}}` placeholder comments that the AI fills per application.

**Compiler: xelatex** (ARCH-0003). Do not use lualatex or pdflatex — the class uses `fontspec` with TTF fonts, which requires xelatex.

**Bundled fonts** are at `cover_letters/OpenFonts/fonts/`:

| Font | Path | Use |
|------|------|-----|
| Lato (Regular, Bold, Italic, BoldItalic) | `Lato/` | Body and header text |
| Raleway | `Raleway/` | Optional display use |
| FontAwesome 6 Free Solid | `FontAwesome6Free/fa-solid-900.ttf` | Icons (email, phone, location, globe) |
| FontAwesome 6 Free Brands | `FontAwesome6Free/fa-brands-400.ttf` | Icons (LinkedIn, GitHub) |

The font `Path=` directives in `cfcl.cls` are relative to the xelatex working directory. **The working directory must be `cover_letters/`** or font resolution fails silently with substituted glyphs.

---

## Locale Adaptation (Locale Packs)

The cover letter adapts to the **target market** via the active locale pack
(`locale-packs/<code>.json`, REQ-7010, ADR-0007), separately from its language:

- **Language:** the cover letter is written in the posting's language (existing rule,
  NFR-0006). Language and locale are independent.
- **`pageSize`:** A4 vs Letter — match the CV's paper size for the target market.
- **`dateFormat`:** format the letter date per the pack (e.g. `MM.yyyy` DE, `yyyy/MM` JP).
- **`legalClauses`:** if the pack lists `gdpr-consent` (EU markets), include a short
  data-processing consent line at the foot.
- Fall back to `locale-packs/default.json` when no market-specific pack applies
  (ARCH-0005). Never fabricate locale-required content (ARCH-0007).

---

## Compile Instructions

Always compile from the `cover_letters/` directory. Font paths in `cfcl.cls` resolve relative to the working directory — compiling from any other location breaks font loading.

```bash
# Copy the template and name it after the company and role (data-req §15)
cp cover_letters/main_example.tex cover_letters/cover_<company>_<role>.tex

# Edit the copy with tailored content
# (fill in recipient, role, paragraphs, salutation, date)

# Compile from the cover_letters/ directory
cd cover_letters
xelatex cover_<company>_<role>.tex
# Output: cover_<company>_<role>.pdf
```

**Generated files are gitignored** — they are personal application output and must never be committed.

**Known pitfall — itemize/fontspec interaction:** Bullets inside `\begin{itemize}` must use the same font as the body text. The class configures this correctly via `fontspec`. Do not override `\item` with a different font command (e.g., do not wrap bullet content in `\texttt{}` or another `\fontspec` call). Doing so breaks the font cascade and produces a compile error or garbled output.

---

## Document Structure

The full skeleton pulled from `cover_letters/main_example.tex`:

```latex
\documentclass{cfcl}

\begin{document}

% ── Header ────────────────────────────────────────────────────────────────────
\clname{Jane Smith}                                           % {{CANDIDATE_NAME}}
\smallskip
\cltagline{Machine Learning Engineer · Python Developer}      % {{TAGLINE}}
\smallskip
\primarycontact{%
  \citem{\faEnvelope}{\href{mailto:jane.smith@email.com}{jane.smith@email.com}}\quad
  \citem{\faPhone}{+1 (415) 555-0198}\quad
  \citem{\faLinkedinIn}{\href{https://linkedin.com/in/janesmith}{linkedin.com/in/janesmith}}
}
\smallskip
\secondarycontact{%
  \citem{\faLocationDot}{San Francisco, CA}\quad
  \citem{\faGithub}{\href{https://github.com/janesmith}{github.com/janesmith}}\quad
  \citem{\faGlobe}{\href{https://janesmith.dev}{janesmith.dev}}
}
\clheadrule

% ── Recipient + Date ──────────────────────────────────────────────────────────
\recipient{Company Name}{Street Address}{City, State ZIP, Country}  % {{RECIPIENT_*}}
\letterdate{June 7, 2026}                                           % {{DATE}}

% ── Subject line ──────────────────────────────────────────────────────────────
\clsection{Re: Role Title}                                          % {{ROLE_TITLE}}

% ── Opening ───────────────────────────────────────────────────────────────────
\opening{Dear Hiring Manager,}                                      % {{SALUTATION}}

% Paragraph 1: Who you are + why you are applying.                 % {{INTRO_PARA}}
...

% Paragraph 2: Concrete evidence of skills matching the job.       % {{BODY_PARA_1}}
...

% Paragraph 3: Company-specific hook showing genuine research.     % {{BODY_PARA_2}}
...

% ── Closing ───────────────────────────────────────────────────────────────────
\closing{%
  I look forward to discussing how my experience can support [Company]'s mission.
  Thank you for your time and consideration.%                       % {{CLOSING}}
}{Jane Smith}                                                       % {{CANDIDATE_NAME}}

\vfill
\noindent\textcolor{accent}{\rule{\linewidth}{1.2pt}}

\end{document}
```

The footer rule (`\vfill\noindent\textcolor{accent}{\rule{\linewidth}{1.2pt}}`) is placed in the document, not the class, so the author controls exact placement. It pushes a DodgerBlue rule to the page bottom, matching the header rule visually.

---

## Key Commands Reference

All commands are defined in `cover_letters/cfcl.cls`.

| Command | Signature | Purpose |
|---------|-----------|---------|
| `\clname` | `\clname{Full Name}` | Large bold uppercase name in header |
| `\cltagline` | `\cltagline{Tagline text}` | Accent-coloured role/tagline below name |
| `\primarycontact` | `\primarycontact{...}` | Centred bold row: email, phone, LinkedIn |
| `\secondarycontact` | `\secondarycontact{...}` | Centred bold row: location, GitHub, portfolio |
| `\citem` | `\citem{\faIcon}{text}` | Accent-coloured icon followed by small text |
| `\clheadrule` | `\clheadrule` | 1.2 pt DodgerBlue rule below header |
| `\recipient` | `\recipient{Company}{Street}{City, ZIP, Country}` | Right-aligned recipient block |
| `\letterdate` | `\letterdate{Month DD, YYYY}` | Light-grey date line |
| `\clsection` | `\clsection{Re: Role Title}` | Uppercase bold section header with rule |
| `\opening` | `\opening{Dear Name,}` | Salutation paragraph |
| `\closing` | `\closing{Sign-off sentence.}{Candidate Name}` | Closing paragraph + bold name signature |
| `\faEnvelope` | — | Email icon (FontAwesome Solid) |
| `\faPhone` | — | Phone icon (FontAwesome Solid) |
| `\faLocationDot` | — | Location icon (FontAwesome Solid) |
| `\faGlobe` | — | Globe icon (FontAwesome Solid) |
| `\faLinkedinIn` | — | LinkedIn icon (FontAwesome Brands) |
| `\faGithub` | — | GitHub icon (FontAwesome Brands) |

To add a new icon: find the codepoint at fontawesome.com, determine whether it is in `fa-solid-900.ttf` (use `\FAsolid`) or `fa-brands-400.ttf` (use `\FAbrands`), then add `\newcommand{\faIconName}{{\FAsolid\char"XXXX}}` to `cfcl.cls`.

---

## Tailoring Guidelines

### Salutation
Search for the hiring manager's name before writing "Dear Hiring Manager". Check the job posting, the company's LinkedIn page, and the team page. Use the name if found and verified. Fall back to "Dear Hiring Manager" if no name is findable. Never write "To Whom It May Concern".

### Length
1 page, 250–300 words of body text. 300 is the hard ceiling; 350 words will overflow the page. Count only prose words — LaTeX commands and markup do not count.

### Bullets
Use 2–4 bullets in the body, each directly addressing a specific requirement from the job posting. No generic bullets that could apply to any role. Each bullet should name a concrete outcome or tool.

### Language matching
Write the letter in the same language as the job posting. Apply the same terminology the posting uses for tools, methodologies, and role type. Do not translate posting-specific jargon into synonyms.

### Company-specific content
At least one sentence must reference something specific and independently verified about the company — a product, a known challenge, a published initiative, a team approach. Never fabricate or assume. If nothing specific can be verified, flag it to the user before submitting.

---

## Length Constraints

From business-rules §3.1:

The cover letter must compile to exactly 1 page, including the signature block. No exceptions.

- **Word budget:** 250–300 words of body text (not counting LaTeX markup)
- **350 words will overflow** — treat 300 as the hard ceiling
- **Block count:** Opening + bullet list + closing = 3 blocks. Add a 4th block only if the other three are short.
- When adding company-specific content, trim other content to compensate rather than adding net length

---

## Cutting Rules

From business-rules §3.2, applied in order:

1. First cut: sentences that restate what a bullet already says
2. Second cut: a bullet that does not hit posting keywords
3. Last resort: a bullet that does hit posting keywords
4. **Never** reduce geometry or line spacing to fit

---

## Finalization Checklist

Tick all items before presenting output to the user:

- [ ] Exactly 1 page (compile with xelatex and inspect PDF)
- [ ] Signature block visible and not cut off
- [ ] Bullet font matches body font (no fontspec override inside itemize)
- [ ] Salutation addressed to the correct name (or "Dear Hiring Manager")
- [ ] Body word count is 250–300 words
- [ ] At least one company-specific verified claim
- [ ] No em-dashes in prose (see `03-writing-style.md`)
- [ ] No clichés or filler phrases

---

## Submission Guidelines

- **File naming:** `[YourName]_CoverLetter_[Company].pdf`
- **Always submit as PDF** — never submit the `.tex` source file
- If the posting specifies a file name format, use it exactly and override the default naming above
- For applications where a cover letter is marked "optional" — include it; a tailored cover letter is a meaningful differentiator and takes less than 5 minutes to generate once the profile is set up
