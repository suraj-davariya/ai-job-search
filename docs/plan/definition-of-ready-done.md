# Plan — Definition of Ready & Done

> **Purpose:** Establishes standardized gates, checklists, and criteria for starting (Ready) and completing (Done) work on CareerForge.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Technical Program Manager

---

## Definition of Ready (DoR)

A task is considered **Ready** to be assigned to a developer or handed to an AI assistant if it meets the following criteria:

- [ ] **Traceability**: The task is linked to at least one valid requirement ID (`REQ-####`) or architecture ID (`ARCH-####`).
- [ ] **Clear Scope**: The description specifies what inputs the command/component takes and what output or side-effects are expected.
- [ ] **Dependencies Met**: All predecessor tasks marked in the [Work Breakdown Structure](work-breakdown-structure.md) are completed.
- [ ] **Data Model Alignment**: Any state changes or file reads match the specifications in [Data Architecture](../architecture/data-architecture.md).
- [ ] **Prompt Guidelines Available**: If the task involves LLM calls, the prompt requirements (e.g. constraints, system prompt guidelines) are documented.

---

## Definition of Done (DoD)

A task or feature is considered **Done** and ready for merge into the main codebase when it satisfies all of the following:

### 1. Code Quality & Standards
- [ ] Code is fully functional and matches the component design specifications.
- [ ] Coding styles conform to the project guidelines (TypeScript/Node and Python standard linters pass without warnings).
- [ ] No hardcoded api keys, personal data, or hard paths are included. All credentials use environment variables or settings files.

### 2. Testing & Verification
- [ ] All unit tests pass successfully.
- [ ] Test coverage meets or exceeds the targets outlined in the [Test Strategy](../testing/test-strategy.md) (typically 80%+ coverage for core logic).
- [ ] Manual test checklist passes (e.g. validating console error outputs on invalid commands, verify LaTeX compilation outputs are readable).

### 3. Documentation
- [ ] The CLI help text or command documentation is updated.
- [ ] README.md or relevant implementation guides are amended if new parameters or dependencies are introduced.
- [ ] Inline code comments explain non-obvious logic, especially LLM prompt-handling choices.

---

## Milestone Exit Gates

Before declaring a milestone complete, the release must pass its designated exit gate.

### Milestone 1: MVP Exit Gate
1. User can run `/setup` and successfully build a merged profile from at least 3 source documents.
2. User can run `/apply <URL>` and generate a matched CV and cover letter.
3. Both PDFs compile locally without formatting errors or layout breaks.
4. Factual validation loop catches and logs any mismatch in dates or company names.

### Milestone 2: v1.0 Exit Gate
1. Reviewer Agent successfully edits drafts using Structured Edit syntax.
2. `/search` discovers new jobs, filters seen ones, and stores matching records in `job_search_tracker.csv`.
3. Fuzzy salary benchmarking successfully pulls match values and includes them in evaluation logs.
4. The repository includes automated check scripts verifying file paths and blocking PII.

### Milestone 3: v1.1 Exit Gate
1. Profile manager correctly merges new competencies from `/expand` source inputs.
2. `/upskill` generates a styled markdown report mapping candidate gaps to resources fetched from live searches.

### Milestone 4: v1.2 Exit Gate
1. Active roles simulate interview questions with STAR answers in a console interactive shell.
2. Decoupled adapter classes function, demonstrating clean modular integration.
3. Clean-room verification checks pass completely with no reference to the reference codebase.
