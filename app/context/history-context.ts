import { createContext } from "react";
import type { HistoryRecord } from "@/types";

export interface HistoryContextValue {
  records: HistoryRecord[];
  recordAction: (label: string) => void;
  removeRecord: (id: string) => void;
  clearRecords: (mode: "all" | "viewed" | "30d" | "90d") => void;
}

export const HistoryContext = createContext<HistoryContextValue | null>(null);
