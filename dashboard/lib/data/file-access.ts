/**
 * Path-guarded access to generated documents (REQ-5005, business-rules §9).
 *
 * The dashboard serves files to the browser ONLY from the two generated-output
 * directories — `cv/output/` and `cover_letters/output/`. Tracker rows store
 * repo-relative references (e.g. "cv/output/main_acme.pdf"); a malicious or
 * malformed reference must never escape those roots. Pure + server-only.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { paths } from "@/lib/paths";

/** Absolute, normalized roots the dashboard is allowed to serve from. */
export function allowedRoots(): string[] {
  return [
    path.resolve(paths.cvOutputDir()),
    path.resolve(paths.coverLetterOutputDir()),
  ];
}

/**
 * Resolve a repo-relative file reference to an absolute path, but ONLY if it
 * lands strictly inside an allowed root and is a `.pdf`. Returns `null` for
 * traversal (`..`), absolute paths escaping the roots, prefix look-alikes
 * (`cv/output-evil/`), the root dir itself, non-PDFs, or empty/NUL input.
 *
 * Existence is NOT checked here — callers use {@link fileExists}.
 */
export function resolveAllowedFile(ref: string): string | null {
  if (!ref || ref.includes("\0")) return null;
  if (path.extname(ref).toLowerCase() !== ".pdf") return null;

  // path.resolve collapses any `..` segments before the containment check.
  const abs = path.resolve(paths.repoRoot(), ref);

  return allowedRoots().some(
    (root) => abs !== root && abs.startsWith(root + path.sep),
  )
    ? abs
    : null;
}

/** True only when `abs` is an existing, regular file. */
export async function fileExists(abs: string): Promise<boolean> {
  try {
    return (await fs.stat(abs)).isFile();
  } catch {
    return false;
  }
}
