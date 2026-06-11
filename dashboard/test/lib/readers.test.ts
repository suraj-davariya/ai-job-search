import { describe, it, expect } from "vitest";
import path from "node:path";
import { readSeenJobs } from "@/lib/data/seen-jobs";
import { readSalary } from "@/lib/data/salary";
import { readApplicationDir } from "@/lib/data/applications";
import { readUpskillReports } from "@/lib/data/upskill";
import { readProfile } from "@/lib/data/profile";

const fix = (...p: string[]) => path.join(__dirname, "..", "fixtures", ...p);

describe("readSeenJobs", () => {
  it("returns [] when the file is missing", async () => {
    expect(await readSeenJobs("/nope/seen.json")).toEqual([]);
  });
  it("reads the seen array", async () => {
    expect(await readSeenJobs(fix("seen_jobs.json"))).toEqual([
      "job-1",
      "job-2",
      "job-3",
    ]);
  });
});

describe("readSalary", () => {
  it("returns null when absent (REQ-5014 empty-state)", async () => {
    expect(await readSalary("/nope/salary.json")).toBeNull();
  });
  it("parses present salary data", async () => {
    const data = await readSalary(fix("salary_data.json"));
    expect(data).not.toBeNull();
    expect(data).toHaveProperty("roles");
  });
});

describe("readApplicationDir", () => {
  it("returns null fields when the dir is missing", async () => {
    const docs = await readApplicationDir("Nope_Role", fix("applications"));
    expect(docs.jobPosting).toBeNull();
    expect(docs.outcome).toBeNull();
  });
  it("reads job_posting.md and outcome.md", async () => {
    const docs = await readApplicationDir("Acme_Engineer", fix("applications"));
    expect(docs.jobPosting).toContain("Acme");
    expect(docs.outcome).toContain("Onsite");
  });
});

describe("readUpskillReports", () => {
  it("returns [] when the dir is missing", async () => {
    expect(await readUpskillReports("/nope/upskill")).toEqual([]);
  });
  it("lists only report-*.md files", async () => {
    const reports = await readUpskillReports(fix("upskill"));
    expect(reports).toHaveLength(1);
    expect(reports[0].name).toBe("report-2026-06-01.md");
    expect(typeof reports[0].mtimeMs).toBe("number");
  });
});

describe("readProfile", () => {
  it("returns [] when nothing exists", async () => {
    const sections = await readProfile({
      skillDir: "/nope/skills",
      memoryPath: "/nope/CLAUDE.md",
    });
    expect(sections).toEqual([]);
  });
  it("assembles numbered profile files + memory, omitting missing", async () => {
    const sections = await readProfile({
      skillDir: fix("profile"),
      memoryPath: fix("profile-claude.md"),
    });
    const names = sections.map((s) => s.name);
    expect(names).toContain("01-candidate-profile.md");
    expect(names).toContain("03-writing-style.md");
    expect(sections.some((s) => s.content.includes("Candidate Profile"))).toBe(true);
  });
});
