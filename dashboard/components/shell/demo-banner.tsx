import { Info } from "lucide-react";
import { IS_DEMO } from "@/lib/demo/flags";

/**
 * Banner shown only in the published static demo (DASHBOARD_DEMO=1). It states
 * plainly that the data is fictional and that editing, the Console, and PDF
 * previews need the real local dashboard — honesty over polish (ARCH-0007).
 * Renders nothing in normal server mode.
 */
export function DemoBanner() {
  if (!IS_DEMO) return null;
  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-primary/30 bg-primary/10 px-6 py-2 text-xs text-foreground"
    >
      <Info className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
      <span>
        <strong className="font-medium">Demo with sample data.</strong> Editing,
        the Console, and PDF previews are disabled — they need the real dashboard
        running locally.
      </span>
      {/* Absolute path bypasses the dashboard basePath to reach the docs site root. */}
      <a href="/ai-job-search/" className="font-medium text-primary hover:underline">
        Back to the guide →
      </a>
    </div>
  );
}
