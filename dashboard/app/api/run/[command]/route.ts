/**
 * POST /api/run/<command> — run an allowlisted command and stream its output.
 *
 * Order of guards (REQ-5010/5011/5007): allowlist → read-only → argument
 * validation → per-type lock. Only then do we spawn. The response is an SSE
 * stream of `output` events (stdout/stderr chunks) followed by one terminal
 * `status` event carrying the real exit code; the run is recorded to history.
 */
import { isAllowed, buildCommand } from "@/lib/run/allowlist";
import { startRun } from "@/lib/run/spawn";
import { appendRun } from "@/lib/run/history";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

function runId(): string {
  return `${new Date().toISOString().replace(/[:.]/g, "-")}-${process.pid}-${Math.floor(
    Math.random() * 1e6,
  )}`;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ command: string }> },
): Promise<Response> {
  const { command } = await params;

  if (!isAllowed(command)) {
    return new Response(`Unknown command: ${command}`, { status: 400 });
  }
  if (getConfig().readOnly) {
    return new Response("Read-only mode — actions are disabled", { status: 403 });
  }

  const input = await req.json().catch(() => ({}));
  let argv;
  try {
    argv = buildCommand(command, input);
  } catch (err) {
    return new Response(err instanceof Error ? err.message : "invalid input", {
      status: 400,
    });
  }

  let handle;
  try {
    handle = startRun(command, argv);
  } catch (err) {
    // Lock held → a run of this type is already in flight.
    return new Response(err instanceof Error ? err.message : "busy", {
      status: 409,
    });
  }

  const id = runId();
  const startedAt = new Date().toISOString();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );

      send("start", { id, command, pid: handle.pid });
      try {
        for await (const chunk of handle.output) send("output", chunk);
        const result = await handle.result;
        await appendRun({
          id,
          command,
          bin: argv.bin,
          args: argv.args,
          startedAt,
          endedAt: new Date().toISOString(),
          code: result.code,
          ok: result.ok,
          error: result.error,
        });
        send("status", { id, ...result });
      } catch (err) {
        send("status", {
          id,
          ok: false,
          code: null,
          error: err instanceof Error ? err.message : "run failed",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive",
    },
  });
}
