import { describe, it, expect } from "vitest";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { DataTable } from "@/components/applications/DataTable";
import { readTracker } from "@/lib/data/tracker";

const smallFixture = path.join(
  __dirname,
  "..",
  "fixtures",
  "tracker-small.csv",
);

describe("Applications DataTable", () => {
  it("renders all 12 fixture rows", async () => {
    const rows = await readTracker(smallFixture);
    const { container } = render(<DataTable rows={rows} />);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(12);
  });

  it("defaults to date-descending sort", async () => {
    const rows = await readTracker(smallFixture);
    const { container } = render(<DataTable rows={rows} />);
    const firstRow = container.querySelector("tbody tr");
    // Newest fixture date is 2026-06-10 (Helios Analytics).
    expect(firstRow?.textContent).toContain("Helios Analytics");
    expect(firstRow?.textContent).toContain("2026-06-10");
  });

  it("marks terminal-status rows muted (not hidden)", async () => {
    const rows = await readTracker(smallFixture);
    const { container } = render(<DataTable rows={rows} />);
    const muted = container.querySelectorAll('tbody tr[data-muted="true"]');
    // Cobalt (Rejected), Lumen (Withdrawn), Apex (Closed).
    expect(muted.length).toBe(3);
    expect(muted[0].className).toContain("opacity-60");
  });

  it("shows the empty-state when there are no rows", () => {
    render(<DataTable rows={[]} />);
    expect(screen.getByTestId("applications-empty")).toBeInTheDocument();
    expect(screen.getByText(/no applications yet/i)).toBeInTheDocument();
  });
});
