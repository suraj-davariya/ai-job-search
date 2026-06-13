import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "node:path";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationsView } from "@/components/applications/ApplicationsView";
import { readTracker } from "@/lib/data/tracker";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(""),
}));

const appendRowAction = vi.fn(async (..._args: unknown[]) => ({ ok: true }) as const);
vi.mock("@/app/actions/tracker", () => ({
  appendRowAction: (...args: unknown[]) => appendRowAction(...args),
  updateRowAction: vi.fn(async () => ({ ok: true }) as const),
}));

const smallFixture = path.join(__dirname, "..", "fixtures", "tracker-small.csv");

async function renderView() {
  const rows = await readTracker(smallFixture);
  render(<ApplicationsView rows={rows} />);
  return rows;
}

beforeEach(() => appendRowAction.mockClear());

describe("New application dialog", () => {
  it("opens from the toolbar button", async () => {
    const user = userEvent.setup();
    await renderView();
    await user.click(screen.getByRole("button", { name: /new application/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("blocks submit when a required field is missing", async () => {
    const user = userEvent.setup();
    await renderView();
    await user.click(screen.getByRole("button", { name: /new application/i }));
    const dialog = screen.getByRole("dialog");

    // Company + role are required and start empty → submit must be blocked.
    await user.click(within(dialog).getByRole("button", { name: /add application/i }));

    await waitFor(() =>
      expect(within(dialog).getByText("Company is required")).toBeInTheDocument(),
    );
    expect(within(dialog).getByText("Role is required")).toBeInTheDocument();
    expect(appendRowAction).not.toHaveBeenCalled();
  });

  it("appends a valid application and closes", async () => {
    const user = userEvent.setup();
    await renderView();
    await user.click(screen.getByRole("button", { name: /new application/i }));
    const dialog = screen.getByRole("dialog");

    await user.type(within(dialog).getByLabelText("Company"), "Zenith Labs");
    await user.type(within(dialog).getByLabelText("Role"), "Data Engineer");
    await user.click(within(dialog).getByRole("button", { name: /add application/i }));

    await waitFor(() => expect(appendRowAction).toHaveBeenCalledTimes(1));
    const payload = appendRowAction.mock.calls[0][0] as Record<string, unknown>;
    expect(payload).toMatchObject({
      company: "Zenith Labs",
      role: "Data Engineer",
      status: "Draft", // default
    });
    expect(payload.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // defaulted to today
    // Dialog closes on success.
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
