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
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eee8f5] text-[#745f91]">
          <Icon name="report" className="size-6" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-[#403a47]">
          {recordCount === 0 ? "No data in this timeframe" : "Not enough data for a reliable view"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#817a86]">
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
              className="rounded-xl border border-[#ddd4e4] bg-white px-3 py-2 text-xs font-bold text-[#665872] transition hover:bg-[#f6f1f8]"
            >
              Switch to {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
