/**
 * GET/HEAD /api/file?path=<repo-relative pdf>
 *
 * Serves generated CV / cover-letter PDFs to the row-detail drawer (REQ-5005),
 * strictly path-guarded to `cv/output/` and `cover_letters/output/`
 * (see lib/data/file-access). HEAD is used by the drawer to decide between a
 * working link and a "file not found" badge without downloading the file.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { resolveAllowedFile, fileExists } from "@/lib/data/file-access";

// Files are read from disk per request; never statically optimized.
export const dynamic = "force-dynamic";

function target(req: Request): string | null {
  const ref = new URL(req.url).searchParams.get("path");
  return ref ? resolveAllowedFile(ref) : null;
}

export async function HEAD(req: Request): Promise<Response> {
  const abs = target(req);
  const ok = !!abs && (await fileExists(abs));
  return new Response(null, { status: ok ? 200 : 404 });
}

export async function GET(req: Request): Promise<Response> {
  const abs = target(req);
  if (!abs || !(await fileExists(abs))) {
    return new Response("File not found", { status: 404 });
  }
  const data = await fs.readFile(abs);
  return new Response(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${path.basename(abs)}"`,
      "Cache-Control": "no-store",
    },
  });
}
