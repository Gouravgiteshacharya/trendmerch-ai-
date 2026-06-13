import type { FashionRetailRecord } from "@/data/fashion-retail-data";

export type ProductAnalytics = {
  productId: string;
  productName: string;
  category: string;
  trendKeyword: string;
  unitsSold: number;
  revenue: number;
  returns: number;
  returnRate: number;
  stockAvailable: number;
  averagePrice: number;
  averageRating: number;
};

export type CategorySales = {
  category: string;
  units: number;
  revenue: number;
  share: number;
};

export type DemandMetric = {
  label: string;
  units: number;
  revenue: number;
  share: number;
};

export type TrendScore = ProductAnalytics & {
  recentUnits: number;
  score: number;
};

type ProductAccumulator = Omit<
  ProductAnalytics,
  "returnRate" | "averagePrice" | "averageRating" | "stockAvailable"
> & {
  priceTotal: number;
  ratingTotal: number;
  records: number;
  latestDate: string;
  latestStock: number;
};

const percentage = (part: number, total: number) => (total === 0 ? 0 : (part / total) * 100);

export function totalRevenue(records: FashionRetailRecord[]) {
  return records.reduce((sum, record) => sum + record.revenue, 0);
}

export function totalUnitsSold(records: FashionRetailRecord[]) {
  return records.reduce((sum, record) => sum + record.quantitySold, 0);
}

export function returnRate(records: FashionRetailRecord[]) {
  return percentage(
    records.reduce((sum, record) => sum + record.returns, 0),
    totalUnitsSold(records),
  );
}

function aggregateProducts(records: FashionRetailRecord[]): ProductAnalytics[] {
  const products = new Map<string, ProductAccumulator>();

  for (const record of records) {
    const existing = products.get(record.productId);

    if (!existing) {
      products.set(record.productId, {
        productId: record.productId,
        productName: record.productName,
        category: record.category,
        trendKeyword: record.trendKeyword,
        unitsSold: record.quantitySold,
        revenue: record.revenue,
        returns: record.returns,
        priceTotal: record.price,
        ratingTotal: record.rating,
        records: 1,
        latestDate: record.date,
        latestStock: record.stockAvailable,
      });
      continue;
    }

    existing.unitsSold += record.quantitySold;
    existing.revenue += record.revenue;
    existing.returns += record.returns;
    existing.priceTotal += record.price;
    existing.ratingTotal += record.rating;
    existing.records += 1;

    if (record.date > existing.latestDate) {
      existing.latestDate = record.date;
      existing.latestStock = record.stockAvailable;
    }
  }

  return Array.from(products.values()).map((product) => ({
    productId: product.productId,
    productName: product.productName,
    category: product.category,
    trendKeyword: product.trendKeyword,
    unitsSold: product.unitsSold,
    revenue: product.revenue,
    returns: product.returns,
    returnRate: percentage(product.returns, product.unitsSold),
    stockAvailable: product.latestStock,
    averagePrice: product.priceTotal / product.records,
    averageRating: product.ratingTotal / product.records,
  }));
}

export function stockoutRiskProducts(records: FashionRetailRecord[]) {
  return aggregateProducts(records)
    .filter((product) => product.stockAvailable <= Math.max(12, product.unitsSold * 0.32))
    .sort(
      (a, b) =>
        b.unitsSold / Math.max(b.stockAvailable, 1) -
        a.unitsSold / Math.max(a.stockAvailable, 1),
    );
}

export function topSellingProducts(records: FashionRetailRecord[], limit = 5) {
  return aggregateProducts(records)
    .sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue)
    .slice(0, limit);
}

export function slowMovingProducts(records: FashionRetailRecord[], limit = 5) {
  return aggregateProducts(records)
    .sort(
      (a, b) =>
        a.unitsSold - b.unitsSold ||
        b.stockAvailable - a.stockAvailable ||
        a.revenue - b.revenue,
    )
    .slice(0, limit);
}

export function highReturnProducts(records: FashionRetailRecord[], limit = 5) {
  return aggregateProducts(records)
    .filter((product) => product.returns > 0)
    .sort((a, b) => b.returnRate - a.returnRate || b.returns - a.returns)
    .slice(0, limit);
}

export function salesByCategory(records: FashionRetailRecord[]): CategorySales[] {
  const categories = new Map<string, { units: number; revenue: number }>();
  const revenue = totalRevenue(records);

  for (const record of records) {
    const current = categories.get(record.category) ?? { units: 0, revenue: 0 };
    current.units += record.quantitySold;
    current.revenue += record.revenue;
    categories.set(record.category, current);
  }

  return Array.from(categories, ([category, values]) => ({
    category,
    ...values,
    share: percentage(values.revenue, revenue),
  })).sort((a, b) => b.revenue - a.revenue);
}

function groupDemand(
  records: FashionRetailRecord[],
  getLabel: (record: FashionRetailRecord) => string,
): DemandMetric[] {
  const groups = new Map<string, { units: number; revenue: number }>();
  const units = totalUnitsSold(records);

  for (const record of records) {
    const label = getLabel(record);
    const current = groups.get(label) ?? { units: 0, revenue: 0 };
    current.units += record.quantitySold;
    current.revenue += record.revenue;
    groups.set(label, current);
  }

  return Array.from(groups, ([label, values]) => ({
    label,
    ...values,
    share: percentage(values.units, units),
  })).sort((a, b) => b.units - a.units);
}

export function demandByState(records: FashionRetailRecord[]) {
  return groupDemand(records, (record) => record.state);
}

export function demandByAgeGroup(records: FashionRetailRecord[]) {
  return groupDemand(records, (record) => {
    if (record.customerAge <= 24) return "18-24";
    if (record.customerAge <= 34) return "25-34";
    if (record.customerAge <= 44) return "35-44";
    return "45+";
  });
}

export function demandByGender(records: FashionRetailRecord[]) {
  return groupDemand(records, (record) => record.customerGender);
}

export function sizeWiseDemand(records: FashionRetailRecord[]) {
  return groupDemand(records, (record) => record.size);
}

export function trendScoreByProduct(records: FashionRetailRecord[]): TrendScore[] {
  const products = aggregateProducts(records);
  const latestTimestamp = Math.max(...records.map((record) => Date.parse(record.date)));
  const recentStart = latestTimestamp - 21 * 86_400_000;
  const recentUnits = new Map<string, number>();

  for (const record of records) {
    if (Date.parse(record.date) >= recentStart) {
      recentUnits.set(
        record.productId,
        (recentUnits.get(record.productId) ?? 0) + record.quantitySold,
      );
    }
  }

  const maxUnits = Math.max(...products.map((product) => product.unitsSold), 1);
  const maxRevenue = Math.max(...products.map((product) => product.revenue), 1);
  const maxRecentUnits = Math.max(...recentUnits.values(), 1);

  return products
    .map((product) => {
      const productRecentUnits = recentUnits.get(product.productId) ?? 0;
      const score =
        (product.unitsSold / maxUnits) * 35 +
        (product.revenue / maxRevenue) * 25 +
        (productRecentUnits / maxRecentUnits) * 25 +
        (product.averageRating / 5) * 15;

      return {
        ...product,
        recentUnits: productRecentUnits,
        score: Math.round(score),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function periodGrowth(
  records: FashionRetailRecord[],
  metric: "revenue" | "units" | "returns",
) {
  const latestTimestamp = Math.max(...records.map((record) => Date.parse(record.date)));
  const currentStart = latestTimestamp - 29 * 86_400_000;
  const previousStart = currentStart - 30 * 86_400_000;
  const current = records.filter((record) => Date.parse(record.date) >= currentStart);
  const previous = records.filter((record) => {
    const timestamp = Date.parse(record.date);
    return timestamp >= previousStart && timestamp < currentStart;
  });
  const valueFor = (period: FashionRetailRecord[]) => {
    if (metric === "revenue") return totalRevenue(period);
    if (metric === "units") return totalUnitsSold(period);
    return returnRate(period);
  };
  const previousValue = valueFor(previous);

  return percentage(valueFor(current) - previousValue, previousValue);
}

