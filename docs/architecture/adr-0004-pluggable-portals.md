# ADR-0004: Pluggable Job Portal Adapters

> **Status:** Accepted
> **Date:** 2026-06-05
> **Decision makers:** Architecture team

---

## Context

Job postings live on different platforms (Indeed, LinkedIn, Glassdoor, country-specific boards). CareerForge needs to search across them. Options:
1. Hard-coded integrations in core framework
2. Pluggable adapter pattern (each portal is a separate CLI tool)
3. Web search only (no site-specific integrations)

## Decision

Use a pluggable adapter pattern where each job portal is a self-contained CLI tool, with web search as the universal fallback.

## Rationale

| Factor | Hard-Coded | Pluggable Adapters | Web Search Only |
|--------|-----------|-------------------|----------------|
| Adding new portals | ❌ Core code change | ✅ Drop-in directory | N/A |
| Maintenance burden | ❌ All in one codebase | ✅ Per-adapter | ✅ None |
| Market flexibility | ❌ Fixed markets | ✅ Any market | ✅ Any market |
| Result quality | ✅ Structured parsing | ✅ Structured parsing | ⚠️ Unstructured |
| Setup complexity | ✅ One install | ⚠️ Per-adapter install | ✅ Zero |
| Community contribution | ❌ PR to core | ✅ Separate repos | N/A |

**The decisive factor:** Job markets vary by country. A Danish user needs Jobindex; a US user needs Indeed. Hard-coding any set of portals limits the product's reach. The adapter pattern lets each market build its own integrations without affecting the core.

## Adapter Interface Contract

Each adapter must:
```
Directory: .agents/skills/<portal-name>/
├── SKILL.md              # Skill definition with trigger keywords
├── cli/
│   ├── package.json      # Dependencies
│   └── index.ts          # CLI entry point
└── url-reference.md      # Optional: URL patterns for the portal
```

**CLI contract:**
- Input: search parameters (keywords, location, date range)
- Output: structured results (title, company, location, URL, date, description snippet)
- Runtime: Bun (TypeScript)
- Exit code: 0 (success), 1 (error)

## Consequences

- **Positive:** Infinite market flexibility; community can contribute; core framework stays clean
- **Negative:** Each adapter requires separate installation (`bun install`); different adapters may have different result quality
- **Fallback:** Web search (`site:<portal>`) always works without adapters, just with less structured results
