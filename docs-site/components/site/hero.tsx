"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Animated landing hero (build-prompt §10.6). Static-final under reduced motion. */
export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-10 pt-20 text-center">
      <Reveal>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
            aria-hidden
          />
          Open source · Runs on your machine · MIT
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          A patient teammate for your{" "}
          <span className="text-primary">job search</span>
        </h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          CareerForge finds postings, scores how well they fit you, writes a
          tailored CV and cover letter as print-ready PDFs, and tracks every
          application — without your data ever leaving your computer.
        </p>
      </Reveal>
      <Reveal delay={0.24} className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/docs/quick-start"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Get started
        </Link>
        <Link
          href="/docs"
          className="rounded-xl border border-border bg-card/50 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50"
        >
          What is CareerForge?
        </Link>
      </Reveal>
      <Reveal delay={0.34} className="mt-10 w-full">
        <div className="rounded-xl border border-border bg-card/50 p-4 text-left font-mono text-sm">
          <p className="text-muted-foreground"># the whole workflow, three commands</p>
          <p className="mt-2">
            <span className="text-primary">/setup</span>
            <span className="text-muted-foreground"> — tell it about yourself, once</span>
          </p>
          <p>
            <span className="text-primary">/search</span>
            <span className="text-muted-foreground"> — find and rank new postings</span>
          </p>
          <p>
            <span className="text-primary">/apply</span>
            <span className="text-muted-foreground"> — get a tailored CV + cover letter, as PDFs</span>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
