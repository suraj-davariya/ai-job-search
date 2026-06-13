/**
 * Atomic tracker writer (impl-guide §4, REQ-5004/5006). The tracker CSV is the
 * single source of truth shared with the CLI, so every mutation must be
 * crash-safe and never leave a half-written file.
 *
 * Recipe per write: read → guard (assertTransition) → mutate in memory →
 * serialize → write `.tmp.<pid>` + fsync → copy the current file to `.bak` →
 * atomic `rename` over the original. An in-process, per-file mutex serializes
 * concurrent callers so they can't clobber each other's read-modify-write;
 * cross-process safety comes from the atomic rename itself.
 *
 * Only `status`, `notes`, and `last_updated` are ever mutated on an update;
 * manual appends write empty `cv_file`/`cover_letter_file` (no PDFs generated).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { parseTrackerCsv, serializeTrackerCsv } from "@/lib/domain/csv";
import {
  assertTransition,
  type Status,
  type TrackerRow,
} from "@/lib/domain/status";

/** The only fields an update may change (last_updated is stamped automatically). */
export type RowPatch = Partial<Pick<TrackerRow, "status" | "notes">>;

/** Today's date as YYYY-MM-DD — matches the `date` column's format. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Per-file in-process mutex ────────────────────────────────────────────────
// Each path gets a promise chain; a new task waits for the previous one to
// settle (success OR failure) before running, so reads and writes never
// interleave within this process.
const chains = new Map<string, Promise<unknown>>();

function withLock<T>(file: string, task: () => Promise<T>): Promise<T> {
  const key = path.resolve(file);
  const prev = chains.get(key) ?? Promise.resolve();
  const run = prev.then(task, task);
  // Keep the chain alive even when a task rejects (swallow only for the chain;
  // the original `run` promise still rejects to the caller).
  chains.set(
    key,
    run.then(
      () => undefined,
      () => undefined,
    ),
  );
  return run;
}

// ── Atomic file replace ──────────────────────────────────────────────────────
async function atomicWrite(file: string, text: string): Promise<void> {
  const dir = path.dirname(file);
  const base = path.basename(file);
  const tmp = path.join(dir, `.${base}.tmp.${process.pid}`);
  const bak = path.join(dir, `.${base}.bak`);

  // 1. Write the new content to a temp file and fsync it to disk.
  const fh = await fs.open(tmp, "w");
  try {
    await fh.writeFile(text, "utf8");
    await fh.sync();
  } finally {
    await fh.close();
  }

  // 2. Snapshot the current file into `.bak` (best-effort; absent on first write).
  try {
    await fs.copyFile(file, bak);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }

  // 3. Atomically swap the temp file over the original.
  await fs.rename(tmp, file);
}

// ── Read current rows (throws on real IO/parse errors; [] only when absent) ──
async function readCurrent(file: string): Promise<TrackerRow[]> {
  let text: string;
  try {
    text = await fs.readFile(file, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  return parseTrackerCsv(text);
}

/**
 * Update one row by index. Validates a status change against the state machine
 * BEFORE writing (an illegal transition throws and leaves the file untouched),
 * then mutates only status/notes and stamps `last_updated`.
 */
export async function updateRow(
  file: string,
  index: number,
  patch: RowPatch,
): Promise<void> {
  return withLock(file, async () => {
    const rows = await readCurrent(file);
    const current = rows[index];
    if (!current) throw new Error(`Row ${index} out of range`);

    if (patch.status !== undefined && patch.status !== current.status) {
      assertTransition(current.status, patch.status as Status);
    }

    const next: TrackerRow = {
      ...current,
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      last_updated: today(),
    };
    delete next._legacyLastUpdated; // in-memory flag must not round-trip
    rows[index] = next;

    await atomicWrite(file, serializeTrackerCsv(rows));
  });
}

/**
 * Append a new application row through the same atomic routine. Required fields
 * (date/company/role/status) come from `partial`; everything else defaults
 * empty, and cv/cover are always empty on a manual append.
 */
export async function appendRow(
  file: string,
  partial: Partial<TrackerRow>,
): Promise<void> {
  return withLock(file, async () => {
    const rows = await readCurrent(file);
    const date = partial.date ?? today();
    const row: TrackerRow = {
      date,
      company: partial.company ?? "",
      sector: partial.sector ?? "",
      role: partial.role ?? "",
      role_type: partial.role_type ?? "",
      channel: partial.channel ?? "",
      status: partial.status ?? "Draft",
      contact_person: partial.contact_person ?? "",
      fit_rating: partial.fit_rating ?? 0,
      notes: partial.notes ?? "",
      cv_file: "",
      cover_letter_file: "",
      source: partial.source ?? "",
      last_updated: today(),
    };
    rows.push(row);
    await atomicWrite(file, serializeTrackerCsv(rows));
  });
}
