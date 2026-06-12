import { describe, it, expect } from "vitest";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KpiCards } from "@/components/dashboard/KpiCard";
import { kpis } from "@/lib/domain/kpi";
import { readTracker } from "@/lib/data/tracker";
import type { Status, TrackerRow } from "@/lib/domain/status";

const NOW = new Date(2026, 5, 11); // 2026-06-11, within the 1k fixture range

function row(date: string, status: Status, fit: number): TrackerRow {
  return {
    date, company: "Co", sector: "", role: "Eng", role_type: "", channel: "",
    status, contact_person: "", fit_rating: fit, notes: "", cv_file: "",
    cover_letter_file: "", source: "", last_updated: date,
  };
}

/** The card element (`.rounded-xl` container) whose label matches. */
function card(label: string | RegExp): HTMLElement {
  return screen.getByText(label).closest("div.rounded-xl") as HTMLElement;
}

describe("KpiCards", () => {
  it("renders — for avg-fit and interview-rate when the floor is unmet", () => {
    const k = kpis([row("2026-06-10", "Sent", 80), row("2026-06-09", "Draft", 60)], NOW);
    render(<KpiCards k={k} />);
    expect(within(card("Avg fit · 30d")).getByText("—")).toBeInTheDocument();
    expect(
      within(card("Interview rate · 90d")).getByText("—"),
    ).toBeInTheDocument();
  });

  it("renders real numbers with the 1000-row fixture", async () => {
    const rows = await readTracker(
      path.join(__dirname, "..", "fixtures", "tracker-1000.csv"),
    );
    const k = kpis(rows, NOW);
    render(<KpiCards k={k} />);

    expect(
      within(card("Total applications")).getByText("1000"),
    ).toBeInTheDocument();
    // Floors are met → numeric values, not the em dash.
    expect(within(card("Avg fit · 30d")).queryByText("—")).toBeNull();
    expect(
      within(card("Interview rate · 90d")).getByText(/%$/),
    ).toBeInTheDocument();
  });

  it("toggles the Applied window between 7d and 30d", async () => {
    const user = userEvent.setup();
    const k = kpis(
      [
        row("2026-06-10", "Sent", 80), // in 7d + 30d
        row("2026-05-20", "Sent", 70), // in 30d only
        row("2026-05-18", "Sent", 60), // in 30d only
      ],
      NOW,
    );
    render(<KpiCards k={k} />);

    // Default window is 30d → applied30 = 3.
    expect(within(card(/^Applied · 30d$/)).getByText("3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "7d" }));
    expect(within(card(/^Applied · 7d$/)).getByText("1")).toBeInTheDocument();
  });
});
