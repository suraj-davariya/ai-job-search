# ADR-0001: File-Based Data Storage Over Database

> **Status:** Accepted
> **Date:** 2026-06-05
> **Decision makers:** Architecture team

---

## Context

CareerForge needs persistent storage for user profiles, application tracking, search history, and salary data. The two main options are a file-based model (Markdown/JSON/CSV) or a lightweight database (SQLite).

## Decision

Use file-based storage exclusively. All persistent data is stored as human-readable text files in the repository directory.

## Rationale

| Factor | File-Based | Database |
|--------|-----------|----------|
| Transparency | ✅ Users can read/edit all data directly | ❌ Requires query tools |
| Version control | ✅ Clean git diffs, natural history | ⚠️ Binary blobs don't diff well |
| Portability | ✅ Copy the directory and go | ⚠️ Need SQLite tooling |
| Manual editing | ✅ Any text editor | ❌ Need SQL or GUI |
| Query efficiency | ❌ Linear scan | ✅ Indexed queries |
| Data volume | ✅ Small (< 1000 records max) | ✅ Handles any volume |
| Concurrency | N/A (single user, single writer) | ✅ ACID transactions |
| Schema enforcement | ❌ Convention-based | ✅ DDL-enforced |

**The decisive factors:**
1. Data volumes are tiny (< 100 profile entries, < 500 tracked jobs, < 50 salary entries)
2. Users benefit from being able to read and edit their data directly
3. Git versioning of profile evolution is valuable for the fork-and-customize model

## Consequences

- **Positive:** Zero setup, zero dependencies, fully portable, human-auditable
- **Negative:** No schema enforcement (conventions must be documented), no indexing (acceptable at these volumes), no multi-file transactions (mitigated by single-writer guarantee)
- **Risk:** If data volumes ever grow significantly (unlikely), migration to SQLite would require a one-time conversion script
