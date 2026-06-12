import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import CompaniesPage from "@/app/(shell)/companies/page";

let dir: string;
const prevRoot = process.env.CAREERFORGE_REPO_ROOT;

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-co-"));
  // Seed a tracker but NO salary_data.json → salary portion is an empty-state.
  const fixture = path.join(__dirname, "..", "fixtures", "tracker-small.csv");
  await fs.copyFile(fixture, path.join(dir, "job_search_tracker.csv"));
  process.env.CAREERFORGE_REPO_ROOT = dir;
});
afterEach(async () => {
  process.env.CAREERFORGE_REPO_ROOT = prevRoot;
  await fs.rm(dir, { recursive: true, force: true });
});

describe("Companies page", () => {
  it("groups the tracker by company and shows the salary empty-state", async () => {
    render(await CompaniesPage());

    // Grouped companies appear as rows (each company once).
    const table = screen.getByRole("table");
    const helios = within(table).getByText("Helios Analytics").closest("tr")!;
    expect(within(helios).getByText("Data")).toBeInTheDocument(); // sector
    expect(within(helios).getByText("1")).toBeInTheDocument(); // app count

    // No salary_data.json → honest empty-state, never an error.
    expect(screen.getByText("No salary data")).toBeInTheDocument();
  });
});
