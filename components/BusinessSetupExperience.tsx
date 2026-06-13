"use client";

import Papa from "papaparse";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import {
  UPLOADED_DATA_KEY,
  ageGroupOptions,
  averageOrderValueOptions,
  brandTypeOptions,
  businessGoalOptions,
  categoryOptions,
  challengeOptions,
  dataSourceLabel,
  genderOptions,
  inventoryProblemOptions,
  isBusinessProfileComplete,
  missingBusinessProfileFields,
  regionOptions,
  roleOptions,
  returnRateOptions,
  revenueRangeOptions,
  saveBusinessProfile,
  type BusinessDataSource,
  type BusinessProfile,
  type RequiredBusinessProfileField,
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
  "mt-2 w-full rounded-2xl border border-[#d2c3ac] bg-[#fcf8f1] px-4 py-3 text-sm text-[#4b4137] outline-none transition placeholder:text-[#9b8f82] focus:border-[#8d8f6c] focus:ring-4 focus:ring-[#e7e5d7]";

const errorInputClass =
  "border-[#c98f7a] bg-[#fff8f3] focus:border-[#b87861] focus:ring-[#ead3c9]";

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <label className="block text-xs font-bold text-[#655a4f]">
      {label} <span className="text-[#a76550]">*</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-[10px] font-semibold text-[#a76550]">
          This field is required.
        </span>
      ) : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  error?: boolean;
}) {
  return (
    <Field label={label} error={error}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} ${error ? errorInputClass : ""} ${value ? "" : "text-[#9b8f82]"}`}
      >
        <option value="" disabled>
          Select value
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-[#4b4137]">
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function RegionMultiSelect({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  error?: boolean;
}) {
  const selected = value;

  function toggle(region: string) {
    if (region === "Entire India") {
      onChange(["Entire India"]);
      return;
    }

    const withoutAllIndia = selected.filter((item) => item !== "Entire India");
    const next = withoutAllIndia.includes(region)
      ? withoutAllIndia.filter((item) => item !== region)
      : [...withoutAllIndia, region];
    onChange(next);
  }

  return (
    <div className="sm:col-span-2">
      <p className="text-xs font-bold text-[#655a4f]">
        Main Selling Regions <span className="text-[#a76550]">*</span>
      </p>
      <details
        className={`group mt-2 rounded-2xl border bg-[#fcf8f1] open:ring-4 ${
          error
            ? "border-[#c98f7a] bg-[#fff8f3] open:border-[#b87861] open:ring-[#ead3c9]"
            : "border-[#d2c3ac] open:border-[#8d8f6c] open:ring-[#e7e5d7]"
        }`}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm text-[#4b4137]">
          <span className={`min-w-0 truncate font-semibold ${selected.length ? "" : "text-[#9b8f82]"}`}>
            {selected.length === 0
              ? "Select one or more regions"
              : selected.includes("Entire India")
              ? "Entire India"
              : `${selected.length} region${selected.length === 1 ? "" : "s"} selected`}
          </span>
          <span className="text-[#7b805f] transition group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-[#d9ccb8] p-3">
          {selected.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {selected.map((region) => (
                <span
                  key={region}
                  className="rounded-full border border-[#aeb495]/50 bg-[#e5e8dc] px-2.5 py-1 text-[10px] font-bold text-[#596149]"
                >
                  {region}
                </span>
              ))}
            </div>
          ) : null}
          <div className="grid max-h-64 gap-1 overflow-y-auto pr-1 sm:grid-cols-2">
            {regionOptions.map((region) => {
              const checked = selected.includes(region);
              return (
                <label
                  key={region}
                  className={`flex cursor-pointer items-start gap-2 rounded-xl px-3 py-2 text-xs transition ${
                    checked
                      ? "bg-[#e5e8dc] font-bold text-[#596149]"
                      : "text-[#675d52] hover:bg-[#f1eadf]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(region)}
                    className="mt-0.5 size-3.5 shrink-0"
                  />
                  {region}
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-[10px] leading-4 text-[#887b6e]">
            Choose Entire India or select multiple priority states and union territories.
          </p>
        </div>
      </details>
      {error ? (
        <p className="mt-1.5 text-[10px] font-semibold text-[#a76550]">
          Select at least one region.
        </p>
      ) : null}
    </div>
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
  const [missingFields, setMissingFields] = useState<Set<RequiredBusinessProfileField>>(
    new Set(),
  );
  const [validationError, setValidationError] = useState("");

  function update<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    onSavedChange(false);
    setProfile((current) => ({ ...current, [key]: value }));
    if (missingFields.has(key as RequiredBusinessProfileField)) {
      setMissingFields((current) => {
        const next = new Set(current);
        next.delete(key as RequiredBusinessProfileField);
        return next;
      });
    }
    setValidationError("");
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
    const missing = missingBusinessProfileFields(profile);
    if (missing.length > 0) {
      setMissingFields(new Set(missing));
      setValidationError("Please complete all required fields to improve report accuracy.");
      onSavedChange(false);
      return;
    }

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
      uploadedRowCount: mode === "csv" ? uploadedRows.length : 0,
      updatedAt: new Date().toISOString(),
    });
    setProfile(nextProfile);

    onSavedChange(true);
    setMissingFields(new Set());
    setValidationError("");
  }

  const profileComplete = isBusinessProfileComplete(profile);
  const hasError = (field: RequiredBusinessProfileField) => missingFields.has(field);

  return (
    <form onSubmit={save} noValidate>
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
                  ? "border-[#8f9271] bg-[#e4e8da] shadow-[0_14px_34px_rgba(70,76,56,0.1)]"
                  : "border-[#d6c7b0] bg-[#faf6ee] shadow-[0_12px_30px_rgba(70,55,38,0.045)] hover:border-[#ad9979]"
              }`}
            >
              <span
                className={`grid size-10 place-items-center rounded-2xl ${
                  active ? "bg-[#40483a] text-[#fff8ec]" : "bg-[#eee5d7] text-[#7b6849]"
                }`}
              >
                <Icon name={option.icon} className="size-4" />
              </span>
              <span className="editorial-serif mt-4 block text-lg font-semibold text-[#40362c]">{option.title}</span>
              <span className="mt-1 block text-xs leading-5 text-[#817467]">
                {option.description}
              </span>
            </button>
          );
        })}
      </section>

      <section className="soft-card mt-5 rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-3 border-b border-[#d9ccb8] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a7d4f]">
              {dataSourceLabel(mode)}
            </p>
            <h2 className="editorial-serif mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#40362c]">
              Configure your business context
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-[#817467]">
              Complete all fields so TrendMerch AI can generate more accurate merchandising
              insights and reports.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`w-fit rounded-full border px-3 py-1.5 text-[10px] font-bold ${
                profileComplete
                  ? "border-[#879174]/40 bg-[#e4e8da] text-[#596149]"
                  : "border-[#c89b86]/55 bg-[#f3e3da] text-[#955f49]"
              }`}
            >
              {profileComplete ? "Profile complete" : "Profile incomplete"}
            </span>
            <span className="w-fit rounded-full border border-[#cdbda4] bg-[#f4ede2] px-3 py-1.5 text-[10px] font-bold text-[#76695c]">
              Stored locally
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Company Name / Workspace Name" error={hasError("companyName")}>
            <input
              value={profile.companyName}
              onChange={(event) => update("companyName", event.target.value)}
              placeholder="Your company or brand"
              className={`${inputClass} ${hasError("companyName") ? errorInputClass : ""}`}
            />
          </Field>
          <SelectField
            label="Role"
            value={profile.role}
            options={roleOptions}
            onChange={(value) => update("role", value)}
            error={hasError("role")}
          />
          <SelectField
            label="Brand Type"
            value={profile.brandType}
            options={brandTypeOptions}
            onChange={(value) => update("brandType", value)}
            error={hasError("brandType")}
          />
          <SelectField
            label="Business Goal for This Month"
            value={profile.businessGoal}
            options={businessGoalOptions}
            onChange={(value) => update("businessGoal", value)}
            error={hasError("businessGoal")}
          />

          {mode === "demo" || mode === "csv" ? (
            <>
              <SelectField label="Primary Category" value={profile.primaryCategory} options={categoryOptions} onChange={(value) => update("primaryCategory", value)} error={hasError("primaryCategory")} />
              <SelectField label="Top Product Categories" value={profile.topProductCategories[0] ?? ""} options={categoryOptions} onChange={(value) => update("topProductCategories", value ? [value] : [])} error={hasError("topProductCategories")} />
              <SelectField label="Monthly Revenue Range" value={profile.monthlyRevenueRange} options={revenueRangeOptions} onChange={(value) => update("monthlyRevenueRange", value)} error={hasError("monthlyRevenueRange")} />
              <SelectField label="Average Order Value" value={profile.averageOrderValue} options={averageOrderValueOptions} onChange={(value) => update("averageOrderValue", value)} error={hasError("averageOrderValue")} />
              <SelectField label="Target Age Group" value={profile.targetAgeGroup} options={ageGroupOptions} onChange={(value) => update("targetAgeGroup", value)} error={hasError("targetAgeGroup")} />
              <SelectField label="Target Gender" value={profile.targetGender} options={genderOptions} onChange={(value) => update("targetGender", value)} error={hasError("targetGender")} />
              <RegionMultiSelect value={profile.mainRegions} onChange={(value) => update("mainRegions", value)} error={hasError("mainRegions")} />
              <SelectField label="Biggest Business Challenge" value={profile.biggestBusinessChallenge} options={challengeOptions} onChange={(value) => update("biggestBusinessChallenge", value)} error={hasError("biggestBusinessChallenge")} />
              <SelectField label="Return Rate Range" value={profile.returnRateRange} options={returnRateOptions} onChange={(value) => update("returnRateRange", value)} error={hasError("returnRateRange")} />
              <SelectField label="Inventory Problem" value={profile.inventoryProblem} options={inventoryProblemOptions} onChange={(value) => update("inventoryProblem", value)} error={hasError("inventoryProblem")} />
            </>
          ) : null}

          {mode === "manual" ? (
            <>
              {([
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
                <Field key={key} label={label} error={hasError(key)}>
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
                    className={`${inputClass} ${hasError(key) ? errorInputClass : ""}`}
                  />
                </Field>
              ))}
            </>
          ) : null}
        </div>

        {mode === "csv" ? (
          <div className="mt-6">
            <label className="block rounded-3xl border border-dashed border-[#ad9979] bg-[#f4ede2] p-6 text-center transition hover:bg-[#eee5d7]">
              <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-[#e4e8da] text-[#596149]">
                <Icon name="report" className="size-5" />
              </span>
              <span className="mt-3 block text-sm font-bold text-[#4b4137]">Choose a CSV file</span>
              <span className="mt-1 block text-xs text-[#817467]">
                Required columns are validated before the data is saved.
              </span>
              <input type="file" accept=".csv,text/csv" onChange={handleCsv} className="sr-only" />
            </label>
            <p className="mt-3 text-[11px] leading-5 text-[#887b6e]">
              Expected: {expectedFields.join(", ")}
            </p>
            {csvError ? (
              <p className="mt-3 rounded-2xl border border-[#d7aa98] bg-[#f4e1d8] px-4 py-3 text-xs font-semibold text-[#985c45]">
                {csvError}
              </p>
            ) : null}

            {uploadedRows.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#d8cab5]">
                <div className="flex items-center justify-between bg-[#faf6ee] px-4 py-3">
                  <p className="text-xs font-bold text-[#51473d]">CSV preview</p>
                  <span className="text-[10px] font-bold text-[#697052]">
                    {uploadedRows.length} rows parsed
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-[900px] w-full text-left text-[11px]">
                    <thead className="bg-[#e9dfd0] text-[#76695c]">
                      <tr>
                        {expectedFields.slice(0, 8).map((field) => (
                          <th key={field} className="px-3 py-2.5 font-bold">{field}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e3d8c7] bg-[#faf6ee] text-[#62584d]">
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

        {validationError ? (
          <p className="mt-6 rounded-2xl border border-[#c98f7a] bg-[#f7e8e0] px-4 py-3 text-xs font-bold text-[#955f49]">
            {validationError}
          </p>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 border-t border-[#d9ccb8] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-[#887b6e]">
              {saved
                ? "Setup saved. Dashboard, AI Assistant, and Merchandising Report now use this profile."
                : "Save to activate this profile across TrendMerch AI."}
            </p>
            {!profileComplete ? (
              <p className="mt-1 text-[10px] font-semibold text-[#9a6854]">
                Complete the required fields before saving.
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3d352d] px-5 py-3 text-sm font-bold text-[#fff8ec] shadow-[0_10px_24px_rgba(55,45,36,0.16)] transition hover:bg-[#4b4136]"
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
