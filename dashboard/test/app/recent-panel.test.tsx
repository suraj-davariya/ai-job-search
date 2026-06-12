import { describe, it, expect } from "vitest";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecentPanel } from "@/components/dashboard/RecentPanel";
import { readTracker } from "@/lib/data/tracker";

const smallFixture = path.join(__dirname, "..", "fixtures", "tracker-small.csv");

/** Position of the first row whose link text contains `name`. */
function rowIndex(name: string): number {
  const texts = within(screen.getByRole("list"))
    .getAllByRole("link")
    .map((a) => a.textContent ?? "");
  return texts.findIndex((t) => t.includes(name));
}

describe("RecentPanel", () => {
  it("links each row to the filtered Applications view", async () => {
    const rows = await readTracker(smallFixture);
    render(<RecentPanel rows={rows} />);
    const helios = screen.getByRole("link", { name: /Helios Analytics/ });
    expect(helios).toHaveAttribute(
      "href",
      "/applications?q=Helios%20Analytics",
    );
  });

  it("toggle switches the ordering source (date vs last_updated)", async () => {
    const user = userEvent.setup();
    const rows = await readTracker(smallFixture);
    render(<RecentPanel rows={rows} />);

    // By application date (default): Orbital (2026-06-01) is newer than
    // Brightwave (2026-05-28).
    expect(rowIndex("Orbital Media")).toBeGreaterThanOrEqual(0);
    expect(rowIndex("Orbital Media")).toBeLessThan(rowIndex("Brightwave"));

    // By last_updated: Brightwave (2026-06-07) is newer than Orbital (2026-06-06).
    await user.click(screen.getByRole("button", { name: "Updated" }));
    expect(rowIndex("Brightwave")).toBeLessThan(rowIndex("Orbital Media"));
  });
});
