import { Suspense } from "react";
import { getConfig } from "@/lib/config";
import { binAvailability } from "@/lib/run/bins";
import { PageSection } from "@/components/shell/page-shell";
import { RunLog } from "@/components/console/RunLog";
import { RunList } from "@/components/console/RunList";

// Bins are probed per request; nothing is cached.
export const dynamic = "force-dynamic";

export default async function ConsolePage() {
  const { readOnly } = getConfig();
  const { claude, python3 } = await binAvailability();

  return (
    <PageSection
      title="Console"
      description="Run allowlisted CLI commands and watch their output live."
    >
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
