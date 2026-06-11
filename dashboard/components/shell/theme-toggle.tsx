"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Dark/light toggle. Default theme is dark (build-prompt §7).
 *
 * The icon is driven purely by CSS `dark:` variants (next-themes sets
 * `class="dark"` on <html>), so there is no theme read during render and thus
 * no hydration mismatch — no mount guard needed. `resolvedTheme` is only read
 * inside the click handler, which runs after hydration.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Sun className="hidden h-4 w-4 dark:block" aria-hidden />
      <Moon className="h-4 w-4 dark:hidden" aria-hidden />
    </button>
  );
}
