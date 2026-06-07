# Testing — Test Data & Environments

> **Purpose:** Specifies configurations, fixtures, mock structures, and environment segregation rules for testing CareerForge.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** QA Lead

---

## 1. Test Environment Segregation

To ensure tests are repeatable and do not write to or corrupt the developer's live workspaces:

- **Unit Test Environment**: Runs entirely in memory. Reads and writes to mock file-system targets using a helper class (e.g. `mock-fs` or generic in-memory mocks).
- **Integration Test Environment**: Runs using a dedicated temporary workspace inside `artifacts/` or `tmp/` folders. Setup scripts create copies of the LaTeX templates, execute builds, and clean up post-execution.
- **E2E Sandbox**: A standalone directory containing a baseline `settings/profile.json` (populated with mock candidate data) and a local mock HTTP server that simulates job posting endpoints to avoid calling live websites during testing.

---

## 2. Test Fixtures

### Mock Candidate Profile (`settings/profile.json` Fixture)
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+1-555-0199",
  "education": [
    {
      "institution": "University of Science",
      "degree": "B.S. Computer Science",
      "graduation_year": "2020"
    }
  ],
  "work_history": [
    {
      "company": "Tech Innovations Inc.",
      "role": "Software Engineer",
      "dates": "2020-06 to 2023-08",
      "projects": [
        {
          "name": "Cloud Deployment",
          "description": "Migrated legacy backend servers to containerized deployments.",
          "technologies": ["Docker", "AWS", "Python"]
        }
      ]
    }
  ],
  "skills": ["Python", "Docker", "AWS", "SQL"]
}
```

### Mock Job Description (`job_description.json` Fixture)
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
```csv
date,company,sector,role,role_type,channel,status,contact_person,fit_rating,notes,cv_file,cover_letter_file,source,last_updated
2026-06-01,Innovate Corp,Technology,Backend Dev,Full-time,Direct,Sent,,85,,cv/output/cv1.pdf,cover_letters/output/cl1.pdf,https://example.com/job1,2026-06-01
2026-06-03,Cloud Devs,Technology,Cloud Arch,Full-time,Recruiter,Draft,,60,,cv/output/cv2.pdf,cover_letters/output/cl2.pdf,https://example.com/job2,2026-06-03
```

### Mock Salary Benchmarking Data (`salary_benchmark.csv` Fixture)
```csv
JobTitle,MedianSalary,Percentile_25,Percentile_75
Cloud Engineer,120000,100000,140000
Software Engineer,105000,90000,125000
```
