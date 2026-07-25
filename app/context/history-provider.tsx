import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { HistoryContext } from "@/context/history-context";
import { initialHistoryRecords } from "@/data/history-data";
import type { HistoryRecord } from "@/types";

const storageKey = "prompthub:activity-history";

function parseAction(label: string): Pick<HistoryRecord, "type" | "title" | "description" | "contentType" | "source"> | null {
  const cleanTitle = label.replace(/^(Opened|Copied|Editing|Saved|Removed|Add|Community prompt opened:)\s*/i, "").replace(/\s+(from Saved|to collection)$/i, "");
  if (/opened|viewed/i.test(label)) return { type: "Viewed", title: cleanTitle, description: `Viewed “${cleanTitle}”`, contentType: label.includes("Community") ? "Community Prompt" : "Prompt", source: label.includes("Community") ? "Explore" : "My Prompts" };
  if (/copied/i.test(label)) return { type: "Copied", title: cleanTitle, description: `Copied “${cleanTitle}”`, contentType: "Prompt", source: "My Prompts" };
  if (/forked/i.test(label)) return { type: "Forked", title: cleanTitle, description: `Forked “${cleanTitle}” into My Prompts`, contentType: "Community Prompt", source: "Explore" };
  if (/^ran /i.test(label)) return { type: "Run", title: cleanTitle.replace(/\s+again$/i, ""), description: `Ran “${cleanTitle.replace(/\s+again$/i, "")}”`, contentType: "Prompt", source: "My Prompts" };
  if (/version .*created/i.test(label)) return { type: "Created Version", title: cleanTitle, description: label, contentType: "Prompt", source: "My Prompts" };
  if (/prompt created|new prompt created/i.test(label)) return { type: "Created", title: "New Prompt", description: "Created a new prompt", contentType: "Prompt", source: "My Prompts" };
  if (/removed.*saved/i.test(label)) return { type: "Removed from Saved", title: cleanTitle, description: `Removed “${cleanTitle}” from Saved`, contentType: "Community Prompt", source: "Saved" };
  if (/saved/i.test(label)) return { type: "Saved", title: cleanTitle, description: `Saved “${cleanTitle}”`, contentType: "Community Prompt", source: "Explore" };
  if (/add.*collection/i.test(label)) return { type: "Added to Collection", title: cleanTitle, description: `Added “${cleanTitle}” to a collection`, contentType: "Prompt", source: "Collections" };
  if (/collection created/i.test(label)) return { type: "Created Collection", title: "New Collection", description: "Created a new collection", contentType: "Collection", source: "Collections" };
  if (/collection updated/i.test(label)) return { type: "Updated Collection", title: "Collection", description: "Updated a collection", contentType: "Collection", source: "Collections" };
  if (/delete/i.test(label)) return { type: "Deleted", title: cleanTitle, description: `Deleted “${cleanTitle}”`, contentType: "Prompt", source: "My Prompts" };
  if (/editing/i.test(label)) return { type: "Edited", title: cleanTitle, description: `Edited “${cleanTitle}”`, contentType: "Prompt", source: "My Prompts" };
  return null;
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<HistoryRecord[]>(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as HistoryRecord[]) : initialHistoryRecords;
    } catch {
      return initialHistoryRecords;
    }
  });

  useEffect(() => { window.localStorage.setItem(storageKey, JSON.stringify(records)); }, [records]);

  const recordAction = useCallback((label: string) => {
    const parsed = parseAction(label);
    if (!parsed) return;
    const timestamp = Date.now();
    setRecords((current) => {
      const duplicateView = parsed.type === "Viewed" && current.some((record) => record.type === "Viewed" && record.title === parsed.title && timestamp - record.createdAt < 120000);
      if (duplicateView) return current;
      return [{ ...parsed, id: `history-${timestamp}`, group: "Today", timestamp: "Just now", createdAt: timestamp }, ...current];
    });
  }, []);

  const value = useMemo(() => ({
    records,
    recordAction,
    removeRecord: (id: string) => setRecords((items) => items.filter((item) => item.id !== id)),
    clearRecords: (mode: "all" | "viewed" | "30d" | "90d") => {
      const cutoff = Date.now() - (mode === "90d" ? 90 : 30) * 24 * 60 * 60 * 1000;
      setRecords((items) => mode === "all" ? [] : mode === "viewed" ? items.filter((item) => item.type !== "Viewed") : items.filter((item) => item.createdAt >= cutoff));
    },
  }), [recordAction, records]);

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}
