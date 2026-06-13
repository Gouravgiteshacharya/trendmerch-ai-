import OpenAI from "openai";
import { generateChatResponse } from "@/lib/ai-insights";
import { buildBusinessContext } from "@/lib/business-context";

export const runtime = "nodejs";

type ChatRequest = {
  question?: unknown;
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

  const fallback = generateChatResponse(question);

  if (!process.env.OPENAI_API_KEY) {
    console.log("Using fallback response");
    return Response.json({ answer: fallback, source: "fallback" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      instructions:
        "You are TrendMerch AI, a senior fashion merchandising co-pilot. Answer only from the supplied business context. Be commercially specific, concise, and action-oriented. Mention products, markets, units, revenue, stock, returns, or customer segments when relevant. Never invent data. If the context cannot answer something, say so and suggest the closest available analysis. Use short paragraphs or bullets and keep the answer under 220 words.",
      input: `${buildBusinessContext()}\n\nUSER QUESTION\n${question}`,
    });

    const answer = response.output_text.trim();
    if (!answer) {
      console.log("Using fallback response");
      return Response.json({ answer: fallback, source: "fallback" });
    }

    console.log("Using OpenAI response");
    return Response.json({ answer, source: "openai" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`OpenAI error: ${message}`);
    console.log("Using fallback response");
    return Response.json({
      answer: fallback,
      source: "fallback",
      ...(isQuotaError(error) ? { note: quotaNote } : {}),
    });
  }
}
