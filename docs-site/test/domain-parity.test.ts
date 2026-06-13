/**
 * Drift guard (build-prompt §6): the docs-site demos run on COPIED domain
 * logic (components/demo/domain/*) so the site stays standalone. A copy can
 * silently diverge from the real dashboard and still compile — a green build
 * that lies. This test imports BOTH the copy and the real implementation in
 * dashboard/lib/domain/* (the one allowed test-only cross-app import) and
 * asserts they agree on the same fixtures.
 *
 * Removability guard: if dashboard/ is absent or its dependencies are not
 * installed, the suite SKIPS (it does not fail) — deleting dashboard/ must
 * leave docs-site intact (build-prompt rule #4).
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import * as copyAggregate from "../components/demo/domain/aggregate";
import { TRACKER_COLUMNS as COPY_COLUMNS } from "../components/demo/domain/columns";
import * as copyKpi from "../components/demo/domain/kpi";
import * as copyStatus from "../components/demo/domain/status";
import { DEMO_NOW, DEMO_ROWS } from "../components/demo/demo-data";

const DASHBOARD_DOMAIN = path.resolve(
  __dirname,
  "../../dashboard/lib/domain",
);

type RealModules = {
  status: typeof copyStatus;
  kpi: typeof copyKpi;
  aggregate: typeof copyAggregate;
  csv: { TRACKER_COLUMNS: readonly string[] };
};

async function loadReal(): Promise<RealModules | null> {
  if (!existsSync(DASHBOARD_DOMAIN)) return null;
  try {
    const [status, kpi, aggregate, csv] = await Promise.all([
      import(path.join(DASHBOARD_DOMAIN, "status.ts")),
      import(path.join(DASHBOARD_DOMAIN, "kpi.ts")),
      import(path.join(DASHBOARD_DOMAIN, "aggregate.ts")),
      import(path.join(DASHBOARD_DOMAIN, "csv.ts")),
    ]);
    return { status, kpi, aggregate, csv };
  } catch {
    // dashboard exists but its node_modules aren't installed — skip, don't fail.
    return null;
  }
}

const real = await loadReal();

describe.skipIf(real === null)("docs-site demo domain ⇄ dashboard domain", () => {
  const r = real!;

  it("status enum, transitions, and terminal set match", () => {
    expect(copyStatus.STATUSES).toEqual(r.status.STATUSES);
    expect(copyStatus.ALLOWED_NEXT).toEqual(r.status.ALLOWED_NEXT);
    expect([...copyStatus.MUTED].sort()).toEqual([...r.status.MUTED].sort());
  });

  it("the 14-column tracker contract matches", () => {
    expect(COPY_COLUMNS).toEqual(r.csv.TRACKER_COLUMNS);
  });

  it("KPI math agrees on the demo fixture", () => {
    expect(copyKpi.kpis(DEMO_ROWS, DEMO_NOW)).toEqual(
      r.kpi.kpis(DEMO_ROWS, DEMO_NOW),
    );
  });

  it("all six chart aggregations agree on the demo fixture", () => {
    expect(copyAggregate.byWeek(DEMO_ROWS)).toEqual(
      r.aggregate.byWeek(DEMO_ROWS),
    );
    expect(copyAggregate.byDay(DEMO_ROWS)).toEqual(
      r.aggregate.byDay(DEMO_ROWS),
    );
    expect(copyAggregate.byStatus(DEMO_ROWS)).toEqual(
      r.aggregate.byStatus(DEMO_ROWS),
    );
    expect(copyAggregate.fitBuckets(DEMO_ROWS)).toEqual(
      r.aggregate.fitBuckets(DEMO_ROWS),
    );
    expect(copyAggregate.topBy(DEMO_ROWS, "company")).toEqual(
      r.aggregate.topBy(DEMO_ROWS, "company"),
    );
    expect(copyAggregate.topBy(DEMO_ROWS, "sector")).toEqual(
      r.aggregate.topBy(DEMO_ROWS, "sector"),
    );
  });

  it("transition validation behaves identically (legal, illegal, no-op)", () => {
    for (const from of copyStatus.STATUSES) {
      for (const to of copyStatus.STATUSES) {
        const copyThrows = throws(() => copyStatus.assertTransition(from, to));
        const realThrows = throws(() => r.status.assertTransition(from, to));
        expect(copyThrows, `${from} → ${to}`).toBe(realThrows);
        expect(copyStatus.transitionOptions(from)).toEqual(
          r.status.transitionOptions(from),
        );
      }
    }
  });
});

describe.skipIf(real !== null)("dashboard absent", () => {
  it("skips parity checks — docs-site remains standalone", () => {
    expect(real).toBeNull();
  });
});

function throws(fn: () => void): boolean {
  try {
    fn();
    return false;
  } catch {
    return true;
  }
}
