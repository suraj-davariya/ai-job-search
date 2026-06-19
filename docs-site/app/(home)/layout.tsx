import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { i18n } from "@/lib/i18n";

// The marketing home is English-only; the docs are where i18n lives.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout {...baseOptions(i18n.defaultLanguage)}>{children}</HomeLayout>
  );
}
