import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared chrome for the home and docs layouts: the wordmark and the
 * top-level nav links. The flame glyph is plain SVG — no external assets.
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 font-semibold">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            aria-hidden
            fill="hsl(var(--primary))"
          >
            <path d="M12 2c.5 3.5-1.5 5.5-3 7-1.6 1.6-3 3.4-3 6a6 6 0 0 0 12 0c0-1.8-.6-3.3-1.5-4.5-.4 1-1 1.9-2 2.5.3-2.5-.4-5-2.5-7-.2 1.6-1 2.6-2 3.5C9.4 8 10.5 5 12 2Z" />
          </svg>
          CareerForge
        </span>
      ),
    },
    links: [
      {
        text: "Guide",
        url: "/docs",
        active: "nested-url",
      },
      {
        text: "GitHub",
        url: "https://github.com/suraj-davariya/ai-job-search",
        external: true,
      },
    ],
  };
}
