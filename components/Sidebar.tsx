"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";
import { useBusinessProfile } from "@/lib/use-business-profile";

const navigation: { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Products", href: "/products", icon: "products" },
  { label: "Regional Demand", href: "/geo-demand", icon: "geo" },
  { label: "Clientele Segments", href: "/customer-segments", icon: "customers" },
  { label: "Trend Intelligence", href: "/trend-intelligence", icon: "trend" },
  { label: "AI Assistant", href: "/ai-chat", icon: "chat" },
  { label: "Merchandising Report", href: "/weekly-report", icon: "report" },
  { label: "Business Setup", href: "/business-setup", icon: "products" },
];

export function Sidebar() {
  const pathname = usePathname();
  const profile = useBusinessProfile();
  const hasSavedProfile = Boolean(profile.updatedAt);
  const workspaceName =
    hasSavedProfile && profile.companyName.trim() ? profile.companyName.trim() : "TrendMerch Demo";
  const workspaceInitials = workspaceName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="border-b border-[#cdbda4] bg-[#eee6d8]/98 px-4 py-4 text-[#4a4138] shadow-[10px_0_30px_rgba(70,55,38,0.045)] backdrop-blur-2xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
      <Link href="/dashboard" className="flex items-center gap-3 px-2">
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#9da382] bg-[#5f684f] text-[#f7efdf] shadow-[0_8px_20px_rgba(70,76,56,0.13)]">
          <Icon name="sparkles" className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="editorial-serif block text-[19px] font-semibold tracking-[-0.03em] text-[#3f372f]">
            TrendMerch AI
          </span>
          <span className="block truncate text-[9px] font-semibold uppercase tracking-[0.19em] text-[#8b795e]">
            Merchandising Atelier
          </span>
        </span>
      </Link>

      <nav className="scrollbar-hidden -mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:mt-10 lg:block lg:space-y-1.5 lg:overflow-visible lg:px-0">
        {navigation.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-3 text-sm font-semibold transition lg:w-full ${
                active
                  ? "border-[#aeb495]/65 bg-[#e0e5d8] text-[#4f5943] shadow-[0_7px_18px_rgba(78,88,65,0.07)]"
                  : "border-transparent text-[#766b60] hover:border-[#d8cab5] hover:bg-[#f6f0e6] hover:text-[#40382f]"
              }`}
            >
              {active ? (
                <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#9b8151]" />
              ) : null}
              <Icon
                name={item.icon}
                className={`size-[19px] shrink-0 ${
                  active ? "text-[#596149]" : "text-[#998d7f] group-hover:text-[#6d7359]"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden rounded-3xl border border-[#c8b99f] bg-[#e5e7d9] p-4 shadow-[0_10px_26px_rgba(70,55,38,0.055)] lg:block">
        <div className="mb-4 grid size-9 place-items-center rounded-xl border border-[#b7bc9e] bg-[#f3f0e5] text-[#626b50]">
          <Icon name="sparkles" className="size-4" />
        </div>
        <p className="text-sm font-bold text-[#414a39]">Atelier brief is ready</p>
        <p className="mt-1 text-xs leading-5 text-[#726d61]">
          Three demand shifts need your attention this week.
        </p>
        <Link
          href="/weekly-report"
          className="mt-4 flex items-center justify-between text-xs font-bold text-[#596149]"
        >
          View brief <Icon name="arrow" className="size-4" />
        </Link>
      </div>

      <Link
        href="/"
        className="mt-4 hidden items-center justify-between rounded-xl border border-[#cdbda4] bg-[#f5efe4]/70 px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#766650] transition hover:border-[#a99163] hover:bg-[#faf6ee] hover:text-[#4c4338] lg:flex"
      >
        Landing Page <Icon name="arrow" className="size-3.5" />
      </Link>

      <Link
        href="/onboarding?next=/dashboard"
        className="mt-4 hidden items-center gap-3 rounded-2xl border border-transparent border-t-[#d2c3ac] px-1 pt-5 transition hover:border-[#cdbda4] hover:bg-[#f5efe4]/75 hover:px-3 hover:pb-3 lg:flex"
      >
        <span className="grid size-9 place-items-center rounded-full border border-[#b9aa91] bg-[#f6efe3] text-[10px] font-bold text-[#665845]">
          {workspaceInitials || "TM"}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-bold text-[#493f35]">{workspaceName}</span>
          <span className="block text-[11px] text-[#8c8174]">
            {hasSavedProfile ? "Brand workspace" : "Demo workspace"}
          </span>
        </span>
        <Icon name="arrow" className="ml-auto size-3.5 shrink-0 text-[#8c8174]" />
      </Link>
    </aside>
  );
}
