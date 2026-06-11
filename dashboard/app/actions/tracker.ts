"use server";

/**
 * Server Actions for tracker mutations (REQ-5004/5006, REQ-5007).
 *
 * Thin, validated boundary between the UI and `lib/write/tracker`:
 *   1. Refuse every write when the dashboard is in read-only mode.
 *   2. Validate the payload with zod (reject bad shapes before touching disk).
 *   3. Delegate to the atomic writer, then revalidate the affected routes.
 *
 * Rows are addressed by their index in the tracker CSV (the file is the
 * identity — there is no surrogate id). Every action returns a typed result so
 * the client can toast success or surface the error inline.
 */
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getConfig } from "@/lib/config";
import { paths } from "@/lib/paths";
import { STATUSES } from "@/lib/domain/status";
import { updateRow, appendRow } from "@/lib/write/tracker";

export type ActionResult = { ok: true } | { error: string };

const READ_ONLY: ActionResult = { error: "read-only" };

const statusEnum = z.enum(STATUSES);

const patchSchema = z
  .object({
    status: statusEnum.optional(),
    notes: z.string().optional(),
  })
  .refine((p) => p.status !== undefined || p.notes !== undefined, {
    message: "empty patch",
  });

const appendSchema = z.object({
  date: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  status: statusEnum,
  sector: z.string().optional(),
  role_type: z.string().optional(),
  channel: z.string().optional(),
  contact_person: z.string().optional(),
  fit_rating: z.number().min(0).max(100).optional(),
  source: z.string().optional(),
});

function revalidate(): void {
  revalidatePath("/applications");
  revalidatePath("/");
}

/** Update one tracker row by CSV index. */
export async function updateRowAction(
  index: number,
  patch: z.input<typeof patchSchema>,
): Promise<ActionResult> {
  if (getConfig().readOnly) return READ_ONLY;

  const parsed = patchSchema.safeParse(patch);
  if (!parsed.success) return { error: "invalid patch" };

  try {
    await updateRow(paths.tracker(), index, parsed.data);
    revalidate();
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "write failed" };
  }
}

/** Append a new application row (empty cv/cover). */
export async function appendRowAction(
  row: z.input<typeof appendSchema>,
): Promise<ActionResult> {
  if (getConfig().readOnly) return READ_ONLY;

  const parsed = appendSchema.safeParse(row);
  if (!parsed.success) return { error: "invalid row" };

  try {
    await appendRow(paths.tracker(), parsed.data);
    revalidate();
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "write failed" };
  }
}
