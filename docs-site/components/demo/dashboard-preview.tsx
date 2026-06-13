"use client";

import { ScrollReveal } from "@/components/site/scroll-reveal";
import { ActivityCalendarDemo } from "./activity-calendar-demo";
import { FitHistogramDemo } from "./fit-histogram-demo";
import { KpiCardsDemo } from "./kpi-cards-demo";
import { PipelineStripDemo } from "./pipeline-strip-demo";
import { StatusDonutDemo } from "./status-donut-demo";
import { TopCompaniesDemo } from "./top-companies-demo";
import { WeeklyBarDemo } from "./weekly-bar-demo";

/**
 * The full mini-dashboard (build-prompt §6): every widget the real dashboard
 * home shows, composed in a similar layout, running on fictional data.
 */
export function DashboardPreview() {
  return (
    <div className="not-prose flex flex-col gap-4">
      <KpiCardsDemo />
      <PipelineStripDemo />
      <ScrollReveal>
        <div className="grid gap-4 lg:grid-cols-2">
          <WeeklyBarDemo />
          <StatusDonutDemo />
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <ActivityCalendarDemo />
      </ScrollReveal>
      <ScrollReveal>
        <div className="grid gap-4 lg:grid-cols-2">
          <FitHistogramDemo />
          <TopCompaniesDemo />
        </div>
      </ScrollReveal>
    </div>
  );
}
