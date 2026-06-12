import { Lock } from "lucide-react";
import { getConfig } from "@/lib/config";

/**
 * App-wide read-only notice (REQ-5007). Renders only when the dashboard was
 * started with CAREERFORGE_READ_ONLY — a server-side flag, so this is a server
 * component. All mutators (status/notes edit, + New) are independently disabled.
 */
export function ReadOnlyBanner() {
  if (!getConfig().readOnly) return null;
  return (
    <div
      role="status"
      className="flex items-center gap-2 border-b border-border bg-muted/50 px-6 py-2 text-xs text-muted-foreground"
    >
      <Lock className="h-3.5 w-3.5" aria-hidden />
      Read-only mode — editing is disabled.
    </div>
  );
}
