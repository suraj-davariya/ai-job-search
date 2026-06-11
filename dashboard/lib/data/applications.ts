/**
 * Read layer: per-application generated docs under
 * documents/applications/<company>_<role>/{job_posting.md,outcome.md}.
 * Missing dir or files → null fields (drawer shows a "file not found" badge).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { paths } from "@/lib/paths";

export interface ApplicationDocs {
  slug: string;
  jobPosting: string | null;
  outcome: string | null;
}

async function readIfExists(file: string): Promise<string | null> {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}

export async function readApplicationDir(
  slug: string,
  baseDir?: string,
): Promise<ApplicationDocs> {
  const dir = path.join(baseDir ?? paths.applicationsDir(), slug);
  const [jobPosting, outcome] = await Promise.all([
    readIfExists(path.join(dir, "job_posting.md")),
    readIfExists(path.join(dir, "outcome.md")),
  ]);
  return { slug, jobPosting, outcome };
}
