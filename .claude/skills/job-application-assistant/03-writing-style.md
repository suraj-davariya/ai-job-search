<!-- Static framework — preserved through /reset; not modified by /setup. Path A may append observed patterns only if ≥2 cover letters exist (REQ-0011). -->

# Writing Style Guide

This file defines permanent rules that govern AI-generated CV and cover letter content. These rules apply on every application run and survive `/reset`.

---

## Critical Rules (Absolute Prohibitions)

| Rule | Example of Violation |
|------|---------------------|
| No em-dashes (`--`) | "My experience -- spanning..." → Use comma or period |
| No clichés/filler | "I am passionate about", "hit the ground running", "leverage my skills" |
| No generic buzzwords without backing | "Results-driven" without a specific result |
| No apologetic language | "I think I could contribute" → "I bring X, demonstrated by Y" |
| No unverified company claims | Must be independently verified via web search |
| No fabricated skills/experience | Every claim must match the profile |

---

## Tone Guidelines

Write in a warm but direct, conversational professional register. The tone is neither stiff and formal nor casual and breezy. It is the voice of someone who is confident in their abilities without arrogance, engaged with the work without breathlessness, and respectful of the reader's time without being terse.

---

## Application Headline Formula

Use this pattern for the email subject line when applying directly:

`[Role Title] — [Your Name] — [One distinguishing fact]`

The distinguishing fact should be the single most relevant signal for this specific posting: a matching domain, a concrete outcome, or a directly applicable tool or method. It should not be a generic descriptor. Keep the entire subject line under 80 characters where possible.

---

## Scannable Structure Guidelines

- Lead with the strongest point — do not save the most relevant claim for the end
- Use parallel sentence structures across all bullets in a section
- Avoid walls of text; if a paragraph runs more than four lines, break it into bullets
- Keep each bullet under two lines; if a bullet needs more, split the idea
- One idea per bullet — no compound statements

---

## Forward-Looking Framing Rules

The cover letter is not a CV repetition. It translates past experience into future relevance.

- Address the employer's needs, not just your history
- Frame experience as relevant to what they are trying to achieve, not simply what you have done
- Use "will bring" and "can contribute" framing alongside "have done" framing
- Avoid narrating your CV chronologically — select and reframe, do not retell

---

## Cover Letter Structure

- **Opening (1 sentence):** Grab attention with the most relevant hook — a specific achievement or a direct address of their stated need. Do not open with "I am writing to apply for..."
- **Body (3–4 bullets):** Evidence bullets. Each bullet should hit a specific requirement from the posting, grounded in a real outcome or responsibility.
- **Motivation (1 short paragraph):** Why this company, this role, this team — must be specific and independently verified. Generic enthusiasm is not sufficient.
- **Company-Specific (optional short paragraph):** Reference a specific product, challenge, initiative, or published information about the company. Verify via web search before including. Omit if no verified hook exists.
- **Closing (1 sentence):** Call to action — express interest in discussing further. No hollow platitudes ("I look forward to hearing from you" is acceptable; "I would be thrilled beyond words" is not).

---

## Bullet Point Style

- Start with a past-tense action verb (built, led, reduced, designed, automated, delivered, analysed, architected)
- Include a specific outcome where possible ("reduced deployment time by 40%", "served 2M monthly active users")
- Vary the opening verb — never repeat the same verb twice in sequence within a section
- One idea per bullet — no compound bullets joined with "and"
- If no quantified outcome is available, describe the scope or scale instead ("across a team of 12", "for a regulated financial data pipeline")

---

## Role-Type Language Variants

- **Technical roles:** Lead with tools, methods, and scale. Name the specific technologies. Anchor claims in systems, data volume, latency, or reliability metrics.
- **Domain roles:** Lead with domain knowledge and stakeholder impact. Demonstrate familiarity with the vocabulary and problems of the field.
- **Consulting/strategy:** Lead with problem framing and structured outputs. Describe what was ambiguous, how it was structured, and what the deliverable enabled.
- **Leadership:** Lead with team size, outcomes, and organisational change. Quantify scope and describe what improved as a result of the leadership.

---

## Multi-Language Rules

- Match the language of the job posting exactly
- When the posting is in language X, write the entire CV and cover letter in language X
- Do not mix languages within a document
- Technical terms may remain in English when no standard translation exists in the target language; do not invent awkward translations

---

## Interview Backtrack Test

For every claim in the CV or cover letter, apply this test:

> *"Could the candidate comfortably explain this in an interview without having to say 'well, what I actually meant was…'?"*

| Outcome | Action |
|---------|--------|
| Passes comfortably | Keep the claim |
| Falls in "flag it" zone | Present to user: "This is a stretch because X. Keep, soften, or drop?" |
| Fails | Rewrite or remove |

---

## Reframing Boundaries

| Acceptable | Flag It | Never |
|-----------|---------|-------|
| Reordering experience to lead with relevance | Combining academic + industry into a single claim implying all industry | Claiming experience the user doesn't have |
| Using natural synonyms for the target domain | Using the posting's specific terminology when actual work was adjacent | Implying work in a domain they haven't touched |
| Emphasising one aspect of a broad role | | |

---

## Tool Naming Rule

When generated CVs or cover letters reference the candidate's use of agentic coding tools or AI assistants, the **specific tool name** must appear — never a generic term.

**Default tool name: Claude Code.** When no override is configured in the candidate profile, use "Claude Code" in all generated documents.

The candidate profile may specify a different tool name via `[AI_TOOL_NAME]` in `01-candidate-profile.md`. When an override is present, use the configured name. Never use a generic term regardless of which tool is configured.

| Situation | Acceptable | Never |
|-----------|-----------|-------|
| Candidate uses Claude Code | "…using Claude Code for agentic coding workflows" | "…using an AI assistant", "…using AI coding tools" |
| Candidate uses Cursor | "…using Cursor for AI-assisted development" | "…using an AI IDE" |
| Multiple tools used | List each by name | "…using various AI tools" |

**Rationale:** Named tools are verifiable hiring signals; generic AI mentions are not (DEC-017).
