import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { updateRowAction, appendRowAction } from "@/app/actions/tracker";
import { readTracker } from "@/lib/data/tracker";

// revalidatePath only works inside a request scope; stub it for unit tests.
const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: (p: string) => revalidatePath(p) }));

const HEADER =
  "date,company,sector,role,role_type,channel,status,contact_person,fit_rating,notes,cv_file,cover_letter_file,source,last_updated";
const SEED =
  "2026-05-01,Acme,Tech,Engineer,Full-time,LinkedIn,Draft,,80,note,,,,\n";

let dir: string, csv: string;
const prevRoot = process.env.CAREERFORGE_REPO_ROOT;
const prevRO = process.env.CAREERFORGE_READ_ONLY;

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-act-"));
  csv = path.join(dir, "job_search_tracker.csv");
  await fs.writeFile(csv, HEADER + "\n" + SEED);
  process.env.CAREERFORGE_REPO_ROOT = dir; // paths.tracker() → this csv
  delete process.env.CAREERFORGE_READ_ONLY;
  revalidatePath.mockClear();
});

afterEach(async () => {
  process.env.CAREERFORGE_REPO_ROOT = prevRoot;
  process.env.CAREERFORGE_READ_ONLY = prevRO;
  await fs.rm(dir, { recursive: true, force: true });
});

describe("tracker server actions", () => {
  it("refuses to write in read-only mode and leaves the file unchanged", async () => {
    process.env.CAREERFORGE_READ_ONLY = "1";
    const before = await fs.readFile(csv, "utf8");

    const res = await updateRowAction(0, { status: "Sent" });

    expect(res).toEqual({ error: "read-only" });
    expect(await fs.readFile(csv, "utf8")).toBe(before); // not written
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("updates a row and revalidates the affected routes", async () => {
    const res = await updateRowAction(0, { status: "Sent" });

    expect(res).toEqual({ ok: true });
    expect((await readTracker(csv))[0].status).toBe("Sent");
    expect(revalidatePath).toHaveBeenCalledWith("/applications");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("returns the state-machine error for an illegal transition", async () => {
    const res = await updateRowAction(0, { status: "Offer" });

    expect(res).toMatchObject({ error: expect.stringMatching(/not allowed/i) });
    expect((await readTracker(csv))[0].status).toBe("Draft");
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects an invalid patch shape before touching disk", async () => {
    const before = await fs.readFile(csv, "utf8");
    // @ts-expect-error — deliberately wrong shape
    const res = await updateRowAction(0, { status: "Bogus" });

    expect(res).toEqual({ error: "invalid patch" });
    expect(await fs.readFile(csv, "utf8")).toBe(before);
  });

  it("appends a valid new row", async () => {
    const res = await appendRowAction({
      date: "2026-05-09",
      company: "Beta",
      role: "PM",
      status: "Draft",
    });

    expect(res).toEqual({ ok: true });
    const rows = await readTracker(csv);
    expect(rows).toHaveLength(2);
    expect(rows[1].company).toBe("Beta");
  });

  it("rejects an append missing a required field", async () => {
    const res = await appendRowAction(
      // @ts-expect-error — missing required company/role
      { date: "2026-05-09", status: "Draft" },
    );
    expect(res).toEqual({ error: "invalid row" });
    expect(await readTracker(csv)).toHaveLength(1);
  });
});
