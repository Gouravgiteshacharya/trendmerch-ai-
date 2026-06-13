"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";

const navigation: { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "Products", href: "/products", icon: "products" },
  { label: "Geo Demand", href: "/geo-demand", icon: "geo" },
  { label: "Customer Segments", href: "/customer-segments", icon: "customers" },
  { label: "Trend Intelligence", href: "/trend-intelligence", icon: "trend" },
  { label: "AI Chat", href: "/ai-chat", icon: "chat" },
  { label: "Weekly Report", href: "/weekly-report", icon: "report" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[#e8e3eb] bg-white/75 px-4 py-4 backdrop-blur-2xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
      <Link href="/" className="flex items-center gap-3 px-2">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#343047] text-white shadow-[0_10px_24px_rgba(52,48,71,0.2)]">
          <Icon name="sparkles" className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[17px] font-bold tracking-[-0.03em] text-[#2e2a3d]">
            TrendMerch AI
          </span>
          <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9a94a5]">
            Merchandising co-pilot
          </span>
        </span>
      </Link>

      <nav className="scrollbar-hidden -mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:mt-10 lg:block lg:space-y-1.5 lg:overflow-visible lg:px-0">
        {navigation.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition lg:w-full ${
                active
                  ? "bg-[#eee9f7] text-[#66558d] shadow-[inset_0_0_0_1px_rgba(139,123,183,0.08)]"
                  : "text-[#848091] hover:bg-[#f7f4f8] hover:text-[#454052]"
              }`}
            >
              <Icon
                name={item.icon}
                className={`size-[19px] shrink-0 ${
                  active ? "text-[#7f6da8]" : "text-[#aaa5b3] group-hover:text-[#706a7c]"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden rounded-3xl bg-gradient-to-br from-[#eee7f5] to-[#f8e9e7] p-4 lg:block">
        <div className="mb-4 grid size-9 place-items-center rounded-xl bg-white/80 text-[#765f99]">
          <Icon name="sparkles" className="size-4" />
        </div>
        <p className="text-sm font-bold text-[#413b50]">AI trend brief is ready</p>
        <p className="mt-1 text-xs leading-5 text-[#7e7788]">
          Three demand shifts need your attention this week.
        </p>
        <Link
          href="/weekly-report"
          className="mt-4 flex items-center justify-between text-xs font-bold text-[#6d588f]"
        >
          View brief <Icon name="arrow" className="size-4" />
        </Link>
      </div>

      <div className="mt-5 hidden items-center gap-3 border-t border-[#eeeaf0] px-1 pt-5 lg:flex">
        <span className="grid size-9 place-items-center rounded-full bg-[#f1d8d3] text-xs font-bold text-[#704f55]">
          GA
        </span>
        <span>
          <span className="block text-xs font-bold text-[#494451]">Merchandiser</span>
          <span className="block text-[11px] text-[#9b96a1]">Merchandising team</span>
        </span>
      </div>
    </aside>
  );
}
