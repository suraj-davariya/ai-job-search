import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RunLog } from "@/components/console/RunLog";
import { RunList } from "@/components/console/RunList";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
}));

/** Build a fetch Response whose body streams the given SSE text. */
function sseResponse(sse: string): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(sse));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

const SSE = [
  `event: start\ndata: ${JSON.stringify({ id: "1", pid: 5 })}\n\n`,
  `event: output\ndata: ${JSON.stringify({ stream: "stdout", data: "looking up Acme…\n" })}\n\n`,
  `event: status\ndata: ${JSON.stringify({ id: "1", ok: true, code: 0 })}\n\n`,
].join("");

beforeEach(() => vi.restoreAllMocks());
afterEach(() => vi.unstubAllGlobals());

describe("RunLog", () => {
  it("streams a triggered run's output into the log with a terminal status", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async () => sseResponse(SSE));
    vi.stubGlobal("fetch", fetchMock);

    render(<RunLog claudeOk pythonOk readOnly={false} />);
    await user.type(screen.getByLabelText("Company"), "Acme");
    await user.click(screen.getByRole("button", { name: /look up/i }));

    await waitFor(() =>
      expect(screen.getByTestId("run-output")).toHaveTextContent(
        "looking up Acme",
      ),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/run/salary-lookup",
      expect.objectContaining({ method: "POST" }),
    );
    // Terminal status surfaced from the SSE status event.
    expect(await screen.findByText(/Exit 0 · ok/)).toBeInTheDocument();
  });

  it("disables the salary trigger with a tooltip when python3 is missing", async () => {
    render(<RunLog claudeOk pythonOk={false} readOnly={false} />);
    // Even with a company typed, the button is disabled and explains why.
    const btn = screen.getByRole("button", { name: /look up/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("title", "python3 not found on PATH");
  });

  it("disables /upskill when claude is missing", async () => {
    render(<RunLog claudeOk={false} pythonOk readOnly={false} />);
    const btn = screen.getByRole("button", { name: /run \/upskill/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("title", "claude not found on PATH");
  });

  it("disables every trigger in read-only mode", async () => {
    render(<RunLog claudeOk pythonOk readOnly />);
    expect(screen.getByRole("button", { name: /run \/upskill/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /look up/i })).toBeDisabled();
  });
});

describe("RunList", () => {
  it("renders recent runs from /api/runs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        json: async () => ({
          runs: [{ id: "r1", command: "apply", code: 0, ok: true }],
          active: [],
        }),
      })),
    );
    render(<RunList />);
    expect(await screen.findByText("/apply")).toBeInTheDocument();
    expect(screen.getByText("exit 0")).toBeInTheDocument();
  });
});
