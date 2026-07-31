import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Provider } from "react-redux";
import { App } from "@/App";
import { SavedPromptsProvider } from "@/context/saved-prompts-provider";
import { CollectionsProvider } from "@/context/collections-provider";
import { HistoryProvider } from "@/context/history-provider";
import "@/styles/globals.css";
import { store } from "@/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <TooltipProvider delayDuration={200}>
        <SavedPromptsProvider>
          <CollectionsProvider>
            <HistoryProvider>
              <App />
            </HistoryProvider>
          </CollectionsProvider>
        </SavedPromptsProvider>
      </TooltipProvider>
    </Provider>
  </StrictMode>,
);
