import { Suspense } from "react";
import { Terminal } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getConfig } from "@/lib/config";
import { binAvailability } from "@/lib/run/bins";
import { PageSection, EmptyState } from "@/components/shell/page-shell";
import { RunLog } from "@/components/console/RunLog";
import { RunList } from "@/components/console/RunList";
import { IS_DEMO } from "@/lib/demo/flags";

// Bins are probed per request; nothing is cached.
export const dynamic = "force-dynamic";

export default async function ConsolePage() {
  const t = await getTranslations("console");

  // The Console executes CLI commands on your machine — impossible on a static
  // host. Show an honest notice instead of a dead terminal in the demo.
  if (IS_DEMO) {
    return (
      <PageSection title={t("title")} description={t("description")}>
        <EmptyState
          title={t("demo.title")}
          hint={t("demo.hint")}
          milestone={t("demo.milestone")}
        />
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal className="h-3.5 w-3.5" aria-hidden />
          {t("demo.note")}
        </div>
      </PageSection>
    );
  }

  const { readOnly } = getConfig();
  const { claude, python3 } = await binAvailability();

  return (
    <PageSection title={t("title")} description={t("description")}>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        {/* useSearchParams in RunLog requires a Suspense boundary. */}
        <Suspense>
          <RunLog claudeOk={claude} pythonOk={python3} readOnly={readOnly} />
        </Suspense>
        <RunList />
      </div>
    </PageSection>
  );
}
