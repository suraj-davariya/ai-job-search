"use client";

import { ResponsiveBar } from "@nivo/bar";
import type { Bin } from "@/lib/domain/aggregate";
import { ChartFrame, chartColor } from "./ChartFrame";

/** Applications per ISO week (REQ-5009). */
export function WeeklyBar({ data }: { data: Bin[] }) {
  return (
    <ChartFrame
      title="Applications per week"
      empty={data.length === 0}
      caption="Applications per ISO week"
      head={["Week", "Applications"]}
      body={data.map((d) => [d.key, d.count])}
    >
      <ResponsiveBar
        data={data.map((d) => ({ week: d.key, applications: d.count }))}
        keys={["applications"]}
        indexBy="week"
        margin={{ top: 8, right: 8, bottom: 40, left: 32 }}
        padding={0.3}
        colors={[chartColor(0)]}
        axisBottom={{ tickRotation: -45 }}
        enableLabel={false}
        animate={false}
        role="img"
        ariaLabel="Applications per week"
      />
    </ChartFrame>
  );
}
