/**
 * Read layer: the per-application fabrication-audit ledger (REQ-2066) written by
 * `/apply` to `documents/applications/<company>_<role>/provenance.json`.
 *
 * Each ledger maps every substantive CV/cover-letter claim to the profile source
 * that backs it; unbacked claims are FLAGGED for the user to review before
 * submitting (REQ-2065). MOST applications will NOT have one (older runs, or runs
 * that predate the audit), so a missing or malformed file is normal and resolves
 * to `null` — never an error (ARCH-0005). Read-only: the dashboard never writes
 * provenance (file-as-DB / data is a shared contract owned by the CLI).
 *
 * Path-guarded like {@link lib/data/file-access}: the resolved file must land
 * strictly inside `documents/applications/`, so a company/role carrying `..` or
 * an absolute segment can never escape the applications root.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { paths } from "@/lib/paths";
import { applicationSlug } from "@/lib/data/applications";

export interface ProvenanceClaim {
  /** The verbatim claim as it appears in the CV / cover letter. */
  claim: string;
  /** Profile file that backs the claim, e.g. `01-candidate-profile.md`, or null when flagged. */
  source: string | null;
  /** Where in that file the backing lives, e.g. `Experience › Acme`, or null when flagged. */
  location: string | null;
  /** True when the claim is traceable to the profile; false → flagged for review. */
  backed: boolean;
  /** Optional reviewer note (e.g. "flagged — no profile backing"). */
  note?: string;
}

export interface ProvenanceSummary {
  total: number;
  backed: number;
  flagged: number;
}

export interface Provenance {
  /** Date the ledger was generated (YYYY-MM-DD). */
  generated: string | null;
  company: string | null;
  role: string | null;
  claims: ProvenanceClaim[];
  /** Counts derived from `claims` so the summary always matches the rendered list. */
  summary: ProvenanceSummary;
}

function asString(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

/** Coerce one raw claim entry into a typed claim, or null if it is unusable. */
function toClaim(raw: unknown): ProvenanceClaim | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const claim = asString(r.claim);
  if (!claim) return null; // a claim with no text is meaningless — drop it.
  const note = asString(r.note);
  return {
    claim,
    source: asString(r.source),
    location: asString(r.location),
    backed: r.backed === true,
    ...(note ? { note } : {}),
  };
}

/**
 * Validate + normalize the parsed JSON into a {@link Provenance}, or null when the
 * shape is unusable. Counts are derived from the validated claims so what the
 * panel summarizes always matches what it lists.
 */
function normalize(data: unknown): Provenance | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.claims)) return null;

  const claims = d.claims
    .map(toClaim)
    .filter((c): c is ProvenanceClaim => c !== null);

  const flagged = claims.filter((c) => !c.backed).length;
  return {
    generated: asString(d.generated),
    company: asString(d.company),
    role: asString(d.role),
    claims,
    summary: {
      total: claims.length,
      backed: claims.length - flagged,
      flagged,
    },
  };
}

/**
 * Read the provenance ledger for an application, or null when there is none.
 *
 * @param company tracker row `company`
 * @param role    tracker row `role`
 * @param baseDir applications root (defaults to `documents/applications/`; injectable for tests)
 */
export async function readProvenance(
  company: string,
  role: string,
  baseDir?: string,
): Promise<Provenance | null> {
  const base = path.resolve(baseDir ?? paths.applicationsDir());
  const file = path.resolve(
    base,
    applicationSlug(company, role),
    "provenance.json",
  );

  // Containment guard: a company/role with `..` or an absolute segment must
  // never read outside the applications root.
  if (file !== base && !file.startsWith(base + path.sep)) return null;

  let text: string;
  try {
    text = await fs.readFile(file, "utf8");
  } catch {
    return null; // missing file — the common case.
  }

  try {
    return normalize(JSON.parse(text));
  } catch {
    return null; // malformed JSON — degrade, never throw.
  }
}
