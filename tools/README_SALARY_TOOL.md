# Salary Benchmarking Tools

> **Status:** Stub — implementation in Epic 7.

CareerForge includes two salary tools to help you benchmark offers
against market data.

## salary_lookup.py (repo root)

Looks up company salary data from `salary_data.json` with fuzzy matching.

**Usage** (once implemented):
```bash
python salary_lookup.py "Acme Corp"
python salary_lookup.py "Acme Corp" --city "San Francisco" --json
```

## tools/convert_salary_excel.py

Converts an Excel salary spreadsheet into the `salary_data.json` format
expected by `salary_lookup.py`.

**Usage** (once implemented):
```bash
python tools/convert_salary_excel.py my_salary_data.xlsx
```

**Requires:** `pip install openpyxl`

## salary_data.json (gitignored)

Your personal salary benchmarking data. Never committed to git.
See `docs/requirements/functional-requirements-salary.md` for the expected schema.
