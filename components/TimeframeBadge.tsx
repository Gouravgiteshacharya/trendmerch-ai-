"use client";

import { timeframeLabel } from "@/lib/timeframe";
import { useTimeframe } from "@/lib/use-timeframe";

export function TimeframeBadge({ className = "" }: { className?: string }) {
  const timeframe = useTimeframe();
  return (
    <span
      className={`inline-flex rounded-full bg-[#eee8f5] px-3 py-1.5 text-[10px] font-bold text-[#705e8c] ${className}`}
    >
      Timeframe: {timeframeLabel(timeframe)}
    </span>
  );
}
