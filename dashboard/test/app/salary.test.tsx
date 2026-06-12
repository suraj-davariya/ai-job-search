import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SalaryPage from "@/app/(shell)/salary/page";
import { SalaryLookup } from "@/components/salary/SalaryLookup";

let dir: string;
const prevRoot = process.env.CAREERFORGE_REPO_ROOT;

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-sal-"));
  process.env.CAREERFORGE_REPO_ROOT = dir;
});
afterEach(async () => {
  process.env.CAREERFORGE_REPO_ROOT = prevRoot;
  await fs.rm(dir, { recursive: true, force: true });
  vi.unstubAllGlobals();
});

function sseResponse(sse: string): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      c.enqueue(new TextEncoder().encode(sse));
      c.close();
    },
  });
  return new Response(stream, { status: 200 });
}

describe("Salary page (browse)", () => {
  it("renders benchmarks as a table when salary_data.json is present", async () => {
    await fs.writeFile(
      path.join(dir, "salary_data.json"),
      JSON.stringify({ roles: [{ title: "Software Engineer", median: 90000 }] }),
    );
    render(await SalaryPage());
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("90000")).toBeInTheDocument();
  });

  it("shows an empty-state when salary_data.json is absent", async () => {
    render(await SalaryPage());
    expect(screen.getByText("No salary data")).toBeInTheDocument();
  });
});

describe("SalaryLookup", () => {
  it("renders a match returned by the lookup", async () => {
    const user = userEvent.setup();
    const sse = `event: output\ndata: ${JSON.stringify({
      stream: "stdout",
      data: JSON.stringify({ query: "Acme", matches: [{ company: "Acme Corp" }] }),
    })}\n\nevent: status\ndata: ${JSON.stringify({ ok: true, code: 0 })}\n\n`;
    vi.stubGlobal("fetch", vi.fn(async () => sseResponse(sse)));

    render(<SalaryLookup pythonOk readOnly={false} />);
    await user.type(screen.getByLabelText("Company"), "Acme");
    await user.click(screen.getByRole("button", { name: /look up/i }));

    await waitFor(() =>
      expect(screen.getByTestId("salary-result")).toHaveTextContent("Acme Corp"),
    );
  });

  it("honestly reports no match when matches is empty", async () => {
    const user = userEvent.setup();
    const sse = `event: output\ndata: ${JSON.stringify({
      stream: "stdout",
      data: JSON.stringify({ query: "Ghost", matches: [] }),
    })}\n\nevent: status\ndata: ${JSON.stringify({ ok: true, code: 0 })}\n\n`;
    vi.stubGlobal("fetch", vi.fn(async () => sseResponse(sse)));

    render(<SalaryLookup pythonOk readOnly={false} />);
    await user.type(screen.getByLabelText("Company"), "Ghost");
    await user.click(screen.getByRole("button", { name: /look up/i }));

    await waitFor(() =>
      expect(screen.getByTestId("salary-result")).toHaveTextContent(
        /No match found/,
      ),
    );
  });

  it("disables the lookup when python3 is missing", () => {
    render(<SalaryLookup pythonOk={false} readOnly={false} />);
    const btn = screen.getByRole("button", { name: /look up/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("title", "python3 not found on PATH");
  });
});
