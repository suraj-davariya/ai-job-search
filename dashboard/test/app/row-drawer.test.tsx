import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import path from "node:path";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationsView } from "@/components/applications/ApplicationsView";
import { readTracker } from "@/lib/data/tracker";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(""),
}));

const smallFixture = path.join(__dirname, "..", "fixtures", "tracker-small.csv");

// The drawer probes each document with a HEAD /api/file. Stub fetch so the
// "Greenfield AI" row (main_missing_greenfield.pdf) reports a missing file.
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) =>
      Promise.resolve({ ok: !/missing/.test(url) } as Response),
    ),
  );
});
afterEach(() => vi.unstubAllGlobals());

async function openRow(name: string) {
  const rows = await readTracker(smallFixture);
  render(<ApplicationsView rows={rows} />);
  await userEvent.click(screen.getByRole("button", { name }));
  return screen.getByRole("dialog");
}

describe("RowDrawer", () => {
  it("opens with the row's full record on click", async () => {
    const dialog = await openRow("Brightwave");
    const q = within(dialog);
    expect(q.getByText("Brightwave")).toBeInTheDocument();
    expect(q.getByText("Platform Engineer")).toBeInTheDocument();
    expect(q.getByText("Marco Reyes")).toBeInTheDocument(); // contact, not in table-less view
    expect(q.getByText(/Phone screen passed/)).toBeInTheDocument(); // notes
  });

  it("auto-links URLs inside notes", async () => {
    const dialog = await openRow("Meridian Bank");
    const link = within(dialog).getByRole("link", {
      name: "https://example.com/posting/meridian-sre",
    });
    expect(link).toHaveAttribute("href", "https://example.com/posting/meridian-sre");
  });

  it("shows a 'file not found' badge for a missing CV", async () => {
    const dialog = await openRow("Greenfield AI");
    // Greenfield references both a missing CV and a missing cover letter.
    await waitFor(() =>
      expect(within(dialog).getAllByTestId("file-missing")).toHaveLength(2),
    );
    expect(within(dialog).getAllByTestId("file-missing")[0]).toHaveTextContent(
      /CV: file not found/i,
    );
  });

  it("renders a working PDF link when the file exists", async () => {
    const dialog = await openRow("Northwind Labs");
    await waitFor(() =>
      expect(within(dialog).getByRole("link", { name: /CV/ })).toHaveAttribute(
        "href",
        "/api/file?path=cv%2Foutput%2Fmain_northwind.pdf",
      ),
    );
  });

  it("closes on Escape and restores focus to the triggering row", async () => {
    const rows = await readTracker(smallFixture);
    render(<ApplicationsView rows={rows} />);
    const trigger = screen.getByRole("button", { name: "Brightwave" });
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus(); // focus restored to the triggering control
  });
});
