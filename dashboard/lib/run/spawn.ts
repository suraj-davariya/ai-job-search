/**
 * Subprocess runner for the action layer (REQ-5010/5011, impl-guide §6.2).
 *
 * Spawns an allowlisted argv with `shell:false` (so arguments are never parsed
 * by a shell), streams stdout/stderr as they arrive, and resolves with the REAL
 * exit code / signal — a missing binary or a non-zero exit is reported, never
 * masked as success (ARCH-0007/0005). A per-command-type lock allows at most one
 * concurrent run of each type (REQ-5011); cross-process isn't a concern (single
 * loopback instance).
 */
import { spawn } from "node:child_process";
import { repoRoot } from "@/lib/paths";
import type { Argv } from "@/lib/run/allowlist";

export interface RunChunk {
  stream: "stdout" | "stderr";
  data: string;
}
export interface RunResult {
  code: number | null;
  signal: NodeJS.Signals | null;
  ok: boolean;
  error?: string;
}
export interface RunHandle {
  command: string;
  readonly pid: number | undefined;
  /** Async stream of output chunks; ends when the process closes. */
  output: AsyncIterable<RunChunk>;
  /** Resolves once with the terminal result. */
  result: Promise<RunResult>;
  /** Request termination (SIGTERM). */
  stop: () => void;
}

/** Command types with a run in flight (the lock). */
const running = new Set<string>();

export function startRun(
  command: string,
  argv: Argv,
  opts?: { cwd?: string },
): RunHandle {
  if (running.has(command)) {
    throw new Error(`A ${command} run is already in progress`);
  }
  running.add(command);

  const child = spawn(argv.bin, argv.args, {
    cwd: opts?.cwd ?? repoRoot(),
    shell: false, // never let a shell interpret the args
  });

  // Queue-backed async iterator over output chunks.
  const queue: RunChunk[] = [];
  let pending: ((r: IteratorResult<RunChunk>) => void) | null = null;
  let finished = false;

  function push(chunk: RunChunk) {
    if (pending) {
      pending({ value: chunk, done: false });
      pending = null;
    } else {
      queue.push(chunk);
    }
  }
  function endStream() {
    finished = true;
    if (pending) {
      pending({ value: undefined as unknown as RunChunk, done: true });
      pending = null;
    }
  }

  let resolveResult!: (r: RunResult) => void;
  const result = new Promise<RunResult>((res) => {
    resolveResult = res;
  });

  let errorMsg: string | undefined;
  let settled = false;
  function settle(r: RunResult) {
    if (settled) return;
    settled = true;
    running.delete(command);
    resolveResult(r);
    endStream();
  }

  child.stdout?.on("data", (d: Buffer) =>
    push({ stream: "stdout", data: d.toString() }),
  );
  child.stderr?.on("data", (d: Buffer) =>
    push({ stream: "stderr", data: d.toString() }),
  );

  child.on("error", (err: Error) => {
    errorMsg = err.message;
    push({ stream: "stderr", data: `failed to start ${argv.bin}: ${err.message}\n` });
    settle({ code: null, signal: null, ok: false, error: err.message });
  });

  child.on("close", (code, signal) => {
    settle({
      code,
      signal,
      ok: errorMsg === undefined && code === 0,
      error: errorMsg,
    });
  });

  const output: AsyncIterable<RunChunk> = {
    [Symbol.asyncIterator]() {
      return {
        next(): Promise<IteratorResult<RunChunk>> {
          if (queue.length) {
            return Promise.resolve({ value: queue.shift()!, done: false });
          }
          if (finished) {
            return Promise.resolve({
              value: undefined as unknown as RunChunk,
              done: true,
            });
          }
          return new Promise((res) => {
            pending = res;
          });
        },
      };
    },
  };

  return {
    command,
    get pid() {
      return child.pid;
    },
    output,
    result,
    stop: () => {
      try {
        child.kill("SIGTERM");
      } catch {
        // already gone — nothing to terminate
      }
    },
  };
}
