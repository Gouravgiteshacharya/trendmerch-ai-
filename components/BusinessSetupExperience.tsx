"use client";

import Papa from "papaparse";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import {
  UPLOADED_DATA_KEY,
  ageGroupOptions,
  averageOrderValueOptions,
  brandTypeOptions,
  categoryOptions,
  challengeOptions,
  dataSourceLabel,
  genderOptions,
  inventoryProblemOptions,
  regionOptions,
  returnRateOptions,
  revenueRangeOptions,
  saveBusinessProfile,
  type BusinessDataSource,
  type BusinessProfile,
  type UploadedBusinessRow,
} from "@/lib/business-profile";
import { useBusinessProfile } from "@/lib/use-business-profile";

const expectedFields = [
  "date",
  "product_name",
  "category",
  "size",
  "price",
  "quantity_sold",
  "revenue",
  "stock_available",
  "returns",
  "state",
  "city",
  "customer_age",
  "customer_gender",
] as const;

const numericFields = new Set([
  "price",
  "quantity_sold",
  "revenue",
  "stock_available",
  "returns",
  "customer_age",
]);

const modeOptions: {
  value: BusinessDataSource;
  title: string;
  description: string;
  icon: "report" | "products" | "sparkles";
}[] = [
  {
    value: "csv",
    title: "Upload CSV",
    description: "Bring order-level retail data and preview it before saving.",
    icon: "report",
  },
  {
    value: "manual",
    title: "Fill Manually",
    description: "Describe the business with a compact operating profile.",
    icon: "products",
  },
  {
    value: "demo",
    title: "Use Demo Dropdowns",
    description: "Create a simulation quickly with guided preset values.",
    icon: "sparkles",
  },
];

const inputClass =
  "mt-2 w-full rounded-2xl border border-[#e8e2eb] bg-white/80 px-4 py-3 text-sm text-[#4c4553] outline-none transition placeholder:text-[#aaa3ae] focus:border-[#b8a5ce] focus:ring-4 focus:ring-[#eee8f5]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-bold text-[#655e6b]">
      {label}
      {children}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </Field>
  );
}

function loadUploadedRows() {
  if (typeof window === "undefined") return [];
  try {
    const rows = window.localStorage.getItem(UPLOADED_DATA_KEY);
    return rows ? (JSON.parse(rows) as UploadedBusinessRow[]) : [];
  } catch {
    return [];
  }
}

function BusinessSetupForm({
  initialProfile,
  initialMode,
  saved,
  onSavedChange,
}: {
  initialProfile: BusinessProfile;
  initialMode?: BusinessDataSource;
  saved: boolean;
  onSavedChange: (saved: boolean) => void;
}) {
  const [mode, setMode] = useState<BusinessDataSource>(initialMode ?? initialProfile.source);
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile);
  const [uploadedRows, setUploadedRows] = useState<UploadedBusinessRow[]>(loadUploadedRows);
  const [csvError, setCsvError] = useState("");

  function update<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    onSavedChange(false);
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function chooseMode(nextMode: BusinessDataSource) {
    setMode(nextMode);
    onSavedChange(false);
    update("source", nextMode);
  }

  function handleCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setCsvError("");
    onSavedChange(false);
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results) => {
        const fields = results.meta.fields ?? [];
        const missing = expectedFields.filter((field) => !fields.includes(field));
        if (missing.length > 0) {
          setUploadedRows([]);
          setCsvError(`Missing required columns: ${missing.join(", ")}`);
          return;
        }

        const rows = results.data.map((row) =>
          Object.fromEntries(
            expectedFields.map((field) => [
              field,
              numericFields.has(field)
                ? Number(String(row[field] ?? "").replace(/[₹,\s]/g, "")) || 0
                : String(row[field] ?? "").trim(),
            ]),
          ),
        ) as UploadedBusinessRow[];

        setUploadedRows(rows);
        update("uploadedRowCount", rows.length);
        if (results.errors.length > 0) {
          setCsvError(`${results.errors.length} row warning(s) found. Valid rows are shown below.`);
        }
      },
      error: (error) => setCsvError(error.message),
    });
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "csv" && uploadedRows.length === 0) {
      setCsvError("Upload a valid CSV before saving this data source.");
      return;
    }

    if (mode === "csv") {
      window.localStorage.setItem(UPLOADED_DATA_KEY, JSON.stringify(uploadedRows));
    }

    const nextProfile = saveBusinessProfile({
      ...profile,
      source: mode,
      topProductCategories:
        profile.topProductCategories.length > 0
          ? profile.topProductCategories
          : [profile.primaryCategory],
      uploadedRowCount: mode === "csv" ? uploadedRows.length : 0,
      updatedAt: new Date().toISOString(),
    });
    setProfile(nextProfile);

    onSavedChange(true);
  }

  return (
    <form onSubmit={save}>
      <section className="grid gap-4 md:grid-cols-3">
        {modeOptions.map((option) => {
          const active = mode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => chooseMode(option.value)}
              className={`rounded-3xl border p-5 text-left transition ${
                active
                  ? "border-[#bba9cf] bg-[#eee8f5] shadow-[0_14px_38px_rgba(90,70,120,0.1)]"
                  : "border-white bg-white/65 shadow-[0_12px_36px_rgba(58,48,82,0.05)] hover:border-[#ddd3e5]"
              }`}
            >
              <span
                className={`grid size-10 place-items-center rounded-2xl ${
                  active ? "bg-[#75618f] text-white" : "bg-[#f0ebf3] text-[#766789]"
                }`}
              >
                <Icon name={option.icon} className="size-4" />
              </span>
              <span className="mt-4 block text-base font-bold text-[#403a47]">{option.title}</span>
              <span className="mt-1 block text-xs leading-5 text-[#827b87]">
                {option.description}
              </span>
            </button>
          );
        })}
      </section>

      <section className="soft-card mt-5 rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-3 border-b border-[#eeeaf0] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a86b2]">
              {dataSourceLabel(mode)}
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] text-[#3d3745]">
              Configure your business context
            </h2>
          </div>
          <span className="w-fit rounded-full bg-[#e7f1eb] px-3 py-1.5 text-[10px] font-bold text-[#547565]">
            Stored locally in this browser
          </span>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Company Name">
            <input
              value={profile.companyName}
              onChange={(event) => update("companyName", event.target.value)}
              placeholder="Your company or brand"
              className={inputClass}
              required
            />
          </Field>

          {mode === "demo" ? (
            <>
              <SelectField label="Brand Type" value={profile.brandType} options={brandTypeOptions} onChange={(value) => update("brandType", value)} />
              <SelectField label="Primary Category" value={profile.primaryCategory} options={categoryOptions} onChange={(value) => { update("primaryCategory", value); update("topProductCategories", [value]); }} />
              <SelectField label="Monthly Revenue Range" value={profile.monthlyRevenueRange} options={revenueRangeOptions} onChange={(value) => update("monthlyRevenueRange", value)} />
              <SelectField label="Average Order Value" value={profile.averageOrderValue} options={averageOrderValueOptions} onChange={(value) => update("averageOrderValue", value)} />
              <SelectField label="Target Age Group" value={profile.targetAgeGroup} options={ageGroupOptions} onChange={(value) => update("targetAgeGroup", value)} />
              <SelectField label="Target Gender" value={profile.targetGender} options={genderOptions} onChange={(value) => update("targetGender", value)} />
              <SelectField label="Main Regions" value={profile.mainRegions[0] ?? regionOptions[0]} options={regionOptions} onChange={(value) => update("mainRegions", [value])} />
              <SelectField label="Biggest Challenge" value={profile.biggestBusinessChallenge} options={challengeOptions} onChange={(value) => update("biggestBusinessChallenge", value)} />
              <SelectField label="Return Rate Range" value={profile.returnRateRange} options={returnRateOptions} onChange={(value) => update("returnRateRange", value)} />
              <SelectField label="Inventory Problem" value={profile.inventoryProblem} options={inventoryProblemOptions} onChange={(value) => update("inventoryProblem", value)} />
            </>
          ) : null}

          {mode === "manual" ? (
            <>
              {([
                ["Brand Type", "brandType"],
                ["Primary Category", "primaryCategory"],
                ["Monthly Revenue Range", "monthlyRevenueRange"],
                ["Average Order Value", "averageOrderValue"],
                ["Target Age Group", "targetAgeGroup"],
                ["Target Gender", "targetGender"],
                ["Main Selling Regions", "mainRegions"],
                ["Top Product Categories", "topProductCategories"],
                ["Biggest Business Challenge", "biggestBusinessChallenge"],
                ["Return Rate Range", "returnRateRange"],
                ["Inventory Problem", "inventoryProblem"],
              ] as const).map(([label, key]) => (
                <Field key={key} label={label}>
                  <input
                    value={Array.isArray(profile[key]) ? profile[key].join(", ") : profile[key]}
                    onChange={(event) =>
                      update(
                        key,
                        (key === "mainRegions" || key === "topProductCategories"
                          ? event.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                          : event.target.value) as never,
                      )
                    }
                    placeholder={key === "mainRegions" || key === "topProductCategories" ? "Separate values with commas" : `Enter ${label.toLowerCase()}`}
                    className={inputClass}
                  />
                </Field>
              ))}
            </>
          ) : null}
        </div>

        {mode === "csv" ? (
          <div className="mt-6">
            <label className="block rounded-3xl border border-dashed border-[#cfc1da] bg-[#faf7fb] p-6 text-center transition hover:bg-[#f6f1f8]">
              <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-[#eee8f5] text-[#725e8f]">
                <Icon name="report" className="size-5" />
              </span>
              <span className="mt-3 block text-sm font-bold text-[#494250]">Choose a CSV file</span>
              <span className="mt-1 block text-xs text-[#8d8692]">
                Required columns are validated before the data is saved.
              </span>
              <input type="file" accept=".csv,text/csv" onChange={handleCsv} className="sr-only" />
            </label>
            <p className="mt-3 text-[11px] leading-5 text-[#8e8793]">
              Expected: {expectedFields.join(", ")}
            </p>
            {csvError ? (
              <p className="mt-3 rounded-2xl bg-[#fbede9] px-4 py-3 text-xs font-semibold text-[#9a5f55]">
                {csvError}
              </p>
            ) : null}

            {uploadedRows.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#ebe6ed]">
                <div className="flex items-center justify-between bg-white/75 px-4 py-3">
                  <p className="text-xs font-bold text-[#514a57]">CSV preview</p>
                  <span className="text-[10px] font-bold text-[#7b6b8c]">
                    {uploadedRows.length} rows parsed
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-[900px] w-full text-left text-[11px]">
                    <thead className="bg-[#f6f2f7] text-[#817888]">
                      <tr>
                        {expectedFields.slice(0, 8).map((field) => (
                          <th key={field} className="px-3 py-2.5 font-bold">{field}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eeeaf0] bg-white/55 text-[#625b67]">
                      {uploadedRows.slice(0, 6).map((row, index) => (
                        <tr key={`${row.date}-${row.product_name}-${index}`}>
                          {expectedFields.slice(0, 8).map((field) => (
                            <td key={field} className="whitespace-nowrap px-3 py-2.5">
                              {String(row[field])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 border-t border-[#eeeaf0] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#8c8590]">
            {saved
              ? "Setup saved. Dashboard, AI Chat, and Weekly Report now use this profile."
              : "Save to activate this profile across TrendMerch AI."}
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#373142] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(55,49,66,0.18)]"
          >
            <Icon name="sparkles" className="size-4" />
            Save Business Setup
          </button>
        </div>
      </section>
    </form>
  );
}

export function BusinessSetupExperience({
  initialMode,
}: {
  initialMode?: BusinessDataSource;
}) {
  const storedProfile = useBusinessProfile();
  const [saved, setSaved] = useState(false);
  return (
    <BusinessSetupForm
      key={`${storedProfile.updatedAt}-${storedProfile.source}-${storedProfile.companyName}-${initialMode ?? "saved"}`}
      initialProfile={storedProfile}
      initialMode={initialMode}
      saved={saved}
      onSavedChange={setSaved}
    />
  );
}
