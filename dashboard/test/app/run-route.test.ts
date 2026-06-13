import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Stub the runner + history so the route is tested in isolation (no real spawn).
const startRun = vi.fn();
const stopRun = vi.fn((_command?: string) => ["apply"]);
const activeCommands = vi.fn(() => ["apply"]);
const appendRun = vi.fn(async (_record?: unknown) => {});
const listRuns = vi.fn(async () => [{ id: "a", command: "apply", ok: true }]);

vi.mock("@/lib/run/spawn", () => ({
  startRun: (command: string, argv: unknown) => startRun(command, argv),
  stopRun: (command?: string) => stopRun(command),
  activeCommands: () => activeCommands(),
}));
vi.mock("@/lib/run/history", () => ({
  appendRun: (record: unknown) => appendRun(record),
  listRuns: () => listRuns(),
}));

import { POST as runPost } from "@/app/api/run/[command]/route";
import { GET as runsGet, POST as runsPost } from "@/app/api/runs/route";

const prevRO = process.env.CAREERFORGE_READ_ONLY;

function req(body: unknown) {
  return new Request("http://127.0.0.1/api/run/x", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
const ctx = (command: string) => ({ params: Promise.resolve({ command }) });

/** Fake run handle: yields two chunks, then resolves ok. */
function fakeHandle() {
  return {
    command: "apply",
    pid: 4242,
    output: (async function* () {
      yield { stream: "stdout", data: "working...\n" };
      yield { stream: "stdout", data: "done\n" };
    })(),
    result: Promise.resolve({ code: 0, signal: null, ok: true }),
    stop: vi.fn(),
  };
}

beforeEach(() => {
  delete process.env.CAREERFORGE_READ_ONLY;
  startRun.mockReset();
  appendRun.mockClear();
});
afterEach(() => {
  process.env.CAREERFORGE_READ_ONLY = prevRO;
});

describe("POST /api/run/[command]", () => {
  it("streams output then a terminal status, and records history", async () => {
    startRun.mockReturnValue(fakeHandle());
    const res = await runPost(req({ url: "https://x.co/job" }), ctx("apply"));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/event-stream");
    const text = await res.text();
    expect(text).toContain("event: output");
    expect(text).toContain("working...");
    expect(text).toContain("event: status");
    expect(text).toMatch(/"ok":true/);
    expect(appendRun).toHaveBeenCalledTimes(1);
  });

  it("rejects an unknown command with 400", async () => {
    const res = await runPost(req({}), ctx("rm"));
    expect(res.status).toBe(400);
    expect(startRun).not.toHaveBeenCalled();
  });

  it("refuses in read-only mode with 403", async () => {
    process.env.CAREERFORGE_READ_ONLY = "1";
    const res = await runPost(req({ url: "https://x.co" }), ctx("apply"));
    expect(res.status).toBe(403);
    expect(startRun).not.toHaveBeenCalled();
  });

  it("rejects invalid arguments with 400 before spawning", async () => {
    const res = await runPost(req({ url: "not-a-url" }), ctx("apply"));
    expect(res.status).toBe(400);
    expect(startRun).not.toHaveBeenCalled();
  });

  it("returns 409 when a run of that type is already in flight", async () => {
    startRun.mockImplementation(() => {
      throw new Error("A apply run is already in progress");
    });
    const res = await runPost(req({ url: "https://x.co" }), ctx("apply"));
    expect(res.status).toBe(409);
  });
});

describe("/api/runs", () => {
  it("GET lists history and active runs", async () => {
    const res = await runsGet();
    const body = await res.json();
    expect(body.runs[0].id).toBe("a");
    expect(body.active).toEqual(["apply"]);
  });

  it("POST stop sends SIGTERM via stopRun", async () => {
    const res = await runsPost(
      new Request("http://127.0.0.1/api/runs", {
        method: "POST",
        body: JSON.stringify({ action: "stop" }),
      }),
    );
    expect((await res.json()).stopped).toEqual(["apply"]);
    expect(stopRun).toHaveBeenCalled();
  });

  it("POST with an unknown action is 400", async () => {
    const res = await runsPost(
      new Request("http://127.0.0.1/api/runs", {
        method: "POST",
        body: JSON.stringify({ action: "nope" }),
      }),
    );
    expect(res.status).toBe(400);
  });
});
