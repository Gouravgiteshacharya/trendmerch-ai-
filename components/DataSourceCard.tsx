"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { dataSourceLabel } from "@/lib/business-profile";
import { useBusinessProfile } from "@/lib/use-business-profile";

export function DataSourceCard() {
  const profile = useBusinessProfile();

  return (
    <section className="mb-5 grid gap-3 rounded-3xl border border-[#d4c5ae] bg-[#f9f5ec]/90 p-4 shadow-[0_12px_30px_rgba(70,55,38,0.055)] sm:grid-cols-2 sm:p-5 xl:grid-cols-4">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-[#e6e4d5] text-[#626b50]">
          <Icon name="products" className="size-4" />
        </span>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9a8265]">
            Data Source
          </p>
          <p className="mt-1 text-sm font-bold text-[#453a2f]">{dataSourceLabel(profile.source)}</p>
        </div>
      </div>
      <div className="border-[#ddd1bf] sm:border-l sm:pl-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9a8265]">Mode</p>
        <p className="mt-1 text-sm font-bold text-[#453a2f]">Personalized Simulation</p>
      </div>
      <div className="border-[#ddd1bf] sm:border-l sm:pl-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9a8265]">
          Monthly Goal
        </p>
        <p className="mt-1 text-sm font-bold text-[#453a2f]">{profile.businessGoal}</p>
      </div>
      <div className="flex items-center justify-between gap-3 border-[#ddd1bf] sm:border-l sm:pl-5">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9a8265]">Profile</p>
          <p className="mt-1 truncate text-sm font-bold text-[#453a2f]">
            {profile.companyName || "Unnamed business"}
          </p>
        </div>
        <Link
          href="/business-setup"
          className="shrink-0 rounded-xl bg-[#3d352d] px-3 py-2 text-[10px] font-bold text-[#fff8ec] transition hover:bg-[#4b4136]"
        >
          Configure
        </Link>
      </div>
    </section>
  );
}
