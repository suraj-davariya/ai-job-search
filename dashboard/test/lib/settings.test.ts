import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { readSettings, writeSettings } from "@/lib/settings";

let file: string;

beforeEach(async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-set-"));
  file = path.join(dir, ".dashboard.local.json");
});
afterEach(async () => {
  await fs.rm(path.dirname(file), { recursive: true, force: true });
});

describe("settings persistence", () => {
  it("returns {} when the file is absent", async () => {
    expect(await readSettings(file)).toEqual({});
  });

  it("round-trips the allowed fields", async () => {
    await writeSettings({ port: 5000, readOnly: true, repoRoot: "/tmp/repo" }, file);
    expect(await readSettings(file)).toEqual({
      port: 5000,
      readOnly: true,
      repoRoot: "/tmp/repo",
    });
  });

  it("drops unknown keys / secrets (whitelist only)", async () => {
    await writeSettings(
      // @ts-expect-error — deliberately passing a disallowed field
      { port: 4480, apiKey: "sk-secret", token: "abc" },
      file,
    );
    const raw = JSON.parse(await fs.readFile(file, "utf8"));
    expect(raw).toEqual({ port: 4480 });
    expect(raw.apiKey).toBeUndefined();
  });

  it("merges a patch over existing settings", async () => {
    await writeSettings({ port: 4480, readOnly: false }, file);
    await writeSettings({ readOnly: true }, file);
    expect(await readSettings(file)).toEqual({ port: 4480, readOnly: true });
  });
});
