"use client";

import { ChartCard } from "@/components/ChartCard";
import { DataEmptyState } from "@/components/DataEmptyState";
import { DataLoadingState } from "@/components/DataLoadingState";
import { MetricBars } from "@/components/MetricBars";
import { PageHeader } from "@/components/PageHeader";
import { demandByGender } from "@/lib/analytics";
import { formatCompactInr } from "@/lib/format";
import {
  categoryPreferenceByAge,
  segmentIntelligence,
  totalSegmentRevenue,
} from "@/lib/intelligence";
import { useAnalyticsData } from "@/lib/use-analytics-data";

export default function CustomerSegmentsPage() {
  const { records, timeframe, hasEnoughData, isHydrated } = useAnalyticsData();
  const segments = hasEnoughData ? segmentIntelligence(records) : [];
  const genderDemand = hasEnoughData ? demandByGender(records) : [];
  const preferences = hasEnoughData ? categoryPreferenceByAge(records) : [];

  return (
    <>
      <PageHeader
        title="Customer Segments"
        description="Translate age, gender, and category affinity into sharper assortment and campaign decisions."
      />

      {!isHydrated ? (
        <DataLoadingState />
      ) : !hasEnoughData ? (
        <DataEmptyState timeframe={timeframe} recordCount={records.length} />
      ) : (
        <>
      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard
          title="Demand by age group"
          subtitle="Unit contribution across lifecycle segments"
          badge="Age cohorts"
        >
          <MetricBars
            data={segments.map((segment) => ({
              label: segment.label,
              value: segment.units,
              detail: `${segment.share.toFixed(1)}%`,
            }))}
          />
        </ChartCard>
        <ChartCard
          title="Demand by gender"
          subtitle="Units sold by customer gender"
          badge="Customer mix"
        >
          <MetricBars
            data={genderDemand.map((segment) => ({
              label: segment.label,
              value: segment.units,
              detail: `${segment.share.toFixed(1)}%`,
            }))}
            colors={["#c59bb2", "#91adca", "#9fc4b5"]}
          />
        </ChartCard>
      </section>

      <section className="soft-card mt-5 rounded-3xl p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-[17px] font-bold text-[#363142]">Category preference by age</h2>
          <p className="mt-1 text-xs text-[#98929f]">
            Top three categories within each age segment
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {segments.map((segment) => (
            <article key={segment.label} className="rounded-2xl bg-[#f8f6f9] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#49424f]">{segment.label}</h3>
                <span className="text-[10px] font-bold text-[#958d9a]">
                  {segment.units} units
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {preferences
                  .filter((preference) => preference.ageGroup === segment.label)
                  .map((preference) => (
                    <div key={preference.category}>
                      <div className="mb-1 flex justify-between text-[10px]">
                        <span className="font-semibold text-[#6e6773]">{preference.category}</span>
                        <span className="font-bold text-[#8d8493]">
                          {preference.share.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#e9e5eb]">
                        <div
                          className="h-full rounded-full bg-[#9b86b7]"
                          style={{ width: `${preference.share}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="soft-card mt-5 overflow-hidden rounded-3xl">
        <div className="border-b border-[#eeeaf0] p-5 sm:p-6">
          <h2 className="text-[17px] font-bold text-[#363142]">Segment playbook</h2>
          <p className="mt-1 text-xs text-[#98929f]">
            Commercial profile and recommended action by age group
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eeeaf0] bg-white/45 text-[10px] font-bold uppercase tracking-[0.09em] text-[#99929f]">
                {[
                  "Segment",
                  "Top category",
                  "Top product",
                  "Revenue",
                  "Units",
                  "Recommendation",
                ].map((heading) => (
                  <th key={heading} className="px-5 py-4">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {segments.map((segment) => (
                <tr key={segment.label} className="border-b border-[#f1eef2] last:border-0">
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-[#eee8f5] px-3 py-1 text-xs font-bold text-[#705e8c]">
                      {segment.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#69626e]">
                    {segment.topCategory}
                  </td>
                  <td className="px-5 py-4 text-xs text-[#69626e]">{segment.topProduct}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#49434f]">
                    {formatCompactInr(totalSegmentRevenue(records, segment.label))}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#69626e]">{segment.units}</td>
                  <td className="max-w-xs px-5 py-4 text-xs leading-5 text-[#746d79]">
                    {segment.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
        </>
      )}
    </>
  );
}
