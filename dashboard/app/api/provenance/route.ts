/**
 * GET /api/provenance?company=<company>&role=<role>
 *
 * Serves the per-application fabrication-audit ledger (REQ-2066) to the row
 * drawer's Provenance panel. Read-only and path-guarded to
 * `documents/applications/<company>_<role>/provenance.json` via
 * lib/data/provenance. Returns 404 when the application has no ledger (the
 * common case) so the panel can render nothing without a console error.
 *
 * Server-only: the static demo export drops `app/api/**` entirely
 * (scripts/export-demo.mjs), so the panel's fetch 404s and degrades gracefully
 * there too.
 */
import { readProvenance } from "@/lib/data/provenance";

// Read from disk per request; never statically optimized.
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams;
  const company = params.get("company");
  const role = params.get("role");
  if (!company || !role) {
    return new Response(null, { status: 400 });
  }

  const provenance = await readProvenance(company, role);
  if (!provenance) {
    return new Response(null, { status: 404 });
  }

  return new Response(JSON.stringify(provenance), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
