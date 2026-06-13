/**
 * Action allowlist (REQ-5010/5011, impl-guide §6.1) — the security core of the
 * action layer. A FIXED table of commands; each entry validates its inputs and
 * returns an argv {bin, args[]}. There is NO code path that concatenates user
 * input into a shell string: callers spawn with `shell:false`, so every arg is
 * an opaque slot (a value like "Beta Corp; rm -rf /" is just one argument).
 *
 * Adding a command means adding a table entry — never widening an existing one.
 */
import { paths } from "@/lib/paths";

export interface Argv {
  bin: string;
  args: string[];
}

const REVIEW_MODES = ["none", "quick", "full"] as const;
type ReviewMode = (typeof REVIEW_MODES)[number];

type Input = Record<string, unknown>;

// ── Validators (throw on anything unexpected) ────────────────────────────────
function assertUrl(v: unknown): string {
  if (typeof v !== "string" || !/^https?:\/\/\S+$/.test(v.trim())) {
    throw new Error("invalid url");
  }
  return v.trim();
}

function assertMode(v: unknown): ReviewMode {
  if (typeof v !== "string" || !(REVIEW_MODES as readonly string[]).includes(v)) {
    throw new Error(`invalid review mode (expected ${REVIEW_MODES.join("|")})`);
  }
  return v as ReviewMode;
}

function assertNonEmpty(v: unknown, name: string): string {
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`${name} is required`);
  }
  return v; // returned verbatim — safe because it becomes a discrete argv slot
}

// ── The fixed command table ──────────────────────────────────────────────────
interface CommandSpec {
  bin: string;
  build: (input: Input) => Argv;
}

/** A `claude -p "/<command> <args>"` invocation (the prompt is ONE argv slot). */
function claudeSlash(buildPrompt: (input: Input) => string): CommandSpec {
  return {
    bin: "claude",
    build: (input) => ({ bin: "claude", args: ["-p", buildPrompt(input)] }),
  };
}

const COMMANDS: Record<string, CommandSpec> = {
  apply: claudeSlash((i) => {
    const url = assertUrl(i.url);
    const mode = i.mode === undefined ? "none" : assertMode(i.mode);
    return mode === "none"
      ? `/apply ${url}`
      : `/apply ${url} --review ${mode}`;
  }),

  search: claudeSlash(() => "/search"),
  upskill: claudeSlash(() => "/upskill"),
  expand: claudeSlash(() => "/expand"),
  setup: claudeSlash(() => "/setup"),

  "salary-lookup": {
    bin: "python3",
    build: (i) => {
      const company = assertNonEmpty(i.company, "company");
      const args = [paths.salaryScript(), company, "--json"];
      if (i.city !== undefined) {
        args.push("--city", assertNonEmpty(i.city, "city"));
      }
      return { bin: "python3", args };
    },
  },

  "convert-salary": {
    bin: "python3",
    build: (i) => {
      const xlsx = assertNonEmpty(i.xlsx, "xlsx path");
      return { bin: "python3", args: [paths.convertSalaryScript(), xlsx] };
    },
  },
};

/** Every command name the action layer will run. */
export const ALLOWED_COMMANDS = Object.keys(COMMANDS);

export function isAllowed(command: string): boolean {
  return Object.prototype.hasOwnProperty.call(COMMANDS, command);
}

/** The fixed binary a command runs (for PATH-availability checks). */
export function commandBin(command: string): string {
  const spec = COMMANDS[command];
  if (!spec) throw new Error(`Command "${command}" is not allowed`);
  return spec.bin;
}

/**
 * Validate inputs and build the argv for an allowlisted command. Throws for an
 * unknown command or any invalid argument — the only way to get an argv.
 */
export function buildCommand(command: string, input: Input): Argv {
  const spec = COMMANDS[command];
  if (!spec) throw new Error(`Command "${command}" is not allowed`);
  return spec.build(input);
}
