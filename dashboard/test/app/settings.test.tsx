import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { Toaster } from "@/components/ui/Toaster";

const updateSettingsAction = vi.fn(async (_p?: unknown) => ({ ok: true }) as const);
vi.mock("@/app/actions/settings", () => ({
  updateSettingsAction: (p: unknown) => updateSettingsAction(p),
}));
// next-themes needs no provider for the toggle to render a button.
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }),
}));

const initial = { repoRoot: "/repo", port: 4480, readOnly: false };

beforeEach(() => updateSettingsAction.mockClear());

describe("SettingsForm", () => {
  it("renders the current preferences", () => {
    render(<SettingsForm initial={initial} />);
    expect(screen.getByLabelText("Repo path")).toHaveValue("/repo");
    expect(screen.getByLabelText("Default port")).toHaveValue(4480);
    expect(screen.getByLabelText("Read-only mode")).not.toBeChecked();
    expect(screen.getByLabelText("Toggle theme")).toBeInTheDocument();
  });

  it("persists edited settings through the server action and toasts", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SettingsForm initial={initial} />
        <Toaster />
      </>,
    );

    await user.click(screen.getByLabelText("Read-only mode"));
    const port = screen.getByLabelText("Default port");
    await user.clear(port);
    await user.type(port, "5000");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    expect(updateSettingsAction).toHaveBeenCalledWith({
      repoRoot: "/repo",
      port: 5000,
      readOnly: true,
    });
    expect(await screen.findByText("Settings saved")).toBeInTheDocument();
  });
});
