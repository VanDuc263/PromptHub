import { createContext, useContext, type ReactNode } from "react";
import { communityPrompts } from "@/data/explore-data";
import {
  publicPrompt,
  publicPromptContent,
  publicSystemMessage,
  publicStats,
  publicVariables,
} from "@/data/public-prompt-data";
import type { ExplorePrompt, PromptDetailVariable, PublicPromptVariable } from "@/types";

export interface PublicPromptContextValue {
  prompt: typeof publicPrompt;
  explorePrompt: ExplorePrompt;
  content: string;
  systemMessage: string;
  variables: PublicPromptVariable[];
  runVariables: PromptDetailVariable[];
  stats: typeof publicStats;
}

const fallbackExplorePrompt = communityPrompts.find((item) => item.title === publicPrompt.title)
  ?? communityPrompts[0];

const defaultValue: PublicPromptContextValue = {
  prompt: publicPrompt,
  explorePrompt: fallbackExplorePrompt,
  content: publicPromptContent,
  systemMessage: publicSystemMessage,
  variables: publicVariables,
  runVariables: publicVariables.map((variable) => ({
    name: variable.name,
    label: variable.name.replace(/_/g, " ").replace(/^./, (letter) => letter.toUpperCase()),
    type: "Text",
    required: variable.required,
    defaultValue: variable.defaultValue,
    placeholder: variable.example,
  })),
  stats: publicStats,
};

const PublicPromptContext = createContext(defaultValue);

export function PublicPromptProvider({ value, children }: { value: PublicPromptContextValue; children: ReactNode }) {
  return <PublicPromptContext.Provider value={value}>{children}</PublicPromptContext.Provider>;
}

// The hook intentionally lives beside its provider so consumers share one context instance.
// eslint-disable-next-line react-refresh/only-export-components
export function usePublicPromptData() {
  return useContext(PublicPromptContext);
}
