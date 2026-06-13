import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { readTracker } from "@/lib/data/tracker";
import { applyFilter, emptyFilter } from "@/lib/domain/filter";
import { kpis } from "@/lib/domain/kpi";
import { byWeek, byDay, byStatus, fitBuckets, topBy } from "@/lib/domain/aggregate";
import { updateRow } from "@/lib/write/tracker";
import { DataTable } from "@/components/applications/DataTable";

const fixture = path.join(__dirname, "..", "fixtures", "tracker-1000.csv");
const log = (label: string, msVal: number) =>
  console.log(`PERF ${label}: ${msVal.toFixed(1)}ms`);

describe("performance (NFR-0014, 1000 rows)", () => {
  it("parses the 1k tracker well under the start budget", async () => {
    const t0 = performance.now();
    const rows = await readTracker(fixture);
    const dt = performance.now() - t0;
    log("readTracker(1000)", dt);
    expect(rows.length).toBe(1000);
    expect(dt).toBeLessThan(500); // generous; typically ≪ 100ms
  });

  it("filters/sorts and computes KPIs + chart aggregates fast", async () => {
    const rows = await readTracker(fixture);

    const t0 = performance.now();
    for (let i = 0; i < 20; i++) {
      applyFilter(rows, { ...emptyFilter(), q: "engineer" });
    }
    const filterMs = (performance.now() - t0) / 20;
    log("applyFilter(1000) avg", filterMs);

    const t1 = performance.now();
    kpis(rows);
    byWeek(rows);
    byDay(rows);
    byStatus(rows);
    fitBuckets(rows);
    topBy(rows, "company");
    const aggMs = performance.now() - t1;
    log("kpis+aggregates(1000)", aggMs);

    expect(filterMs).toBeLessThan(50);
    expect(aggMs).toBeLessThan(250);
  });

  it("renders the full 1k-row table within budget (SSR proxy for FCP)", async () => {
    const rows = await readTracker(fixture);
    const t0 = performance.now();
    renderToString(createElement(DataTable, { rows }));
    const renderMs = performance.now() - t0;
    log("renderToString DataTable(1000)", renderMs);
    // SSR string render of all rows; a load-sensitive proxy (the representative
    // isolated number ~790ms is recorded in ARCHITECTURE.md). Generous ceiling
    // so parallel-worker CPU contention can't flake it; the strict NFR gates are
    // parse (<500ms) and save (<250ms) below.
    expect(renderMs).toBeLessThan(8000);
  });

  it("round-trips an inline save under the 250ms NFR bound", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-perf-"));
    const csv = path.join(dir, "job_search_tracker.csv");
    await fs.copyFile(fixture, csv);

    const t0 = performance.now();
    await updateRow(csv, 0, { notes: "perf check" }); // read→mutate→fsync→rename
    const saveMs = performance.now() - t0;
    log("updateRow round-trip(1000)", saveMs);

    expect(saveMs).toBeLessThan(250); // NFR-0014 save bound
    await fs.rm(dir, { recursive: true, force: true });
  });
});
