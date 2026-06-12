import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import UpskillPage from "@/app/(shell)/upskill/page";

let dir: string;
const prevRoot = process.env.CAREERFORGE_REPO_ROOT;

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-up-"));
  process.env.CAREERFORGE_REPO_ROOT = dir;
});
afterEach(async () => {
  process.env.CAREERFORGE_REPO_ROOT = prevRoot;
  await fs.rm(dir, { recursive: true, force: true });
});

describe("Upskill page", () => {
  it("renders existing reports and the /upskill trigger", async () => {
    const up = path.join(dir, "upskill");
    await fs.mkdir(up, { recursive: true });
    await fs.writeFile(
      path.join(up, "report-2026-06-01.md"),
      "# Upskill report\n\nFocus: Kubernetes, distributed systems.",
    );

    render(await UpskillPage());
    expect(screen.getByText("report-2026-06-01.md")).toBeInTheDocument();
    expect(screen.getByText(/Focus: Kubernetes/)).toBeInTheDocument();
    // Trigger links to the console.
    expect(
      screen.getByRole("link", { name: /Run \/upskill/i }),
    ).toHaveAttribute("href", "/console");
  });

  it("shows an empty-state when there are no reports", async () => {
    render(await UpskillPage());
    expect(screen.getByText("No upskill reports yet")).toBeInTheDocument();
  });
});
