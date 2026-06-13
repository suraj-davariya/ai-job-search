/**
 * Read layer: load the tracker CSV into typed rows.
 * Tolerates missing/empty/malformed files with a graceful empty result
 * (ARCH-0005) — never throws a page-crashing error.
 */
import { promises as fs } from "node:fs";
import { parseTrackerCsv } from "@/lib/domain/csv";
import { paths } from "@/lib/paths";
import type { TrackerRow } from "@/lib/domain/status";
import { IS_DEMO } from "@/lib/demo/flags";
import { DEMO_ROWS } from "@/lib/demo/seed";

export async function readTracker(filePath?: string): Promise<TrackerRow[]> {
  // Static demo build: serve bundled sample rows, never touch the filesystem.
  if (IS_DEMO) return DEMO_ROWS.map((r, i) => ({ ...r, _row: i }));

  const file = filePath ?? paths.tracker();

  let text: string;
  try {
    text = await fs.readFile(file, "utf8");
  } catch {
    // Missing file → empty tracker (first-run empty-state).
    return [];
  }

  try {
    return parseTrackerCsv(text);
  } catch (err) {
    console.warn(`readTracker: failed to parse ${file}:`, err);
    return [];
  }
}
