"use client";

import { Icon } from "@/components/icons";
import { saveTimeframe, timeframeLabel, type Timeframe } from "@/lib/timeframe";

const alternatives: { value: Timeframe; label: string }[] = [
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "last-1-year", label: "Last 1 Year" },
  { value: "all-time", label: "All Time" },
];

export function DataEmptyState({
  timeframe,
  recordCount,
}: {
  timeframe: Timeframe;
  recordCount: number;
}) {
  return (
    <section className="soft-card subtle-grid flex min-h-[360px] items-center justify-center rounded-3xl p-8 text-center">
      <div className="max-w-lg">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e4e8da] text-[#596149]">
          <Icon name="report" className="size-6" />
        </span>
        <h2 className="editorial-serif mt-5 text-xl font-semibold text-[#40362c]">
          {recordCount === 0 ? "No data in this timeframe" : "Not enough data for a reliable view"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#817467]">
          {timeframeLabel(timeframe)} contains {recordCount} usable{" "}
          {recordCount === 1 ? "record" : "records"}. Choose a broader period to generate meaningful
          merchandising analytics.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {alternatives.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => saveTimeframe(option.value)}
              className="rounded-xl border border-[#d2c3ac] bg-[#faf6ee] px-3 py-2 text-xs font-bold text-[#5c5146] transition hover:bg-[#eee5d7]"
            >
              Switch to {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
