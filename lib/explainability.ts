import { fashionRetailData, type FashionRetailRecord } from "@/data/fashion-retail-data";
import {
  demandByAgeGroup,
  demandByGender,
  demandByState,
  highReturnProducts,
  salesByCategory,
  slowMovingProducts,
  stockoutRiskProducts,
  topSellingProducts,
  totalRevenue,
  totalUnitsSold,
} from "@/lib/analytics";
import { productIntelligence, trendIntelligence } from "@/lib/intelligence";

export type SupportingProduct = {
  productName: string;
  unitsSold: number;
  stockAvailable: number;
  returnRate: number;
  trendScore: number;
};

export type ChatSupportingData = {
  products: SupportingProduct[];
  topState: string;
  topAgeGroup: string;
  gender: string;
  suggestedAction: string;
};

export type EvidenceSection = {
  title:
    | "Revenue Data"
    | "Inventory Risk Data"
    | "Geo Demand Data"
    | "Customer Segment Data"
    | "Trend Data";
  items: { label: string; value: string }[];
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

function toSupportingProducts(
  products: {
    productName: string;
    unitsSold: number;
    stockAvailable: number;
    returnRate: number;
    score?: number;
  }[],
  records: FashionRetailRecord[],
) {
  const scores = new Map(
    productIntelligence(records).map((product) => [product.productName, product.score]),
  );
  return products.slice(0, 4).map((product) => ({
    productName: product.productName,
    unitsSold: product.unitsSold,
    stockAvailable: product.stockAvailable,
    returnRate: product.returnRate,
    trendScore: product.score ?? scores.get(product.productName) ?? 0,
  }));
}

export function buildChatSupportingData(
  question: string,
  records: FashionRetailRecord[] = fashionRetailData,
): ChatSupportingData {
  if (records.length < 3) {
    return {
      products: [],
      topState: "Insufficient data",
      topAgeGroup: "Insufficient data",
      gender: "Insufficient data",
      suggestedAction: "Switch to Last 30 Days, Last 1 Year, or All Time.",
    };
  }

  const normalized = question.toLowerCase();
  const topState = demandByState(records)[0];
  const topAge = demandByAgeGroup(records)[0];
  const topGender = demandByGender(records)[0];
  let products = topSellingProducts(records, 4);
  let suggestedAction =
    "Protect bestsellers, monitor returns, and align inventory depth with the strongest market.";

  if (/(restock|stock|inventory)/.test(normalized)) {
    products = stockoutRiskProducts(records).slice(0, 4);
    suggestedAction = "Replenish low-cover products and route the first allocation to the top state.";
  } else if (/(trend|trending|viral|fashion signal)/.test(normalized)) {
    products = trendIntelligence(records).slice(0, 4);
    suggestedAction = "Keep high-score products visible while matching buys to their expected trend window.";
  } else if (/(return|refund|fit issue)/.test(normalized)) {
    products = highReturnProducts(records, 4);
    suggestedAction = "Review fit guidance and product content before increasing promotion.";
  } else if (/(discount|markdown|dead stock|slow moving|clearance|overstock)/.test(normalized)) {
    products = slowMovingProducts(records, 4);
    suggestedAction = "Test a targeted 10-15% markdown and reassess sell-through before going deeper.";
  } else if (/(state|city|region|location|market|geo)/.test(normalized)) {
    suggestedAction = `Prioritize allocation to ${topState.label}, then validate category depth by city.`;
  } else if (/(age|gender|customer|segment|audience|cohort)/.test(normalized)) {
    suggestedAction = `Build the next campaign around ${topAge.label} customers and the ${topGender.label} audience.`;
  }

  return {
    products: toSupportingProducts(products, records),
    topState: `${topState.label} · ${topState.units} units`,
    topAgeGroup: `${topAge.label} · ${topAge.units} units`,
    gender: `${topGender.label} · ${topGender.units} units`,
    suggestedAction,
  };
}

export function buildReportEvidence(
  records: FashionRetailRecord[] = fashionRetailData,
): EvidenceSection[] {
  if (records.length < 3) {
    return [
      "Revenue Data",
      "Inventory Risk Data",
      "Geo Demand Data",
      "Customer Segment Data",
      "Trend Data",
    ].map((title) => ({
      title: title as EvidenceSection["title"],
      items: [{ label: "Data availability", value: "Broaden the selected timeframe" }],
    }));
  }

  const categories = salesByCategory(records);
  const stockRisks = stockoutRiskProducts(records);
  const states = demandByState(records);
  const ages = demandByAgeGroup(records);
  const genders = demandByGender(records);
  const trends = trendIntelligence(records);

  return [
    {
      title: "Revenue Data",
      items: [
        { label: "Total revenue", value: currency.format(totalRevenue(records)) },
        { label: "Units sold", value: totalUnitsSold(records).toLocaleString("en-IN") },
        { label: "Top category", value: `${categories[0].category} · ${currency.format(categories[0].revenue)}` },
      ],
    },
    {
      title: "Inventory Risk Data",
      items:
        stockRisks.length > 0
          ? stockRisks.slice(0, 3).map((product) => ({
              label: product.productName,
              value: `${product.stockAvailable} stock · ${product.unitsSold} sold`,
            }))
          : [{ label: "Stockout risk", value: "No urgent risks detected" }],
    },
    {
      title: "Geo Demand Data",
      items: states.slice(0, 3).map((state) => ({
        label: state.label,
        value: `${state.units} units · ${currency.format(state.revenue)}`,
      })),
    },
    {
      title: "Customer Segment Data",
      items: [
        ...ages.slice(0, 2).map((age) => ({
          label: `Age ${age.label}`,
          value: `${age.units} units · ${age.share.toFixed(1)}% share`,
        })),
        {
          label: "Dominant gender",
          value: `${genders[0].label} · ${genders[0].units} units`,
        },
      ],
    },
    {
      title: "Trend Data",
      items: trends.slice(0, 3).map((trend) => ({
        label: productLabel(trend.productName, trend.trendKeyword),
        value: `${trend.score}/100 · ${trend.growth >= 0 ? "+" : ""}${trend.growth.toFixed(1)}% growth`,
      })),
    },
  ];
}

function productLabel(productName: string, keyword: string) {
  return `${productName} · ${keyword}`;
}
