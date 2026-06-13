"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { generateWeeklyReport, type WeeklyReport } from "@/lib/ai-insights";

const sectionTones = [
  "from-[#eee9f6] to-white",
  "from-[#fae9e2] to-white",
  "from-[#e4f0ea] to-white",
  "from-[#e7eef6] to-white",
  "from-[#f5e8ee] to-white",
  "from-[#eee9f6] to-white",
  "from-[#373142] to-[#494057] text-white",
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

function parseGeneratedReport(text: string): WeeklyReport {
  const fallback = generateWeeklyReport();
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
    title: "Weekly Merchandising Intelligence Report",
    period: "Data through 12 June 2026",
    generatedAt: "Week 24, 2026",
    sections,
    copyText: text,
  };
}

export function WeeklyReportExperience() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [source, setSource] = useState<"openai" | "fallback" | null>(null);
  const [sourceNote, setSourceNote] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [isLoading, setIsLoading] = useState(false);

  async function generate() {
    if (isLoading) return;
    setIsLoading(true);
    setCopyStatus("idle");

    const fallback = generateWeeklyReport();
    let nextReport = fallback;
    let nextSource: "openai" | "fallback" = "fallback";
    let nextSourceNote: string | null = null;

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "weekly" }),
      });
      const data = (await response.json()) as {
        report?: unknown;
        source?: unknown;
        note?: unknown;
      };

      if (response.ok && typeof data.report === "string" && data.report.trim()) {
        nextReport = parseGeneratedReport(data.report);
        nextSource = data.source === "openai" ? "openai" : "fallback";
        nextSourceNote = typeof data.note === "string" ? data.note : null;
      }
    } catch {
      // Keep the complete local report when the API route is unreachable.
    }

    setReport(nextReport);
    setSource(nextSource);
    setSourceNote(nextSourceNote);
    setIsLoading(false);
  }

  async function copyReport() {
    if (!report) return;
    let copied = false;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(report.copyText);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      const textArea = document.createElement("textarea");
      textArea.value = report.copyText;
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
      <section className="relative overflow-hidden rounded-3xl bg-[#373142] p-6 text-white shadow-[0_18px_48px_rgba(55,49,66,0.18)] sm:p-8">
        <div className="absolute -right-16 -top-20 size-64 rounded-full bg-[#9f82bd]/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 size-64 rounded-full bg-[#ed9f88]/15 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-[#e1d2ef]">
              <Icon name="report" className="size-5" />
            </span>
            <h2 className="mt-5 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
              Turn this week’s signals into an action plan.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#c9c1ce]">
              Generate a leadership-ready report from revenue, inventory, geography, customer,
              and trend analytics.
            </p>
          </div>
          <button
            type="button"
            onClick={generate}
            disabled={isLoading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#3d3649] shadow-sm transition hover:bg-[#f8f4fa] disabled:cursor-wait disabled:opacity-75"
          >
            <Icon name="sparkles" className={`size-4 ${isLoading ? "animate-pulse" : ""}`} />
            {isLoading
              ? "Generating Report..."
              : report
                ? "Regenerate Report"
                : "Generate Weekly Report"}
          </button>
        </div>
      </section>

      {!report ? (
        <section className="soft-card subtle-grid mt-5 flex min-h-[360px] items-center justify-center rounded-3xl p-8 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#eee8f5] text-[#745f91]">
              <Icon name="report" className="size-6" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-[#403a47]">
              {isLoading ? "Analyzing this week’s signals..." : "Your weekly brief is ready to build."}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#817a86]">
              {isLoading
                ? "OpenAI is turning the compact analytics context into a leadership-ready report."
                : "OpenAI uses a compact analytics summary, with the complete local report ready as fallback."}
            </p>
          </div>
        </section>
      ) : (
        <>
          <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-white bg-white/65 p-5 shadow-[0_12px_36px_rgba(58,48,82,0.06)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9a86b2]">
                {report.generatedAt}
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#3f3946]">{report.title}</h2>
              <p className="mt-1 text-xs text-[#918a95]">{report.period}</p>
              {source ? (
                <span
                  className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                    source === "openai"
                      ? "bg-[#e4f0e9] text-[#4f7765]"
                      : "bg-[#eee8f5] text-[#705e8c]"
                  }`}
                >
                  {source === "openai" ? "Generated by OpenAI" : "Fallback insight engine"}
                </span>
              ) : null}
              {sourceNote ? (
                <p className="mt-3 max-w-xl rounded-xl bg-[#fbf1e7] px-3 py-2 text-[11px] leading-5 text-[#8b654d]">
                  {sourceNote}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={copyReport}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ddd5e3] bg-white px-4 py-2.5 text-xs font-bold text-[#64566f] transition hover:bg-[#f8f4fa]"
            >
              <Icon name={copyStatus === "copied" ? "sparkles" : "report"} className="size-4" />
              {copyStatus === "copied"
                ? "Copied"
                : copyStatus === "failed"
                  ? "Copy failed"
                  : "Copy report"}
            </button>
          </div>

          <section className="mt-5 grid gap-5 xl:grid-cols-2">
            {report.sections.map((section, index) => {
              const dark = index === report.sections.length - 1;
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
                          dark ? "text-[#d9cce5]" : "text-[#9a86b2]"
                        }`}
                      >
                        Section {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2
                        className={`mt-2 text-xl font-bold tracking-[-0.02em] ${
                          dark ? "text-white" : "text-[#3d3744]"
                        }`}
                      >
                        {section.title}
                      </h2>
                    </div>
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                        dark ? "bg-white/10 text-[#e4d8ec]" : "bg-white/65 text-[#786591]"
                      }`}
                    >
                      <Icon name={index === 5 ? "trend" : index === 3 ? "geo" : "sparkles"} className="size-4" />
                    </span>
                  </div>
                  <p
                    className={`mt-4 text-sm font-semibold leading-6 ${
                      dark ? "text-[#e4dfe7]" : "text-[#5f5864]"
                    }`}
                  >
                    {section.summary}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className={`flex gap-3 text-xs leading-5 ${
                          dark ? "text-[#c9c1cf]" : "text-[#7b7480]"
                        }`}
                      >
                        <span
                          className={`mt-2 size-1.5 shrink-0 rounded-full ${
                            dark ? "bg-[#d6bddd]" : "bg-[#9c88b5]"
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
