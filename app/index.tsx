import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { App } from "@/App";
import { SavedPromptsProvider } from "@/context/saved-prompts-provider";
import { CollectionsProvider } from "@/context/collections-provider";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider delayDuration={200}>
      <SavedPromptsProvider>
        <CollectionsProvider>
          <App />
        </CollectionsProvider>
      </SavedPromptsProvider>
    </TooltipProvider>
  </StrictMode>,
);
