import type { FashionRetailRecord } from "@/data/fashion-retail-data";
import type { UploadedBusinessRow } from "@/lib/business-profile";

function gender(value: string): FashionRetailRecord["customerGender"] {
  const normalized = value.trim().toLowerCase();
  if (normalized === "women" || normalized === "woman" || normalized === "female") return "Women";
  if (normalized === "men" || normalized === "man" || normalized === "male") return "Men";
  return "Non-binary";
}

function productId(name: string) {
  const slug = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 18);
  return `CSV-${slug || "PRODUCT"}`;
}

export function uploadedRowsToFashionRecords(rows: UploadedBusinessRow[]): FashionRetailRecord[] {
  return rows.map((row, index) => ({
    orderId: `CSV-${String(index + 1).padStart(5, "0")}`,
    date: row.date,
    productId: productId(row.product_name),
    productName: row.product_name || "Unnamed Product",
    category: row.category || "Uncategorized",
    subCategory: row.category || "Uncategorized",
    size: row.size || "N/A",
    color: "N/A",
    price: Number(row.price) || 0,
    quantitySold: Math.max(0, Number(row.quantity_sold) || 0),
    revenue: Math.max(0, Number(row.revenue) || 0),
    stockAvailable: Math.max(0, Number(row.stock_available) || 0),
    returns: Math.max(0, Number(row.returns) || 0),
    state: row.state || "Unknown",
    city: row.city || "Unknown",
    customerAge: Math.max(0, Number(row.customer_age) || 0),
    customerGender: gender(row.customer_gender),
    rating: 4,
    trendKeyword: (row.category || "retail").toLowerCase(),
  }));
}

export function normalizeFashionRecords(value: unknown): FashionRetailRecord[] | null {
  if (!Array.isArray(value)) return null;

  const records = value.slice(0, 5000).flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<FashionRetailRecord>;
    const date = typeof row.date === "string" ? row.date : "";
    const productName = typeof row.productName === "string" ? row.productName.slice(0, 160) : "";
    if (!date || !Number.isFinite(Date.parse(date)) || !productName) return [];

    const safeNumber = (number: unknown) =>
      typeof number === "number" && Number.isFinite(number) ? Math.max(0, number) : 0;
    const customerGender =
      row.customerGender === "Women" || row.customerGender === "Men"
        ? row.customerGender
        : "Non-binary";

    return [{
      orderId: typeof row.orderId === "string" ? row.orderId.slice(0, 80) : `API-${index}`,
      date,
      productId:
        typeof row.productId === "string" ? row.productId.slice(0, 80) : productId(productName),
      productName,
      category: typeof row.category === "string" ? row.category.slice(0, 120) : "Uncategorized",
      subCategory:
        typeof row.subCategory === "string" ? row.subCategory.slice(0, 120) : "Uncategorized",
      size: typeof row.size === "string" ? row.size.slice(0, 40) : "N/A",
      color: typeof row.color === "string" ? row.color.slice(0, 60) : "N/A",
      price: safeNumber(row.price),
      quantitySold: safeNumber(row.quantitySold),
      revenue: safeNumber(row.revenue),
      stockAvailable: safeNumber(row.stockAvailable),
      returns: safeNumber(row.returns),
      state: typeof row.state === "string" ? row.state.slice(0, 100) : "Unknown",
      city: typeof row.city === "string" ? row.city.slice(0, 100) : "Unknown",
      customerAge: safeNumber(row.customerAge),
      customerGender,
      rating: Math.min(5, safeNumber(row.rating) || 4),
      trendKeyword:
        typeof row.trendKeyword === "string" ? row.trendKeyword.slice(0, 100) : "retail",
    } satisfies FashionRetailRecord];
  });

  return records;
}
