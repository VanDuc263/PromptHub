import { useContext } from "react";
import { SavedPromptsContext } from "@/context/saved-prompts-context";

export function useSavedPrompts() {
  const context = useContext(SavedPromptsContext);
  if (!context) {
    throw new Error("useSavedPrompts must be used inside SavedPromptsProvider");
  }
  return context;
}
