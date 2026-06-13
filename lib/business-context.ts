import "server-only";

import { fashionRetailData } from "@/data/fashion-retail-data";
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

export function buildBusinessContext() {
  const revenue = totalRevenue(fashionRetailData);
  const units = totalUnitsSold(fashionRetailData);
  const returns = returnRate(fashionRetailData);
  const topProducts = topSellingProducts(fashionRetailData);
  const stockRisks = stockoutRiskProducts(fashionRetailData);
  const slowProducts = slowMovingProducts(fashionRetailData);
  const returnRisks = highReturnProducts(fashionRetailData);
  const categories = salesByCategory(fashionRetailData);
  const states = demandByState(fashionRetailData);
  const ages = demandByAgeGroup(fashionRetailData);
  const genders = demandByGender(fashionRetailData);
  const sizes = sizeWiseDemand(fashionRetailData);
  const trends = trendScoreByProduct(fashionRetailData);

  return [
    "TRENDMERCH AI BUSINESS CONTEXT",
    `Dataset: ${fashionRetailData.length} fashion retail orders through 12 June 2026.`,
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
