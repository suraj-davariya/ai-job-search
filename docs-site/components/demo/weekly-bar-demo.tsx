"use client";

import { ResponsiveBar } from "@nivo/bar";
import { ChartFrame, chartColor, nivoTheme } from "./chart-frame";
import { DEMO_ROWS } from "./demo-data";
import { byWeek } from "./domain/aggregate";

/** Live weekly-bar demo — same aggregation and look as the dashboard chart. */
export function WeeklyBarDemo() {
  const data = byWeek(DEMO_ROWS);
  return (
    <ChartFrame
      title="Applications per week"
      empty={data.length === 0}
      caption="Applications per ISO week"
      head={["Week", "Applications"]}
      body={data.map((d) => [d.key, d.count])}
    >
      {(animate) => (
        <ResponsiveBar
          data={data.map((d) => ({ week: d.key, applications: d.count }))}
          keys={["applications"]}
          indexBy="week"
          margin={{ top: 8, right: 8, bottom: 40, left: 32 }}
          padding={0.3}
          colors={[chartColor(0)]}
          axisBottom={{ tickRotation: -45 }}
          enableLabel={false}
          animate={animate}
          theme={nivoTheme}
          role="img"
          ariaLabel="Applications per week"
        />
      )}
    </ChartFrame>
  );
}
