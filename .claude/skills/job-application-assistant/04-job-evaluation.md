<!-- Framework static (preserved through /reset). Skill/experience areas + career goals = tokens populated by /setup, cleared by /reset. -->

# Job Evaluation Framework

## Scoring Dimensions

| Dimension | Weight | Scale | Description |
|-----------|--------|-------|-------------|
| Technical Skills Match | 30% | 0–100 | Alignment between required/preferred skills and user capabilities |
| Experience Match | 25% | 0–100 | Relevance of work history to the role |
| Behavioral/Culture Fit | 15% | 0–100 | Match between behavioral profile and role/company culture |
| Career Alignment | 30% | 0–100 | Whether the role advances career goals and contains energizing tasks |
| Location & Logistics | — | Pass/Fail | Commute feasibility; deal-breaker if relocation required |

Weight total: 100% (Location is Pass/Fail, not weighted).

## Score Interpretation

| Range | Technical Skills | Experience Match | Behavioral Fit | Career Alignment |
|-------|-----------------|------------------|----------------|------------------|
| 80–100 | Core requirements are primary skills | Direct experience in same domain/role | Culture strongly matches preferences | Strongly aligned, clear growth path |
| 60–79 | Most match, 1–2 learnable gaps | Related experience, transferable skills clear | Mixed but mostly compatible | Good but only partially aligned |
| 40–59 | Partial match, significant upskilling needed | Adjacent experience, must make the case | Some friction areas | Decent job, doesn't build toward goals |
| 0–39 | Fundamental mismatch | Unrelated experience | Significant culture mismatch | Dead end or backwards step |

## Verdict Thresholds

| Overall Score | Verdict | Action |
|---------------|---------|--------|
| 75+ | Strong Fit | Definitely apply, tailor everything |
| 60–74 | Good Fit | Apply, address gaps in cover letter |
| 45–59 | Moderate Fit | Consider carefully, discuss with user |
| 30–44 | Weak Fit | Probably skip unless strategic reasons |
| <30 | Poor Fit | Skip |

## Motivation Evaluation

<!-- Populated by /setup, cleared by /reset -->
Beyond skill match, evaluate whether the role's tasks will **energize** the user. This assessment feeds directly into the Career Alignment score.

**Tasks that energize:**
- [ENERGIZING_TASKS]

**Tasks that drain:**
- [DRAINING_TASKS]

Non-task factors to also evaluate: leadership style, department culture, company values, degree of autonomy.

## Location Filter Rules

| Zone | Action |
|------|--------|
| Within commute range | PASS |
| Remote with occasional office | PASS |
| Requires relocation | FAIL (deal-breaker) |
| Frequent international travel | FLAG (discuss with user) |

> **Override rule:** When Location & Logistics = FAIL, the Verdict is automatically **Poor Fit** regardless of the weighted score. Do not override this with a high score.

## Skill Match Areas

<!-- Populated by /setup — describes the candidate's self-assessed skill coverage -->
**Strong Match:**
- [STRONG_SKILLS]

**Moderate Match (1–2 learnable gaps):**
- [MODERATE_SKILLS]

**Weak Match (significant upskilling needed):**
- [WEAK_SKILLS]

## Experience Match Areas

<!-- Populated by /setup -->
**Strong Experience:**
- [STRONG_EXPERIENCE]

**Moderate Experience (transferable skills apply):**
- [MODERATE_EXPERIENCE]

**Entry-Level / Adjacent Experience:**
- [ENTRY_EXPERIENCE]

## Career Goals

<!-- Populated by /setup -->
- [CAREER_GOALS]

## Salary Benchmark Integration

> When evaluating a role, invoke `salary_lookup.py` to check the salary range against the candidate's expectations. Usage: `python3 salary_lookup.py "<Role Title>" "<Location>"`. This tool is wired in Epic 7; if salary data is unavailable, note "Salary data not available" in the evaluation and proceed.

## Output Format

```
## Fit Evaluation: [Company] — [Role Title]

| Dimension | Score | Weight | Notes |
|-----------|-------|--------|-------|
| Technical Skills Match | /100 | 30% | |
| Experience Match | /100 | 25% | |
| Behavioral/Culture Fit | /100 | 15% | |
| Career Alignment | /100 | 30% | |
| Location & Logistics | PASS/FAIL | — | |
| Salary Benchmark | [range / "Not available"] | — | vs. candidate expectation |

**Weighted Total:** /100
*(If Location = FAIL → Verdict = Poor Fit, skip weighted calculation)*
**Verdict:** [Strong Fit / Good Fit / Moderate Fit / Weak Fit / Poor Fit]

**Recommendation:** [one sentence]
**Proceed to draft?** [Yes / No / Discuss with user]
```

## Pre-Application Call Guidance

- Call before applying when: the posting is vague about scope, you have a specific question about the team/tech, or the fit is Moderate and a conversation could clarify
- Never call just to "check if they received your application"
- Keep calls to 5 minutes: introduce yourself, state you're applying, ask one specific question
- Note the call outcome in the tracker CSV
