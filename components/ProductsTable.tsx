"use client";

import { useState } from "react";
import type { ProductIntelligence, ProductRisk } from "@/lib/intelligence";

const filters: Array<"All" | ProductRisk> = [
  "All",
  "Low Stock",
  "Overstock",
  "High Returns",
  "Trending",
];

const riskStyles: Record<ProductRisk, string> = {
  "Low Stock": "bg-[#fae5df] text-[#a25d50]",
  Overstock: "bg-[#e6eef7] text-[#587493]",
  "High Returns": "bg-[#f6e2ea] text-[#9a5871]",
  Trending: "bg-[#ece5f5] text-[#70598e]",
  Healthy: "bg-[#e4f0e9] text-[#537867]",
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function ProductsTable({ products }: { products: ProductIntelligence[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.risk === activeFilter);

  return (
    <section className="soft-card overflow-hidden rounded-3xl">
      <div className="border-b border-[#eeeaf0] p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-[#363142]">Product intelligence</h2>
            <p className="mt-1 text-xs text-[#98929f]">
              Revenue, demand, inventory, return, and trend signals by SKU
            </p>
          </div>
          <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => {
              const count =
                filter === "All"
                  ? products.length
                  : products.filter((product) => product.risk === filter).length;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition ${
                    activeFilter === filter
                      ? "bg-[#3b3548] text-white"
                      : "bg-[#f3f0f4] text-[#77717f] hover:bg-[#ebe6ef]"
                  }`}
                >
                  {filter} <span className="ml-1 opacity-65">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#eeeaf0] bg-white/45 text-[10px] font-bold uppercase tracking-[0.09em] text-[#99929f]">
              {[
                "Product",
                "Category",
                "Revenue",
                "Units",
                "Stock",
                "Returns",
                "Return rate",
                "Trend score",
                "Risk",
              ].map((heading) => (
                <th key={heading} className="px-5 py-4">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.productId} className="border-b border-[#f1eef2] last:border-0">
                <td className="px-5 py-4">
                  <span className="block text-sm font-bold text-[#403a48]">
                    {product.productName}
                  </span>
                  <span className="mt-1 block text-[11px] text-[#a09aa5]">{product.productId}</span>
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-[#716b77]">
                  {product.category}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-[#494350]">
                  {currency.format(product.revenue)}
                </td>
                <td className="px-5 py-4 text-sm text-[#68616d]">{product.unitsSold}</td>
                <td className="px-5 py-4 text-sm text-[#68616d]">{product.stockAvailable}</td>
                <td className="px-5 py-4 text-sm text-[#68616d]">{product.returns}</td>
                <td className="px-5 py-4 text-sm text-[#68616d]">
                  {product.returnRate.toFixed(1)}%
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#ece8ef]">
                      <div
                        className="h-full rounded-full bg-[#917cad]"
                        style={{ width: `${product.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#625b68]">{product.score}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${riskStyles[product.risk]}`}
                  >
                    {product.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="p-10 text-center text-sm text-[#8d8692]">
          No products currently match this risk rule.
        </div>
      ) : null}
    </section>
  );
}

