# ADR-0002: Drafter-Reviewer Agent Pipeline

> **Status:** Accepted
> **Date:** 2026-06-05
> **Decision makers:** Architecture team

---

## Context

Application materials (CV + cover letter) need to be reviewed for quality before presentation to the user. Options considered:
1. Single-pass generation with self-review
2. Single-pass generation with checklist only
3. Two-agent pipeline: drafter generates, reviewer critiques, drafter revises

## Decision

Use a two-agent pipeline where the reviewer operates with a fresh, isolated context.

## Rationale

| Factor | Single Pass + Self-Review | Single Pass + Checklist | Two-Agent Pipeline |
|--------|--------------------------|------------------------|-------------------|
| Confirmation bias | ❌ High (reviews own work) | ❌ Only checks format | ✅ Fresh perspective |
| Content critique quality | ⚠️ Moderate | ❌ No content critique | ✅ High |
| Token cost | ✅ Low | ✅ Low | ❌ Higher (~2x for review step) |
| Missed keywords | ⚠️ Often missed | ⚠️ Often missed | ✅ Reviewer catches |
| Company-specific angles | ⚠️ Often generic | ❌ Not checked | ✅ Reviewer researches independently |
| Tone/voice check | ⚠️ Self-assessed | ❌ Not checked | ✅ Cross-checked against behavioral profile |

**The decisive factor:** A fresh context catches problems that a single-pass generator is blind to. The token cost increase (~20-30% per application) is justified by material improvement in output quality.

## Consequences

- **Positive:** Materially better applications; missed keywords caught; company angles discovered; tone issues detected
- **Negative:** Higher token consumption; longer generation time; more complex workflow
- **Mitigations:** Token cost reduced by passing drafts inline (no file re-reads); reviewer reads only 4 of 7 profile files (sufficient for critique)

## Reviewer Constraints (Architecture-Level)
- **Fresh context only** — No access to drafter's working memory
- **Content critique only** — Does not verify LaTeX structure or run compilation
- **Structured output** — Part A (machine-applicable edits) + Part B (narrative suggestions)
- **Grounded in profile** — Cannot suggest fabrication
