import type { FashionRetailRecord } from "@/data/fashion-retail-data";
import {
  demandByAgeGroup,
  demandByGender,
  demandByState,
  salesByCategory,
  totalRevenue,
  totalUnitsSold,
  trendScoreByProduct,
  type DemandMetric,
  type TrendScore,
} from "@/lib/analytics";

export type ProductRisk = "Low Stock" | "Overstock" | "High Returns" | "Trending" | "Healthy";

export type ProductIntelligence = TrendScore & {
  risk: ProductRisk;
  growth: number;
};

export type StateIntelligence = DemandMetric & {
  topCategory: string;
  topProduct: string;
  dominantGender: string;
  dominantAgeGroup: string;
};

export type SegmentIntelligence = DemandMetric & {
  topCategory: string;
  topProduct: string;
  recommendation: string;
};

export type CategoryPreference = {
  ageGroup: string;
  category: string;
  units: number;
  share: number;
};

export type TrendDuration = "Viral spike" | "Seasonal trend" | "Evergreen" | "Declining";

export type TrendIntelligence = ProductIntelligence & {
  duration: TrendDuration;
  durationLabel: string;
  explanation: string;
};

const day = 86_400_000;

export function getAgeGroup(age: number) {
  if (age <= 24) return "18-24";
  if (age <= 34) return "25-34";
  if (age <= 44) return "35-44";
  return "45+";
}

function productGrowth(records: FashionRetailRecord[]) {
  const latest = Math.max(...records.map((record) => Date.parse(record.date)));
  const recentStart = latest - 20 * day;
  const previousStart = recentStart - 21 * day;
  const recent = new Map<string, number>();
  const previous = new Map<string, number>();

  for (const record of records) {
    const timestamp = Date.parse(record.date);
    if (timestamp >= recentStart) {
      recent.set(record.productId, (recent.get(record.productId) ?? 0) + record.quantitySold);
    } else if (timestamp >= previousStart) {
      previous.set(record.productId, (previous.get(record.productId) ?? 0) + record.quantitySold);
    }
  }

  return new Map(
    Array.from(new Set([...recent.keys(), ...previous.keys()])).map((productId) => {
      const current = recent.get(productId) ?? 0;
      const prior = previous.get(productId) ?? 0;
      const growth = prior === 0 ? (current > 0 ? 100 : 0) : ((current - prior) / prior) * 100;
      return [productId, growth];
    }),
  );
}

export function productIntelligence(records: FashionRetailRecord[]): ProductIntelligence[] {
  const products = trendScoreByProduct(records);
  const growth = productGrowth(records);
  const averageUnits =
    products.reduce((sum, product) => sum + product.unitsSold, 0) / Math.max(products.length, 1);

  return products.map((product) => {
    const highUnits = product.unitsSold >= averageUnits;
    const lowUnits = product.unitsSold < averageUnits * 0.82;
    let risk: ProductRisk = "Healthy";

    if (product.returnRate > 15) risk = "High Returns";
    else if (product.stockAvailable < 20 && highUnits) risk = "Low Stock";
    else if (product.stockAvailable > 80 && lowUnits) risk = "Overstock";
    else if (product.score >= 80) risk = "Trending";

    return {
      ...product,
      risk,
      growth: growth.get(product.productId) ?? 0,
    };
  });
}

export function stateIntelligence(records: FashionRetailRecord[]): StateIntelligence[] {
  return demandByState(records).map((state) => {
    const stateRecords = records.filter((record) => record.state === state.label);
    return {
      ...state,
      topCategory: salesByCategory(stateRecords)[0]?.category ?? "N/A",
      topProduct:
        trendScoreByProduct(stateRecords).sort((a, b) => b.unitsSold - a.unitsSold)[0]
          ?.productName ?? "N/A",
      dominantGender: demandByGender(stateRecords)[0]?.label ?? "N/A",
      dominantAgeGroup: demandByAgeGroup(stateRecords)[0]?.label ?? "N/A",
    };
  });
}

export function categoryPreferenceByAge(records: FashionRetailRecord[]): CategoryPreference[] {
  const ageGroups = ["18-24", "25-34", "35-44", "45+"];

  return ageGroups.flatMap((ageGroup) => {
    const segmentRecords = records.filter((record) => getAgeGroup(record.customerAge) === ageGroup);
    const categories = salesByCategory(segmentRecords);
    const units = totalUnitsSold(segmentRecords);

    return categories.slice(0, 3).map((category) => ({
      ageGroup,
      category: category.category,
      units: category.units,
      share: units === 0 ? 0 : (category.units / units) * 100,
    }));
  });
}

export function segmentIntelligence(records: FashionRetailRecord[]): SegmentIntelligence[] {
  const recommendations: Record<string, string> = {
    "18-24": "Prioritize social-first drops and accessible trend-led styles.",
    "25-34": "Protect depth in versatile work-to-weekend bestsellers.",
    "35-44": "Lead with quality, fit confidence, and premium capsules.",
    "45+": "Build curated edits around comfort, craft, and service.",
  };

  return demandByAgeGroup(records)
    .map((segment) => {
      const segmentRecords = records.filter(
        (record) => getAgeGroup(record.customerAge) === segment.label,
      );
      return {
        ...segment,
        topCategory: salesByCategory(segmentRecords)[0]?.category ?? "N/A",
        topProduct:
          trendScoreByProduct(segmentRecords).sort((a, b) => b.unitsSold - a.unitsSold)[0]
            ?.productName ?? "N/A",
        recommendation: recommendations[segment.label],
      };
    })
    .sort(
      (a, b) =>
        ["18-24", "25-34", "35-44", "45+"].indexOf(a.label) -
        ["18-24", "25-34", "35-44", "45+"].indexOf(b.label),
    );
}

function durationForTrend(product: ProductIntelligence): {
  duration: TrendDuration;
  durationLabel: string;
} {
  if (product.growth < -10) return { duration: "Declining", durationLabel: "Less than 2 weeks" };
  if (product.growth >= 35 && product.score >= 82) {
    return { duration: "Viral spike", durationLabel: "1-3 weeks" };
  }
  if (product.growth >= 8) return { duration: "Seasonal trend", durationLabel: "4-8 weeks" };
  return { duration: "Evergreen", durationLabel: "3-6 months" };
}

export function trendIntelligence(records: FashionRetailRecord[]): TrendIntelligence[] {
  return productIntelligence(records).map((product) => {
    const duration = durationForTrend(product);
    const direction =
      product.growth >= 10 ? "accelerating" : product.growth < 0 ? "softening" : "holding steady";
    const stockText =
      product.stockAvailable < 20
        ? "Inventory is tight, so replenish selectively."
        : product.stockAvailable > 80
          ? "Inventory is deep, so avoid adding cover."
          : "Inventory cover is balanced.";

    return {
      ...product,
      ...duration,
      explanation: `${product.trendKeyword} demand is ${direction} with ${product.recentUnits} units sold in the latest 21-day window. ${stockText}`,
    };
  });
}

export function totalSegmentRevenue(records: FashionRetailRecord[], ageGroup: string) {
  return totalRevenue(records.filter((record) => getAgeGroup(record.customerAge) === ageGroup));
}
