import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import type { Metadata } from "next";

const basePath = process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? "";

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
    // suppressHydrationWarning: next-themes mutates <html> class before hydration.
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          theme={{ defaultTheme: "dark" }}
          search={{
            options: {
              type: "static",
              // The static index is exported as a file; respect basePath so
              // search still resolves under a GitHub Pages project URL (§8).
              api: `${basePath}/api/search`,
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
