import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationsView } from "@/components/applications/ApplicationsView";
import { readTracker } from "@/lib/data/tracker";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(""),
}));

const smallFixture = path.join(__dirname, "..", "fixtures", "tracker-small.csv");
const dataRows = () => document.querySelectorAll("tbody tr");

beforeEach(() => replace.mockClear());

describe("ApplicationsView filtering", () => {
  it("free-text search narrows rows and updates the URL", async () => {
    const user = userEvent.setup();
    const rows = await readTracker(smallFixture);
    render(<ApplicationsView rows={rows} />);
    expect(dataRows()).toHaveLength(12);

    await user.type(screen.getByLabelText("Search applications"), "Helios");
    expect(dataRows()).toHaveLength(1);
    expect(screen.getByText("Helios Analytics")).toBeInTheDocument();
    // URL was synced via router.replace with the q param.
    expect(replace).toHaveBeenCalled();
    expect(replace.mock.calls.at(-1)?.[0]).toContain("q=Helios");
  });

  it("Escape clears the filter back to all rows", async () => {
    const user = userEvent.setup();
    const rows = await readTracker(smallFixture);
    render(<ApplicationsView rows={rows} />);

    const input = screen.getByLabelText("Search applications");
    await user.type(input, "Helios");
    expect(dataRows()).toHaveLength(1);
    await user.keyboard("{Escape}");
    expect(dataRows()).toHaveLength(12);
  });

  it("status chip narrows to that status", async () => {
    const user = userEvent.setup();
    const rows = await readTracker(smallFixture);
    render(<ApplicationsView rows={rows} />);

    await user.click(screen.getByRole("button", { name: "Sent" }));
    // Fixture has 4 Sent rows: Northwind, Vertex, Greenfield, Meridian.
    expect(dataRows()).toHaveLength(4);
    expect(replace.mock.calls.at(-1)?.[0]).toContain("status=Sent");
  });
});
