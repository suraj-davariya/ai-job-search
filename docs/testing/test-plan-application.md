# Testing — Test Plan: Application Pipeline

> **Purpose:** Test cases, boundary assertions, and failure scenarios for the `/apply` drafting and review pipeline.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** QA Lead

---

## 1. Feature Under Test: `/apply`

The `/apply` command performs job description parsing, compatibility scoring, LaTeX generation, local compilation, and Reviewer Agent iteration.

---

## 2. Test Cases

### Fit Evaluation Scoring
- **TC-APP-001**: Verify that if a candidate matches 0 required skills, the compatibility evaluator outputs a fit score of `0%` and classifies it as `Low Fit`.
- **TC-APP-002**: Verify that salary benchmarking calculations handle fuzzy string matches (e.g. matching "Senior Soft. Eng." in Excel with "Senior Software Engineer" in job description).

### LaTeX Generation & Escaping
- **TC-APP-003**: Verify that special LaTeX tokens (e.g. `Research & Development` or `100% test coverage`) are escaped to `Research \& Development` and `100\% test coverage` in the generated `.tex` files.
- **TC-APP-004**: Verify that if the LLM output adds unescaped brackets or braces, the generator catches the error and corrects it before saving.

### PDF Compile & Inspect Loop
- **TC-APP-005**: Verify that compiling with `lualatex` or `xelatex` outputs zero critical warnings and successfully generates a PDF file in `cv/output/`.
- **TC-APP-006**: Verify that if the compiled CV is 3 pages long, the content-cutting algorithm triggers, truncates bullet points, and successfully compiles a 2-page CV.
- **TC-APP-007**: Verify that if compilation fails due to a missing engine (e.g. `lualatex` not in PATH), the system catches the exit code, outputs the error log, and exit with code `1`.

### Reviewer Agent Loop (Structured Edits)
- **TC-APP-008**: Verify that the revision engine successfully processes Part A structured edits by applying exact substring matches and replacements to the `.tex` files.
- **TC-APP-009**: Verify that if a search substring in a Structured Edit does not exist in the document, the engine logs a warning and skips the edit without crashing.
- **TC-APP-010**: Verify that the review loop exits after a maximum of 2 iteration rounds to prevent infinite loops.

### Verification Checklist & Edge Cases
- **TC-APP-011**: Verify that passing an invalid or unreachable URL prints a clean fetch error and exits.
- **TC-APP-012**: Verify that running `/apply` with `--dry-run` outputs the LLM prompts and estimated token costs without writing output files.
