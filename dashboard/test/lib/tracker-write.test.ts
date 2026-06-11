import { describe, it, expect, beforeEach } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { readTracker } from "@/lib/data/tracker";
import { updateRow, appendRow } from "@/lib/write/tracker";

let dir: string, csv: string;
const HEADER =
  "date,company,sector,role,role_type,channel,status,contact_person,fit_rating,notes,cv_file,cover_letter_file,source,last_updated";

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-"));
  csv = path.join(dir, "job_search_tracker.csv");
  await fs.writeFile(
    csv,
    HEADER +
      "\n" +
      "2026-05-01,Acme,Tech,Engineer,Full-time,LinkedIn,Draft,,80,note,,,,\n",
  );
});

describe("atomic tracker writer", () => {
  it("updates status and stamps last_updated, leaving other columns intact", async () => {
    await updateRow(csv, 0, { status: "Sent" });
    const rows = await readTracker(csv);
    expect(rows[0].status).toBe("Sent");
    expect(rows[0].company).toBe("Acme");
    expect(rows[0].last_updated).not.toBe(""); // materialized
  });
  it("rejects an illegal transition without writing", async () => {
    await expect(updateRow(csv, 0, { status: "Offer" })).rejects.toThrow(
      /not allowed/i,
    );
    const rows = await readTracker(csv);
    expect(rows[0].status).toBe("Draft"); // unchanged
  });
  it("writes a .bak before replacing", async () => {
    await updateRow(csv, 0, { notes: "updated" });
    const bak = path.join(dir, ".job_search_tracker.csv.bak");
    expect((await fs.stat(bak)).isFile()).toBe(true);
  });
  it("appends a new row through the same routine", async () => {
    await appendRow(csv, {
      date: "2026-05-09",
      company: "Beta",
      role: "PM",
      status: "Draft",
    });
    const rows = await readTracker(csv);
    expect(rows.length).toBe(2);
    expect(rows[1].cv_file).toBe(""); // empty cv/cover on manual append
  });
  it("survives 5 concurrent updates without corrupting the header", async () => {
    await Promise.all(
      [0, 0, 0, 0, 0].map(() =>
        updateRow(csv, 0, { notes: "x" }).catch(() => {}),
      ),
    );
    const raw = await fs.readFile(csv, "utf8");
    expect(raw.split("\n")[0]).toBe(HEADER); // header intact, file parseable
    expect((await readTracker(csv)).length).toBe(1);
  });
});
