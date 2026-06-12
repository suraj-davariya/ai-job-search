"use server";

/**
 * Persist local dashboard preferences (REQ-5016). zod-validated whitelist; no
 * secrets. Theme is handled client-side by next-themes (localStorage), so it is
 * not part of this payload.
 */
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { writeSettings } from "@/lib/settings";

export type SettingsResult = { ok: true } | { error: string };

const schema = z.object({
  repoRoot: z.string().optional(),
  port: z.number().int().min(1).max(65535).optional(),
  readOnly: z.boolean().optional(),
});

export async function updateSettingsAction(
  patch: z.input<typeof schema>,
): Promise<SettingsResult> {
  const parsed = schema.safeParse(patch);
  if (!parsed.success) return { error: "invalid settings" };
  try {
    await writeSettings(parsed.data);
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "write failed" };
  }
}
