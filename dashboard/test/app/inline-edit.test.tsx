import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "node:path";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationsView } from "@/components/applications/ApplicationsView";
import { Toaster } from "@/components/ui/Toaster";
import { readTracker } from "@/lib/data/tracker";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(""),
}));

// Stub the server action so edits don't touch disk; default = success.
const updateRowAction = vi.fn(
  async (..._args: unknown[]) => ({ ok: true }) as const,
);
vi.mock("@/app/actions/tracker", () => ({
  updateRowAction: (...args: unknown[]) => updateRowAction(...args),
  appendRowAction: vi.fn(),
}));

const smallFixture = path.join(__dirname, "..", "fixtures", "tracker-small.csv");

async function renderView() {
  const rows = await readTracker(smallFixture);
  render(
    <>
      <ApplicationsView rows={rows} />
      <Toaster />
    </>,
  );
  return rows;
}

beforeEach(() => updateRowAction.mockClear());

describe("inline status edit", () => {
  it("persists an allowed change and toasts", async () => {
    const user = userEvent.setup();
    await renderView();
    // Helios Analytics is Draft and the first CSV row (_row 0).
    const select = screen.getByLabelText("Status for Helios Analytics");
    await user.selectOptions(select, "Sent");

    await waitFor(() =>
      expect(updateRowAction).toHaveBeenCalledWith(0, { status: "Sent" }),
    );
    expect(await screen.findByText(/Updated ·/)).toBeInTheDocument();
    expect((select as HTMLSelectElement).value).toBe("Sent"); // optimistic stays
  });

  it("never offers a status outside the state machine", async () => {
    await renderView();
    const select = screen.getByLabelText(
      "Status for Helios Analytics",
    ) as HTMLSelectElement;
    const offered = within(select)
      .getAllByRole("option")
      .map((o) => (o as HTMLOptionElement).value);
    // Draft → only Draft, Sent, Withdrawn are legal.
    expect(offered).toEqual(["Draft", "Sent", "Withdrawn"]);
    expect(offered).not.toContain("Offer");
    expect(offered).not.toContain("Interview");
  });

  it("reverts the cell when the write is rejected", async () => {
    const user = userEvent.setup();
    updateRowAction.mockResolvedValueOnce({
      error: "Transition Draft → Sent is not allowed",
    } as never);
    await renderView();

    const select = screen.getByLabelText(
      "Status for Helios Analytics",
    ) as HTMLSelectElement;
    await user.selectOptions(select, "Sent");

    await waitFor(() => expect(select.value).toBe("Draft")); // reverted
    expect(await screen.findByText(/Couldn't update status/)).toBeInTheDocument();
  });

  it("renders a static pill (no select) for terminal statuses", async () => {
    await renderView();
    // Cobalt Systems is Rejected → terminal, not editable.
    expect(
      screen.queryByLabelText("Status for Cobalt Systems"),
    ).not.toBeInTheDocument();
  });
});

describe("inline notes edit", () => {
  it("persists notes on blur and toasts", async () => {
    const user = userEvent.setup();
    await renderView();
    const notes = screen.getByLabelText("Notes for Helios Analytics");
    await user.clear(notes);
    await user.type(notes, "Followed up");
    await user.tab(); // blur → commit

    await waitFor(() =>
      expect(updateRowAction).toHaveBeenCalledWith(0, { notes: "Followed up" }),
    );
    expect(await screen.findByText(/Updated ·/)).toBeInTheDocument();
  });
});
