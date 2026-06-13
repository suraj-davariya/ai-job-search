import defaultMdxComponents from "fumadocs-ui/mdx";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import type { MDXComponents } from "mdx/types";
import { ApplicationsTableDemo, StatusFlowDemo } from "@/components/demo/applications-table-demo";
import { ActivityCalendarDemo } from "@/components/demo/activity-calendar-demo";
import { DashboardPreview } from "@/components/demo/dashboard-preview";
import { FitHistogramDemo } from "@/components/demo/fit-histogram-demo";
import { KpiCardsDemo } from "@/components/demo/kpi-cards-demo";
import { PipelineStripDemo } from "@/components/demo/pipeline-strip-demo";
import { StatusDonutDemo } from "@/components/demo/status-donut-demo";
import { TopCompaniesDemo } from "@/components/demo/top-companies-demo";
import { WeeklyBarDemo } from "@/components/demo/weekly-bar-demo";

/** Components every MDX page can use as plain tags (build-prompt §6). */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Cards,
    Card,
    Steps,
    Step,
    Tabs,
    Tab,
    DashboardPreview,
    KpiCardsDemo,
    PipelineStripDemo,
    WeeklyBarDemo,
    ActivityCalendarDemo,
    StatusDonutDemo,
    FitHistogramDemo,
    TopCompaniesDemo,
    ApplicationsTableDemo,
    StatusFlowDemo,
    ...components,
  };
}
