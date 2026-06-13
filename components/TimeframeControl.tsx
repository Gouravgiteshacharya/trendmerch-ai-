"use client";

import { saveTimeframe, timeframeLabel, timeframeOptions, type Timeframe } from "@/lib/timeframe";
import { useTimeframe } from "@/lib/use-timeframe";

export function TimeframeControl() {
  const timeframe = useTimeframe();

  return (
    <label className="flex min-w-0 items-center gap-2 rounded-2xl border border-white bg-white/75 px-3 py-2 shadow-[0_8px_24px_rgba(48,41,61,0.06)]">
      <span className="hidden text-[9px] font-bold uppercase tracking-[0.1em] text-[#978e9d] xl:block">
        Timeframe
      </span>
      <select
        aria-label="Global timeframe"
        value={timeframe}
        onChange={(event) => saveTimeframe(event.target.value as Timeframe)}
        className="max-w-[150px] bg-transparent text-xs font-bold text-[#514959] outline-none"
      >
        {timeframeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="sr-only">Timeframe: {timeframeLabel(timeframe)}</span>
    </label>
  );
}
