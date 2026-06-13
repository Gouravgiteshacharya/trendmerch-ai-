import OpenAI from "openai";
import { fashionRetailData } from "@/data/fashion-retail-data";
import { generateWeeklyReport } from "@/lib/ai-insights";
import { buildBusinessContext } from "@/lib/business-context";
import { normalizeBusinessProfile } from "@/lib/business-profile";
import { normalizeFashionRecords } from "@/lib/data-source";
import { buildReportEvidence } from "@/lib/explainability";
import { filterDataByTimeframe, normalizeTimeframe, timeframeLabel } from "@/lib/timeframe";

export const runtime = "nodejs";

type ReportRequest = {
  type?: unknown;
  profile?: unknown;
  timeframe?: unknown;
  records?: unknown;
};

const reportFormat = `Use exactly these seven uppercase section headings, in this order:
EXECUTIVE SUMMARY
REVENUE HIGHLIGHTS
INVENTORY RISKS
GEO DEMAND INSIGHTS
CUSTOMER SEGMENT INSIGHTS
TREND INTELLIGENCE
RECOMMENDED ACTIONS

Under each heading, write one concise summary paragraph followed by 2-4 bullet points beginning with "- ". Do not use markdown heading symbols, tables, or any additional sections.`;

const quotaNote =
  "OpenAI quota is unavailable, so this response was generated using the fallback insight engine.";

function isQuotaError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;

  const candidate = error as { status?: unknown; code?: unknown; message?: unknown };
  return (
    candidate.status === 429 ||
    candidate.code === "insufficient_quota" ||
    (typeof candidate.message === "string" &&
      /(429|quota|billing)/i.test(candidate.message))
  );
}

export async function POST(request: Request) {
  const apiKeyExists = Boolean(process.env.OPENAI_API_KEY);
  console.log(`OPENAI_API_KEY exists: ${apiKeyExists}`);

  let body: ReportRequest;

  try {
    body = (await request.json()) as ReportRequest;
  } catch {
    console.log("Using fallback response");
    return Response.json(
      { report: "Please send a valid JSON request.", source: "fallback" },
      { status: 400 },
    );
  }

  if (body.type !== "weekly") {
    console.log("Using fallback response");
    return Response.json(
      { report: "Only weekly reports are currently supported.", source: "fallback" },
      { status: 400 },
    );
  }

  const profile = normalizeBusinessProfile(body.profile);
  const timeframe = normalizeTimeframe(body.timeframe);
  const uploadedRecords = normalizeFashionRecords(body.records);
  const sourceRecords =
    profile?.source === "csv" && uploadedRecords ? uploadedRecords : fashionRetailData;
  const records = filterDataByTimeframe(sourceRecords, timeframe);
  const fallback = generateWeeklyReport(profile, records, timeframe).copyText;
  const evidence = buildReportEvidence(records);

  if (!process.env.OPENAI_API_KEY) {
    console.log("Using fallback response");
    return Response.json({ report: fallback, source: "fallback", evidence });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      instructions:
        "You are TrendMerch AI, a senior fashion merchandising analyst preparing a weekly leadership brief. Use only the supplied business context, preserve numerical accuracy, prioritize decisions, and do not invent facts. Write clear professional merchandising language.",
      input: `${buildBusinessContext(profile, records, timeframe)}\n\nREPORT INSTRUCTIONS\nCreate the merchandising report for the selected timeframe: ${timeframeLabel(timeframe)}. Tailor recommendations to the supplied company profile when relevant.\n${reportFormat}`,
    });

    const report = response.output_text.trim();
    if (!report) {
      console.log("Using fallback response");
      return Response.json({ report: fallback, source: "fallback", evidence });
    }

    console.log("Using OpenAI response");
    return Response.json({ report, source: "openai", evidence });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`OpenAI error: ${message}`);
    console.log("Using fallback response");
    return Response.json({
      report: fallback,
      source: "fallback",
      evidence,
      ...(isQuotaError(error) ? { note: quotaNote } : {}),
    });
  }
}
