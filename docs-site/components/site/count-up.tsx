"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Animate a number from 0 to `value` when it scrolls into view (§6).
 * The static value is in the server-rendered HTML, so without JS the real
 * number still shows. With prefers-reduced-motion, no count-up runs.
 */
export function CountUp({
  value,
  format = (n) => String(Math.round(n)),
  durationMs = 800,
}: {
  value: number;
  format?: (n: number) => string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced || !inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, durationMs]);

  return <span ref={ref}>{format(display)}</span>;
}
