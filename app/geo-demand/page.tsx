"use client";

import { ChartCard } from "@/components/ChartCard";
import { DataEmptyState } from "@/components/DataEmptyState";
import { DataLoadingState } from "@/components/DataLoadingState";
import { MetricBars } from "@/components/MetricBars";
import { PageHeader } from "@/components/PageHeader";
import { formatCompactInr } from "@/lib/format";
import { stateIntelligence } from "@/lib/intelligence";
import { useAnalyticsData } from "@/lib/use-analytics-data";

export default function GeoDemandPage() {
  const { records, timeframe, hasEnoughData, isHydrated } = useAnalyticsData();
  const states = hasEnoughData ? stateIntelligence(records) : [];
  const topStates = states.slice(0, 3);

  return (
    <>
      <PageHeader
        title="Regional Demand"
        description="Understand regional demand, customer mix, and the inventory moves most likely to capture revenue."
      />

      {!isHydrated ? (
        <DataLoadingState />
      ) : !hasEnoughData ? (
        <DataEmptyState timeframe={timeframe} recordCount={records.length} />
      ) : (
        <>
      <section className="grid gap-4 sm:grid-cols-3">
        {topStates.map((state, index) => (
          <article
            key={state.label}
            className={`rounded-3xl border border-[#d6c7b0] bg-[#faf6ee] p-5 shadow-[0_14px_32px_rgba(70,55,38,0.055)] ${
              ["border-t-[3px] border-t-[#aa8b58]", "border-t-[3px] border-t-[#a66f55]", "border-t-[3px] border-t-[#687153]"][index]
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#847565]">
                Top market #{index + 1}
              </span>
              <span className="rounded-full border border-[#d8ccb9] bg-[#f2eadc] px-2.5 py-1 text-[10px] font-bold text-[#706456]">
                {state.share.toFixed(1)}% share
              </span>
            </div>
            <h2 className="editorial-serif mt-5 text-xl font-semibold text-[#40362c]">{state.label}</h2>
            <p className="mt-1 text-sm text-[#817467]">
              {state.units} units · {formatCompactInr(state.revenue)}
            </p>
            <p className="mt-4 text-xs font-semibold text-[#685d51]">
              Leads in {state.topCategory}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <ChartCard
          title="Demand by state"
          subtitle="Units sold across the ten tracked markets"
          badge={`${states.length} states`}
        >
          <MetricBars
            data={states.map((state) => ({
              label: state.label,
              value: state.units,
              detail: `${state.units} units`,
            }))}
          />
        </ChartCard>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {topStates.map((state, index) => (
            <article key={state.label} className="soft-card rounded-3xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9a7d4f]">
                Regional allocation {index + 1}
              </p>
              <h2 className="editorial-serif mt-2 text-lg font-semibold text-[#40362c]">
                Send more {state.topCategory.toLowerCase()} depth to {state.label}.
              </h2>
              <p className="mt-2 text-xs leading-5 text-[#817467]">
                {state.topProduct} leads local demand. Prioritize the {state.dominantAgeGroup}{" "}
                {state.dominantGender.toLowerCase()} cohort when allocating the next replenishment.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="soft-card mt-5 overflow-hidden rounded-3xl">
        <div className="border-b border-[#d9ccb8] p-5 sm:p-6">
          <h2 className="editorial-serif text-[20px] font-semibold text-[#40362c]">Market intelligence</h2>
          <p className="mt-1 text-xs text-[#887b6e]">
            Leading category, product, and customer profile by state
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#d8cab5] bg-[#eee5d7] text-[10px] font-bold uppercase tracking-[0.09em] text-[#796c5e]">
                {[
                  "State",
                  "Top category",
                  "Top product",
                  "Revenue",
                  "Units",
                  "Dominant gender",
                  "Dominant age",
                ].map((heading) => (
                  <th key={heading} className="px-5 py-4">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state.label} className="border-b border-[#e3d8c7] last:border-0">
                  <td className="px-5 py-4 text-sm font-bold text-[#44392f]">{state.label}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#695f54]">
                    {state.topCategory}
                  </td>
                  <td className="px-5 py-4 text-xs text-[#695f54]">{state.topProduct}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#4b4137]">
                    {formatCompactInr(state.revenue)}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#695f54]">{state.units}</td>
                  <td className="px-5 py-4 text-xs text-[#695f54]">
                    {state.dominantGender}
                  </td>
                  <td className="px-5 py-4 text-xs text-[#695f54]">
                    {state.dominantAgeGroup}
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
