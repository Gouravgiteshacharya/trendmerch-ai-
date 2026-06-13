"use client";

import { useSyncExternalStore } from "react";
import {
  TIMEFRAME_EVENT,
  TIMEFRAME_KEY,
  defaultTimeframe,
  normalizeTimeframe,
} from "@/lib/timeframe";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(TIMEFRAME_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(TIMEFRAME_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return normalizeTimeframe(window.localStorage.getItem(TIMEFRAME_KEY));
}

function getServerSnapshot() {
  return defaultTimeframe;
}

export function useTimeframe() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
