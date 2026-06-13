"use client";

import { ResponsiveCalendar } from "@nivo/calendar";
import { ChartFrame, chartColor, nivoTheme } from "./chart-frame";
import { DEMO_ROWS } from "./demo-data";
import { byDay } from "./domain/aggregate";

/** Live activity-calendar demo — applications per day as a heatmap. */
export function ActivityCalendarDemo() {
  const data = byDay(DEMO_ROWS);
  const from = data[0]?.day ?? "";
  const to = data[data.length - 1]?.day ?? "";
  return (
    <ChartFrame
      title="Activity"
      empty={data.length === 0}
      caption="Applications per calendar day"
      head={["Day", "Applications"]}
      body={data.map((d) => [d.day, d.value])}
    >
      {() => (
        <ResponsiveCalendar
          data={data}
          from={from}
          to={to}
          emptyColor="hsl(var(--muted))"
          colors={[chartColor(3), chartColor(1), chartColor(0), chartColor(2)]}
          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          monthBorderColor="hsl(var(--border))"
          dayBorderColor="hsl(var(--background))"
          theme={nivoTheme}
        />
      )}
    </ChartFrame>
  );
}
