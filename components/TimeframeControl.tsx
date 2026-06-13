"use client";

import { saveTimeframe, timeframeLabel, timeframeOptions, type Timeframe } from "@/lib/timeframe";
import { useTimeframe } from "@/lib/use-timeframe";

export function TimeframeControl() {
  const timeframe = useTimeframe();

  return (
    <label className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#d2c3ac] bg-[#faf6ee] px-3 py-2 shadow-[0_8px_22px_rgba(70,55,38,0.06)]">
      <span className="hidden text-[9px] font-bold uppercase tracking-[0.12em] text-[#938270] xl:block">
        Timeframe
      </span>
      <select
        aria-label="Global timeframe"
        value={timeframe}
        onChange={(event) => saveTimeframe(event.target.value as Timeframe)}
        className="max-w-[150px] bg-transparent text-xs font-bold text-[#4f463c] outline-none"
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
