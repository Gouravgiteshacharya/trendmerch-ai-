"use client";

import { DataEmptyState } from "@/components/DataEmptyState";
import { PageHeader } from "@/components/PageHeader";
import { ProductsTable } from "@/components/ProductsTable";
import { productIntelligence } from "@/lib/intelligence";
import { useAnalyticsData } from "@/lib/use-analytics-data";

export default function ProductsPage() {
  const { records, timeframe, hasEnoughData } = useAnalyticsData();
  const products = hasEnoughData ? productIntelligence(records) : [];
  const lowStock = products.filter((product) => product.risk === "Low Stock").length;
  const overstock = products.filter((product) => product.risk === "Overstock").length;
  const trending = products.filter((product) => product.risk === "Trending").length;

  return (
    <>
      <PageHeader
        title="Products"
        description="Monitor SKU velocity, inventory cover, return exposure, and trend momentum across the assortment."
      />

      {!hasEnoughData ? (
        <DataEmptyState timeframe={timeframe} recordCount={records.length} />
      ) : (
        <>
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active SKUs", value: products.length, tone: "bg-[#eee8f6]" },
          { label: "Low stock", value: lowStock, tone: "bg-[#f8e7e1]" },
          { label: "Overstock", value: overstock, tone: "bg-[#e6eef7]" },
          { label: "Trending", value: trending, tone: "bg-[#e4f0e9]" },
        ].map((item) => (
          <article key={item.label} className={`rounded-3xl p-5 ${item.tone}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#817a87]">
              {item.label}
            </p>
            <p className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#342f40]">
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
