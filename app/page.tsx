"use client";

import Link from "next/link";
import { CategoryChart, DemandChart } from "@/components/mock-charts";
import { ChartCard } from "@/components/ChartCard";
import { DataEmptyState } from "@/components/DataEmptyState";
import { DataSourceCard } from "@/components/DataSourceCard";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import {
  demandByState,
  periodGrowth,
  returnRate,
  salesByCategory,
  stockoutRiskProducts,
  totalRevenue,
  totalUnitsSold,
  trendScoreByProduct,
} from "@/lib/analytics";
import { useAnalyticsData } from "@/lib/use-analytics-data";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const productColors = ["#edc4b5", "#c6d4e5", "#d8cbea"];

function signedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export default function DashboardPage() {
  const { records, timeframe, hasEnoughData } = useAnalyticsData();

  if (!hasEnoughData) {
    return (
      <>
        <PageHeader
          title="Welcome back, Merchandiser"
          description="Choose a wider timeframe to unlock reliable revenue, inventory, market, and trend analytics."
        />
        <DataSourceCard />
        <DataEmptyState timeframe={timeframe} recordCount={records.length} />
      </>
    );
  }

  const revenue = totalRevenue(records);
  const units = totalUnitsSold(records);
  const returns = returnRate(records);
  const stockoutRisks = stockoutRiskProducts(records);
  const categories = salesByCategory(records);
  const states = demandByState(records);
  const trendingProducts = trendScoreByProduct(records).slice(0, 3);
  const leadRisk = stockoutRisks[0];
  const leadState = states[0];
  const revenueGrowth = periodGrowth(records, "revenue");
  const unitGrowth = periodGrowth(records, "units");
  const returnGrowth = periodGrowth(records, "returns");
  const estimatedOpportunity = leadRisk
    ? Math.max(0, leadRisk.unitsSold * 0.35 - leadRisk.stockAvailable) * leadRisk.averagePrice
    : 0;

  return (
    <>
      <PageHeader
        title="Welcome back, Merchandiser"
        description="Here is what is moving across your assortment and where your attention will have the most impact."
      />

      <DataSourceCard />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={currency.format(revenue)}
          change={signedPercent(revenueGrowth)}
          detail="momentum inside selected data"
          icon="revenue"
          tone="lavender"
        />
        <StatCard
          label="Units Sold"
          value={units.toLocaleString("en-IN")}
          change={signedPercent(unitGrowth)}
          detail={`across ${records.length} orders`}
          icon="units"
          tone="peach"
        />
        <StatCard
          label="Stockout Risk"
          value={`${stockoutRisks.length} SKUs`}
          change={`${stockoutRisks.reduce((sum, product) => sum + product.unitsSold, 0)} units`}
          detail="high demand exposure"
          icon="risk"
          tone="mint"
        />
        <StatCard
          label="Return Rate"
          value={`${returns.toFixed(1)}%`}
          change={signedPercent(returnGrowth)}
          detail="momentum inside selected data"
          icon="returns"
          tone="blue"
          inverseTrend
        />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <ChartCard
          title="Top categories"
          subtitle="Sell-through performance by category"
          badge={`${categories.length} categories`}
        >
          <CategoryChart data={categories} />
        </ChartCard>
        <ChartCard
          title="State-wise demand"
          subtitle="Demand index across key Indian markets"
          badge={`${states.length} markets`}
        >
          <DemandChart data={states} />
        </ChartCard>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <article className="soft-card rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-[#363142]">Trending products</h2>
              <p className="mt-1 text-xs text-[#98929f]">Products gaining momentum this week</p>
            </div>
            <Link href="/products" className="text-xs font-bold text-[#7b689a]">
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {trendingProducts.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center gap-4 rounded-2xl border border-[#f0edf1] bg-white/60 p-3"
              >
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-xl text-sm font-bold text-[#514956]"
                  style={{ backgroundColor: productColors[index] }}
                >
                  0{index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[#45404c]">
                    {product.productName}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#9a949f]">{product.category}</span>
                </span>
                <span className="rounded-full bg-[#e6f1eb] px-2.5 py-1 text-xs font-bold text-[#58806f]">
                  {product.score} score
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="relative overflow-hidden rounded-3xl bg-[#342f43] p-6 text-white shadow-[0_18px_48px_rgba(52,47,67,0.2)]">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-[#9b82bb]/25 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-[#efa18e]/15 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-2xl bg-white/10 text-[#ddc9f1]">
                <Icon name="sparkles" className="size-5" />
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#d8cee1]">
                AI recommendation
              </span>
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-tight tracking-[-0.035em]">
              {leadRisk
                ? `Restock ${leadRisk.productName} before the next demand peak.`
                : "Inventory cover is healthy across the assortment."}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#c6bfcb]">
              {leadRisk
                ? `${leadRisk.productName} has sold ${leadRisk.unitsSold} units with only ${leadRisk.stockAvailable} units in the latest stock snapshot. Prioritize ${leadState?.label ?? "the strongest market"} to protect an estimated ${currency.format(estimatedOpportunity)} in revenue.`
                : "No products currently meet the stockout-risk threshold in this dataset."}
            </p>
            <Link
              href="/ai-chat"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-[#3c3549]"
            >
              Explore recommendation <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
