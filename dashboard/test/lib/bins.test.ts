import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { hasBin } from "@/lib/run/bins";

let dir: string;
const prevPath = process.env.PATH;

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-bin-"));
  await fs.writeFile(path.join(dir, "mybin"), "#!/bin/sh\n", { mode: 0o755 });
  process.env.PATH = dir;
});
afterEach(async () => {
  process.env.PATH = prevPath;
  await fs.rm(dir, { recursive: true, force: true });
});

describe("hasBin", () => {
  it("finds an executable on PATH", async () => {
    expect(await hasBin("mybin")).toBe(true);
  });
  it("returns false for a binary that isn't on PATH", async () => {
    expect(await hasBin("definitely-absent-xyz")).toBe(false);
  });
});
