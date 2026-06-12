/**
 * GET  /api/runs        — list recent run history (newest first).
 * POST /api/runs         — { action: "stop", command? } sends SIGTERM to the
 *                          running process(es). Read-only mode can still stop
 *                          a run (it's a safety control, not a mutation).
 */
import { listRuns } from "@/lib/run/history";
import { stopRun, activeCommands } from "@/lib/run/spawn";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const runs = await listRuns();
  return Response.json({ runs, active: activeCommands() });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json().catch(() => ({}));
  if (body?.action !== "stop") {
    return new Response("Unknown action", { status: 400 });
  }
  const stopped = stopRun(typeof body.command === "string" ? body.command : undefined);
  return Response.json({ stopped });
}
