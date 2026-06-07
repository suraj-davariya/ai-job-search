# Cross-Cutting Concerns

> **Purpose:** Documents concerns that span multiple components: error handling, internationalization, logging, and extensibility.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Software Architect

---

## 1. Error Handling

### Graceful Degradation Hierarchy

| Severity | Behavior | Example |
|----------|----------|---------|
| **Fatal** | Stop workflow, report to user | Profile files not found during /apply |
| **Recoverable** | Retry or offer alternative | URL fetch fails → prompt for paste |
| **Skippable** | Skip step, continue workflow | Salary data missing → omit salary section |
| **Informational** | Log and continue | Empty document subfolder during /setup |

### Error Patterns by Component

| Component | Common Errors | Handling |
|-----------|---------------|----------|
| Profile Manager | Unsupported file format, empty folders | Skip with warning, offer alternatives |
| Search Engine | Portal unreachable, no results | Skip portal, report honestly |
| Application Pipeline | URL unreachable, compilation failure | Prompt for paste, fix-and-retry loop |
| Salary Tool | Data file missing, no match | Silent skip (optional feature) |
| Portal Adapters | Dependencies not installed, site blocking | Fall back to web search |

### LaTeX Compilation Error Recovery
```
1. First attempt: compile normally
2. If error: read log, identify issue
3. Fix common issues (unescaped characters, missing packages)
4. Retry compilation
5. If still failing: report specific error to user
```

---

## 2. Internationalization (i18n)

### Multi-Language Document Generation

| Document | Language Rule |
|----------|--------------|
| CV | Always English |
| Cover Letter | Matches job posting language |
| Profile Files | English (system files) |
| Upskill Reports | English |
| Interview Prep | English (framework); user can add native-language STAR examples |

### Localization Rules for Cover Letters
- **Date format:** Local convention (e.g., "5. juni 2026" for Danish, "June 5, 2026" for English)
- **Closing phrase:** Local convention (e.g., "Med venlig hilsen" for Danish, "Kind regards" for English)
- **Salutation:** Local convention
- **Content:** Written naturally in the target language, not translated from English

### Character Handling
- Full UTF-8 support throughout
- LaTeX files use `\usepackage[utf8]{inputenc}`
- Salary tool handles Nordic characters (ø, æ, å, ö, ä, ü) with anglicized equivalents for matching

---

## 3. Logging & Observability

### Audit Trail
CareerForge does not have traditional application logging. Instead, the audit trail is implicit:
- **Git history:** Shows profile evolution over time
- **Generated files:** Each application produces dated files
- **Tracker CSV:** Records application history
- **Upskill reports:** Track skill gap evolution
- **Seen jobs registry:** Records search history

### Verification Reporting
The verification checklist at the end of /apply serves as a per-application quality report:
- Each item reported as pass/fail
- Presented to the user for review
- Not persisted separately (visible in the AI assistant's conversation history)

---

## 4. Extensibility

### Adding a New Job Portal Adapter

```
1. Create directory: .agents/skills/<portal-name>/
2. Create SKILL.md with:
   - Skill name and description
   - CLI invocation pattern
   - Output format specification
3. Create cli/ directory with:
   - package.json (bun dependencies)
   - index.ts (search implementation)
4. Add search queries for the portal to search-queries.md
5. Run `bun install` in the cli/ directory
```

**No changes to existing code required.**

### Adding a New CV Template
```
1. Place new .tex template in cv/
2. Update 05-cv-templates.md with:
   - Template description and compile command
   - Section structure and customization rules
   - Page budget and layout verification rules
```

### Adding a New Profile Section
```
1. Create new .md file under .claude/skills/job-application-assistant/
2. Add the file to the SKILL.md orchestration rules
3. Update /setup to populate the new section
4. Update /reset to handle the new file
```

### Adding a New Command
```
1. Create new .md file under .claude/commands/
2. Define the workflow steps in the command file
3. Reference relevant skills
4. Update the main SKILL.md if the new command needs skill activation
```

---

## 5. Performance

### Token Economy
| Optimization | Saves |
|-------------|-------|
| Pre-filter search results by title/snippet | ~50% of page fetch tokens |
| Pass drafts inline to reviewer | File re-read tokens |
| Run verification once (not twice) | ~30% of verification tokens |
| Read existing profile before writing | Prevents re-processing unchanged content |

### Compilation Performance
- lualatex typically compiles in 3–5 seconds per run
- xelatex typically compiles in 2–4 seconds per run
- Fix loops add 5–10 seconds per iteration
- Expected total compilation time: 10–30 seconds per application

---

## Skill Frontmatter Schema (ARCH-0010)

Every `SKILL.md` file across both skill planes (ARCH-0008) carries mandatory YAML frontmatter at the top of the file:

```yaml
---
name: <kebab-case-skill-name>
description: <one-line summary; first sentence describes the skill purpose; trigger keywords are listed at the end of the line, including slash-prefixed entries like `/scrape`>
allowed-tools: <comma-separated tool list — Read, Edit, Bash, WebFetch, etc.>
---
```

**Field semantics:**

- `name` — Must match the directory name (`.claude/skills/<name>/SKILL.md`). Used by the runtime for explicit invocation (e.g., `Skill(<name>)` in `settings.local.json` permissions).
- `description` — First sentence is the human summary. The end of the line lists trigger phrases the runtime matches against user input. Slash-prefixed names like `/scrape` are valid trigger phrases.
- `allowed-tools` — The exhaustive list of tools this skill may invoke. Per NFR-0018, the runtime denies any tool call outside this list. Tools include: `Read`, `Edit`, `Write`, `Glob`, `Grep`, `Bash`, `WebFetch`, `WebSearch`, `Agent`, `AskUserQuestion`, `Skill(<other-skill-name>)`, plus any other names exposed by the runtime.

**Plane 1 vs. Plane 2 differences:**

- Plane 1 skills (Claude Code, `.claude/skills/<name>/SKILL.md`) — frontmatter is the only declaration; companion files (numbered `01-…`, `02-…`) are referenced in the body but do not have their own frontmatter.
- Plane 2 skills (sub-agent CLI, `.agents/skills/<name>/SKILL.md`) — frontmatter still mandatory; the skill also has a `cli/` subdirectory with `package.json` (Bun) and TypeScript source. The frontmatter `allowed-tools` covers the SKILL-level tools (e.g., `Bash` to invoke the CLI); per-tool permissions inside the CLI process are governed by the CLI's own configuration.

**Frontmatter validation** (where applicable):

- Missing `name` or `description` → skill is not loadable
- Missing `allowed-tools` → skill defaults to an empty list (effectively unusable); the loader should error rather than silently allowing all
- Unknown tools in `allowed-tools` → ignored with a warning
