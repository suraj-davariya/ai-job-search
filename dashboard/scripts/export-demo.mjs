/**
 * Build the static demo export for GitHub Pages (`npm run build:demo`).
 *
 * The real dashboard is a Node server: it has API route handlers (`app/api/**`),
 * Server Actions (`app/actions/*`), and `force-dynamic` pages that read the
 * filesystem per request. None of those can exist in a `output: export` build.
 *
 * Rather than fork the app, this wrapper transiently neutralises exactly those
 * three things for the duration of one build, then restores them — so the real
 * source on disk is unchanged afterwards (the data layer already serves bundled
 * sample data when DASHBOARD_DEMO=1; see lib/demo/*):
 *
 *   1. move `app/api/` aside           — route handlers can't be statically exported
 *   2. swap `app/actions/*.ts` → stubs — `'use server'` is unsupported under export
 *   3. force-dynamic → force-static    — every page must be static to export
 *
 * Everything is restored in a `finally`, and originals are also copied to a
 * backup dir as a belt-and-suspenders against an interrupted run. The published
 * pages are read-only and seeded, so the stubbed mutations are never reached.
 */
import { execSync } from "node:child_process";
import { existsSync, promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backupDir = path.join(root, ".demo-build-backup");

const apiDir = path.join(root, "app", "api");
const apiBackup = path.join(backupDir, "api");
const shellDir = path.join(root, "app", "(shell)");

const actionFiles = [
  path.join(root, "app", "actions", "tracker.ts"),
  path.join(root, "app", "actions", "settings.ts"),
];

const ACTION_STUBS = {
  "tracker.ts": `/**
 * DEMO BUILD STUB — generated transiently by scripts/export-demo.mjs.
 * The real Server Actions (\`'use server'\`) can't exist in a static export.
 * Demo pages are read-only, so these are never actually invoked; they exist
 * only so the client imports resolve. Restored to the real file after build.
 */
export type ActionResult = { ok: true } | { error: string };

const DEMO: ActionResult = {
  error: "This is a static demo — changes aren't saved.",
};

export async function updateRowAction(
  ..._args: unknown[]
): Promise<ActionResult> {
  return DEMO;
}

export async function appendRowAction(
  ..._args: unknown[]
): Promise<ActionResult> {
  return DEMO;
}
`,
  "settings.ts": `/**
 * DEMO BUILD STUB — generated transiently by scripts/export-demo.mjs.
 * See the tracker stub. Restored to the real file after build.
 */
export type SettingsResult = { ok: true } | { error: string };

export async function updateSettingsAction(
  ..._args: unknown[]
): Promise<SettingsResult> {
  return { error: "This is a static demo — settings aren't saved." };
}
`,
};

/** Files we overwrite in place; remember originals to restore them exactly. */
const originals = new Map();

async function remember(file) {
  originals.set(file, await fs.readFile(file, "utf8"));
  // Also persist to the backup dir in case the process is killed mid-build.
  const dest = path.join(backupDir, "files", path.relative(root, file));
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(file, dest);
}

async function listShellPages(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listShellPages(full)));
    else if (entry.isFile() && /\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

async function setup() {
  await fs.rm(backupDir, { recursive: true, force: true });
  await fs.mkdir(backupDir, { recursive: true });

  // 1. Move API routes out of the build.
  if (existsSync(apiDir)) await fs.rename(apiDir, apiBackup);

  // 2. Replace Server Actions with client-safe stubs.
  for (const file of actionFiles) {
    if (!existsSync(file)) continue;
    await remember(file);
    await fs.writeFile(file, ACTION_STUBS[path.basename(file)], "utf8");
  }

  // 3. Make every page static.
  for (const file of await listShellPages(shellDir)) {
    const src = await fs.readFile(file, "utf8");
    if (!src.includes('export const dynamic = "force-dynamic"')) continue;
    await remember(file);
    await fs.writeFile(
      file,
      src.replaceAll(
        'export const dynamic = "force-dynamic"',
        'export const dynamic = "force-static"',
      ),
      "utf8",
    );
  }
}

async function restore() {
  for (const [file, content] of originals) {
    await fs.writeFile(file, content, "utf8").catch(() => {});
  }
  if (existsSync(apiBackup) && !existsSync(apiDir)) {
    await fs.rename(apiBackup, apiDir).catch(() => {});
  }
  await fs.rm(backupDir, { recursive: true, force: true }).catch(() => {});
}

async function main() {
  try {
    await setup();
    console.log("[demo] building static export (DASHBOARD_DEMO=1)…");
    execSync("next build", {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        DASHBOARD_DEMO: "1",
        NEXT_PUBLIC_DASHBOARD_DEMO: "1",
      },
    });
    console.log("[demo] static export written to dashboard/out/");
  } finally {
    await restore();
    console.log("[demo] restored real source files");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
