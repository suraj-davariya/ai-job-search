"use client";

import {
  FileCheck,
  Globe2,
  LayoutDashboard,
  Lock,
  Search,
  UserRound,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const FEATURES = [
  {
    icon: UserRound,
    title: "It learns who you are",
    body: "Point /setup at your CV or let it interview you. It builds a profile from your real experience and never invents skills you don't have.",
  },
  {
    icon: Search,
    title: "It finds the right openings",
    body: "/search sweeps the job boards you choose, skips what you've already seen, and ranks each match High, Medium, or Low.",
  },
  {
    icon: FileCheck,
    title: "It writes, a reviewer checks",
    body: "/apply drafts a tailored CV and cover letter, a second AI critiques both, and the result compiles to print-ready PDFs.",
  },
  {
    icon: LayoutDashboard,
    title: "You see your whole pipeline",
    body: "A local dashboard turns your application log into KPIs and charts: weekly activity, status mix, fit distribution, top companies.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Profile, applications, and PDFs stay on your machine. Nothing is uploaded, tracked, or shared — the data file is yours.",
  },
  {
    icon: Globe2,
    title: "Works anywhere",
    body: "No hardcoded country, language, or job board. Cover letters are written in the posting's language; portals come from your config.",
  },
];

/** The landing feature grid — six honest claims, each scroll-revealed. */
export function FeatureGrid() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <ScrollReveal key={f.title} delay={0.05 * (i % 3)}>
            <div className="h-full rounded-xl border border-border bg-card/50 p-5">
              <f.icon className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="mt-3 text-sm font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
