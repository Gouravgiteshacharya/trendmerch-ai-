"use client";

import { DataEmptyState } from "@/components/DataEmptyState";
import { DataLoadingState } from "@/components/DataLoadingState";
import { PageHeader } from "@/components/PageHeader";
import { ProductsTable } from "@/components/ProductsTable";
import { productIntelligence } from "@/lib/intelligence";
import { useAnalyticsData } from "@/lib/use-analytics-data";

export default function ProductsPage() {
  const { records, timeframe, hasEnoughData, isHydrated } = useAnalyticsData();
  const products = hasEnoughData ? productIntelligence(records) : [];
  const lowStock = products.filter((product) => product.risk === "Low Stock").length;
  const overstock = products.filter((product) => product.risk === "Overstock").length;
  const trending = products.filter((product) => product.risk === "Trending").length;

  return (
    <>
      <PageHeader
        title="Collection Intelligence"
        description="Monitor SKU velocity, inventory cover, return exposure, and trend momentum across the assortment."
      />

      {!isHydrated ? (
        <DataLoadingState />
      ) : !hasEnoughData ? (
        <DataEmptyState timeframe={timeframe} recordCount={records.length} />
      ) : (
        <>
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active SKUs", value: products.length, tone: "border-t-[#aa8b58]" },
          { label: "Low stock", value: lowStock, tone: "border-t-[#b67858]" },
          { label: "Overstock", value: overstock, tone: "border-t-[#887668]" },
          { label: "Trending", value: trending, tone: "border-t-[#687153]" },
        ].map((item) => (
          <article key={item.label} className={`rounded-3xl border border-[#d6c7b0] border-t-[3px] bg-[#faf6ee] p-5 shadow-[0_14px_32px_rgba(70,55,38,0.055)] ${item.tone}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#817467]">
              {item.label}
            </p>
            <p className="editorial-serif mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#3b3127]">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <ProductsTable products={products} />
        </>
      )}
    </>
  );
}
