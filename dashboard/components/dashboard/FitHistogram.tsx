"use client";

import { ResponsiveBar } from "@nivo/bar";
import type { FitBucket } from "@/lib/domain/aggregate";
import { ChartFrame, chartColor } from "./ChartFrame";

/** Distribution of fit ratings across 5 bands (REQ-5009). */
export function FitHistogram({ data }: { data: FitBucket[] }) {
  const total = data.reduce((a, b) => a + b.count, 0);
  return (
    <ChartFrame
      title="Fit distribution"
      empty={total === 0}
      caption="Number of applications per fit-rating band"
      head={["Fit range", "Count"]}
      body={data.map((d) => [d.range, d.count])}
    >
      <ResponsiveBar
        data={data.map((d) => ({ range: d.range, count: d.count }))}
        keys={["count"]}
        indexBy="range"
        margin={{ top: 8, right: 8, bottom: 32, left: 32 }}
        padding={0.3}
        colors={[chartColor(1)]}
        enableLabel={false}
        animate={false}
        role="img"
        ariaLabel="Fit distribution"
      />
    </ChartFrame>
  );
}
