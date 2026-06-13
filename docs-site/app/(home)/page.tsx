import Link from "next/link";
import { DashboardPreview } from "@/components/demo/dashboard-preview";
import { FeatureGrid } from "@/components/site/feature-grid";
import { Hero } from "@/components/site/hero";
import { ScrollReveal } from "@/components/site/scroll-reveal";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <FeatureGrid />
      <section className="mx-auto w-full max-w-5xl px-4 pb-20">
        <ScrollReveal>
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            The dashboard, live
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            This is a working copy of the tracking dashboard, running on
            fictional data right here in your browser. Yours fills with your
            own applications.
          </p>
        </ScrollReveal>
        <div className="mt-8">
          <DashboardPreview />
        </div>
        <ScrollReveal className="mt-10 text-center">
          <Link
            href="/docs/dashboard"
            className="rounded-xl border border-border bg-card/50 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            Explore the dashboard guide →
          </Link>
        </ScrollReveal>
      </section>
    </main>
  );
}
