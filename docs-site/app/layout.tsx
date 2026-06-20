import "./global.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteProviders } from "@/components/site/site-providers";

export const metadata: Metadata = {
  title: {
    template: "%s | CareerForge",
    default: "CareerForge — an AI teammate for your job search",
  },
  description:
    "Find postings, write tailored CVs and cover letters, and track every application — on your own machine.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    // The single root <html> can't read a route param, so it ships the English
    // defaults (lang="en", dir="ltr"); SiteProviders updates lang/dir on the
    // client for non-default / RTL locales (no middleware under static export).
    // suppressHydrationWarning: next-themes (and SiteProviders) mutate <html>
    // attributes before hydration.
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
