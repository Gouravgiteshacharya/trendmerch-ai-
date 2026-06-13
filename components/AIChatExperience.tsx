"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { generateChatResponse } from "@/lib/ai-insights";
import {
  buildChatSupportingData,
  type ChatSupportingData,
} from "@/lib/explainability";
import { timeframeLabel } from "@/lib/timeframe";
import { useAnalyticsData } from "@/lib/use-analytics-data";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
  source?: "openai" | "fallback";
  note?: string;
  supportingData?: ChatSupportingData;
};

const suggestions = [
  "What should we restock this week?",
  "Which products are trending?",
  "Which states have highest demand?",
  "Which customer segment should we target?",
  "Which products need discounts?",
  "Which products have high return risk?",
];

const welcomeMessage =
  "Hello, I’m Mira, your merchandising co-pilot. I use OpenAI with a built-in local analytics fallback to answer inventory, trend, market, customer, return, and markdown questions.";

export function AIChatExperience() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { profile, records, sourceData, timeframe, isUploadedData } = useAnalyticsData();

  async function askQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const timestamp = Date.now();
    setMessages((current) => [
      ...current,
      { id: timestamp, role: "user", content: trimmed },
    ]);
    setInput("");
    setIsLoading(true);

    let answer = generateChatResponse(trimmed, profile, records, timeframe);
    let source: ChatMessage["source"] = "fallback";
    let note: string | undefined;
    let supportingData = buildChatSupportingData(trimmed, records);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          profile,
          timeframe,
          records: isUploadedData ? sourceData : undefined,
        }),
      });
      const data = (await response.json()) as {
        answer?: unknown;
        source?: unknown;
        note?: unknown;
        supportingData?: unknown;
      };

      if (response.ok && typeof data.answer === "string" && data.answer.trim()) {
        answer = data.answer;
        source = data.source === "openai" ? "openai" : "fallback";
        note = typeof data.note === "string" ? data.note : undefined;
        if (data.supportingData && typeof data.supportingData === "object") {
          supportingData = data.supportingData as ChatSupportingData;
        }
      }
    } catch {
      // The local rules engine already provides a complete fallback response.
    }

    setMessages((current) => [
      ...current,
      {
        id: timestamp + 1,
        role: "assistant",
        content: answer,
        source,
        note,
        supportingData,
      },
    ]);
    setIsLoading(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askQuestion(input);
  }

  return (
    <div className="grid min-h-[680px] gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="soft-card flex min-h-[640px] flex-col overflow-hidden rounded-3xl">
        <div className="flex items-center gap-3 border-b border-[#d9ccb8] bg-[#f5efe5]/70 p-5">
          <span className="grid size-11 place-items-center rounded-full border border-[#6e765c] bg-[#40483a] text-[#ddc99d] shadow-[0_10px_24px_rgba(55,57,43,0.18)]">
            <Icon name="sparkles" className="size-5" />
          </span>
          <div>
            <h2 className="editorial-serif text-base font-semibold text-[#40362c]">Mira, Atelier Assistant</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#887b6e]">
              <span className="size-1.5 rounded-full bg-[#687153]" />
              Merchandising intelligence online
            </p>
          </div>
          <span className="ml-auto rounded-full border border-[#cfc2a7] bg-[#eee8dc] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#697052]">
            OpenAI + fallback
          </span>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" ? (
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e4e8da] text-[#596149]">
                  <Icon name="sparkles" className="size-4" />
                </span>
              ) : null}
              <div
                className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[76%] ${
                  message.role === "user"
                    ? "rounded-br-md bg-[#3d352d] text-[#fff8ec]"
                    : "rounded-bl-md border border-[#ddd0bd] bg-[#f8f3ea] text-[#5e5449]"
                }`}
              >
                {message.content}
                {message.role === "assistant" && message.source ? (
                  <span
                    className={`mt-3 block w-fit rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                      message.source === "openai"
                        ? "border border-[#879174]/40 bg-[#e4e8da] text-[#596149]"
                        : "border border-[#b8a47c]/40 bg-[#eee5d5] text-[#806942]"
                    }`}
                  >
                    {message.source === "openai"
                      ? "Generated by OpenAI"
                      : "Fallback insight engine"}
                  </span>
                ) : null}
                {message.role === "assistant" && message.note ? (
                  <p className="mt-2 rounded-xl border border-[#dfc7ab] bg-[#f4e8d8] px-3 py-2 text-[11px] leading-5 text-[#815f47]">
                    {message.note}
                  </p>
                ) : null}
                {message.role === "assistant" && message.supportingData ? (
                  <details className="group mt-3 rounded-2xl border border-[#d8cab5] bg-[#f2eadf]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-[11px] font-bold text-[#635846]">
                      View supporting data
                      <span className="text-base leading-none transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="border-t border-[#d8cab5] p-3">
                      <div className="grid gap-2 sm:grid-cols-3">
                        {[
                          ["Top state", message.supportingData.topState],
                          ["Top age group", message.supportingData.topAgeGroup],
                          ["Gender", message.supportingData.gender],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-xl border border-[#e0d5c3] bg-[#faf6ee] px-3 py-2">
                            <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9a8265]">{label}</p>
                            <p className="mt-1 text-[11px] font-semibold text-[#554b40]">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 overflow-x-auto rounded-xl border border-[#d8cab5]">
                        <table className="min-w-[560px] w-full text-left text-[10px]">
                          <thead className="bg-[#e9dfd0] text-[#76695c]">
                            <tr>
                              {["Product", "Units sold", "Stock", "Return rate", "Trend score"].map((heading) => (
                                <th key={heading} className="px-2.5 py-2 font-bold">{heading}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e3d8c7] bg-[#faf6ee]">
                            {message.supportingData.products.map((product) => (
                              <tr key={product.productName}>
                                <td className="px-2.5 py-2 font-semibold text-[#51473d]">{product.productName}</td>
                                <td className="px-2.5 py-2">{product.unitsSold}</td>
                                <td className="px-2.5 py-2">{product.stockAvailable}</td>
                                <td className="px-2.5 py-2">{product.returnRate.toFixed(1)}%</td>
                                <td className="px-2.5 py-2">{product.trendScore}/100</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 rounded-xl border border-[#adb493]/45 bg-[#e5e8dc] px-3 py-2.5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#697052]">Suggested action</p>
                        <p className="mt-1 text-[11px] leading-5 text-[#596149]">{message.supportingData.suggestedAction}</p>
                      </div>
                    </div>
                  </details>
                ) : null}
              </div>
            </div>
          ))}
          {isLoading ? (
            <div className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e4e8da] text-[#596149]">
                <Icon name="sparkles" className="size-4" />
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#ddd0bd] bg-[#f8f3ea] px-4 py-4">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="size-1.5 animate-pulse rounded-full bg-[#7b805f]"
                    style={{ animationDelay: `${dot * 140}ms` }}
                  />
                ))}
                <span className="ml-2 text-xs font-semibold text-[#817467]">
                  Analyzing merchandising signals
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-[#d9ccb8] bg-[#f5efe5]/55 p-4 sm:p-5">
          <div className="flex items-end gap-3 rounded-2xl border border-[#d2c3ac] bg-[#fcf8f1] p-2 pl-4 focus-within:border-[#8d8f6c] focus-within:ring-4 focus-within:ring-[#e7e5d7]">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isLoading}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  askQuestion(input);
                }
              }}
              rows={1}
              placeholder="Ask about inventory, trends, markets, segments, or returns..."
              className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm text-[#4b4137] outline-none placeholder:text-[#9b8f82]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#40483a] text-[#fff8ec] transition hover:bg-[#505947] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="arrow" className="size-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-[#95897c]">
            OpenAI runs server-side; local analytics answer automatically if it is unavailable.
          </p>
        </form>
      </section>

      <aside className="soft-card h-fit rounded-3xl p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a7d4f]">
          Suggested questions
        </p>
        <h2 className="editorial-serif mt-2 text-xl font-semibold tracking-[-0.02em] text-[#40362c]">
          Start with a decision.
        </h2>
        <div className="mt-5 space-y-2.5">
          {suggestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => askQuestion(question)}
              disabled={isLoading}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#d8cab5] bg-[#f8f3ea] px-4 py-3 text-left text-xs font-semibold leading-5 text-[#675d52] transition hover:border-[#ad9979] hover:bg-[#eee5d7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {question}
              <Icon name="arrow" className="size-3.5 shrink-0 text-[#7b805f]" />
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-[#d5c6af] bg-gradient-to-br from-[#e7e5d7] to-[#f0dfd3] p-4">
          <p className="text-xs font-bold text-[#4b4137]">What Mira can analyze</p>
          <p className="mt-2 text-[11px] leading-5 text-[#786d60]">
            180 local orders, 15 products, ten Indian markets, customer cohorts, inventory,
            returns, and trend momentum.
          </p>
          <p className="mt-3 border-t border-[#d6c7b0] pt-3 text-[10px] font-bold text-[#5f684e]">
            Active profile: {profile.companyName}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-[#76695c]">
            Role: {profile.role}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-[#76695c]">
            Monthly goal: {profile.businessGoal}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-[#76695c]">
            Analyzing: {timeframeLabel(timeframe)} · {records.length} records
          </p>
        </div>
      </aside>
    </div>
  );
}
