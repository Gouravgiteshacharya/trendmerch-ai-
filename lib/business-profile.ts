export type BusinessDataSource = "demo" | "csv" | "manual";

export type BusinessProfile = {
  source: BusinessDataSource;
  companyName: string;
  brandType: string;
  primaryCategory: string;
  monthlyRevenueRange: string;
  averageOrderValue: string;
  targetAgeGroup: string;
  targetGender: string;
  mainRegions: string[];
  topProductCategories: string[];
  biggestBusinessChallenge: string;
  returnRateRange: string;
  inventoryProblem: string;
  uploadedRowCount: number;
  updatedAt: string;
};

export type UploadedBusinessRow = {
  date: string;
  product_name: string;
  category: string;
  size: string;
  price: number;
  quantity_sold: number;
  revenue: number;
  stock_available: number;
  returns: number;
  state: string;
  city: string;
  customer_age: number;
  customer_gender: string;
};

export const BUSINESS_PROFILE_KEY = "trendmerch-business-profile";
export const UPLOADED_DATA_KEY = "trendmerch-uploaded-business-data";
export const BUSINESS_PROFILE_EVENT = "trendmerch-profile-updated";

export const brandTypeOptions = [
  "D2C Fashion Brand",
  "Boutique",
  "Marketplace Seller",
  "Offline Retailer",
  "Instagram Store",
];

export const categoryOptions = [
  "Women’s Western Wear",
  "Men’s Casual Wear",
  "Ethnic Wear",
  "Streetwear",
  "Kidswear",
  "Accessories",
];

export const revenueRangeOptions = [
  "₹0–₹1L",
  "₹1L–₹5L",
  "₹5L–₹10L",
  "₹10L–₹25L",
  "₹25L+",
];

export const averageOrderValueOptions = ["₹499", "₹999", "₹1,499", "₹2,499", "₹4,999"];
export const ageGroupOptions = ["18–24", "25–34", "35–44", "45+"];
export const genderOptions = ["Women", "Men", "All"];
export const regionOptions = [
  "Maharashtra",
  "Karnataka",
  "Delhi",
  "Odisha",
  "West Bengal",
  "Tamil Nadu",
  "Telangana",
  "Gujarat",
];
export const challengeOptions = [
  "Stockouts",
  "Overstock",
  "High Returns",
  "Low Sales",
  "Wrong Size Mix",
  "Trend Prediction",
];
export const returnRateOptions = ["0–5%", "5–10%", "10–15%", "15%+"];
export const inventoryProblemOptions = [
  "Low stock",
  "Dead stock",
  "Size imbalance",
  "Regional mismatch",
];

export const defaultBusinessProfile: BusinessProfile = {
  source: "demo",
  companyName: "Demo Fashion Co.",
  brandType: brandTypeOptions[0],
  primaryCategory: categoryOptions[0],
  monthlyRevenueRange: revenueRangeOptions[2],
  averageOrderValue: averageOrderValueOptions[2],
  targetAgeGroup: ageGroupOptions[1],
  targetGender: genderOptions[2],
  mainRegions: [regionOptions[0]],
  topProductCategories: [categoryOptions[0]],
  biggestBusinessChallenge: challengeOptions[0],
  returnRateRange: returnRateOptions[1],
  inventoryProblem: inventoryProblemOptions[0],
  uploadedRowCount: 0,
  updatedAt: "",
};

const text = (value: unknown, fallback = "") =>
  typeof value === "string" ? value.trim().slice(0, 180) : fallback;

const stringList = (value: unknown, fallback: string[] = []) =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().slice(0, 100))
        .filter(Boolean)
        .slice(0, 12)
    : fallback;

export function normalizeBusinessProfile(value: unknown): BusinessProfile | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<BusinessProfile>;
  const source =
    candidate.source === "csv" || candidate.source === "manual" || candidate.source === "demo"
      ? candidate.source
      : "demo";

  return {
    source,
    companyName: text(candidate.companyName, defaultBusinessProfile.companyName),
    brandType: text(candidate.brandType, defaultBusinessProfile.brandType),
    primaryCategory: text(candidate.primaryCategory, defaultBusinessProfile.primaryCategory),
    monthlyRevenueRange: text(
      candidate.monthlyRevenueRange,
      defaultBusinessProfile.monthlyRevenueRange,
    ),
    averageOrderValue: text(candidate.averageOrderValue, defaultBusinessProfile.averageOrderValue),
    targetAgeGroup: text(candidate.targetAgeGroup, defaultBusinessProfile.targetAgeGroup),
    targetGender: text(candidate.targetGender, defaultBusinessProfile.targetGender),
    mainRegions: stringList(candidate.mainRegions, defaultBusinessProfile.mainRegions),
    topProductCategories: stringList(
      candidate.topProductCategories,
      defaultBusinessProfile.topProductCategories,
    ),
    biggestBusinessChallenge: text(
      candidate.biggestBusinessChallenge,
      defaultBusinessProfile.biggestBusinessChallenge,
    ),
    returnRateRange: text(candidate.returnRateRange, defaultBusinessProfile.returnRateRange),
    inventoryProblem: text(candidate.inventoryProblem, defaultBusinessProfile.inventoryProblem),
    uploadedRowCount:
      typeof candidate.uploadedRowCount === "number" && Number.isFinite(candidate.uploadedRowCount)
        ? Math.max(0, Math.floor(candidate.uploadedRowCount))
        : 0,
    updatedAt: text(candidate.updatedAt),
  };
}

export function loadBusinessProfile() {
  if (typeof window === "undefined") return defaultBusinessProfile;
  try {
    const stored = window.localStorage.getItem(BUSINESS_PROFILE_KEY);
    return stored ? normalizeBusinessProfile(JSON.parse(stored)) ?? defaultBusinessProfile : defaultBusinessProfile;
  } catch {
    return defaultBusinessProfile;
  }
}

export function saveBusinessProfile(profile: BusinessProfile) {
  const normalized = normalizeBusinessProfile(profile) ?? defaultBusinessProfile;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(BUSINESS_PROFILE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event(BUSINESS_PROFILE_EVENT));
  }
  return normalized;
}

export function dataSourceLabel(source: BusinessDataSource) {
  if (source === "csv") return "Uploaded CSV";
  if (source === "manual") return "Manual Setup";
  return "Demo Dataset";
}

export function businessProfileContext(profile: BusinessProfile | null) {
  if (!profile) return "Business profile: not configured; use the demo dataset context.";
  return [
    `Company: ${profile.companyName || "Unnamed business"}`,
    `Data source: ${dataSourceLabel(profile.source)}`,
    `Brand type: ${profile.brandType || "Not provided"}`,
    `Primary category: ${profile.primaryCategory || "Not provided"}`,
    `Monthly revenue range: ${profile.monthlyRevenueRange || "Not provided"}`,
    `Average order value: ${profile.averageOrderValue || "Not provided"}`,
    `Target customer: ${profile.targetAgeGroup || "Not provided"}, ${profile.targetGender || "Not provided"}`,
    `Main regions: ${profile.mainRegions.join(", ") || "Not provided"}`,
    `Top categories: ${profile.topProductCategories.join(", ") || "Not provided"}`,
    `Biggest challenge: ${profile.biggestBusinessChallenge || "Not provided"}`,
    `Return-rate range: ${profile.returnRateRange || "Not provided"}`,
    `Inventory problem: ${profile.inventoryProblem || "Not provided"}`,
    profile.source === "csv" ? `Uploaded rows: ${profile.uploadedRowCount}` : "",
  ]
    .filter(Boolean)
    .join("; ");
}
