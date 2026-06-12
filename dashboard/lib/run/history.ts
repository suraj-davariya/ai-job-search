/**
 * Run bookkeeping (REQ-5011): one JSON file per run under `dashboard/.runs/`.
 * Dashboard-local state, NOT product data — gitignored. Honest by construction:
 * a record stores the real exit code / error, never a synthetic success.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { paths } from "@/lib/paths";

export interface RunRecord {
  id: string;
  command: string;
  bin: string;
  args: string[];
  startedAt: string; // ISO
  endedAt?: string; // ISO
  code: number | null;
  ok: boolean;
  error?: string;
}

/** Write (or overwrite) a run record as `<id>.json`. */
export async function appendRun(
  record: RunRecord,
  dir: string = paths.runsDir(),
): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, `${record.id}.json`),
    JSON.stringify(record, null, 2),
    "utf8",
  );
}

/** List run records, newest-first by `startedAt`. Missing dir → []. */
export async function listRuns(
  dir: string = paths.runsDir(),
  limit = 50,
): Promise<RunRecord[]> {
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  const records = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => {
        try {
          return JSON.parse(
            await fs.readFile(path.join(dir, f), "utf8"),
          ) as RunRecord;
        } catch {
          return null;
        }
      }),
  );
  return records
    .filter((r): r is RunRecord => r !== null)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, limit);
}
