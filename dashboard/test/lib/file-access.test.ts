import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { resolveAllowedFile, fileExists } from "@/lib/data/file-access";

let root: string;
const prevEnv = process.env.CAREERFORGE_REPO_ROOT;

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), "cf-file-"));
  process.env.CAREERFORGE_REPO_ROOT = root;
  await fs.mkdir(path.join(root, "cv", "output"), { recursive: true });
  await fs.mkdir(path.join(root, "cover_letters", "output"), { recursive: true });
  await fs.writeFile(path.join(root, "cv", "output", "main.pdf"), "%PDF-1.4");
});

afterEach(async () => {
  process.env.CAREERFORGE_REPO_ROOT = prevEnv;
  await fs.rm(root, { recursive: true, force: true });
});

describe("resolveAllowedFile — path guard", () => {
  it("resolves a CV PDF inside cv/output", () => {
    const abs = resolveAllowedFile("cv/output/main.pdf");
    expect(abs).toBe(path.join(root, "cv", "output", "main.pdf"));
  });

  it("resolves a cover-letter PDF inside cover_letters/output", () => {
    const abs = resolveAllowedFile("cover_letters/output/cover.pdf");
    expect(abs).toBe(path.join(root, "cover_letters", "output", "cover.pdf"));
  });

  it("rejects parent-directory traversal", () => {
    expect(resolveAllowedFile("cv/output/../../../etc/passwd")).toBeNull();
    expect(resolveAllowedFile("../secrets.pdf")).toBeNull();
  });

  it("rejects absolute paths that escape the allowed roots", () => {
    expect(resolveAllowedFile("/etc/passwd")).toBeNull();
    expect(resolveAllowedFile(path.join(root, "CLAUDE.md"))).toBeNull();
  });

  it("rejects a sibling dir that merely shares the allowed-root prefix", () => {
    // cv/output-evil/ must NOT pass just because it starts with cv/output.
    expect(resolveAllowedFile("cv/output-evil/x.pdf")).toBeNull();
  });

  it("rejects the allowed root itself and non-PDF references", () => {
    expect(resolveAllowedFile("cv/output")).toBeNull();
    expect(resolveAllowedFile("cv/output/notes.txt")).toBeNull();
    expect(resolveAllowedFile("")).toBeNull();
    expect(resolveAllowedFile("cv/output/\0.pdf")).toBeNull();
  });
});

describe("fileExists", () => {
  it("is true for an existing file, false for a missing one", async () => {
    expect(await fileExists(path.join(root, "cv", "output", "main.pdf"))).toBe(true);
    expect(await fileExists(path.join(root, "cv", "output", "ghost.pdf"))).toBe(false);
  });
});
