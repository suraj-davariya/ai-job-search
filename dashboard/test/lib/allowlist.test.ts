import { describe, it, expect } from "vitest";
import {
  buildCommand,
  commandBin,
  isAllowed,
  ALLOWED_COMMANDS,
} from "@/lib/run/allowlist";

describe("command allowlist", () => {
  it("builds /apply as an argv array, never a shell string", () => {
    const argv = buildCommand("apply", { url: "https://x.co/job", mode: "quick" });
    expect(argv.bin).toBe("claude");
    expect(Array.isArray(argv.args)).toBe(true);
    expect(argv.args).toContain("-p");
  });
  it("rejects an unknown command", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => buildCommand("rm", { x: "1" } as any)).toThrow(/not allowed/i);
  });
  it("rejects an invalid review mode", () => {
    expect(() =>
      buildCommand("apply", { url: "https://x.co", mode: "evil;rm -rf" }),
    ).toThrow();
  });
  it("passes salary-lookup company as a single argv slot", () => {
    const argv = buildCommand("salary-lookup", { company: "Beta Corp; rm -rf /" });
    expect(argv.bin).toBe("python3");
    expect(argv.args).toContain("Beta Corp; rm -rf /"); // opaque arg, not a shell fragment
    expect(argv.args).toContain("--json");
  });

  // ── extra coverage ────────────────────────────────────────────────────────
  it("rejects a non-URL for /apply", () => {
    expect(() => buildCommand("apply", { url: "not a url" })).toThrow(/url/i);
  });
  it("defaults /apply review mode to none (no --review flag)", () => {
    const argv = buildCommand("apply", { url: "https://x.co/j" });
    expect(argv.args.join(" ")).toContain("/apply https://x.co/j");
    expect(argv.args.join(" ")).not.toContain("--review");
  });
  it("builds /search, /upskill, /expand, /setup via claude -p", () => {
    for (const cmd of ["search", "upskill", "expand", "setup"] as const) {
      const argv = buildCommand(cmd, {});
      expect(argv.bin).toBe("claude");
      expect(argv.args[0]).toBe("-p");
      expect(argv.args[1]).toContain(`/${cmd}`);
    }
  });
  it("requires a non-empty company for salary-lookup", () => {
    expect(() => buildCommand("salary-lookup", { company: "  " })).toThrow();
  });
  it("threads an optional --city through salary-lookup as a discrete slot", () => {
    const argv = buildCommand("salary-lookup", {
      company: "Acme",
      city: "Berlin",
    });
    expect(argv.args).toContain("--city");
    expect(argv.args).toContain("Berlin");
  });
  it("exposes the bin and allow-status of each command", () => {
    expect(isAllowed("apply")).toBe(true);
    expect(isAllowed("rm")).toBe(false);
    expect(commandBin("salary-lookup")).toBe("python3");
    expect(ALLOWED_COMMANDS).toContain("apply");
    expect(ALLOWED_COMMANDS).not.toContain("rm");
  });
});
