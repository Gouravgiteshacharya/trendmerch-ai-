"use client";

import { timeframeLabel } from "@/lib/timeframe";
import { useTimeframe } from "@/lib/use-timeframe";

export function TimeframeBadge({ className = "" }: { className?: string }) {
  const timeframe = useTimeframe();
  return (
    <span
      className={`inline-flex rounded-full border border-[#cfc2a7] bg-[#f3eddf] px-3 py-1.5 text-[10px] font-bold text-[#63694f] ${className}`}
    >
      Timeframe: {timeframeLabel(timeframe)}
    </span>
  );
}
