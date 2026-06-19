import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { i18n } from "@/lib/i18n";
import { source } from "@/lib/source";

// English (default locale) docs chrome — stays at the unprefixed `/docs/...`.
// Non-default languages are served by `app/[lang]/docs`.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree(i18n.defaultLanguage)}
      {...baseOptions(i18n.defaultLanguage)}
    >
      {children}
    </DocsLayout>
  );
}
