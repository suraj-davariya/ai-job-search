# Development — Coding Standards & Conventions

> **Purpose:** Guidelines for writing clean, structured, and consistent code in the CareerForge repository.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Staff Engineer

---

## Coding Principles

1. **Clean-Room Isolation**: Do not copy code, classes, variables, or functions from any reference codebase. Write all features from scratch.
2. **Local-First Safety**: Do not store state or logs in external cloud databases. Write all user files into the gitignored directories (`settings/`, `cv/output/`).
3. **Robust Input Validation**: Ensure all inputs (CLI inputs, raw scraped HTML, parsed YAML documents) are validated before parsing or passing to LLMs.

---

## TypeScript Guidelines

- **Strict Types**: Enforce `"strict": true` in `tsconfig.json`. Avoid `any` types. Write clear interface structures.
- **Naming Conventions**:
  - Classes and Interfaces: PascalCase (e.g., `ReviewerAgent`, `IJobAdapter`).
  - Variables and Functions: camelCase (e.g., `compilePdf`, `profileState`).
  - Constants and Enums: UPPER_SNAKE_CASE (e.g., `MAX_REVISION_LOOPS`).
- **Async Code**: Use `async/await` syntax instead of raw promises or callbacks. Handle exceptions using `try/catch` blocks.
- **Imports**: Organize imports logically (external libraries first, then internal utilities). Use absolute workspace imports.

---

## Python Guidelines

- **Style Standard**: Adhere strictly to **PEP 8** style guidelines.
- **Formatting**: Format code using `black` or `ruff`.
- **Type Annotations**: Enforce type hinting on all function signatures:
  ```python
  def calculate_salary_percentile(company: str, role: str) -> float:
      pass
  ```
- **Virtual Environments**: Always run scripts via `uv run` or within active venvs.

---

## LaTeX Generation Standards

Because LaTeX uses special syntax characters, generating TeX source files from LLMs requires strict safety checks to prevent compilation errors.

### 1. Escaping Special Characters
Before injecting parsed user strings into LaTeX templates, sanitizers must escape the following characters:
- `&` → `\&`
- `%` → `\%`
- `_` → `\_`
- `#` → `\#`
- `$` → `\$`
- `{` → `\{`
- `}` → `\}`
- `~` → `\textasciitilde{}`
- `^` → `\textasciicircum{}`
- `\` → `\textbackslash{}`

### 2. Layout & Page Budget Constraints
- **CV Limit**: Keep within exactly 2 pages. The generation tool must truncate older experiences if the compiled length goes to page 3.
- **Letter Limit**: Must compile to exactly 1 page. Adjust margins or spacing if text goes beyond one page.
- **Font Pathing**: Refer to custom fonts using relative paths to `cover_letters/templates/OpenFonts/fonts/`.

---

## LLM Orchestration & Prompts

- **Prompt Externalization**: Never bake long instructions or templates inside JS files. Save system prompts as distinct markdown files in the profile manager (e.g. `03-writing-style.md`, `04-job-evaluation.md`) and read them at runtime.
- **Schema Validation**: Define prompt outputs as structured formats (e.g. JSON or Markdown edits). Parse and validate schemas using schemas definitions (e.g., JSON Schema or Zod).
- **Token Auditing**: Log input and output token counts for every API transaction. Halts or warn when a single session exceeds a threshold limit (e.g., 50k tokens).
