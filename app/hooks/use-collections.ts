import { useContext } from "react";
import { CollectionsContext } from "@/context/collections-context";

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (!context) throw new Error("useCollections must be used inside CollectionsProvider");
  return context;
}
