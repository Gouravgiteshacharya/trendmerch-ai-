import type { CategorySales, DemandMetric } from "@/lib/analytics";
import { formatCompactInr } from "@/lib/format";

const chartColors = ["#667052", "#aa8b58", "#a66f55", "#887668", "#9a9277"];

export function CategoryChart({ data }: { data: CategorySales[] }) {
  const bars = data.slice(0, 5);
  const maxRevenue = Math.max(...bars.map((bar) => bar.revenue), 1);

  return (
    <div className="flex h-56 items-end gap-3 sm:gap-5">
      {bars.map((bar, index) => (
        <div key={bar.category} className="flex h-full min-w-0 flex-1 flex-col justify-end">
          <span className="mb-2 text-center text-[10px] font-bold text-[#7c7063]">
            {formatCompactInr(bar.revenue)}
          </span>
          <div className="relative h-[76%] overflow-hidden rounded-t-xl bg-[#e8dfd1]">
            <div
              className="absolute inset-x-0 bottom-0 rounded-t-xl"
              style={{
                height: `${Math.max(12, (bar.revenue / maxRevenue) * 100)}%`,
                backgroundColor: chartColors[index],
              }}
            />
          </div>
          <span className="mt-3 truncate text-center text-[10px] font-semibold text-[#817568]">
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
    <div className="flex h-56 flex-col justify-center gap-3 rounded-2xl border border-[#e0d5c3] bg-[#f7f1e7] p-4">
      {states.map((state) => (
        <div key={state.label} className="grid grid-cols-[82px_1fr_36px] items-center gap-3">
          <span className="truncate text-[10px] font-semibold text-[#817568]">{state.label}</span>
          <div className="h-3 overflow-hidden rounded-full bg-[#e5dbc9]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#a89a70] to-[#596149]"
              style={{ width: `${Math.max(8, (state.units / maxUnits) * 100)}%` }}
            />
          </div>
          <span className="text-right text-[10px] font-bold text-[#6e6257]">{state.units}</span>
        </div>
      ))}
      <div className="mt-1 flex items-center justify-between border-t border-[#ded2bf] pt-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9b8e80]">
        <span>Units sold</span>
        <span>{states.reduce((sum, state) => sum + state.units, 0)} across top markets</span>
      </div>
    </div>
  );
}
