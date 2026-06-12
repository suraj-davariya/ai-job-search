/**
 * Read layer: upskill reports (upskill/report-*.md), newest first.
 * Missing dir → [] (ARCH-0005).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { paths } from "@/lib/paths";

export interface UpskillReport {
  name: string; // file name, e.g. report-2026-06-01.md
  path: string; // absolute path
  mtimeMs: number;
}

export async function readUpskillReports(
  dir?: string,
): Promise<UpskillReport[]> {
  const base = dir ?? paths.upskillDir();
  let entries: string[];
  try {
    entries = await fs.readdir(base);
  } catch {
    return [];
  }

  const reports = await Promise.all(
    entries
      .filter((n) => /^report-.*\.md$/.test(n))
      .map(async (name) => {
        const full = path.join(base, name);
        const stat = await fs.stat(full);
        return { name, path: full, mtimeMs: stat.mtimeMs };
      }),
  );

  return reports.sort((a, b) => b.mtimeMs - a.mtimeMs);
}

/** Read a single report's markdown; missing/unreadable → null (ARCH-0005). */
export async function readUpskillReport(file: string): Promise<string | null> {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}
