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
        title="Clientele Segments"
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
            colors={["#a66f55", "#887668", "#687153"]}
          />
        </ChartCard>
      </section>

      <section className="soft-card mt-5 rounded-3xl p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="editorial-serif text-[20px] font-semibold text-[#40362c]">Category preference by age</h2>
          <p className="mt-1 text-xs text-[#887b6e]">
            Top three categories within each age segment
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {segments.map((segment) => (
            <article key={segment.label} className="rounded-2xl border border-[#ded2bf] bg-[#f4ede2] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#4b4137]">{segment.label}</h3>
                <span className="rounded-full bg-[#e4e8da] px-2 py-1 text-[10px] font-bold text-[#667052]">
                  {segment.units} units
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {preferences
                  .filter((preference) => preference.ageGroup === segment.label)
                  .map((preference) => (
                    <div key={preference.category}>
                      <div className="mb-1 flex justify-between text-[10px]">
                        <span className="font-semibold text-[#695f54]">{preference.category}</span>
                        <span className="font-bold text-[#817467]">
                          {preference.share.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#e2d8c8]">
                        <div
                          className="h-full rounded-full bg-[#687153]"
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
        <div className="border-b border-[#d9ccb8] p-5 sm:p-6">
          <h2 className="editorial-serif text-[20px] font-semibold text-[#40362c]">Clientele playbook</h2>
          <p className="mt-1 text-xs text-[#887b6e]">
            Commercial profile and recommended action by age group
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#d8cab5] bg-[#eee5d7] text-[10px] font-bold uppercase tracking-[0.09em] text-[#796c5e]">
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
                <tr key={segment.label} className="border-b border-[#e3d8c7] last:border-0">
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full border border-[#aeb495]/50 bg-[#e5e8dc] px-3 py-1 text-xs font-bold text-[#5f684e]">
                      {segment.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#695f54]">
                    {segment.topCategory}
                  </td>
                  <td className="px-5 py-4 text-xs text-[#695f54]">{segment.topProduct}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#4b4137]">
                    {formatCompactInr(totalSegmentRevenue(records, segment.label))}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#695f54]">{segment.units}</td>
                  <td className="max-w-xs px-5 py-4 text-xs leading-5 text-[#75695d]">
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
