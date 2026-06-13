"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  BUSINESS_PROFILE_EVENT,
  BUSINESS_PROFILE_KEY,
  defaultBusinessProfile,
  normalizeBusinessProfile,
} from "@/lib/business-profile";

const emptySnapshot = "";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(BUSINESS_PROFILE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(BUSINESS_PROFILE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(BUSINESS_PROFILE_KEY) ?? emptySnapshot;
}

function getServerSnapshot() {
  return emptySnapshot;
}

export function useBusinessProfile() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    if (!snapshot) return defaultBusinessProfile;
    try {
      return normalizeBusinessProfile(JSON.parse(snapshot)) ?? defaultBusinessProfile;
    } catch {
      return defaultBusinessProfile;
    }
  }, [snapshot]);
}
