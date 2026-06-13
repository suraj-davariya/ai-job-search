/**
 * PATH lookup for action-layer binaries (REQ-5010, ARCH-0005). When `claude` or
 * `python3` is absent, the relevant trigger is disabled with a tooltip while the
 * rest of the dashboard keeps working — graceful degradation, never a crash.
 */
import { promises as fs } from "node:fs";
import { constants } from "node:fs";
import path from "node:path";
import { IS_DEMO } from "@/lib/demo/flags";

/** True when `bin` is an executable file on PATH. */
export async function hasBin(bin: string): Promise<boolean> {
  const dirs = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
  for (const dir of dirs) {
    try {
      await fs.access(path.join(dir, bin), constants.X_OK);
      return true;
    } catch {
      // not here — keep scanning
    }
  }
  return false;
}

/** Availability of the two action-layer binaries, for the console UI. */
export async function binAvailability(): Promise<{
  claude: boolean;
  python3: boolean;
}> {
  // Static demo build: there is no host shell, so no binaries are available.
  if (IS_DEMO) return { claude: false, python3: false };

  const [claude, python3] = await Promise.all([
    hasBin("claude"),
    hasBin("python3"),
  ]);
  return { claude, python3 };
}
