export type Timeframe =
  | "last-24-hours"
  | "last-7-days"
  | "last-15-days"
  | "last-30-days"
  | "last-6-months"
  | "last-1-year"
  | "all-time";

export const TIMEFRAME_KEY = "trendmerch-timeframe";
export const TIMEFRAME_EVENT = "trendmerch-timeframe-updated";
export const defaultTimeframe: Timeframe = "last-30-days";

export const timeframeOptions: { value: Timeframe; label: string }[] = [
  { value: "last-24-hours", label: "Last 24 Hours" },
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-15-days", label: "Last 15 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "last-6-months", label: "Last 6 Months" },
  { value: "last-1-year", label: "Last 1 Year" },
  { value: "all-time", label: "All Time" },
];

export function normalizeTimeframe(value: unknown): Timeframe {
  return timeframeOptions.some((option) => option.value === value)
    ? (value as Timeframe)
    : defaultTimeframe;
}

export function timeframeLabel(timeframe: Timeframe) {
  return timeframeOptions.find((option) => option.value === timeframe)?.label ?? "Last 30 Days";
}

export function filterDataByTimeframe<T extends { date: string }>(
  data: T[],
  timeframe: Timeframe,
) {
  if (timeframe === "all-time" || data.length === 0) return data;

  const validDates = data
    .map((record) => Date.parse(record.date))
    .filter((timestamp) => Number.isFinite(timestamp));
  if (validDates.length === 0) return [];

  const latest = Math.max(...validDates);
  const latestDate = new Date(latest);
  let start = latest;

  if (timeframe === "last-24-hours") start = latest - 24 * 60 * 60 * 1000;
  if (timeframe === "last-7-days") start = latest - 6 * 24 * 60 * 60 * 1000;
  if (timeframe === "last-15-days") start = latest - 14 * 24 * 60 * 60 * 1000;
  if (timeframe === "last-30-days") start = latest - 29 * 24 * 60 * 60 * 1000;
  if (timeframe === "last-6-months") {
    const boundary = new Date(latestDate);
    boundary.setUTCMonth(boundary.getUTCMonth() - 6);
    start = boundary.getTime();
  }
  if (timeframe === "last-1-year") {
    const boundary = new Date(latestDate);
    boundary.setUTCFullYear(boundary.getUTCFullYear() - 1);
    start = boundary.getTime();
  }

  return data.filter((record) => {
    const timestamp = Date.parse(record.date);
    return Number.isFinite(timestamp) && timestamp >= start && timestamp <= latest;
  });
}

export function saveTimeframe(timeframe: Timeframe) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TIMEFRAME_KEY, timeframe);
    window.dispatchEvent(new Event(TIMEFRAME_EVENT));
  }
}
