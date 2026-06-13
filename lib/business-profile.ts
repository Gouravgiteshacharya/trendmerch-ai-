export type BusinessDataSource = "demo" | "csv" | "manual";

export type BusinessProfile = {
  source: BusinessDataSource;
  companyName: string;
  role: string;
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
  businessGoal: string;
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

export type RequiredBusinessProfileField =
  | "companyName"
  | "role"
  | "brandType"
  | "primaryCategory"
  | "monthlyRevenueRange"
  | "averageOrderValue"
  | "targetAgeGroup"
  | "targetGender"
  | "mainRegions"
  | "topProductCategories"
  | "biggestBusinessChallenge"
  | "returnRateRange"
  | "inventoryProblem"
  | "businessGoal";

export const BUSINESS_PROFILE_KEY = "trendmerch-business-profile";
export const UPLOADED_DATA_KEY = "trendmerch-uploaded-business-data";
export const BUSINESS_PROFILE_EVENT = "trendmerch-profile-updated";

export const brandTypeOptions = [
  "D2C Fashion Brand",
  "Boutique",
  "Marketplace Seller",
  "Offline Retailer",
  "Instagram Store",
  "Student Demo",
];

export const roleOptions = [
  "Founder",
  "Merchandiser",
  "Brand Manager",
  "Student / Demo User",
  "Operations Team",
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
  "Entire India",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
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
export const businessGoalOptions = [
  "Increase revenue",
  "Reduce returns",
  "Clear dead stock",
  "Improve size availability",
  "Expand into new regions",
  "Launch a new collection",
  "Improve profit margin",
  "Increase repeat purchases",
];

export const defaultBusinessProfile: BusinessProfile = {
  source: "demo",
  companyName: "",
  role: "",
  brandType: "",
  primaryCategory: "",
  monthlyRevenueRange: "",
  averageOrderValue: "",
  targetAgeGroup: "",
  targetGender: "",
  mainRegions: [],
  topProductCategories: [],
  biggestBusinessChallenge: "",
  returnRateRange: "",
  inventoryProblem: "",
  businessGoal: "",
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
        .slice(0, 40)
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
    role: text(candidate.role, defaultBusinessProfile.role),
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
    businessGoal: text(candidate.businessGoal, defaultBusinessProfile.businessGoal),
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

export const requiredBusinessProfileFields: RequiredBusinessProfileField[] = [
  "companyName",
  "role",
  "brandType",
  "primaryCategory",
  "monthlyRevenueRange",
  "averageOrderValue",
  "targetAgeGroup",
  "targetGender",
  "mainRegions",
  "topProductCategories",
  "biggestBusinessChallenge",
  "returnRateRange",
  "inventoryProblem",
  "businessGoal",
];

export function missingBusinessProfileFields(profile: BusinessProfile) {
  return requiredBusinessProfileFields.filter((field) => {
    const value = profile[field];
    return Array.isArray(value) ? value.length === 0 : !value.trim();
  });
}

export function isBusinessProfileComplete(profile: BusinessProfile) {
  return missingBusinessProfileFields(profile).length === 0;
}

export function dataSourceLabel(source: BusinessDataSource) {
  if (source === "csv") return "Uploaded CSV";
  if (source === "manual") return "Manual Setup";
  return "Demo Dataset";
}

export function businessProfileContext(profile: BusinessProfile | null) {
  if (!profile) return "Business profile: not configured; use the demo dataset context.";
  return [
    `Workspace: ${profile.companyName || "Unnamed business"}`,
    `Role: ${profile.role || "Not provided"}`,
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
    `Business goal for this month: ${profile.businessGoal || "Not provided"}`,
    `Goal priority guidance: ${businessGoalGuidance(profile.businessGoal)}`,
    profile.source === "csv" ? `Uploaded rows: ${profile.uploadedRowCount}` : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function businessGoalGuidance(goal: string) {
  const guidance: Record<string, string> = {
    "Increase revenue":
      "Prioritize restocking proven bestsellers and protecting availability in the highest-demand markets.",
    "Reduce returns":
      "Prioritize high-return products, size and fit issues, product quality, imagery, and expectation-setting.",
    "Clear dead stock":
      "Prioritize controlled markdowns, bundles, targeted offers, and slow-moving inventory reduction.",
    "Improve size availability":
      "Prioritize size-wise demand, stock gaps, replenishment depth, and correcting the size mix.",
    "Expand into new regions":
      "Prioritize state-wise demand, regional whitespace, and inventory allocation opportunities.",
    "Launch a new collection":
      "Prioritize trend intelligence, customer segments, category affinity, and launch timing.",
    "Improve profit margin":
      "Prioritize discount control, premium revenue contributors, return reduction, and disciplined inventory buys.",
    "Increase repeat purchases":
      "Prioritize loyal customer segments, best-performing categories, retention offers, and replenishable favorites.",
  };

  return guidance[goal] ?? guidance["Increase revenue"];
}
