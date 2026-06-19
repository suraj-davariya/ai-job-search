"use client";

import { RootProvider } from "fumadocs-ui/provider/next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import {
  i18n,
  isRtlLocale,
  localeFromPathname,
  localizedPath,
  provider,
} from "@/lib/i18n";

const basePath = process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? "";

/**
 * Single, locale-aware provider tree for the whole site.
 *
 * Because this is a static export there is NO middleware to rewrite locale
 * prefixes, and there is exactly one root `<html>` (in `app/layout.tsx`) that
 * cannot read a route param. So we derive the active locale on the client from
 * the pathname and:
 *
 *  1. feed the matching `provider(locale)` into `<RootProvider i18n>` so the
 *     language switcher highlights the right language and the UI chrome uses the
 *     right translations;
 *  2. set `<html lang>` and, for RTL languages like Arabic, `dir="rtl"`, since
 *     the static HTML ships with the English defaults until JS runs;
 *  3. override `onLocaleChange` so switching honors `hideLocale:
 *     "default-locale"` — English drops the prefix (`/docs`), others gain one
 *     (`/es/docs`). `next/navigation` adds the basePath for us.
 */
export function SiteProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = localeFromPathname(pathname);
  const rtl = isRtlLocale(locale);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = rtl ? "rtl" : "ltr";
  }, [locale, rtl]);

  function onLocaleChange(next: string) {
    // Strip the current non-default locale prefix (if any) to get the
    // locale-independent remainder, then re-attach the target's prefix.
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === locale && locale !== i18n.defaultLanguage) {
      segments.shift();
    }
    let remainder = segments.join("/");
    // The marketing home (`/`) is English-only — there is no `/<lang>` page.
    // Send a non-default switch from there into the localized docs instead of a
    // dead-end route.
    if (!remainder && next !== i18n.defaultLanguage) {
      remainder = "docs";
    }
    router.push(localizedPath(next, remainder));
  }

  return (
    <RootProvider
      dir={rtl ? "rtl" : "ltr"}
      theme={{ defaultTheme: "dark" }}
      i18n={{ ...provider(locale), locale, onLocaleChange }}
      search={{
        options: {
          type: "static",
          // The static index is exported as a file; respect basePath so search
          // still resolves under a GitHub Pages project URL (§8). The search
          // dialog scopes results to the active locale automatically.
          api: `${basePath}/api/search`,
        },
      }}
    >
      {children}
    </RootProvider>
  );
}
