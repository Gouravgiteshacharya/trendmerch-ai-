import type { CategorySales, DemandMetric } from "@/lib/analytics";

const chartColors = ["#a18cc2", "#efb09c", "#91bbaa", "#a7bed7", "#d4a8b5"];

const compactCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function CategoryChart({ data }: { data: CategorySales[] }) {
  const bars = data.slice(0, 5);
  const maxRevenue = Math.max(...bars.map((bar) => bar.revenue), 1);

  return (
    <div className="flex h-56 items-end gap-3 sm:gap-5">
      {bars.map((bar, index) => (
        <div key={bar.category} className="flex h-full min-w-0 flex-1 flex-col justify-end">
          <span className="mb-2 text-center text-[10px] font-bold text-[#88818d]">
            {compactCurrency.format(bar.revenue)}
          </span>
          <div className="relative h-[76%] overflow-hidden rounded-t-xl bg-[#f1eef3]">
            <div
              className="absolute inset-x-0 bottom-0 rounded-t-xl"
              style={{
                height: `${Math.max(12, (bar.revenue / maxRevenue) * 100)}%`,
                backgroundColor: chartColors[index],
              }}
            />
          </div>
          <span className="mt-3 truncate text-center text-[10px] font-semibold text-[#8f8996]">
            {bar.category}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DemandChart({ data }: { data: DemandMetric[] }) {
  const states = data.slice(0, 6);
  const maxUnits = Math.max(...states.map((state) => state.units), 1);

  return (
    <div className="flex h-56 flex-col justify-center gap-3 rounded-2xl bg-[#fbfafc] p-4">
      {states.map((state) => (
        <div key={state.label} className="grid grid-cols-[82px_1fr_36px] items-center gap-3">
          <span className="truncate text-[10px] font-semibold text-[#8f8996]">{state.label}</span>
          <div className="h-3 overflow-hidden rounded-full bg-[#eeeaf1]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#b5a4cf] to-[#806b9f]"
              style={{ width: `${Math.max(8, (state.units / maxUnits) * 100)}%` }}
            />
          </div>
          <span className="text-right text-[10px] font-bold text-[#746d7a]">{state.units}</span>
        </div>
      ))}
      <div className="mt-1 flex items-center justify-between border-t border-[#efecf1] pt-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#aaa4ae]">
        <span>Units sold</span>
        <span>{states.reduce((sum, state) => sum + state.units, 0)} across top markets</span>
      </div>
    </div>
  );
}
