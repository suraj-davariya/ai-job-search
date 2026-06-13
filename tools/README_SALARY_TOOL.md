# Salary Benchmarking Tools

CareerForge includes two salary tools to benchmark target companies against your own data during fit evaluation.

---

## `salary_lookup.py` (repo root)

Looks up a company in `salary_data.json` using fuzzy matching and prints salary indices relative to your baseline.

**Usage:**

```bash
# Basic lookup
python3 salary_lookup.py "Acme Corp"

# Narrow to a city
python3 salary_lookup.py "Acme Corp" --city "Copenhagen"

# Machine-readable JSON output (used by /apply internally)
python3 salary_lookup.py "Acme Corp" --json

# List all companies in your dataset
python3 salary_lookup.py --list
python3 salary_lookup.py --list --city "London"

# Adjust minimum match threshold (default: 60, range: 0–100)
python3 salary_lookup.py "Acme Corp" --threshold 50
```

**Matching behaviour:**
- Strips legal suffixes (A/S, ApS, Inc., Ltd., GmbH, …) before comparing
- Handles Nordic/special characters (æ→e, ø→o, å→a, ü→u, …)
- Ignores noise words (holding, group, international, …)
- Drops parenthetical sub-entities and post-comma descriptions
- Uses F1 token-overlap scoring — short queries like "Nordea" still match "Nordea Bank"

**Graceful degradation:** exits 0 with an informational message when `salary_data.json` is absent — never blocks the `/apply` pipeline.

---

## `tools/convert_salary_excel.py`

Converts an Excel spreadsheet into the `salary_data.json` format expected by `salary_lookup.py`.

**Requires:**
```bash
pip install openpyxl
```

**Usage:**

```bash
# Minimal — derives source name from filename
python3 tools/convert_salary_excel.py my_salary_data.xlsx

# With metadata
python3 tools/convert_salary_excel.py my_salary_data.xlsx \
  --source "Glassdoor 2025" \
  --baseline 100 \
  --baseline-label "index" \
  --baseline-desc "Median = 100" \
  --output salary_data.json
```

**Column auto-detection:**
- **Company column:** header containing `company`, `virksomhed`, `firma`, `employer`, or `organization`
- **City column (optional):** header containing `city`, `location`, `by`, or `sted`
- **Count + Index pairs:** adjacent columns where one header contains `count`/`antal`/`n` and the next contains `index`/`indeks`/`score`
- **Standalone index columns:** any remaining numeric column is treated as an index category

---

## `salary_data.json` schema

```json
{
  "metadata": {
    "source": "Glassdoor 2025",
    "index_baseline": 100,
    "index_label": "index",
    "baseline_description": "Median = 100"
  },
  "companies": [
    {
      "company": "Acme Corporation",
      "city": "Copenhagen",
      "categories": {
        "Engineers": { "count": 120, "index": 118 },
        "Sales":     { "count": 3,   "index": 95  }
      }
    }
  ]
}
```

- `index_baseline`: the reference value (typically 100 = median)
- `count`: number of employees in that category; `null` if unknown
- `index`: salary index for that category; `null` if unpublished
- Categories with `count < 5` are flagged with a privacy note in output

---

## Privacy

`salary_data.json` is **gitignored** — it is never committed. It contains proprietary or personally sourced compensation data that should stay on your machine.

If you share this repo or open a PR, your salary data will not be included.
