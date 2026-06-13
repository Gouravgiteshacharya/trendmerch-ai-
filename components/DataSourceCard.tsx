"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { dataSourceLabel } from "@/lib/business-profile";
import { useBusinessProfile } from "@/lib/use-business-profile";

export function DataSourceCard() {
  const profile = useBusinessProfile();

  return (
    <section className="mb-5 grid gap-3 rounded-3xl border border-white bg-white/65 p-4 shadow-[0_12px_36px_rgba(58,48,82,0.06)] sm:grid-cols-3 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-[#eee8f5] text-[#725e8f]">
          <Icon name="products" className="size-4" />
        </span>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9a91a0]">
            Data Source
          </p>
          <p className="mt-1 text-sm font-bold text-[#403a47]">{dataSourceLabel(profile.source)}</p>
        </div>
      </div>
      <div className="border-[#eeeaf0] sm:border-l sm:pl-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9a91a0]">Mode</p>
        <p className="mt-1 text-sm font-bold text-[#403a47]">Personalized Simulation</p>
      </div>
      <div className="flex items-center justify-between gap-3 border-[#eeeaf0] sm:border-l sm:pl-5">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#9a91a0]">Profile</p>
          <p className="mt-1 truncate text-sm font-bold text-[#403a47]">
            {profile.companyName || "Unnamed business"}
          </p>
        </div>
        <Link
          href="/business-setup"
          className="shrink-0 rounded-xl bg-[#373142] px-3 py-2 text-[10px] font-bold text-white"
        >
          Configure
        </Link>
      </div>
    </section>
  );
}
