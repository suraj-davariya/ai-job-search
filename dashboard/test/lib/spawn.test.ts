import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { startRun } from "@/lib/run/spawn";
import { appendRun, listRuns, type RunRecord } from "@/lib/run/history";

async function collect(handle: ReturnType<typeof startRun>) {
  let out = "";
  let err = "";
  for await (const c of handle.output) {
    if (c.stream === "stdout") out += c.data;
    else err += c.data;
  }
  const result = await handle.result;
  return { out, err, result };
}

describe("startRun", () => {
  it("streams stdout chunks and resolves the real exit code", async () => {
    const h = startRun("t-ok", { bin: "python3", args: ["-c", "print('hello')"] });
    const { out, result } = await collect(h);
    expect(out).toContain("hello");
    expect(result.code).toBe(0);
    expect(result.ok).toBe(true);
  });

  it("surfaces a non-zero exit code as not-ok", async () => {
    const h = startRun("t-fail", {
      bin: "python3",
      args: ["-c", "import sys; sys.exit(3)"],
    });
    const { result } = await collect(h);
    expect(result.code).toBe(3);
    expect(result.ok).toBe(false);
  });

  it("spawns without a shell — metacharacters are literal argv", async () => {
    const h = startRun("t-noshell", {
      bin: "python3",
      args: ["-c", "import sys; print(sys.argv[1])", "$(echo pwned)"],
    });
    const { out } = await collect(h);
    expect(out).toContain("$(echo pwned)"); // not expanded by a shell
  });

  it("rejects a second concurrent run of the same command type", async () => {
    const h1 = startRun("t-lock", {
      bin: "python3",
      args: ["-c", "import time; time.sleep(0.3)"],
    });
    expect(() =>
      startRun("t-lock", { bin: "python3", args: ["-c", "pass"] }),
    ).toThrow(/in progress|already/i);
    await collect(h1);
    // Lock releases after completion → a fresh run is allowed.
    const h2 = startRun("t-lock", { bin: "python3", args: ["-c", "pass"] });
    expect((await collect(h2)).result.ok).toBe(true);
  });

  it("returns a clear error (no crash) when the bin is missing", async () => {
    const h = startRun("t-missing", {
      bin: "definitely-not-a-real-bin-xyz",
      args: [],
    });
    const { result } = await collect(h);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/definitely-not-a-real-bin-xyz|ENOENT/);
  });

  it("stop() terminates a running process with SIGTERM", async () => {
    const h = startRun("t-stop", {
      bin: "python3",
      args: ["-c", "import time; time.sleep(30)"],
    });
    h.stop();
    const { result } = await collect(h);
    expect(result.ok).toBe(false);
    expect(result.signal).toBe("SIGTERM");
  });
});

describe("run history", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "cf-runs-"));
  });
  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("appends a JSON record and lists newest-first", async () => {
    const base: Omit<RunRecord, "id" | "startedAt"> = {
      command: "apply",
      bin: "claude",
      args: ["-p", "/apply x"],
      code: 0,
      ok: true,
    };
    await appendRun({ ...base, id: "a", startedAt: "2026-06-10T10:00:00Z" }, dir);
    await appendRun({ ...base, id: "b", startedAt: "2026-06-11T10:00:00Z" }, dir);

    const runs = await listRuns(dir);
    expect(runs.map((r) => r.id)).toEqual(["b", "a"]); // newest first
    expect(runs[0].command).toBe("apply");

    // Round-trips through a real file.
    expect(
      JSON.parse(await fs.readFile(path.join(dir, "a.json"), "utf8")).ok,
    ).toBe(true);
  });

  it("returns [] for a missing runs dir", async () => {
    expect(await listRuns(path.join(dir, "nope"))).toEqual([]);
  });
});
