import { getTranslations } from "next-intl/server";
import { readTracker } from "@/lib/data/tracker";
import { getConfig } from "@/lib/config";
import { PageSection } from "@/components/shell/page-shell";
import { ApplicationsView } from "@/components/applications/ApplicationsView";

// Re-read from disk on every request (no long-lived cache in v1; CSV ≤ 1k rows).
export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const rows = await readTracker();
  const { readOnly } = getConfig();
  const t = await getTranslations("applications");

  return (
    <PageSection
      title={t("page.title")}
      description={t("page.description", { count: rows.length })}
    >
      <ApplicationsView rows={rows} readOnly={readOnly} />
    </PageSection>
  );
}
