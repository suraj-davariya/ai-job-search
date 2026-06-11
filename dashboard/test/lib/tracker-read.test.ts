import { describe, it, expect } from "vitest";
import path from "node:path";
import { readTracker } from "@/lib/data/tracker";

const fix = (n: string) => path.join(__dirname, "..", "fixtures", n);

describe("readTracker", () => {
  it("returns [] for a missing file", async () => {
    expect(await readTracker("/nope/missing.csv")).toEqual([]);
  });

  it("returns [] for a header-only file", async () => {
    expect(await readTracker(fix("tracker-empty.csv"))).toEqual([]);
  });

  it("parses all rows of the small fixture", async () => {
    const rows = await readTracker(fix("tracker-small.csv"));
    expect(rows.length).toBeGreaterThanOrEqual(12);
    expect(rows[0]).toHaveProperty("company");
    expect(typeof rows[0].fit_rating).toBe("number");
  });

  it("coerces fit_rating to a number", async () => {
    const rows = await readTracker(fix("tracker-small.csv"));
    expect(rows.every((r) => typeof r.fit_rating === "number")).toBe(true);
  });

  it("defaults last_updated to date for the legacy row (in-memory)", async () => {
    const rows = await readTracker(fix("tracker-small.csv"));
    const legacy = rows.find((r) => r._legacyLastUpdated);
    expect(legacy).toBeDefined();
    expect(legacy?.last_updated).toBe(legacy?.date);
  });

  it("handles the 1000-row perf fixture", async () => {
    const rows = await readTracker(fix("tracker-1000.csv"));
    expect(rows.length).toBe(1000);
  });
});
