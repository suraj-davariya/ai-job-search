import { describe, it, expect } from "vitest";
import { summarizeCompanies } from "@/lib/domain/companies";
import type { Status, TrackerRow } from "@/lib/domain/status";

function row(
  company: string,
  status: Status,
  fit: number,
  sector = "Tech",
): TrackerRow {
  return {
    date: "2026-06-10", company, sector, role: "Eng", role_type: "", channel: "",
    status, contact_person: "", fit_rating: fit, notes: "", cv_file: "",
    cover_letter_file: "", source: "", last_updated: "2026-06-10",
  };
}

describe("summarizeCompanies", () => {
  const rows = [
    row("Acme", "Sent", 80, "Fintech"),
    row("Acme", "Interview", 88, "Fintech"),
    row("Beta", "Draft", 60, "Health"),
    row("", "Sent", 70), // blank company skipped
  ];

  it("groups by company with count, best fit, sector and status mix", () => {
    const out = summarizeCompanies(rows);
    // Acme (2) ranks before Beta (1).
    expect(out.map((c) => c.company)).toEqual(["Acme", "Beta"]);

    const acme = out[0];
    expect(acme.count).toBe(2);
    expect(acme.bestFit).toBe(88);
    expect(acme.sector).toBe("Fintech");
    expect(acme.statusMix).toEqual([
      { status: "Sent", count: 1 },
      { status: "Interview", count: 1 },
    ]);
  });

  it("skips blank company names", () => {
    expect(summarizeCompanies(rows).some((c) => c.company === "")).toBe(false);
  });

  it("returns [] for no rows", () => {
    expect(summarizeCompanies([])).toEqual([]);
  });
});
