import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import ProfilePage from "@/app/(shell)/profile/page";

let dir: string;
const prevRoot = process.env.CAREERFORGE_REPO_ROOT;

async function seedSkillFile() {
  const skillDir = path.join(dir, ".claude", "skills", "job-application-assistant");
  await fs.mkdir(skillDir, { recursive: true });
  await fs.writeFile(
    path.join(skillDir, "01-candidate-profile.md"),
    "# Candidate\n\nSenior engineer with a focus on platforms.",
  );
}

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-prof-"));
  process.env.CAREERFORGE_REPO_ROOT = dir;
});
afterEach(async () => {
  process.env.CAREERFORGE_REPO_ROOT = prevRoot;
  await fs.rm(dir, { recursive: true, force: true });
});

describe("Profile page", () => {
  it("renders profile sections read-only when files exist", async () => {
    await seedSkillFile();
    render(await ProfilePage());
    expect(screen.getByText("Candidate profile")).toBeInTheDocument(); // prettified heading
    expect(
      screen.getByText(/Senior engineer with a focus on platforms/),
    ).toBeInTheDocument();
  });

  it("degrades to an empty-state when no profile files exist", async () => {
    render(await ProfilePage());
    expect(screen.getByText("No profile found")).toBeInTheDocument();
  });
});
