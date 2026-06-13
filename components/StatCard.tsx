import { Icon, type IconName } from "@/components/icons";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  detail: string;
  icon: IconName;
  tone: "lavender" | "peach" | "mint" | "blue";
  inverseTrend?: boolean;
};

const tones = {
  lavender: "border-t-[#aa8b58] text-[#8d7044]",
  peach: "border-t-[#b67858] text-[#a66f55]",
  mint: "border-t-[#687153] text-[#596149]",
  blue: "border-t-[#887668] text-[#756357]",
};

export function StatCard({
  label,
  value,
  change,
  detail,
  icon,
  tone,
  inverseTrend = false,
}: StatCardProps) {
  const isPositive = change.trim().startsWith("+");
  const good = inverseTrend ? !isPositive : isPositive;

  return (
    <article
      className={`rounded-3xl border border-[#d6c7b0] border-t-[3px] bg-[#faf6ee] ${tones[tone]} p-5 shadow-[0_16px_38px_rgba(70,55,38,0.07)]`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#786d60]">{label}</p>
        <span className="grid size-9 place-items-center rounded-xl border border-[#dfd2bf] bg-[#f3ecdf]">
          <Icon name={icon} className="size-[17px]" />
        </span>
      </div>
      <p className="editorial-serif mt-5 text-[30px] font-semibold tracking-[-0.04em] text-[#3b3127]">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className={`font-bold ${good ? "text-[#657052]" : "text-[#a66f55]"}`}>
          {change}
        </span>
        <span className="text-[#918578]">{detail}</span>
      </div>
    </article>
  );
}
