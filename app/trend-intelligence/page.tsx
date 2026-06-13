"use client";

import { DataEmptyState } from "@/components/DataEmptyState";
import { PageHeader } from "@/components/PageHeader";
import { trendIntelligence, type TrendDuration } from "@/lib/intelligence";
import { useAnalyticsData } from "@/lib/use-analytics-data";

const durationStyles: Record<TrendDuration, string> = {
  "Viral spike": "bg-[#f8e3df] text-[#9c5a50]",
  "Seasonal trend": "bg-[#eee7f6] text-[#735f91]",
  Evergreen: "bg-[#e3efe9] text-[#547766]",
  Declining: "bg-[#e7edf4] text-[#5f7188]",
};

function signedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export default function TrendIntelligencePage() {
  const { records, timeframe, hasEnoughData } = useAnalyticsData();
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

      {!hasEnoughData ? (
        <DataEmptyState timeframe={timeframe} recordCount={records.length} />
      ) : (
        <>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Rising products", value: rising.length, tone: "bg-[#eee8f6]" },
          { label: "Viral signals", value: viral.length, tone: "bg-[#f8e7e1]" },
          {
            label: "Breakout keyword",
            value: leadTrend?.trendKeyword ?? "N/A",
            tone: "bg-[#e3efe9]",
          },
        ].map((item) => (
          <article key={item.label} className={`rounded-3xl p-5 ${item.tone}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#817a87]">
              {item.label}
            </p>
            <p className="mt-4 text-2xl font-bold capitalize tracking-[-0.03em] text-[#373140]">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <div className="soft-card overflow-hidden rounded-3xl">
          <div className="border-b border-[#eeeaf0] p-5 sm:p-6">
            <h2 className="text-[17px] font-bold text-[#363142]">Trend ranking</h2>
            <p className="mt-1 text-xs text-[#98929f]">
              Composite score from demand, revenue, recent velocity, and rating
            </p>
          </div>
          <div className="divide-y divide-[#f0edf1]">
            {trends.map((trend, index) => (
              <article
                key={trend.productId}
                className="grid gap-4 p-5 sm:grid-cols-[44px_minmax(0,1fr)_120px_150px] sm:items-center"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-[#f0ebf5] text-sm font-bold text-[#705e8c]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-[#433d49]">
                      {trend.productName}
                    </h3>
                    <span className="rounded-full bg-[#f3eff5] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#83718f]">
                      {trend.trendKeyword}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#97909c]">
                    {trend.category} · {trend.recentUnits} recent units
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm font-bold ${
                      trend.growth >= 0 ? "text-[#56806e]" : "text-[#b06760]"
                    }`}
                  >
                    {signedPercent(trend.growth)}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[#a19aa5]">
                    demand growth
                  </p>
                </div>
                <div className="sm:text-right">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${durationStyles[trend.duration]}`}
                  >
                    {trend.duration}
                  </span>
                  <p className="mt-1.5 text-[10px] text-[#928b96]">{trend.durationLabel}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {trends.slice(0, 4).map((trend, index) => (
            <article
              key={trend.productId}
              className={`rounded-3xl p-5 ${
                index === 0 ? "bg-[#373142] text-white" : "soft-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.13em] ${
                    index === 0 ? "text-[#d6c9e4]" : "text-[#9a86b2]"
                  }`}
                >
                  Rule-based insight
                </span>
                <span
                  className={`text-xs font-bold ${
                    index === 0 ? "text-[#f0dfba]" : "text-[#765f94]"
                  }`}
                >
                  {trend.score}/100
                </span>
              </div>
              <h2
                className={`mt-3 text-base font-bold ${
                  index === 0 ? "text-white" : "text-[#403946]"
                }`}
              >
                {trend.productName}
              </h2>
              <p
                className={`mt-2 text-xs leading-5 ${
                  index === 0 ? "text-[#c9c1ce]" : "text-[#7d7581]"
                }`}
              >
                {trend.explanation}
              </p>
            </article>
          ))}
        </div>
      </section>
        </>
      )}
    </>
  );
}
