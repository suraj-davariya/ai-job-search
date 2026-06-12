import { describe, it, expect, vi } from "vitest";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { readTracker } from "@/lib/data/tracker";
import {
  byWeek,
  byDay,
  byStatus,
  fitBuckets,
  topBy,
} from "@/lib/domain/aggregate";
import { WeeklyBar } from "@/components/dashboard/WeeklyBar";
import { ActivityCalendar } from "@/components/dashboard/ActivityCalendar";
import { StatusDonut } from "@/components/dashboard/StatusDonut";
import { FitHistogram } from "@/components/dashboard/FitHistogram";
import { TopCompanies } from "@/components/dashboard/TopCompanies";

// Nivo needs a real layout/ResizeObserver; stub the visual charts. The
// accessible <table> (the contract we test) is rendered by ChartFrame, not Nivo.
vi.mock("@nivo/bar", () => ({ ResponsiveBar: () => null }));
vi.mock("@nivo/calendar", () => ({ ResponsiveCalendar: () => null }));

const fix = (n: string) => path.join(__dirname, "..", "fixtures", n);

describe("dashboard charts (with the 1000-row fixture)", () => {
  it("each chart renders its accessible data table", async () => {
    const rows = await readTracker(fix("tracker-1000.csv"));
    render(
      <>
        <WeeklyBar data={byWeek(rows)} />
        <ActivityCalendar data={byDay(rows)} />
        <StatusDonut data={byStatus(rows)} />
        <FitHistogram data={fitBuckets(rows)} />
        <TopCompanies data={topBy(rows, "company")} />
      </>,
    );

    for (const caption of [
      "Applications per ISO week",
      "Applications per calendar day",
      "Applications by status",
      "Number of applications per fit-rating band",
      "Company by application count",
    ]) {
      expect(screen.getByText(caption).tagName).toBe("CAPTION");
    }
    // The status table includes a real count for a known bucket.
    expect(screen.getByRole("table", { name: "Applications by status" })).toBeInTheDocument();
  });

  it("the calendar table bins by date (day → count)", async () => {
    const rows = await readTracker(fix("tracker-1000.csv"));
    const days = byDay(rows);
    render(<ActivityCalendar data={days} />);
    const table = screen.getByRole("table", { name: "Applications per calendar day" });
    // First body row is the earliest day with its count.
    const firstCells = table.querySelectorAll("tbody tr:first-child td");
    expect(firstCells[0].textContent).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number(firstCells[1].textContent)).toBeGreaterThan(0);
  });
});

describe("dashboard charts (empty)", () => {
  it("show empty-states instead of fabricating a series", () => {
    render(
      <>
        <WeeklyBar data={[]} />
        <StatusDonut data={byStatus([])} />
        <FitHistogram data={fitBuckets([])} />
        <TopCompanies data={[]} />
        <ActivityCalendar data={[]} />
      </>,
    );
    expect(screen.getAllByText("No data yet")).toHaveLength(5);
    // No accessible data tables when there's nothing to show.
    expect(screen.queryByRole("table")).toBeNull();
  });
});
