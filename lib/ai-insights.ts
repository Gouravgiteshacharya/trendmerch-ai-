import { fashionRetailData } from "@/data/fashion-retail-data";
import {
  highReturnProducts,
  periodGrowth,
  returnRate,
  salesByCategory,
  slowMovingProducts,
  stockoutRiskProducts,
  totalRevenue,
  totalUnitsSold,
} from "@/lib/analytics";
import {
  productIntelligence,
  segmentIntelligence,
  stateIntelligence,
  trendIntelligence,
} from "@/lib/intelligence";

export type WeeklyReportSection = {
  title: string;
  summary: string;
  bullets: string[];
};

export type WeeklyReport = {
  title: string;
  period: string;
  generatedAt: string;
  sections: WeeklyReportSection[];
  copyText: string;
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const signedPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
const joinNames = (names: string[]) => names.filter(Boolean).join(", ");

function generalSummary() {
  const revenue = totalRevenue(fashionRetailData);
  const units = totalUnitsSold(fashionRetailData);
  const returns = returnRate(fashionRetailData);
  const topCategory = salesByCategory(fashionRetailData)[0];
  const topState = stateIntelligence(fashionRetailData)[0];
  const topTrend = trendIntelligence(fashionRetailData)[0];

  return `Current merchandising snapshot: ${currency.format(revenue)} revenue from ${units.toLocaleString("en-IN")} units, with a ${returns.toFixed(1)}% return rate. ${topCategory.category} leads category revenue, ${topState.label} is the strongest demand market, and ${topTrend.productName} has the highest trend score at ${topTrend.score}/100.`;
}

export function generateChatResponse(question: string) {
  const normalized = question.trim().toLowerCase();

  if (/(restock|stock|inventory)/.test(normalized)) {
    const risks = stockoutRiskProducts(fashionRetailData).slice(0, 4);
    if (risks.length === 0) {
      return "Inventory cover is currently healthy. No products meet the low-stock and high-demand threshold.";
    }
    const actions = risks.map(
      (product) =>
        `${product.productName}: ${product.stockAvailable} units available against ${product.unitsSold} units sold`,
    );
    return `Restock priority is ${joinNames(risks.slice(0, 3).map((product) => product.productName))}. ${actions.join(". ")}. Allocate the next replenishment toward the highest-demand states first.`;
  }

  if (/(trend|trending|viral|fashion signal)/.test(normalized)) {
    const trends = trendIntelligence(fashionRetailData).slice(0, 4);
    return `Top trend signals: ${trends
      .map(
        (trend) =>
          `${trend.productName} (${trend.score}/100, ${signedPercent(trend.growth)} growth, ${trend.durationLabel})`,
      )
      .join("; ")}. The strongest keyword is “${trends[0].trendKeyword}”.`;
  }

  if (/(state|city|region|location|market|geo)/.test(normalized)) {
    const states = stateIntelligence(fashionRetailData).slice(0, 5);
    return `Highest demand markets are ${states
      .map((state) => `${state.label} with ${state.units} units led by ${state.topCategory}`)
      .join("; ")}. Prioritize ${states[0].label} for the next inventory allocation, especially ${states[0].topProduct}.`;
  }

  if (/(age|gender|customer|segment|audience|cohort)/.test(normalized)) {
    const segments = segmentIntelligence(fashionRetailData);
    const lead = [...segments].sort((a, b) => b.units - a.units)[0];
    return `${lead.label} is the largest age segment with ${lead.units} units and a preference for ${lead.topCategory}. Its lead product is ${lead.topProduct}. Recommendation: ${lead.recommendation} The next strongest segment is ${[...segments].sort((a, b) => b.units - a.units)[1].label}.`;
  }

  if (/(return|refund|fit issue)/.test(normalized)) {
    const strictRisks = productIntelligence(fashionRetailData).filter(
      (product) => product.returnRate > 15,
    );
    const monitored = highReturnProducts(fashionRetailData, 4);
    if (strictRisks.length === 0) {
      return `No product currently exceeds the 15% high-return threshold. The products to monitor are ${monitored
        .map((product) => `${product.productName} at ${product.returnRate.toFixed(1)}%`)
        .join(", ")}. Review fit, sizing guidance, and product imagery before returns rise further.`;
    }
    return `High-return risks are ${strictRisks
      .map((product) => `${product.productName} at ${product.returnRate.toFixed(1)}%`)
      .join(", ")}. Pause aggressive promotion and review fit feedback.`;
  }

  if (/(discount|markdown|dead stock|slow moving|clearance|overstock)/.test(normalized)) {
    const overstock = productIntelligence(fashionRetailData).filter(
      (product) => product.risk === "Overstock",
    );
    const slow = slowMovingProducts(fashionRetailData, 4);
    const candidates = overstock.length > 0 ? overstock : slow;
    return `Markdown candidates are ${candidates
      .slice(0, 4)
      .map(
        (product) =>
          `${product.productName} (${product.stockAvailable} units in stock, ${product.unitsSold} sold)`,
      )
      .join(", ")}. Start with a targeted 10-15% offer, then reassess sell-through before taking a deeper markdown.`;
  }

  return `${generalSummary()} Ask me about restocking, trends, regional demand, customer segments, returns, or markdown candidates for a more focused recommendation.`;
}

export function generateWeeklyReport(): WeeklyReport {
  const revenue = totalRevenue(fashionRetailData);
  const units = totalUnitsSold(fashionRetailData);
  const returns = returnRate(fashionRetailData);
  const revenueGrowth = periodGrowth(fashionRetailData, "revenue");
  const unitGrowth = periodGrowth(fashionRetailData, "units");
  const categories = salesByCategory(fashionRetailData);
  const inventoryRisks = stockoutRiskProducts(fashionRetailData);
  const products = productIntelligence(fashionRetailData);
  const overstock = products.filter((product) => product.risk === "Overstock");
  const states = stateIntelligence(fashionRetailData);
  const segments = segmentIntelligence(fashionRetailData);
  const leadSegment = [...segments].sort((a, b) => b.units - a.units)[0];
  const trends = trendIntelligence(fashionRetailData);
  const markdowns = slowMovingProducts(fashionRetailData, 3);

  const sections: WeeklyReportSection[] = [
    {
      title: "Executive Summary",
      summary: `${currency.format(revenue)} revenue was generated from ${units.toLocaleString("en-IN")} units across the current dataset.`,
      bullets: [
        `Revenue momentum is ${signedPercent(revenueGrowth)} versus the prior 30-day period.`,
        `${inventoryRisks.length} products require stock attention and ${overstock.length} products are overstocked.`,
        `${states[0].label} is the strongest market, while ${trends[0].productName} leads trend momentum.`,
      ],
    },
    {
      title: "Revenue Highlights",
      summary: `${categories[0].category} is the highest-revenue category at ${currency.format(categories[0].revenue)}.`,
      bullets: [
        `Unit growth is ${signedPercent(unitGrowth)} versus the prior period.`,
        `${categories[1].category} contributes ${currency.format(categories[1].revenue)} in revenue.`,
        `Overall return rate is ${returns.toFixed(1)}%, leaving net demand quality healthy.`,
      ],
    },
    {
      title: "Inventory Risks",
      summary:
        inventoryRisks.length > 0
          ? `${inventoryRisks[0].productName} is the most urgent restock priority.`
          : "No urgent stockout risks were detected.",
      bullets: [
        ...inventoryRisks
          .slice(0, 3)
          .map(
            (product) =>
              `${product.productName}: ${product.stockAvailable} available versus ${product.unitsSold} sold.`,
          ),
        ...(overstock.length > 0
          ? overstock.map(
              (product) =>
                `${product.productName}: consider a controlled markdown on ${product.stockAvailable} units.`,
            )
          : ["No products currently meet the overstock rule."]),
      ],
    },
    {
      title: "Geo Demand Insights",
      summary: `${states[0].label} leads demand with ${states[0].units} units and ${currency.format(states[0].revenue)} revenue.`,
      bullets: states.slice(0, 3).map(
        (state) =>
          `${state.label}: prioritize ${state.topCategory}; ${state.topProduct} is the lead product.`,
      ),
    },
    {
      title: "Customer Segment Insights",
      summary: `${leadSegment.label} is the largest customer age segment with ${leadSegment.units} units.`,
      bullets: segments.slice(0, 3).map(
        (segment) =>
          `${segment.label}: ${segment.topCategory} leads. ${segment.recommendation}`,
      ),
    },
    {
      title: "Trend Intelligence",
      summary: `${trends[0].productName} leads with a ${trends[0].score}/100 trend score and the keyword “${trends[0].trendKeyword}”.`,
      bullets: trends.slice(0, 3).map(
        (trend) =>
          `${trend.productName}: ${signedPercent(trend.growth)} demand growth, classified as ${trend.duration.toLowerCase()} (${trend.durationLabel}).`,
      ),
    },
    {
      title: "Recommended Actions",
      summary: "Focus the team on inventory protection, regional allocation, and disciplined markdowns.",
      bullets: [
        inventoryRisks[0]
          ? `Replenish ${inventoryRisks[0].productName} first and route depth toward ${states[0].label}.`
          : "Maintain current replenishment levels.",
        `Build the next campaign around ${leadSegment.label} customers and ${leadSegment.topCategory}.`,
        `Test a 10-15% markdown on ${joinNames(markdowns.map((product) => product.productName))}.`,
        `Keep ${trends[0].productName} visible while monitoring its ${trends[0].durationLabel.toLowerCase()} trend window.`,
      ],
    },
  ];

  const copyText = [
    "TRENDMERCH AI - WEEKLY MERCHANDISING REPORT",
    "Reporting period: Data through 12 June 2026",
    "",
    ...sections.flatMap((section) => [
      section.title.toUpperCase(),
      section.summary,
      ...section.bullets.map((bullet) => `- ${bullet}`),
      "",
    ]),
  ].join("\n");

  return {
    title: "Weekly Merchandising Intelligence Report",
    period: "Data through 12 June 2026",
    generatedAt: "Week 24, 2026",
    sections,
    copyText,
  };
}

