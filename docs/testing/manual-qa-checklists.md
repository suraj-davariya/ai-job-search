# Testing — Manual QA Checklists

> **Purpose:** Hand-execution checklists for verifying visual document quality, CLI interactions, and fact-checking validations.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** QA Lead

---

## 1. Visual PDF Verification Checklist

Use this checklist after running `/apply` to inspect the generated PDF files:

- [ ] **Page Count Enforcement**:
  - The CV is exactly 2 pages (or 1 page if candidate is entry-level). No overflow lines appear on page 3.
  - The Cover Letter is exactly 1 page. No trailing signature elements appear on page 2.
- [ ] **Typography & Fonts**:
  - Latin characters load correctly. Custom fonts (Raleway, Lato) render without missing glyph warnings.
  - Headers (`moderncv` style) align nicely with dates.
- [ ] **Line Breaks & Offsets**:
  - Text does not overflow margins or overlap section icons.
  - No orphaned section titles (titles starting at the bottom of page 1 with content on page 2).

---

## 2. Command UX Checklist

These commands are prompt-as-code (ARCH-0001) — the assistant drives the
interaction inside Claude Code; there is no compiled TUI, colored console
output, or temp-file state. Use this checklist during manual runs:

- [ ] **Interactive Responsiveness**:
  - The interview questions are clear, conversational, and asked one topic at a time (REQ-0014), not dumped as a rigid form.
  - If a run is abandoned mid-way, re-running the command reads existing profile files first and resumes cleanly without duplicating already-captured content (idempotency — REQ-0002, business-rules §7.3).
- [ ] **Step Visibility**:
  - The assistant names each phase it is in (path selection, extraction, cross-reference, merge, convergence, summary) so the user can follow progress.
  - No file is written until the user confirms the proposed changes (REQ-0009).
- [ ] **Parameter Validation**:
  - Passing an empty URL, a malformed path, or an invalid `--section` value causes the assistant to explain the problem and list valid options, rather than guessing or fabricating (REQ-0001, ARCH-0007).

---

## 3. Fact-Checking & Hallucination Audit

This audit checklist must be run before submitting any generated application documents:

- [ ] **Cross-Profile Alignment**:
  - Compare generated bullets against the source data in the candidate profile files (`01-candidate-profile.md` and the user-fork `CLAUDE.md`). Ensure dates, companies, and roles are 100% accurate.
- [ ] **Credential Integrity**:
  - Ensure the AI did not generate fake credentials (e.g. certifications, degrees) that are absent from the candidate's profile.
- [ ] **Metric Backtracking**:
  - Ensure any metric quoted in the cover letter (e.g., "reduced latency by 40%") exists as a fact in the behavioral profile (`02-behavioral-profile.md` or similar) or the main profile project data.
- [ ] **No System Prompt Artifacts**:
  - Verify that no instruction text (e.g., "As an AI, I have written this...") appears in the cover letter text.
