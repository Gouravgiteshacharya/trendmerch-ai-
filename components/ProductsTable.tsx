"use client";

import { useState } from "react";
import { formatCompactInr } from "@/lib/format";
import type { ProductIntelligence, ProductRisk } from "@/lib/intelligence";

const filters: Array<"All" | ProductRisk> = [
  "All",
  "Low Stock",
  "Overstock",
  "High Returns",
  "Trending",
];

const riskStyles: Record<ProductRisk, string> = {
  "Low Stock": "border border-[#c98768]/45 bg-[#f7e6dc] text-[#9f5f45]",
  Overstock: "border border-[#b49d79]/45 bg-[#eee5d5] text-[#7f6949]",
  "High Returns": "border border-[#a8756d]/40 bg-[#f2e1de] text-[#8c5750]",
  Trending: "border border-[#7d8668]/45 bg-[#e4e8da] text-[#596149]",
  Healthy: "border border-[#9ca17f]/40 bg-[#edf0e5] text-[#67704f]",
};

export function ProductsTable({ products }: { products: ProductIntelligence[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.risk === activeFilter);

  return (
    <section className="soft-card overflow-hidden rounded-3xl">
      <div className="border-b border-[#d9ccb8] p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="editorial-serif text-[20px] font-semibold text-[#40362c]">Collection intelligence</h2>
            <p className="mt-1 text-xs text-[#887b6e]">
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
                      ? "bg-[#3d352d] text-[#fff8ec]"
                      : "border border-[#d7c9b4] bg-[#f1eadf] text-[#71665a] hover:bg-[#e8ddcc]"
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
            <tr className="border-b border-[#d8cab5] bg-[#eee5d7] text-[10px] font-bold uppercase tracking-[0.09em] text-[#796c5e]">
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
              <tr key={product.productId} className="border-b border-[#e3d8c7] last:border-0">
                <td className="px-5 py-4">
                  <span className="block text-sm font-bold text-[#44392f]">
                    {product.productName}
                  </span>
                  <span className="mt-1 block text-[11px] text-[#948779]">{product.productId}</span>
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-[#695f54]">
                  {product.category}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-[#4b4137]">
                  {formatCompactInr(product.revenue)}
                </td>
                <td className="px-5 py-4 text-sm text-[#695f54]">{product.unitsSold}</td>
                <td className="px-5 py-4 text-sm text-[#695f54]">{product.stockAvailable}</td>
                <td className="px-5 py-4 text-sm text-[#695f54]">{product.returns}</td>
                <td className="px-5 py-4 text-sm text-[#695f54]">
                  {product.returnRate.toFixed(1)}%
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#e6ddce]">
                      <div
                        className="h-full rounded-full bg-[#687153]"
                        style={{ width: `${product.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#62584d]">{product.score}</span>
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
        <div className="p-10 text-center text-sm text-[#887b6e]">
          No products currently match this risk rule.
        </div>
      ) : null}
    </section>
  );
}
