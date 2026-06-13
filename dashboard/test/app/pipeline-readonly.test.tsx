import { describe, it, expect, vi } from "vitest";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationsView } from "@/components/applications/ApplicationsView";
import { readTracker } from "@/lib/data/tracker";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(""),
}));
vi.mock("@/app/actions/tracker", () => ({
  updateRowAction: vi.fn(async () => ({ ok: true }) as const),
  appendRowAction: vi.fn(async () => ({ ok: true }) as const),
}));

const smallFixture = path.join(__dirname, "..", "fixtures", "tracker-small.csv");

async function renderView(readOnly = false) {
  const rows = await readTracker(smallFixture);
  render(<ApplicationsView rows={rows} readOnly={readOnly} />);
  return rows;
}

function strip() {
  return screen.getByRole("group", { name: "Pipeline counts" });
}

describe("PipelineStrip", () => {
  it("shows per-status counts over the full set", async () => {
    await renderView();
    const s = within(strip());
    // Fixture: 4 Sent, 2 Interview, 2 Draft, 1 each Offer/Rejected/Withdrawn/Closed.
    expect(s.getByRole("button", { name: /^Sent: 4$/ })).toBeInTheDocument();
    expect(s.getByRole("button", { name: /^Interview: 2$/ })).toBeInTheDocument();
    expect(s.getByText("12 total")).toBeInTheDocument();
  });

  it("counts reflect the active filter slice", async () => {
    const user = userEvent.setup();
    await renderView();
    await user.type(screen.getByLabelText("Search applications"), "Helios");
    // Only Helios Analytics (Draft) remains.
    expect(within(strip()).getByText("1 total")).toBeInTheDocument();
    expect(
      within(strip()).getByRole("button", { name: /^Draft: 1$/ }),
    ).toBeInTheDocument();
  });

  it("toggles a status filter when a bucket is clicked", async () => {
    const user = userEvent.setup();
    await renderView();
    await user.click(within(strip()).getByRole("button", { name: /^Sent: 4$/ }));
    // Table now shows only the 4 Sent rows.
    expect(document.querySelectorAll("tbody tr")).toHaveLength(4);
  });
});

describe("read-only mode", () => {
  it("disables every mutator", async () => {
    await renderView(true);
    // No inline status select / notes input anywhere.
    expect(screen.queryByLabelText(/^Status for /)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^Notes for /)).not.toBeInTheDocument();
    // + New application is disabled.
    expect(
      screen.getByRole("button", { name: /new application/i }),
    ).toBeDisabled();
  });
});
