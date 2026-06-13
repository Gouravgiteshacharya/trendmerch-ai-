import "server-only";

import { fashionRetailData, type FashionRetailRecord } from "@/data/fashion-retail-data";
import {
  demandByAgeGroup,
  demandByGender,
  demandByState,
  highReturnProducts,
  returnRate,
  salesByCategory,
  sizeWiseDemand,
  slowMovingProducts,
  stockoutRiskProducts,
  topSellingProducts,
  totalRevenue,
  totalUnitsSold,
  trendScoreByProduct,
} from "@/lib/analytics";
import { businessProfileContext, type BusinessProfile } from "@/lib/business-profile";
import { defaultTimeframe, timeframeLabel, type Timeframe } from "@/lib/timeframe";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const compactList = <T>(
  items: T[],
  formatter: (item: T) => string,
  limit = 5,
) => items.slice(0, limit).map(formatter).join("; ");

export function buildBusinessContext(
  profile?: BusinessProfile | null,
  records: FashionRetailRecord[] = fashionRetailData,
  timeframe: Timeframe = defaultTimeframe,
) {
  if (records.length < 3) {
    return [
      "TRENDMERCH AI BUSINESS CONTEXT",
      businessProfileContext(profile ?? null),
      `Selected timeframe: ${timeframeLabel(timeframe)}.`,
      `Only ${records.length} usable records are available. Recommend switching to Last 30 Days, Last 1 Year, or All Time.`,
    ].join("\n");
  }

  const revenue = totalRevenue(records);
  const units = totalUnitsSold(records);
  const returns = returnRate(records);
  const topProducts = topSellingProducts(records);
  const stockRisks = stockoutRiskProducts(records);
  const slowProducts = slowMovingProducts(records);
  const returnRisks = highReturnProducts(records);
  const categories = salesByCategory(records);
  const states = demandByState(records);
  const ages = demandByAgeGroup(records);
  const genders = demandByGender(records);
  const sizes = sizeWiseDemand(records);
  const trends = trendScoreByProduct(records);

  return [
    "TRENDMERCH AI BUSINESS CONTEXT",
    businessProfileContext(profile ?? null),
    `Analyze the data for the selected timeframe: ${timeframeLabel(timeframe)}.`,
    `Dataset: ${records.length} fashion retail orders in the selected timeframe.`,
    `Core KPIs: revenue ${currency.format(revenue)}; units sold ${units}; return rate ${returns.toFixed(1)}%.`,
    `Top selling products: ${compactList(topProducts, (product) => `${product.productName} (${product.unitsSold} units, ${currency.format(product.revenue)} revenue)`)}`,
    `Stockout risks: ${compactList(stockRisks, (product) => `${product.productName} (${product.stockAvailable} stock, ${product.unitsSold} sold)`) || "none"}`,
    `Slow-moving products: ${compactList(slowProducts, (product) => `${product.productName} (${product.unitsSold} sold, ${product.stockAvailable} stock)`)}`,
    `Highest return products: ${compactList(returnRisks, (product) => `${product.productName} (${product.returnRate.toFixed(1)}%, ${product.returns} returns)`) || "none"}`,
    `Sales by category: ${compactList(categories, (category) => `${category.category} (${category.units} units, ${currency.format(category.revenue)}, ${category.share.toFixed(1)}% revenue share)`, 8)}`,
    `Demand by state: ${compactList(states, (state) => `${state.label} (${state.units} units, ${currency.format(state.revenue)})`, 10)}`,
    `Demand by age group: ${compactList(ages, (age) => `${age.label} (${age.units} units, ${age.share.toFixed(1)}%)`, 4)}`,
    `Demand by gender: ${compactList(genders, (gender) => `${gender.label} (${gender.units} units, ${gender.share.toFixed(1)}%)`, 4)}`,
    `Size-wise demand: ${compactList(sizes, (size) => `${size.label} (${size.units} units)`, 10)}`,
    `Trend scores: ${compactList(trends, (trend) => `${trend.productName} (${trend.score}/100, ${trend.recentUnits} recent units, keyword: ${trend.trendKeyword})`, 8)}`,
  ].join("\n");
}
