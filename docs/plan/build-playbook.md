# Plan — Build Playbook

> **Purpose:** Provides instructions on how to use AI coding assistants to build CareerForge task-by-task.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Engineering Lead / Technical Program Manager

---

## AI Prompting Strategy

When building CareerForge with an AI coding assistant (such as Claude Code or another LLM session), follow a **context-driven, modular approach**. Do not ask the assistant to write the entire application at once. Instead, prompt it for individual tasks or single-component features.

### Guidelines for Effective Prompts
1. **Provide Clear Context Boundaries**: For every prompt, link to the relevant files in the workspace (e.g. `docs/requirements/functional-requirements-onboarding.md`, `docs/architecture/component-design.md`).
2. **Explicitly Reference IDs**: Use `REQ-####` and `ARCH-####` IDs in your prompts to maintain traceability.
3. **Use the Clean-Room Rule**: Remind the assistant that it is writing clean, original code for **CareerForge** and must not use branding, patterns, or proprietary copy from the reference codebase.
4. **Assert Inputs & Outputs**: Clearly state the input arguments (e.g. command arguments, JSON structures) and expected output side-effects (e.g. specific files written, exit codes).

---

## Playbook by Milestone

### Phase 1: MVP Scaffolding & Setup

#### Prompt Template for T-001 (Structure & Init)
> You are starting implementation on **CareerForge**, a CLI-based career materials generator. Initialize the folder structure described in [repository-setup.md](file:///Volumes/home/Code/Workspace/ai-job-search/docs/plan/repository-setup.md).
> Create the empty folders, place a `.gitkeep` file in each, and generate the baseline `.gitignore` following the guidelines in [security-architecture.md](file:///Volumes/home/Code/Workspace/ai-job-search/docs/architecture/security-architecture.md) to ensure personal documents, profiles, and compiled PDFs are never committed.
> Output: Create directory structure, `.gitkeep` files, and `.gitignore`.

#### Prompt Template for T-030 (Setup Command Structure)
> Implement the entry point for the `/setup` CLI command following the requirements in [functional-requirements-onboarding.md](file:///Volumes/home/Code/Workspace/ai-job-search/docs/requirements/functional-requirements-onboarding.md).
> Ensure the CLI supports the options `--path` (A: scanning, B: resume, C: interview) and `--section` (allowing re-running of specific profile sections).
> Parse arguments, set up error boundaries, and create placeholder routes for each path. Log actions clearly to console.

---

### Phase 2: Resume & Letter Generation

#### Prompt Template for T-042 & T-043 (LaTeX Draft Generation)
> Implement the document drafting engine for `/apply` as specified in [component-design.md](file:///Volumes/home/Code/Workspace/ai-job-search/docs/architecture/component-design.md).
> The system must read the candidate profile from `settings/profile.json` and generate:
> 1. A CV LaTeX source based on `cv/templates/main_example.tex`.
> 2. A Cover Letter LaTeX source using the class `cover.cls`.
>
> **Constraints**:
> - Enforce writing style rules from [business-rules-and-validation.md](file:///Volumes/home/Code/Workspace/ai-job-search/docs/requirements/business-rules-and-validation.md) (no clichés, no em-dashes, active verbs).
> - Apply the content-cutting algorithm if the estimated length exceeds the page budget (2 pages for CV, 1 page for Cover Letter).
> Write the code, outputting files to the correct directories.

---

### Phase 3: Reviewer Agent & Loop

#### Prompt Template for T-050 & T-053 (Reviewer Loop)
> Implement the Drafter-Reviewer iteration loop for `/apply` as described in [adr-0002-drafter-reviewer.md](file:///Volumes/home/Code/Workspace/ai-job-search/docs/architecture/adr-0002-drafter-reviewer.md).
> Hook up the Reviewer Agent to:
> 1. Research the company or parsed job details.
> 2. Evaluate the generated CV & letter draft against the job requirements.
> 3. Generate a revision advice file containing a JSON array of `StructuredEdits` (Part A: exact match and replacement) and narrative feedback (Part B).
> 4. Run the Revision Engine to apply edits to the LaTeX source and trigger a re-compile.
> Implement this loop, capping runs at a maximum of 2 iterations.

---

## Common AI Assistant Pitfalls & Workarounds

| Observed Pitfall | Workaround in Prompts |
|---|---|
| AI references or copies names from the reference codebase. | Add a system boundary note: *"Do not look at or reference any folder outside `docs/` and the target files you are editing. Do not reuse any branding, variable names, or scripts unless specifically instructed."* |
| AI skips writing complex algorithms (e.g., content-cutting, merge conflict logic). | Require the assistant to think step-by-step: *"Explain the logic for length estimation and section priority scoring before writing the code. Do not use placeholders or generic TODOs; write full implementation details."* |
| AI introduces random dependencies (npm/pip packages). | Restrict package additions: *"Only use standard library packages and packages defined in our tech stack in [technology-stack.md](file:///Volumes/home/Code/Workspace/ai-job-search/docs/architecture/technology-stack.md). If you must add a package, declare it and explain the trade-off first."* |
