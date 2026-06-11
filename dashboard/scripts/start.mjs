#!/usr/bin/env node
/**
 * Loopback launcher for the CareerForge dashboard (REQ-5000, REQ-5008).
 *
 * Wraps `next start`, binding 127.0.0.1 ONLY (never 0.0.0.0 — no LAN flag in v1),
 * asserting the tracker CSV is reachable, finding a free port, and printing a
 * copy-friendly URL. No daemon: the server lives only while this process lives.
 *
 *   node scripts/start.mjs [--port N] [--read-only] [--no-open] [--repo PATH]
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOST = "127.0.0.1";
const DEFAULT_PORT = 4480;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dashboardDir = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = { port: DEFAULT_PORT, readOnly: false, open: true, repo: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--port") args.port = Number(argv[++i]) || DEFAULT_PORT;
    else if (a === "--read-only") args.readOnly = true;
    else if (a === "--no-open") args.open = false;
    else if (a === "--repo") args.repo = argv[++i];
  }
  return args;
}

/** Resolve repo root (default: dashboard/..) and assert the tracker is reachable. */
function resolveRepoRoot(repoFlag) {
  const root = repoFlag
    ? path.resolve(repoFlag)
    : path.resolve(dashboardDir, "..");
  const tracker = path.join(root, "job_search_tracker.csv");
  if (!existsSync(tracker)) {
    console.error(
      `\n✗ Tracker CSV not found at ${tracker}\n` +
        `  Pass --repo <path> to point at your CareerForge repo root.\n`,
    );
    process.exit(1);
  }
  return root;
}

/** Find a free loopback port starting at `start`, incrementing on EADDRINUSE. */
function findFreePort(start) {
  return new Promise((resolve, reject) => {
    const tryPort = (port, attemptsLeft) => {
      const srv = net.createServer();
      srv.once("error", (err) => {
        srv.close();
        if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
          tryPort(port + 1, attemptsLeft - 1);
        } else {
          reject(err);
        }
      });
      srv.once("listening", () => {
        srv.close(() => resolve(port));
      });
      srv.listen(port, HOST);
    };
    tryPort(start, 20);
  });
}

function openBrowser(url) {
  const cmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "cmd"
        : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  try {
    spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
  } catch {
    /* opening the browser is best-effort */
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = resolveRepoRoot(args.repo);
  const port = await findFreePort(args.port);
  const url = `http://localhost:${port}/`;

  // Resolve the locally-installed `next` binary — it is not on PATH under spawn.
  const nextBin = path.join(
    dashboardDir,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "next.cmd" : "next",
  );

  const child = spawn(nextBin, ["start", "-H", HOST, "-p", String(port)], {
    cwd: dashboardDir,
    stdio: "inherit",
    env: {
      ...process.env,
      HOSTNAME: HOST,
      CAREERFORGE_REPO_ROOT: repoRoot,
      CAREERFORGE_READ_ONLY: args.readOnly ? "1" : "0",
    },
    shell: process.platform === "win32",
  });

  console.log(`\n  CareerForge dashboard`);
  console.log(`  ─────────────────────`);
  console.log(`  Repo:      ${repoRoot}`);
  console.log(`  Mode:      ${args.readOnly ? "read-only" : "read/write"}`);
  console.log(`  Bound to:  ${HOST} (loopback only)`);
  console.log(`\n  ▶  ${url}\n`);

  if (args.open) openBrowser(url);

  const shutdown = () => {
    child.kill("SIGTERM");
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  child.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
