# Functional Requirements — Salary Benchmarking

> **Purpose:** Specifies the requirements for CareerForge's optional salary benchmarking subsystem.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## Overview

Salary benchmarking is an optional feature that lets users compare target companies' compensation against a baseline from their own data. It integrates with the fit evaluation during the application pipeline.

Related documents:
- [Functional Requirements — Application](functional-requirements-application.md) — Where salary data is consumed (REQ-2011)
- [Data Requirements](data-requirements.md) — Salary data schema

---

### REQ-4001: BYO Data Model
**Priority:** Must
**Description:** The salary system shall work with any salary data the user provides, without requiring a specific external data source.
**Acceptance Criteria:**
- Supports index-based data (e.g., index 100 = median, higher is better)
- Supports absolute salary values in any currency
- Supports custom metrics
- Data stored in a JSON file with metadata about the source and baseline
- System gracefully skips salary lookup when data file is absent

### REQ-4002: Data Import from Excel
**Priority:** Should
**Description:** A conversion tool shall be available to import salary data from Excel spreadsheets.
**Acceptance Criteria:**
- Auto-detects header row and column layout
- Finds company column (multiple naming patterns supported)
- Finds optional city column
- Pairs count/index columns for multi-category data
- Supports configurable source name, baseline value, and baseline description
- Outputs to JSON format in the repository root

### REQ-4003: Company Name Matching
**Priority:** Must
**Description:** The lookup tool shall use fuzzy matching to handle company name variations.
**Acceptance Criteria:**
- Handles: legal suffixes (A/S, ApS, Inc., Ltd.), Nordic/special characters, anglicized spellings, partial matches
- Strips noise words (holding, group, regional identifiers)
- Handles parenthetical sub-entities and post-comma descriptions
- Results ranked by match score with configurable minimum threshold
- City filter can narrow results

### REQ-4004: Lookup Output
**Priority:** Must
**Description:** The lookup tool shall present salary data in both human-readable and machine-parseable formats.
**Acceptance Criteria:**
- Human-readable: formatted table with company name, location, categories, index values, and difference from baseline
- JSON output mode for programmatic consumption
- List-all mode to show every company in the dataset
- Privacy note for categories with too few employees to publish

### REQ-4005: Integration with Evaluation
**Priority:** Should
**Description:** When salary data is available, the fit evaluation shall include a salary benchmark section.
**Acceptance Criteria:**
- Lookup runs automatically during evaluation if data file exists
- Results presented as a table showing category indices and variance from baseline
- If tool not configured or no match found, section is silently omitted
- City filter applied if the posting specifies a city

### REQ-4006: Data Privacy
**Priority:** Must
**Description:** Salary data shall be excluded from version control as it may contain proprietary or confidential information.
**Acceptance Criteria:**
- Data file listed in .gitignore
- README documents that the file is user-specific and not shared
- Error message when file is missing explains how to set up or skip
