# ADR-0003: LaTeX for Document Generation

> **Status:** Accepted
> **Date:** 2026-06-05
> **Decision makers:** Architecture team

---

## Context

CareerForge generates professional CVs and cover letters. Options for document generation:
1. LaTeX → PDF (moderncv + custom class)
2. HTML/CSS → PDF (via Puppeteer or wkhtmltopdf)
3. Markdown → PDF (via Pandoc)
4. DOCX generation (via python-docx or similar)

## Decision

Use LaTeX with lualatex (CV) and xelatex (cover letter).

## Rationale

| Factor | LaTeX | HTML→PDF | Markdown→PDF | DOCX |
|--------|-------|----------|-------------|------|
| Typography quality | ✅ Professional | ⚠️ Good but not typographic | ❌ Limited | ⚠️ Variable |
| Page-break control | ✅ \needspace, \enlargethispage | ❌ Unpredictable | ❌ Unpredictable | ⚠️ Manual |
| Template ecosystem | ✅ moderncv, academic templates | ⚠️ Custom CSS needed | ❌ Limited | ⚠️ Template-dependent |
| Font control | ✅ fontspec (xelatex) | ✅ @font-face | ❌ | ⚠️ Embedded fonts |
| Human-editable source | ✅ Plain text | ✅ Plain text | ✅ Plain text | ❌ XML zip |
| Install complexity | ❌ Full TeX distribution | ⚠️ Browser engine | ✅ Pandoc | ✅ Python lib |
| Academic familiarity | ✅ Target audience knows LaTeX | ⚠️ | ✅ | ❌ |

**The decisive factors:**
1. **Typography:** LaTeX produces the best-looking documents. For a product focused on application quality, this matters.
2. **Page-break control:** LaTeX provides explicit tools (\needspace, \enlargethispage) for the compile-and-inspect loop. HTML/CSS page breaks are unpredictable.
3. **Target audience:** Technical professionals (the primary persona) are likely familiar with LaTeX.
4. **Existing ecosystem:** moderncv is a battle-tested CV template with extensive customization.

## Consequences

- **Positive:** Publication-quality output; precise page control; human-editable sources; academic credibility
- **Negative:** LaTeX installation is heavy (~1-4 GB); compilation is slower than HTML rendering; error messages are cryptic
- **Mitigations:** SETUP.md documents installation clearly; common errors documented in template files; compile-and-inspect loop handles issues iteratively

## Two Compilers
- **lualatex** for CVs: Handles fontawesome5 font-expansion correctly (pdflatex fails on modern MiKTeX)
- **xelatex** for cover letters: Required by the custom class for fontspec/custom font loading (Lato, Raleway)

## Revisited 2026-06-18 — ATS exports alongside the PDF (REQ-2063)

The LaTeX→PDF decision stands as the **primary, human-facing** output. It is now **augmented**, not replaced: the CV is *also* exported as plain-text (`.txt`) and `.docx` for applicant-tracking-system parsers, which can choke on typeset PDFs (see the "DOCX" column above — viable for machine parsing, just never for typographic quality). All three artifacts derive from the same tailored content (no divergent re-authoring). See REQ-2063/REQ-2064 and ADR-0007 (locale-aware fonts/scripts for non-Latin CVs).

## Revisited 2026-06-18 — multilingual typesetting (ADR-0007)

Non-Latin/RTL/Indic CVs require shaping-capable fonts in the LaTeX pipeline (`polyglossia`/`babel` + Noto family). Tracked under NFR-0019; the compiler choice is unaffected.
