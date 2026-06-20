import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

// Docs chrome for the non-default languages, served under `/<lang>/docs/...`.
// The page tree for the locale already includes English fallback pages (the
// locale storage inherits the English files), so the sidebar is complete even
// when only a few pages are translated.
export default async function Layout(props: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await props.params;
  return (
    <DocsLayout tree={source.getPageTree(lang)} {...baseOptions(lang)}>
      {props.children}
    </DocsLayout>
  );
}
