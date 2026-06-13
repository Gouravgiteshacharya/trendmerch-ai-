"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import type { FashionRetailRecord } from "@/data/fashion-retail-data";
import { generateWeeklyReport, type WeeklyReport } from "@/lib/ai-insights";
import type { BusinessProfile } from "@/lib/business-profile";
import {
  buildReportEvidence,
  type EvidenceSection,
} from "@/lib/explainability";
import { timeframeLabel, type Timeframe } from "@/lib/timeframe";
import { useAnalyticsData } from "@/lib/use-analytics-data";

const sectionTones = [
  "border border-[#d6c7b0] from-[#eee5d7] to-[#faf6ee]",
  "border border-[#d6c7b0] from-[#f1dfd4] to-[#faf6ee]",
  "border border-[#d6c7b0] from-[#e5e8dc] to-[#faf6ee]",
  "border border-[#d6c7b0] from-[#ebe4da] to-[#faf6ee]",
  "border border-[#d6c7b0] from-[#efe1dc] to-[#faf6ee]",
  "border border-[#d6c7b0] from-[#e8e5d7] to-[#faf6ee]",
  "border border-[#6d745a] from-[#40483a] to-[#4f5746] text-[#fffaf0]",
];

const reportHeadings = [
  "Executive Summary",
  "Revenue Highlights",
  "Inventory Risks",
  "Geo Demand Insights",
  "Customer Segment Insights",
  "Trend Intelligence",
  "Recommended Actions",
];

function normalizeHeading(line: string) {
  return line
    .replace(/^#+\s*/, "")
    .replace(/\*\*/g, "")
    .replace(/:$/, "")
    .trim()
    .toLowerCase();
}

function parseGeneratedReport(
  text: string,
  profile: BusinessProfile,
  records: FashionRetailRecord[],
  timeframe: Timeframe,
): WeeklyReport {
  const fallback = generateWeeklyReport(profile, records, timeframe);
  const sections = reportHeadings.map((heading) => {
    const lines = text.split(/\r?\n/);
    const start = lines.findIndex((line) => normalizeHeading(line) === heading.toLowerCase());
    const next = lines.findIndex(
      (line, index) =>
        index > start &&
        reportHeadings.some(
          (candidate) => normalizeHeading(line) === candidate.toLowerCase(),
        ),
    );
    const body = start >= 0 ? lines.slice(start + 1, next >= 0 ? next : undefined) : [];
    const clean = body.map((line) => line.trim()).filter(Boolean);
    const summary = clean
      .filter((line) => !/^[-*•]\s+/.test(line))
      .join(" ")
      .trim();
    const bullets = clean
      .filter((line) => /^[-*•]\s+/.test(line))
      .map((line) => line.replace(/^[-*•]\s+/, ""));
    const fallbackSection = fallback.sections.find((section) => section.title === heading);

    return {
      title: heading,
      summary: summary || fallbackSection?.summary || "",
      bullets: bullets.length > 0 ? bullets : fallbackSection?.bullets ?? [],
    };
  });

  return {
    title: `${profile.companyName} Merchandising Report`,
    period: `Selected timeframe: ${timeframeLabel(timeframe)}`,
    generatedAt: fallback.generatedAt,
    sections,
    copyText: text,
  };
}

export function WeeklyReportExperience() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [source, setSource] = useState<"openai" | "fallback" | null>(null);
  const [sourceNote, setSourceNote] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<EvidenceSection[]>([]);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedFor, setGeneratedFor] = useState<Timeframe | null>(null);
  const { profile, records, sourceData, timeframe, isUploadedData } = useAnalyticsData();
  const visibleReport = generatedFor === timeframe ? report : null;

  async function generate() {
    if (isLoading) return;
    setIsLoading(true);
    setCopyStatus("idle");

    const fallback = generateWeeklyReport(profile, records, timeframe);
    let nextReport = fallback;
    let nextSource: "openai" | "fallback" = "fallback";
    let nextSourceNote: string | null = null;
    let nextEvidence = buildReportEvidence(records);

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "weekly",
          profile,
          timeframe,
          records: isUploadedData ? sourceData : undefined,
        }),
      });
      const data = (await response.json()) as {
        report?: unknown;
        source?: unknown;
        note?: unknown;
        evidence?: unknown;
      };

      if (response.ok && typeof data.report === "string" && data.report.trim()) {
        nextReport = parseGeneratedReport(data.report, profile, records, timeframe);
        nextSource = data.source === "openai" ? "openai" : "fallback";
        nextSourceNote = typeof data.note === "string" ? data.note : null;
        if (Array.isArray(data.evidence)) {
          nextEvidence = data.evidence as EvidenceSection[];
        }
      }
    } catch {
      // Keep the complete local report when the API route is unreachable.
    }

    setReport(nextReport);
    setGeneratedFor(timeframe);
    setSource(nextSource);
    setSourceNote(nextSourceNote);
    setEvidence(nextEvidence);
    setIsLoading(false);
  }

  async function copyReport() {
    if (!visibleReport) return;
    let copied = false;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(visibleReport.copyText);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      const textArea = document.createElement("textarea");
      textArea.value = visibleReport.copyText;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      copied = document.execCommand("copy");
      textArea.remove();
    }

    setCopyStatus(copied ? "copied" : "failed");
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <>
      <div className="mb-4 inline-flex rounded-full border border-[#cfc2a7] bg-[#f3eddf] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#63694f]">
        Report for: {timeframeLabel(timeframe)}
      </div>
      <section className="relative overflow-hidden rounded-3xl border border-[#6d745a] bg-[#40483a] p-6 text-[#fffaf0] shadow-[0_18px_48px_rgba(55,57,43,0.18)] sm:p-8">
        <div className="absolute -right-16 -top-20 size-64 rounded-full bg-[#c2aa76]/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 size-64 rounded-full bg-[#9d6c55]/12 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#d8c59c]/12 text-[#e0ca9a]">
              <Icon name="report" className="size-5" />
            </span>
            <h2 className="editorial-serif mt-5 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Turn merchandising signals into an action plan.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#d1c9ba]">
              Generate a leadership-ready report from revenue, inventory, geography, customer,
              and trend analytics.
            </p>
          </div>
          <button
            type="button"
            onClick={generate}
            disabled={isLoading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#f1e7d4] px-5 py-3 text-sm font-bold text-[#41382e] shadow-sm transition hover:bg-[#fff8ec] disabled:cursor-wait disabled:opacity-75"
          >
            <Icon name="sparkles" className={`size-4 ${isLoading ? "animate-pulse" : ""}`} />
            {isLoading
              ? "Generating Report..."
              : visibleReport
                ? "Regenerate Report"
                : "Generate Merchandising Report"}
          </button>
        </div>
      </section>

      {!visibleReport ? (
        <section className="soft-card subtle-grid mt-5 flex min-h-[360px] items-center justify-center rounded-3xl p-8 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e4e8da] text-[#596149]">
              <Icon name="report" className="size-6" />
            </span>
            <h2 className="editorial-serif mt-5 text-xl font-semibold text-[#40362c]">
              {isLoading ? "Analyzing merchandising signals..." : "Your merchandising report is ready to build."}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#817467]">
              {isLoading
                ? "OpenAI is turning the compact analytics context into a leadership-ready report."
                : "OpenAI uses a compact analytics summary, with the complete local report ready as fallback."}
            </p>
          </div>
        </section>
      ) : (
        <>
          <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-[#d4c5ae] bg-[#f9f5ec]/90 p-5 shadow-[0_12px_30px_rgba(70,55,38,0.055)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a7d4f]">
                {visibleReport.generatedAt}
              </p>
              <h2 className="editorial-serif mt-1 text-xl font-semibold text-[#40362c]">{visibleReport.title}</h2>
              <p className="mt-1 text-xs text-[#887b6e]">{visibleReport.period}</p>
              {source ? (
                <span
                  className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                    source === "openai"
                      ? "border border-[#879174]/40 bg-[#e4e8da] text-[#596149]"
                      : "border border-[#b8a47c]/40 bg-[#eee5d5] text-[#806942]"
                  }`}
                >
                  {source === "openai" ? "Generated by OpenAI" : "Fallback insight engine"}
                </span>
              ) : null}
              {sourceNote ? (
                <p className="mt-3 max-w-xl rounded-xl border border-[#dfc7ab] bg-[#f4e8d8] px-3 py-2 text-[11px] leading-5 text-[#815f47]">
                  {sourceNote}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={copyReport}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d2c3ac] bg-[#faf6ee] px-4 py-2.5 text-xs font-bold text-[#5c5146] transition hover:bg-[#eee5d7]"
            >
              <Icon name={copyStatus === "copied" ? "sparkles" : "report"} className="size-4" />
              {copyStatus === "copied"
                ? "Copied"
                : copyStatus === "failed"
                  ? "Copy failed"
                  : "Copy report"}
            </button>
          </div>

          <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {evidence.map((section) => (
              <details
                key={section.title}
                className="group rounded-2xl border border-[#d4c5ae] bg-[#f9f5ec]/90 shadow-[0_10px_28px_rgba(70,55,38,0.045)] md:last:col-span-2 xl:last:col-span-1"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-bold text-[#5c5146]">
                  {section.title}
                  <span className="text-base text-[#7b805f] transition group-open:rotate-45">+</span>
                </summary>
                <dl className="space-y-2 border-t border-[#d9ccb8] p-3">
                  {section.items.map((item) => (
                    <div key={`${section.title}-${item.label}`} className="rounded-xl border border-[#e0d5c3] bg-[#f4ede2] px-3 py-2">
                      <dt className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9a8265]">{item.label}</dt>
                      <dd className="mt-1 text-[11px] font-semibold leading-5 text-[#5e5449]">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            ))}
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-2">
            {visibleReport.sections.map((section, index) => {
              const dark = index === visibleReport.sections.length - 1;
              return (
                <article
                  key={section.title}
                  className={`rounded-3xl bg-gradient-to-br p-5 shadow-[0_15px_40px_rgba(58,48,82,0.07)] sm:p-6 ${sectionTones[index]} ${
                    index === 0 || dark ? "xl:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-[0.13em] ${
                          dark ? "text-[#d8c69d]" : "text-[#9a7d4f]"
                        }`}
                      >
                        Section {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2
                        className={`editorial-serif mt-2 text-xl font-semibold tracking-[-0.02em] ${
                          dark ? "text-[#fffaf0]" : "text-[#40362c]"
                        }`}
                      >
                        {section.title}
                      </h2>
                    </div>
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                        dark ? "bg-[#d8c59c]/12 text-[#e0ca9a]" : "border border-[#d8cab5] bg-[#f4ede2] text-[#697052]"
                      }`}
                    >
                      <Icon name={index === 5 ? "trend" : index === 3 ? "geo" : "sparkles"} className="size-4" />
                    </span>
                  </div>
                  <p
                    className={`mt-4 text-sm font-semibold leading-6 ${
                      dark ? "text-[#eee8dc]" : "text-[#5e5449]"
                    }`}
                  >
                    {section.summary}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className={`flex gap-3 text-xs leading-5 ${
                          dark ? "text-[#d1c9ba]" : "text-[#7b6f62]"
                        }`}
                      >
                        <span
                          className={`mt-2 size-1.5 shrink-0 rounded-full ${
                            dark ? "bg-[#d6bd83]" : "bg-[#687153]"
                          }`}
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </section>
        </>
      )}
    </>
  );
}
