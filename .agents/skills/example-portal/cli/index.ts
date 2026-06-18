#!/usr/bin/env bun
/**
 * TEMPLATE — CareerForge example job-portal adapter (ADR-0004).
 *
 * This is NOT a real portal. It returns clearly-labelled EXAMPLE data so you can
 * run the adapter end-to-end and see the contract. To add a real portal, copy
 * this directory to `.agents/skills/<portal-name>/` and replace `fetchPostings`
 * with a real fetch (the portal's public search/API or HTML parsing).
 *
 * Contract (ADR-0004):
 *   Input : --keywords "<terms>"  --location "<place>"  --date-range <days>
 *   Output: JSON array on stdout — { title, company, location, url, date, snippet }[]
 *   Exit  : 0 on success (emit [] if no results), 1 on error (message on stderr)
 *
 * Runtime: Bun (`bun run index.ts ...`). `npx tsx index.ts ...` also works.
 */

// Minimal ambient declaration so this template typechecks with ZERO dependencies.
// Under Bun (or Node) these globals are real; for full typings add `bun-types`
// (Bun) or `@types/node` (Node) as a devDependency.
declare const process: {
  argv: string[];
  stdout: { write(s: string): void };
  stderr: { write(s: string): void };
  exit(code: number): never;
};

interface Posting {
  title: string;
  company: string;
  location: string;
  url: string;
  date: string; // ISO yyyy-mm-dd, or "recent" when unknown
  snippet: string;
}

interface SearchParams {
  keywords: string;
  location: string;
  dateRangeDays: number;
}

/** Minimal `--flag value` parser (no deps, so the template stays copy-paste simple). */
function parseArgs(argv: string[]): SearchParams {
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i !== -1 && i + 1 < argv.length ? argv[i + 1] : undefined;
  };
  return {
    keywords: get("--keywords") ?? "",
    location: get("--location") ?? "",
    dateRangeDays: Number(get("--date-range") ?? "14"),
  };
}

/**
 * Replace this with a real fetch for your portal. A real implementation must
 * return only postings it actually found, with real URLs (ARCH-0007 — no
 * fabrication). This template echoes the query back as obviously-fake examples.
 */
function fetchPostings(params: SearchParams): Posting[] {
  if (!params.keywords) return [];
  const kw = params.keywords;
  const loc = params.location || "Anywhere";
  return [
    {
      title: `${kw} (EXAMPLE — replace with real adapter output)`,
      company: "Example Company A",
      location: loc,
      url: "https://example.com/jobs/EXAMPLE-1",
      date: "recent",
      snippet: `Template result for "${kw}" in ${loc}. This is not a real posting.`,
    },
    {
      title: `Senior ${kw} (EXAMPLE)`,
      company: "Example Company B",
      location: loc,
      url: "https://example.com/jobs/EXAMPLE-2",
      date: "recent",
      snippet: `Second template result for "${kw}". Replace fetchPostings() to go live.`,
    },
  ];
}

function main(): void {
  try {
    const params = parseArgs(process.argv.slice(2));
    if (Number.isNaN(params.dateRangeDays)) {
      throw new Error("--date-range must be a number of days");
    }
    const results = fetchPostings(params);
    process.stdout.write(JSON.stringify(results, null, 2) + "\n");
    process.exit(0);
  } catch (err) {
    process.stderr.write(
      `example-portal adapter error: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.exit(1);
  }
}

main();
