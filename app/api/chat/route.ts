import OpenAI from "openai";
import { fashionRetailData } from "@/data/fashion-retail-data";
import { generateChatResponse } from "@/lib/ai-insights";
import { buildBusinessContext } from "@/lib/business-context";
import { normalizeBusinessProfile } from "@/lib/business-profile";
import { normalizeFashionRecords } from "@/lib/data-source";
import { buildChatSupportingData } from "@/lib/explainability";
import { filterDataByTimeframe, normalizeTimeframe } from "@/lib/timeframe";

export const runtime = "nodejs";

type ChatRequest = {
  question?: unknown;
  profile?: unknown;
  timeframe?: unknown;
  records?: unknown;
};

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

  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    console.log("Using fallback response");
    return Response.json(
      { answer: "Please send a valid JSON request.", source: "fallback" },
      { status: 400 },
    );
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    console.log("Using fallback response");
    return Response.json(
      { answer: "Please enter a merchandising question.", source: "fallback" },
      { status: 400 },
    );
  }

  const profile = normalizeBusinessProfile(body.profile);
  const timeframe = normalizeTimeframe(body.timeframe);
  const uploadedRecords = normalizeFashionRecords(body.records);
  const sourceRecords =
    profile?.source === "csv" && uploadedRecords ? uploadedRecords : fashionRetailData;
  const records = filterDataByTimeframe(sourceRecords, timeframe);
  const fallback = generateChatResponse(question, profile, records, timeframe);
  const supportingData = buildChatSupportingData(question, records);

  if (!process.env.OPENAI_API_KEY) {
    console.log("Using fallback response");
    return Response.json({ answer: fallback, source: "fallback", supportingData });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      instructions: `You are TrendMerch AI, a senior fashion merchandising co-pilot. Answer only from the supplied business context. Be commercially specific, concise, and action-oriented. Mention products, markets, units, revenue, stock, returns, or customer segments when relevant. Never invent data. If the context cannot answer something, say so and suggest the closest available analysis. Use short paragraphs or bullets and keep the answer under 220 words.${profile?.companyName ? ` Address ${profile.companyName} by name in the opening sentence so the recommendation is clearly personalized.` : ""}`,
      input: `${buildBusinessContext(profile, records, timeframe)}\n\nUSER QUESTION\n${question}`,
    });

    const answer = response.output_text.trim();
    if (!answer) {
      console.log("Using fallback response");
      return Response.json({ answer: fallback, source: "fallback", supportingData });
    }

    console.log("Using OpenAI response");
    return Response.json({ answer, source: "openai", supportingData });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`OpenAI error: ${message}`);
    console.log("Using fallback response");
    return Response.json({
      answer: fallback,
      source: "fallback",
      supportingData,
      ...(isQuotaError(error) ? { note: quotaNote } : {}),
    });
  }
}
