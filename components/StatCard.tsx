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
  lavender: "from-[#f1ebf8] to-[#fbf9fd] text-[#766099]",
  peach: "from-[#fae7df] to-[#fffaf8] text-[#a96755]",
  mint: "from-[#e2f1e9] to-[#f9fcfa] text-[#55806f]",
  blue: "from-[#e4edf7] to-[#fafcfe] text-[#5d7695]",
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
      className={`rounded-3xl bg-gradient-to-br ${tones[tone]} p-5 shadow-[0_16px_45px_rgba(58,48,82,0.07)]`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#777181]">{label}</p>
        <span className="grid size-9 place-items-center rounded-xl bg-white/65">
          <Icon name={icon} className="size-[17px]" />
        </span>
      </div>
      <p className="mt-5 text-[28px] font-bold tracking-[-0.04em] text-[#302c3e]">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className={`font-bold ${good ? "text-[#588675]" : "text-[#c07165]"}`}>
          {change}
        </span>
        <span className="text-[#97919c]">{detail}</span>
      </div>
    </article>
  );
}
