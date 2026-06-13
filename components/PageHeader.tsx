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
    <header className="mb-8 flex flex-col gap-5 border-b border-[#d5c6af] pb-6 2xl:flex-row 2xl:items-start 2xl:justify-between">
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a7d4f]">
          {eyebrow}
        </p>
        <h1 className="editorial-serif text-3xl font-semibold tracking-[-0.04em] text-[#3b3127] sm:text-[42px] sm:leading-tight">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#776b5e]">{description}</p>
        <TimeframeBadge className="mt-3" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <TimeframeControl />
        <button
          aria-label="Search"
          className="grid size-10 place-items-center rounded-2xl border border-[#d2c3ac] bg-[#faf6ee] text-[#685d50] shadow-[0_8px_22px_rgba(70,55,38,0.06)]"
        >
          <Icon name="search" className="size-[18px]" />
        </button>
        <button
          aria-label="Notifications"
          className="relative grid size-10 place-items-center rounded-2xl border border-[#d2c3ac] bg-[#faf6ee] text-[#685d50] shadow-[0_8px_22px_rgba(70,55,38,0.06)]"
        >
          <Icon name="bell" className="size-[18px]" />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[#a96f52]" />
        </button>
      </div>
    </header>
  );
}
