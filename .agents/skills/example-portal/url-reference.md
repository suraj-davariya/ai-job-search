# URL Reference — Example Portal (TEMPLATE)

> Optional file (ADR-0004). Record the search-URL patterns your portal uses so the
> adapter and the `job-scraper` fallback stay in sync. Replace the examples below.

## Search URL pattern

How the portal encodes a search in its URL — fill in the real one:

```
https://www.example-portal.com/jobs?q=<keywords>&l=<location>&fromage=<days>
```

| Placeholder | Maps to adapter input | Notes |
|-------------|----------------------|-------|
| `<keywords>` | `--keywords` | URL-encode; the portal may use `+` or `%20` for spaces |
| `<location>` | `--location` | Some portals use a geo-id instead of a plain string |
| `<days>` | `--date-range` | "posted within N days" filter, if the portal supports it |

## Posting URL pattern

The canonical URL shape for a single posting (used for dedup keys in `seen_jobs.json`):

```
https://www.example-portal.com/job/<posting-id>
```

## Web-search fallback

If no adapter is installed, `job-scraper` reaches the same portal via web search:

```
site:example-portal.com <keywords> <location>
```

Keep this `site:` form accurate so the fallback works even without the CLI.
