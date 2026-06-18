import { Lock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getConfig } from "@/lib/config";
import { IS_DEMO } from "@/lib/demo/flags";

/**
 * App-wide read-only notice (REQ-5007). Renders only when the dashboard was
 * started with CAREERFORGE_READ_ONLY — a server-side flag, so this is a server
 * component. All mutators (status/notes edit, + New) are independently disabled.
 */
export async function ReadOnlyBanner() {
  // The demo build shows its own richer banner; avoid stacking two.
  if (IS_DEMO) return null;
  if (!getConfig().readOnly) return null;
  const t = await getTranslations("common");
  return (
    <div
      role="status"
      className="flex items-center gap-2 border-b border-border bg-muted/50 px-6 py-2 text-xs text-muted-foreground"
    >
      <Lock className="h-3.5 w-3.5" aria-hidden />
      {t("banner.readOnly")}
    </div>
  );
}
