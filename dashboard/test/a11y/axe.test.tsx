import { describe, it, expect, vi } from "vitest";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { readTracker } from "@/lib/data/tracker";
import { kpis } from "@/lib/domain/kpi";
import { byStatus, topBy } from "@/lib/domain/aggregate";
import { ApplicationsView } from "@/components/applications/ApplicationsView";
import { KpiCards } from "@/components/dashboard/KpiCard";
import { StatusDonut } from "@/components/dashboard/StatusDonut";
import { TopCompanies } from "@/components/dashboard/TopCompanies";
import { RunLog } from "@/components/console/RunLog";

// Server actions + navigation + Nivo are stubbed; we audit the DOM they render.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(""),
}));
vi.mock("@/app/actions/tracker", () => ({
  updateRowAction: vi.fn(async () => ({ ok: true })),
  appendRowAction: vi.fn(async () => ({ ok: true })),
}));
vi.mock("@nivo/bar", () => ({ ResponsiveBar: () => null }));
vi.mock("@nivo/calendar", () => ({ ResponsiveCalendar: () => null }));

// axe.run over a full surface takes a few seconds; give it ample headroom so a
// loaded CI worker can't trip the default 5s timeout (this audit is not flaky —
// the violation set is deterministic; only the wall-clock varies).
vi.setConfig({ testTimeout: 20000 });

const fixture = path.join(__dirname, "..", "fixtures", "tracker-small.csv");

/** Run axe over a container. color-contrast is disabled — jsdom has no layout
 *  engine to compute it (verified separately via the design tokens). */
async function auditViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  return results.violations.map((v) => `${v.id} (${v.nodes.length})`);
}

describe("accessibility (axe-core, NFR-0015)", () => {
  it("Applications surface has no axe violations", async () => {
    const rows = await readTracker(fixture);
    const { container } = render(<ApplicationsView rows={rows} />);
    expect(await auditViolations(container)).toEqual([]);
  });

  it("Applications surface stays clean with the detail drawer open", async () => {
    const rows = await readTracker(fixture);
    const { container } = render(<ApplicationsView rows={rows} />);
    await userEvent.click(screen.getByRole("button", { name: "Helios Analytics" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await auditViolations(container)).toEqual([]);
  });

  it("Analytics cards + charts have no axe violations", async () => {
    const rows = await readTracker(fixture);
    const { container } = render(
      <div>
        <KpiCards k={kpis(rows)} />
        <StatusDonut data={byStatus(rows)} />
        <TopCompanies data={topBy(rows, "company")} />
      </div>,
    );
    expect(await auditViolations(container)).toEqual([]);
  });

  it("Console run log has no axe violations", async () => {
    const { container } = render(
      <RunLog claudeOk pythonOk readOnly={false} />,
    );
    expect(await auditViolations(container)).toEqual([]);
  });
});
