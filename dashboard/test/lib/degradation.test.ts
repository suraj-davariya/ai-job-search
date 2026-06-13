import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

// Import EVERY lib/ module — a broken module (bad import, top-level throw) fails
// this suite at load time. Pure-domain + read + run layers all included.
import * as config from "@/lib/config";
import * as paths from "@/lib/paths";
import * as utils from "@/lib/utils";
import * as toast from "@/lib/toast";
import * as settings from "@/lib/settings";
import * as tracker from "@/lib/data/tracker";
import * as applications from "@/lib/data/applications";
import * as profile from "@/lib/data/profile";
import * as salary from "@/lib/data/salary";
import * as seenJobs from "@/lib/data/seen-jobs";
import * as upskill from "@/lib/data/upskill";
import * as fileAccess from "@/lib/data/file-access";
import * as status from "@/lib/domain/status";
import * as csv from "@/lib/domain/csv";
import * as filter from "@/lib/domain/filter";
import * as kpi from "@/lib/domain/kpi";
import * as aggregate from "@/lib/domain/aggregate";
import * as companies from "@/lib/domain/companies";
import * as allowlist from "@/lib/run/allowlist";
import * as spawn from "@/lib/run/spawn"; // imported only; not executed (would spawn)
import * as history from "@/lib/run/history";
import * as bins from "@/lib/run/bins";

let dir: string;
const prevRoot = process.env.CAREERFORGE_REPO_ROOT;

beforeEach(async () => {
  // An EMPTY repo — no tracker, no salary, no profile, no upskill, no .runs.
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-empty-"));
  process.env.CAREERFORGE_REPO_ROOT = dir;
});
afterEach(async () => {
  process.env.CAREERFORGE_REPO_ROOT = prevRoot;
  await fs.rm(dir, { recursive: true, force: true });
});

describe("graceful degradation against an empty repo (ARCH-0005)", () => {
  it("every reader returns a graceful empty value, never throwing", async () => {
    expect(await tracker.readTracker()).toEqual([]);
    expect(await seenJobs.readSeenJobs()).toEqual([]);
    expect(await salary.readSalary()).toBeNull();
    expect(await profile.readProfile()).toEqual([]);
    expect(await upskill.readUpskillReports()).toEqual([]);
    expect(await upskill.readUpskillReport("/nope.md")).toBeNull();
    expect(await applications.readApplicationDir("Acme_Engineer")).toMatchObject({
      jobPosting: null,
      outcome: null,
    });
    expect(await settings.readSettings()).toEqual({});
    expect(await history.listRuns(path.join(dir, ".runs"))).toEqual([]);
    expect(await bins.hasBin("definitely-absent-xyz")).toBe(false);
  });

  it("pure domain functions handle empty input safely", () => {
    expect(kpi.kpis([]).total).toBe(0);
    expect(companies.summarizeCompanies([])).toEqual([]);
    expect(aggregate.byWeek([])).toEqual([]);
    expect(aggregate.byStatus([]).length).toBe(status.STATUSES.length);
    expect(filter.applyFilter([], filter.emptyFilter())).toEqual([]);
    expect(csv.parseTrackerCsv("")).toEqual([]);
    expect(utils.cn("a", "b")).toContain("a");
  });

  it("the file-access guard rejects junk without throwing", () => {
    expect(fileAccess.resolveAllowedFile("../../etc/passwd")).toBeNull();
    expect(fileAccess.resolveAllowedFile("")).toBeNull();
  });

  it("config + paths resolve against the empty repo", () => {
    expect(config.getConfig().repoRoot).toBe(dir);
    expect(paths.paths.tracker()).toContain("job_search_tracker.csv");
    expect(allowlist.isAllowed("apply")).toBe(true);
    expect(typeof toast.toast).toBe("function");
    expect(typeof spawn.startRun).toBe("function");
  });
});
