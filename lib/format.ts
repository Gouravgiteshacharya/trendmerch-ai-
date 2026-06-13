function compactNumber(value: number, divisor: number, suffix: string) {
  const scaled = value / divisor;
  const digits = scaled >= 100 ? 0 : 1;
  return `${scaled.toFixed(digits).replace(/\.0$/, "")}${suffix}`;
}

export function formatCompactInr(value: number) {
  const absolute = Math.abs(value);
  if (absolute >= 10_000_000) return `₹${compactNumber(value, 10_000_000, "Cr")}`;
  if (absolute >= 100_000) return `₹${compactNumber(value, 100_000, "L")}`;
  if (absolute >= 1_000) return `₹${compactNumber(value, 1_000, "K")}`;
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}
