"use client";

import { DataEmptyState } from "@/components/DataEmptyState";
import { DataLoadingState } from "@/components/DataLoadingState";
import { PageHeader } from "@/components/PageHeader";
import {
  getAgeGroup,
  trendIntelligence,
  type TrendDuration,
  type TrendIntelligence,
} from "@/lib/intelligence";
import { useAnalyticsData } from "@/lib/use-analytics-data";

const durationStyles: Record<TrendDuration, string> = {
  "Viral spike": "border border-[#bd8168]/40 bg-[#f4e1d8] text-[#985c45]",
  "Seasonal trend": "border border-[#b29a70]/40 bg-[#eee5d4] text-[#806942]",
  Evergreen: "border border-[#84906d]/40 bg-[#e3e8d9] text-[#596149]",
  Declining: "border border-[#9b8b7c]/35 bg-[#e9e3da] text-[#76685c]",
};

function signedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function leadingValue(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
}

function merchandisingAction(trend: TrendIntelligence) {
  if (trend.returnRate > 15) {
    return "Review fit, quality, and product detail content before increasing promotion.";
  }
  if (trend.stockAvailable < 20 && trend.growth >= 0) {
    return "Replenish selectively and protect availability in the strongest market.";
  }
  if (trend.stockAvailable > 80 || trend.growth < 0) {
    return "Hold additional buys and use targeted storytelling or a controlled offer.";
  }
  if (trend.duration === "Viral spike") {
    return "Increase visibility now, but keep buys disciplined around the short trend window.";
  }
  return "Maintain balanced inventory and feature the product in segment-led campaigns.";
}

export default function TrendIntelligencePage() {
  const { records, timeframe, hasEnoughData, isHydrated } = useAnalyticsData();
  const trends = hasEnoughData ? trendIntelligence(records) : [];
  const rising = trends.filter((trend) => trend.growth > 0);
  const viral = trends.filter((trend) => trend.duration === "Viral spike");
  const leadTrend = trends[0];

  return (
    <>
      <PageHeader
        title="Trend Intelligence"
        description="Rank emerging product signals, estimate their staying power, and translate momentum into merchandising action."
      />

      <section className="mb-5 rounded-3xl border border-[#cfc2a7] bg-[#f3eddf] p-5 shadow-[0_12px_28px_rgba(70,55,38,0.045)]">
        <p className="max-w-4xl text-sm leading-6 text-[#665b4f]">
          Trend Intelligence identifies products and categories gaining momentum using sales
          velocity, stock movement, return behavior, regional demand, customer segments, and
          AI-generated reasoning.
        </p>
      </section>

      {!isHydrated ? (
        <DataLoadingState />
      ) : !hasEnoughData ? (
        <DataEmptyState timeframe={timeframe} recordCount={records.length} />
      ) : (
        <>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Rising products", value: rising.length, tone: "border-t-[#687153]" },
          { label: "Viral signals", value: viral.length, tone: "border-t-[#a66f55]" },
          {
            label: "Breakout keyword",
            value: leadTrend?.trendKeyword ?? "N/A",
            tone: "border-t-[#aa8b58]",
          },
        ].map((item) => (
          <article key={item.label} className={`rounded-3xl border border-[#d6c7b0] border-t-[3px] bg-[#faf6ee] p-5 shadow-[0_14px_32px_rgba(70,55,38,0.055)] ${item.tone}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#817467]">
              {item.label}
            </p>
            <p className="editorial-serif mt-4 text-2xl font-semibold capitalize tracking-[-0.03em] text-[#3b3127]">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <div className="soft-card overflow-hidden rounded-3xl">
          <div className="border-b border-[#d9ccb8] p-5 sm:p-6">
            <h2 className="editorial-serif text-[20px] font-semibold text-[#40362c]">Trend ranking</h2>
            <p className="mt-1 text-xs text-[#887b6e]">
              Composite score from demand, revenue, recent velocity, and rating
            </p>
          </div>
          <div className="divide-y divide-[#e3d8c7]">
            {trends.map((trend, index) => (
              <article
                key={trend.productId}
                className="grid gap-4 p-5 sm:grid-cols-[44px_minmax(0,1fr)_120px_150px] sm:items-center"
              >
                <span className="grid size-10 place-items-center rounded-xl border border-[#d7c9b4] bg-[#eee5d7] text-sm font-bold text-[#756244]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-[#44392f]">
                      {trend.productName}
                    </h3>
                    <span className="rounded-full border border-[#b7ad90]/45 bg-[#ece9dc] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#657052]">
                      {trend.trendKeyword}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#918476]">
                    {trend.category} · {trend.recentUnits} recent units
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm font-bold ${
                      trend.growth >= 0 ? "text-[#647052]" : "text-[#a66f55]"
                    }`}
                  >
                    {signedPercent(trend.growth)}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[#998b7d]">
                    demand growth
                  </p>
                </div>
                <div className="sm:text-right">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${durationStyles[trend.duration]}`}
                  >
                    {trend.duration}
                  </span>
                  <p className="mt-1.5 text-[10px] text-[#887b6e]">{trend.durationLabel}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {trends.slice(0, 4).map((trend, index) => (
            (() => {
              const productRecords = records.filter(
                (record) => record.productId === trend.productId,
              );
              const topRegion = leadingValue(productRecords.map((record) => record.state));
              const topSegment = leadingValue(
                productRecords.map((record) => getAgeGroup(record.customerAge)),
              );

              return (
                <article
                  key={trend.productId}
                  className={`rounded-3xl p-5 ${
                    index === 0
                      ? "border border-[#6d745a] bg-[#40483a] text-[#fffaf0] shadow-[0_16px_38px_rgba(55,57,43,0.16)]"
                      : "soft-card"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-[0.13em] ${
                        index === 0 ? "text-[#d8c69d]" : "text-[#9a7d4f]"
                      }`}
                    >
                      {trend.category}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        index === 0
                          ? "border border-[#d6c18f]/30 bg-white/[0.07] text-[#e1cb99]"
                          : "border border-[#aeb495]/50 bg-[#e5e8dc] text-[#596149]"
                      }`}
                    >
                      {trend.score}/100
                    </span>
                  </div>
                  <h2
                    className={`editorial-serif mt-3 text-lg font-semibold ${
                      index === 0 ? "text-[#fffaf0]" : "text-[#40362c]"
                    }`}
                  >
                    {trend.productName}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {[
                      ["Why it is trending", trend.explanation],
                      ["Top region", topRegion],
                      ["Top customer segment", topSegment],
                      ["Estimated duration", `${trend.duration} · ${trend.durationLabel}`],
                      ["Recommended action", merchandisingAction(trend)],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className={`rounded-2xl border px-3 py-2.5 ${
                          index === 0
                            ? "border-white/10 bg-white/[0.045]"
                            : "border-[#ded2bf] bg-[#f5efe5]"
                        }`}
                      >
                        <p
                          className={`text-[9px] font-bold uppercase tracking-[0.1em] ${
                            index === 0 ? "text-[#cdbb96]" : "text-[#8f7959]"
                          }`}
                        >
                          {label}
                        </p>
                        <p
                          className={`mt-1 text-xs leading-5 ${
                            index === 0 ? "text-[#ded6c8]" : "text-[#6f6458]"
                          }`}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })()
          ))}
        </div>
      </section>

      <aside className="mt-5 rounded-2xl border border-[#d4c5ae] bg-[#f8f3ea] px-4 py-3 text-xs leading-5 text-[#786d60]">
        This MVP uses internal/demo retail signals for trend scoring. In production, this layer can
        connect to Google Trends, social signals, marketplace reviews, and competitor catalog data.
      </aside>
        </>
      )}
    </>
  );
}
