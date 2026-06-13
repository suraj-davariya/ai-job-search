# Testing — Test Data & Environments

> **Purpose:** Specifies configurations, fixtures, mock structures, and environment segregation rules for testing CareerForge.
>
> **Status:** Draft
> **Last updated:** 2026-06-07
> **Owner persona:** QA Lead

---

## 1. Test Environment Segregation

To ensure tests are repeatable and do not write to or corrupt the developer's live workspaces:

- **Unit-level checks**: Operate on copies of individual profile files (Markdown) in a scratch directory; assert on token replacement and merge behavior. No live profile files are mutated.
- **Integration Test Environment**: Runs using a dedicated temporary workspace inside `artifacts/` or `tmp/` folders. Setup scripts copy the LaTeX templates and profile files, exercise the workflow, and clean up post-execution.
- **E2E Sandbox**: A standalone fork-shaped directory containing baseline profile files — a populated user-fork `CLAUDE.md` and `01-candidate-profile.md` seeded with mock candidate data — plus a `documents/` tree of sample source files, and a local mock HTTP server that simulates job-posting endpoints to avoid calling live websites during testing.

---

## 2. Test Fixtures

### Mock Candidate Profile (`01-candidate-profile.md` Fixture)

A populated copy of the candidate-profile skill file (file-as-DB, ARCH-0004) —
all `[UPPER_SNAKE_CASE]` tokens replaced with mock data:

```markdown
## Identity

- **Name:** Jane Doe
- **Location:** Remote (EU)
- **Phone:** +1-555-0199
- **Email:** jane.doe@example.com

## Education

- **Degree:** B.S. Computer Science
- **Field:** Computer Science
- **Period:** 2016 – 2020
- **Institution:** University of Science

## Professional Experience

### Software Engineer — Tech Innovations Inc.
**Period:** 2020-06 – 2023-08 | **Location:** Remote

- Migrated legacy backend servers to containerized deployments (Docker, AWS).

## Technical Skills

- **Primary:** Python, SQL
- **Secondary:** Docker, AWS
```

### Mock Job Posting (Fixture)

Mock posting input for `/apply` parse tests (postings are normally parsed from a
URL or pasted text — this fixture stands in for that input):

```json
{
  "title": "Cloud Operations Engineer",
  "company": "Enterprise Solutions Co.",
  "url": "http://localhost:8080/job-cloud-op",
  "location": "Remote",
  "required_skills": ["Docker", "Kubernetes", "AWS", "Python"],
  "description": "Looking for a cloud specialist to manage container orchestration platforms..."
}
```

### Mock Tracker File (`job_search_tracker.csv` Fixture)

Matches the schema in data-requirements §11:

```csv
date,company,sector,role,role_type,channel,status,contact_person,fit_rating,notes,cv_file,cover_letter_file,source,last_updated
2026-06-01,Innovate Corp,Technology,Backend Dev,Full-time,Direct,sent,,85,,cv/main_innovate.pdf,cover_letters/cover_innovate_backend.pdf,https://example.com/job1,2026-06-01
2026-06-03,Cloud Devs,Technology,Cloud Arch,Full-time,Recruiter,draft,,60,,cv/main_clouddevs.pdf,cover_letters/cover_clouddevs_arch.pdf,https://example.com/job2,2026-06-03
```

> Note: `status` values use the canonical enum in business-rules §9; `cv_file`
> / `cover_letter_file` follow the naming in data-requirements §15.

### Mock Salary Data (`salary_data.json` Fixture)

Matches the schema in data-requirements §12:

```json
{
  "metadata": {
    "source": "mock benchmark",
    "index_baseline": 100,
    "index_label": "market median = 100",
    "baseline_description": "synthetic test data"
  },
  "companies": [
    {
      "company": "Enterprise Solutions Co.",
      "city": "Remote",
      "categories": {
        "Cloud Engineer": { "count": 12, "index": 118 },
        "Software Engineer": { "count": 30, "index": 104 }
      }
    }
  ]
}
```
