"use client";

import { useMemo, useSyncExternalStore } from "react";
import { fashionRetailData, type FashionRetailRecord } from "@/data/fashion-retail-data";
import {
  BUSINESS_PROFILE_EVENT,
  UPLOADED_DATA_KEY,
  type UploadedBusinessRow,
} from "@/lib/business-profile";
import { uploadedRowsToFashionRecords } from "@/lib/data-source";
import { filterDataByTimeframe } from "@/lib/timeframe";
import { useBusinessProfile } from "@/lib/use-business-profile";
import { useTimeframe } from "@/lib/use-timeframe";

const emptySnapshot = "";
const subscribeHydration = () => () => {};

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(BUSINESS_PROFILE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(BUSINESS_PROFILE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(UPLOADED_DATA_KEY) ?? emptySnapshot;
}

function getServerSnapshot() {
  return emptySnapshot;
}

function parseUploadedRows(snapshot: string) {
  if (!snapshot) return [];
  try {
    const value = JSON.parse(snapshot);
    return Array.isArray(value) ? (value as UploadedBusinessRow[]) : [];
  } catch {
    return [];
  }
}

export function useAnalyticsData() {
  const profile = useBusinessProfile();
  const timeframe = useTimeframe();
  const isHydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const uploadedSnapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    const uploadedRecords = uploadedRowsToFashionRecords(parseUploadedRows(uploadedSnapshot));
    const sourceData: FashionRetailRecord[] =
      profile.source === "csv" && uploadedRecords.length > 0
        ? uploadedRecords
        : fashionRetailData;
    const records = filterDataByTimeframe(sourceData, timeframe);

    return {
      records,
      sourceData,
      timeframe,
      profile,
      isUploadedData: profile.source === "csv" && uploadedRecords.length > 0,
      hasEnoughData: records.length >= 3,
      isHydrated,
    };
  }, [profile, timeframe, uploadedSnapshot, isHydrated]);
}
