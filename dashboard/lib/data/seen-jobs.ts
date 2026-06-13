/**
 * Read layer: the job-scraper's seen-jobs state (job_scraper/seen_jobs.json).
 * Shape: { seen: string[] }. Missing/malformed → [] (ARCH-0005).
 */
import { promises as fs } from "node:fs";
import { paths } from "@/lib/paths";

export async function readSeenJobs(filePath?: string): Promise<string[]> {
  const file = filePath ?? paths.seenJobs();
  try {
    const text = await fs.readFile(file, "utf8");
    const data = JSON.parse(text) as { seen?: unknown };
    return Array.isArray(data.seen) ? data.seen.map(String) : [];
  } catch {
    return [];
  }
}
