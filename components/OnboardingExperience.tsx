"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import {
  brandTypeOptions,
  roleOptions,
  saveBusinessProfile,
  type BusinessProfile,
} from "@/lib/business-profile";
import { useBusinessProfile } from "@/lib/use-business-profile";

const fieldClass =
  "mt-2 w-full rounded-2xl border border-[#cdbda4] bg-[#fbf7ef] px-4 py-3.5 text-sm text-[#40362c] outline-none transition placeholder:text-[#a29483] focus:border-[#7d8564] focus:ring-4 focus:ring-[#7d8564]/10";

function OnboardingForm({
  profile,
  nextPath,
}: {
  profile: BusinessProfile;
  nextPath: string;
}) {
  const router = useRouter();
  const hasSavedProfile = Boolean(profile.updatedAt);
  const [workspaceName, setWorkspaceName] = useState(
    hasSavedProfile ? profile.companyName : "",
  );
  const [role, setRole] = useState(profile.role || roleOptions[3]);
  const [brandType, setBrandType] = useState(profile.brandType || brandTypeOptions[0]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = workspaceName.trim();
    if (!name) return;

    saveBusinessProfile({
      ...profile,
      companyName: name,
      role,
      brandType,
      updatedAt: new Date().toISOString(),
    });
    router.push(nextPath);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[34px] border border-[#c8b89f] bg-[#f8f1e5] p-6 shadow-[0_30px_80px_rgba(68,52,34,0.14)] sm:p-9"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[#dfe2d1]/65 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 size-64 rounded-full bg-[#e6d2b5]/45 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4 border-b border-[#d8cbb7] pb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#91784c]">
              Workspace introduction
            </p>
            <h1 className="editorial-serif mt-3 max-w-xl text-4xl leading-[1.04] tracking-[-0.04em] text-[#352c24] sm:text-5xl">
              Create your merchandising workspace
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#75695c]">
              Tell TrendMerch AI who this workspace is for before entering the dashboard.
            </p>
          </div>
          <span className="hidden size-12 shrink-0 place-items-center rounded-full border border-[#aeb494] bg-[#e2e6d9] text-[#596149] sm:grid">
            <Sparkles className="size-5" strokeWidth={1.5} />
          </span>
        </div>

        {hasSavedProfile ? (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#bfc4a8] bg-[#e7e9dd] px-4 py-3 text-xs font-semibold text-[#596149]">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#687157] text-[#fffaf0]">
              <Check className="size-3.5" />
            </span>
            Your saved workspace is ready. Review the details or continue as they are.
          </div>
        ) : null}

        <div className="mt-7 grid gap-5">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.09em] text-[#5b5045]">
              Workspace Name
            </span>
            <input
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              placeholder="e.g. Urban Loom, Atelier Studio, or Gourav"
              className={fieldClass}
              maxLength={180}
              required
              autoFocus={!hasSavedProfile}
            />
            <span className="mt-2 block text-[11px] leading-5 text-[#8a7d6e]">
              Use your company, organisation, brand, or your own name.
            </span>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.09em] text-[#5b5045]">
                Your Role
              </span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className={fieldClass}
              >
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.09em] text-[#5b5045]">
                Brand Type
              </span>
              <select
                value={brandType}
                onChange={(event) => setBrandType(event.target.value)}
                className={fieldClass}
              >
                {brandTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#d8cbb7] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-5 text-[#8a7d6e]">
            Saved locally in this browser. No account or password is required.
          </p>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#596149] px-5 py-3.5 text-sm font-bold text-[#fffaf0] shadow-[0_12px_28px_rgba(75,84,62,0.2)] transition hover:-translate-y-0.5 hover:bg-[#687157]"
          >
            {hasSavedProfile ? "Continue to workspace" : "Create workspace"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </form>
  );
}

export function OnboardingExperience({ nextPath }: { nextPath: string }) {
  const profile = useBusinessProfile();

  return (
    <div className="min-h-screen bg-[#f2ecdf] px-5 py-8 text-[#3b3127] sm:px-8 sm:py-12">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(193,170,129,0.16),transparent_28%),radial-gradient(circle_at_88%_72%,rgba(92,104,72,0.13),transparent_30%)]" />
      <div className="relative mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-[#b9a98e] bg-[#f7efdf] text-[#596149]">
              <Sparkles className="size-4" strokeWidth={1.5} />
            </span>
            <span>
              <span className="editorial-serif block text-lg font-semibold text-[#3e342b]">
                TrendMerch AI
              </span>
              <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-[#8d7c67]">
                Merchandising Atelier
              </span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-[#796a57] transition hover:text-[#3e342b]"
          >
            Back to landing
          </Link>
        </div>

        <OnboardingForm
          key={`${profile.updatedAt}-${profile.companyName}-${profile.role}-${profile.brandType}`}
          profile={profile}
          nextPath={nextPath}
        />
      </div>
    </div>
  );
}
