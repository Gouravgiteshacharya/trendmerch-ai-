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

const defaultColors = ["#9d89bd", "#e7a58f", "#8db6a6", "#9fb7d1", "#ca9eac"];

export function MetricBars({ data, colors = defaultColors, suffix = "" }: MetricBarsProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-4 text-xs">
            <span className="truncate font-semibold text-[#5d5766]">{item.label}</span>
            <span className="shrink-0 font-bold text-[#77707e]">
              {item.detail ?? `${item.value.toLocaleString("en-IN")}${suffix}`}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#efecf1]">
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

