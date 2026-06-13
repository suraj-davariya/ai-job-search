import { describe, it, expect } from "vitest";
import {
  byWeek,
  byDay,
  byStatus,
  fitBuckets,
  topBy,
} from "@/lib/domain/aggregate";
import type { Status, TrackerRow } from "@/lib/domain/status";

function row(
  date: string,
  status: Status = "Sent",
  fit = 50,
  extra: Partial<TrackerRow> = {},
): TrackerRow {
  return {
    date, company: "Co", sector: "Tech", role: "Eng", role_type: "", channel: "",
    status, contact_person: "", fit_rating: fit, notes: "", cv_file: "",
    cover_letter_file: "", source: "", last_updated: date, ...extra,
  };
}

describe("byWeek", () => {
  it("groups by ISO week (Mon start), ascending, skipping bad dates", () => {
    const out = byWeek([
      row("2026-06-08"), // Mon, week of 06-08
      row("2026-06-10"), // Wed, same week
      row("2026-06-15"), // next Mon
      row(""), // skipped
    ]);
    expect(out).toEqual([
      { key: "2026-06-08", count: 2 },
      { key: "2026-06-15", count: 1 },
    ]);
  });
});

describe("byDay", () => {
  it("counts per calendar day in {day,value} form, ascending", () => {
    const out = byDay([row("2026-06-10"), row("2026-06-10"), row("2026-06-09")]);
    expect(out).toEqual([
      { day: "2026-06-09", value: 1 },
      { day: "2026-06-10", value: 2 },
    ]);
  });
});

describe("byStatus", () => {
  it("returns every status in canonical order, including zeros", () => {
    const out = byStatus([row("2026-06-10", "Sent"), row("2026-06-10", "Sent"), row("2026-06-10", "Offer")]);
    expect(out).toEqual([
      { status: "Draft", count: 0 },
      { status: "Sent", count: 2 },
      { status: "Interview", count: 0 },
      { status: "Offer", count: 1 },
      { status: "Rejected", count: 0 },
      { status: "Withdrawn", count: 0 },
      { status: "Closed", count: 0 },
    ]);
  });
});

describe("fitBuckets", () => {
  it("bins fit into 5 bands of 20, with 100 in the top band", () => {
    const out = fitBuckets([
      row("2026-06-10", "Sent", 0),
      row("2026-06-10", "Sent", 19),
      row("2026-06-10", "Sent", 20),
      row("2026-06-10", "Sent", 80),
      row("2026-06-10", "Sent", 100),
    ]);
    expect(out).toEqual([
      { range: "0–19", count: 2 },
      { range: "20–39", count: 1 },
      { range: "40–59", count: 0 },
      { range: "60–79", count: 0 },
      { range: "80–100", count: 2 },
    ]);
  });
});

describe("topBy", () => {
  it("ranks by count desc, breaking ties alphabetically, capped at n", () => {
    const rows = [
      row("2026-06-10", "Sent", 50, { company: "Acme" }),
      row("2026-06-10", "Sent", 50, { company: "Acme" }),
      row("2026-06-10", "Sent", 50, { company: "Beta" }),
      row("2026-06-10", "Sent", 50, { company: "Cobalt" }),
      row("2026-06-10", "Sent", 50, { company: "" }), // blank skipped
    ];
    expect(topBy(rows, "company", 2)).toEqual([
      { key: "Acme", count: 2 },
      { key: "Beta", count: 1 }, // Beta before Cobalt on the tie
    ]);
  });

  it("aggregates by sector too", () => {
    const out = topBy(
      [
        row("2026-06-10", "Sent", 50, { sector: "Fintech" }),
        row("2026-06-10", "Sent", 50, { sector: "Fintech" }),
        row("2026-06-10", "Sent", 50, { sector: "Health" }),
      ],
      "sector",
    );
    expect(out[0]).toEqual({ key: "Fintech", count: 2 });
  });
});
