import { Icon } from "@/components/icons";
import { TimeframeBadge } from "@/components/TimeframeBadge";
import { TimeframeControl } from "@/components/TimeframeControl";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PageHeader({
  eyebrow = "TrendMerch Intelligence",
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9a86b2]">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#292638] sm:text-[36px]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7d7888]">{description}</p>
        <TimeframeBadge className="mt-3" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <TimeframeControl />
        <button
          aria-label="Search"
          className="grid size-10 place-items-center rounded-2xl border border-white bg-white/75 text-[#817b8b] shadow-[0_8px_24px_rgba(48,41,61,0.06)]"
        >
          <Icon name="search" className="size-[18px]" />
        </button>
        <button
          aria-label="Notifications"
          className="relative grid size-10 place-items-center rounded-2xl border border-white bg-white/75 text-[#817b8b] shadow-[0_8px_24px_rgba(48,41,61,0.06)]"
        >
          <Icon name="bell" className="size-[18px]" />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[#ed9d87]" />
        </button>
      </div>
    </header>
  );
}
