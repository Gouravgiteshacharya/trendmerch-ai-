type MetricBar = {
  label: string;
  value: number;
  detail?: string;
};

type MetricBarsProps = {
  data: MetricBar[];
  colors?: string[];
  suffix?: string;
};

const defaultColors = ["#667052", "#aa8b58", "#a66f55", "#887668", "#9a9277"];

export function MetricBars({ data, colors = defaultColors, suffix = "" }: MetricBarsProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-4 text-xs">
            <span className="truncate font-semibold text-[#5a5045]">{item.label}</span>
            <span className="shrink-0 font-bold text-[#7f7265]">
              {item.detail ?? `${item.value.toLocaleString("en-IN")}${suffix}`}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#e8dfd1]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(5, (item.value / maxValue) * 100)}%`,
                backgroundColor: colors[index % colors.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
