# Testing — Test Plan: Career Advisor & Prep

> **Purpose:** Test cases and validation scenarios for competency expansion, skill gap analysis, and interactive STAR interview simulations.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** QA Lead

---

## 1. Features Under Test: `/expand` & `/upskill`

These commands read profile details, execute web resources lookups, identify career gaps, and validate simulated interview responses.

---

## 2. Test Cases

### Competency Expansion (`/expand`)
- **TC-CAR-001**: Verify that `/expand` with a GitHub username correctly extracts repo list technologies and appends new skills to `settings/profile.json`.
- **TC-CAR-002**: Verify that all newly added skills contain a `source` tag referencing the URL or repository source.
- **TC-CAR-003**: Verify that existing manually-entered experiences are never deleted or modified during expansion.

### Skill Gap Analysis (`/upskill`)
- **TC-CAR-004**: Verify that Targeted Mode (running `/upskill --url <URL>`) evaluates the candidate profile against that specific job, generating a target markdown report at `upskill/reports/gap_report.md`.
- **TC-CAR-005**: Verify that Aggregate Mode (running `/upskill` with no URL) pulls all jobs listed in `tracker.csv` to calculate aggregate gaps.
- **TC-CAR-006**: Verify that the web search lookup for resources identifies valid tutorial URLs (e.g. docs.docker.com, learn.hashicorp.com) and excludes dead links.
- **TC-CAR-007**: Verify that the generated gap report includes a visual markdown-rendered skill heatmap.

### STAR Interview Preparation
- **TC-CAR-008**: Verify that the interview prep module generates exactly 5 questions matching the requirements of the targeted job role.
- **TC-CAR-009**: Verify that if a candidate's response lacks quantifiable results (no metrics or stats), the validator flags a "Missing Result" warning and prompts for metrics.
- **TC-CAR-010**: Verify that using "we" instead of "I" in answers triggers a warning highlighting the need for personal action statements.
- **TC-CAR-011**: Verify that ending the session outputs a styled interview feedback report summarizing strengths and gaps.
