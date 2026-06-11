import { describe, it, expect } from "vitest";
import { parse, serialize, applyFilter, emptyFilter } from "@/lib/domain/filter";
import type { TrackerRow } from "@/lib/domain/status";

function row(p: Partial<TrackerRow>): TrackerRow {
  return {
    date: "2026-06-01",
    company: "Acme",
    sector: "Software",
    role: "Engineer",
    role_type: "Full-time",
    channel: "LinkedIn",
    status: "Sent",
    contact_person: "",
    fit_rating: 70,
    notes: "",
    cv_file: "",
    cover_letter_file: "",
    source: "",
    last_updated: "2026-06-01",
    ...p,
  };
}

describe("filter state", () => {
  it("round-trips a query string", () => {
    expect(serialize(parse("?q=acme&status=Sent,Offer&fit_min=50"))).toBe(
      "q=acme&status=Sent,Offer&fit_min=50",
    );
  });

  it("parses a leading ? and a bare query identically", () => {
    expect(parse("?q=x")).toEqual(parse("q=x"));
  });

  it("an empty filter serializes to the empty string", () => {
    expect(serialize(emptyFilter())).toBe("");
  });

  it("free-text matches company, role, or notes (case-insensitive)", () => {
    const rows = [
      row({ company: "Acme Corp" }),
      row({ company: "Globex", role: "Acme-adjacent role" }),
      row({ company: "Initech", notes: "referred by ACME alum" }),
      row({ company: "Umbrella" }),
    ];
    const out = applyFilter(rows, parse("q=acme"));
    expect(out).toHaveLength(3);
  });

  it("filters by multi-status", () => {
    const rows = [
      row({ status: "Sent" }),
      row({ status: "Offer" }),
      row({ status: "Rejected" }),
    ];
    const out = applyFilter(rows, parse("status=Sent,Offer"));
    expect(out.map((r) => r.status)).toEqual(["Sent", "Offer"]);
  });

  it("filters by fit range and date range", () => {
    const rows = [
      row({ fit_rating: 40, date: "2026-01-01" }),
      row({ fit_rating: 75, date: "2026-06-01" }),
      row({ fit_rating: 95, date: "2026-06-10" }),
    ];
    expect(applyFilter(rows, parse("fit_min=70")).map((r) => r.fit_rating)).toEqual([
      75, 95,
    ]);
    expect(
      applyFilter(rows, parse("from=2026-05-01&to=2026-06-05")).map((r) => r.date),
    ).toEqual(["2026-06-01"]);
  });

  it("filters by role_type and channel", () => {
    const rows = [
      row({ role_type: "Full-time", channel: "LinkedIn" }),
      row({ role_type: "Contract", channel: "Referral" }),
    ];
    expect(applyFilter(rows, parse("role_type=Contract")).map((r) => r.role_type)).toEqual([
      "Contract",
    ]);
    expect(applyFilter(rows, parse("channel=LinkedIn")).map((r) => r.channel)).toEqual([
      "LinkedIn",
    ]);
  });
});
