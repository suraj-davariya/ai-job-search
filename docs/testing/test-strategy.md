# Testing — Test Strategy

> **Purpose:** Outlines the testing strategy, tool choices, test pyramid, and code coverage targets for CareerForge.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** QA Lead

---

## Quality Philosophy

CareerForge is a local-first, command-line tool. Quality is defined by **factual correctness**, **formatting integrity**, and **robust error isolation**. 
- Systems must fail gracefully: a broken external API must not corrupt the local profile or generate broken LaTeX documents.
- Security boundaries are absolute: personal credentials and data must never cross out of bounds.

---

## Test Pyramid

```
   / \
  /   \      E2E CLI Orchestration Tests (~10%)
 /=====\
/   I   \    Integration (File I/O, LaTeX Compiling, LLM mocks) (~30%)
/=======\
/  U  N  I  T  \  Unit (Sanitizers, Fuzzy matcher, Data parsers) (~60%)
/---------------\
```

### 1. Unit Tests
- **Focus**: Pure functions, data parsing, string escaping, and fuzzy matching.
- **Rules**: Must not execute network requests or call external LaTeX binaries. Run instantly (under 100ms per test).
- **Target Code**: `tools/latex_compiler.ts` (escaping regexes), `salary_lookup.py` (percentile match math, at repo root), and `tools/agent/revision_engine.ts` (Part A string substitutions).

### 2. Integration Tests
- **Focus**: Component communication, mock LLM client interactions, file system state transitions, and compilation subprocess calls.
- **Mocks**: Outbound LLM API calls are intercepted using mock fixtures.
- **Target Code**: `/apply` steps, `/setup` path parsing, and `/search` deduplication checks.

### 3. End-to-End (E2E) Tests
- **Focus**: Executing the complete CLI command chain from end to end using predefined sandbox workspaces.
- **Execution**: Run via CLI runner in a isolated workspace, verifying files generated, exit codes, and output prints.

---

## Tooling Stack

- **TypeScript Testing**: **Jest** or **Vitest** for running unit and integration suites.
- **Python Testing**: **pytest** for validating benchmarking modules.
- **Mocking**: Mock LLM payloads are stored in JSON file fixtures, enabling deterministic validation of prompt reactions.
- **LaTeX Compilation Tests**: Run small-scale compiling scripts using `xelatex` and `lualatex` during integration runs to check font path resolutions.

---

## Coverage Targets

| Layer | Coverage Target | Critical Files |
|---|---|---|
| **Core Utilities** | 90% | LaTeX Escaper, File Merger, State Hashing |
| **CLI Command Routing** | 70% | `setup.ts`, `apply.ts`, `search.ts` |
| **Adapters & Agents** | 80% | `revision_engine.ts`, `generic_scraper.ts` |
| **Overall Project** | **80% Minimum** | All source files |
