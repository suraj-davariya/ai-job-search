/**
 * Companies view aggregation (REQ-5012). Pure + unit-tested: group the tracker
 * by company and derive per-company stats. Salary enrichment is layered in the
 * page (it depends on the optional salary_data.json).
 */
import { STATUSES, type Status, type TrackerRow } from "./status";

export interface CompanySummary {
  company: string;
  count: number;
  bestFit: number;
  sector: string;
  /** Non-zero status counts, in canonical status order. */
  statusMix: { status: Status; count: number }[];
}

export function summarizeCompanies(rows: TrackerRow[]): CompanySummary[] {
  const groups = new Map<string, TrackerRow[]>();
  for (const r of rows) {
    if (!r.company) continue; // skip blank company names
    const list = groups.get(r.company) ?? [];
    list.push(r);
    groups.set(r.company, list);
  }

  const summaries: CompanySummary[] = [...groups.entries()].map(
    ([company, list]) => {
      const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<
        Status,
        number
      >;
      let bestFit = 0;
      let sector = "";
      for (const r of list) {
        if (r.status in counts) counts[r.status] += 1;
        if (r.fit_rating > bestFit) bestFit = r.fit_rating;
        if (!sector && r.sector) sector = r.sector;
      }
      const statusMix = STATUSES.filter((s) => counts[s] > 0).map((status) => ({
        status,
        count: counts[status],
      }));
      return { company, count: list.length, bestFit, sector, statusMix };
    },
  );

  return summaries.sort(
    (a, b) => b.count - a.count || a.company.localeCompare(b.company),
  );
}
