import { describe, it, expect } from "vitest";
import { kpis } from "@/lib/domain/kpi";
import type { Status, TrackerRow } from "@/lib/domain/status";

// Fixed "now" (local midnight) so day-window math is deterministic.
const NOW = new Date(2026, 5, 11); // 2026-06-11

function row(date: string, status: Status, fit_rating: number): TrackerRow {
  return {
    date,
    company: "Co",
    sector: "",
    role: "Eng",
    role_type: "",
    channel: "",
    status,
    contact_person: "",
    fit_rating,
    notes: "",
    cv_file: "",
    cover_letter_file: "",
    source: "",
    last_updated: date,
  };
}

describe("kpis", () => {
  const rows: TrackerRow[] = [
    row("2026-06-10", "Sent", 80), // 1d ago
    row("2026-06-05", "Interview", 90), // 6d
    row("2026-05-20", "Sent", 70), // 22d
    row("2026-05-15", "Draft", 60), // 27d
    row("2026-04-01", "Rejected", 50), // 71d
    row("2026-02-01", "Offer", 95), // 130d (outside 90d)
  ];

  it("counts total and per-status over all rows", () => {
    const k = kpis(rows, NOW);
    expect(k.total).toBe(6);
    expect(k.byStatus.Sent).toBe(2);
    expect(k.byStatus.Interview).toBe(1);
    expect(k.byStatus.Draft).toBe(1);
    expect(k.byStatus.Rejected).toBe(1);
    expect(k.byStatus.Offer).toBe(1);
    expect(k.byStatus.Withdrawn).toBe(0);
    expect(k.byStatus.Closed).toBe(0);
  });

  it("counts applications in the 7d and 30d windows", () => {
    const k = kpis(rows, NOW);
    expect(k.applied7).toBe(2); // 1d, 6d
    expect(k.applied30).toBe(4); // 1d, 6d, 22d, 27d
  });

  it("averages fit over the 30d window when ≥3 rows are in it", () => {
    // (80 + 90 + 70 + 60) / 4 = 75
    expect(kpis(rows, NOW).avgFit30).toBe(75);
  });

  it("computes interview rate over the 90d window", () => {
    // window (≤90d): Sent, Interview, Sent, Draft, Rejected.
    // denom = non-Draft (Sent+Interview+Offer+Rejected+Withdrawn+Closed) = 4
    // numerator = Interview = 1 → 0.25
    expect(kpis(rows, NOW).interviewRate90).toBeCloseTo(0.25, 5);
  });

  it("returns null avgFit30 when fewer than 3 rows are in the 30d window", () => {
    const sparse = [row("2026-06-10", "Sent", 80), row("2026-06-09", "Sent", 60)];
    expect(kpis(sparse, NOW).avgFit30).toBeNull();
  });

  it("returns null interviewRate90 when the denominator is below 3", () => {
    // Only 2 non-Draft rows in window → denom < 3.
    const sparse = [
      row("2026-06-10", "Sent", 80),
      row("2026-06-09", "Interview", 60),
      row("2026-06-08", "Draft", 50), // excluded from denom
    ];
    expect(kpis(sparse, NOW).interviewRate90).toBeNull();
  });

  it("handles an empty tracker", () => {
    const k = kpis([], NOW);
    expect(k.total).toBe(0);
    expect(k.avgFit30).toBeNull();
    expect(k.interviewRate90).toBeNull();
    expect(k.byStatus.Sent).toBe(0);
  });
});
