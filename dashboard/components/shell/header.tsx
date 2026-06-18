"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NAV_ITEMS } from "./nav";
import { ThemeToggle } from "./theme-toggle";

/** Top header bar: current-page title + global controls. */
export function Header() {
  const pathname = usePathname();
  const t = useTranslations("common");

  const match = NAV_ITEMS.find((i) =>
    i.href === "/" ? pathname === "/" : pathname.startsWith(i.href),
  );
  const title = match ? t(`nav.${match.key}`) : t("app.name");

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
