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

## 2. CLI Command UX Checklist

Use this checklist during manual runs in the terminal:

- [ ] **Interactive Responsiveness**:
  - The console interview options are readable and prompt navigation inputs cleanly.
  - Pressing `Ctrl+C` prints a cleanup message, saves progress in the temp file, and exits without stack traces.
- [ ] **Visual Logs & Console Indicators**:
  - Executed steps (0 through 6) print progress indicators with completion statuses.
  - Successful operations output green console strings; errors output red strings with next-step instructions.
- [ ] **Parameter Validation**:
  - Passing empty URLs, malformed paths, or invalid section arguments prints a help notice instead of crashing.

---

## 3. Fact-Checking & Hallucination Audit

This audit checklist must be run before submitting any generated application documents:

- [ ] **Cross-Profile Alignment**:
  - Compare generated bullets against the source data in `settings/profile.json`. Ensure dates, companies, and roles are 100% accurate.
- [ ] **Credential Integrity**:
  - Ensure the AI did not generate fake credentials (e.g. certifications, degrees) that are absent from the candidate's profile.
- [ ] **Metric Backtracking**:
  - Ensure any metric quoted in the cover letter (e.g., "reduced latency by 40%") exists as a fact in the behavioral profile (`02-behavioral-profile.md` or similar) or the main profile project data.
- [ ] **No System Prompt Artifacts**:
  - Verify that no instruction text (e.g., "As an AI, I have written this...") appears in the cover letter text.
