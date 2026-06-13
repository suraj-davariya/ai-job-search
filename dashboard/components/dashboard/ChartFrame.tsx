"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Orange→gold chart ramp, sourced from the CSS tokens in globals.css. */
export const CHART_TOKENS = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
] as const;
export const chartColor = (i: number) =>
  `hsl(var(${CHART_TOKENS[i % CHART_TOKENS.length]}))`;

/**
 * Shared chart shell (NFR-0015). Always renders a screen-reader `<table>` of the
 * exact series — so every chart has a non-visual equivalent and works without
 * JS — and mounts the visual chart only after hydration (Nivo needs the DOM;
 * this also keeps SSR/build from touching browser-only APIs). Empty data shows
 * an honest empty-state instead of a fabricated series (ARCH-0007).
 */
export function ChartFrame({
  title,
  empty,
  caption,
  head,
  body,
  children,
}: {
  title: string;
  empty: boolean;
  caption: string;
  head: string[];
  body: (string | number)[][];
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  // Defer the flag into a microtask so the setState isn't synchronous in the
  // effect body (post-hydration gate; keeps Nivo off the server).
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => active && setMounted(true));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-xl border border-border bg-card/50 p-4">
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      {empty ? (
        <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          No data yet
        </p>
      ) : (
        <>
          <div className="h-64 w-full">{mounted ? children : null}</div>
          <table className="sr-only">
            <caption>{caption}</caption>
            <thead>
              <tr>
                {head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
