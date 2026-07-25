import { CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { SearchDialog } from "@/components/search-dialog";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { cn } from "@/lib/utils";
import { HomePage } from "@/pages/home-page";
import { MyPromptsPage } from "@/pages/my-prompts-page";
import { CreatePromptPage } from "@/pages/create-prompt-page";
import { PromptDetailPage } from "@/pages/prompt-detail-page";

export function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState("Home");

  const handleAction = useCallback((label: string) => {
    if (label === "New prompt created" || label === "Create prompt opened") {
      setCurrentPage("Create prompt");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (label === "Opened Java Code Reviewer") {
      setCurrentPage("Prompt detail");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setToast(label);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  useKeyboardShortcut("k", openSearch, { ctrlOrMeta: true });

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-200">
      <AppSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        currentPage={currentPage}
        onCollapse={() => setSidebarCollapsed((value) => !value)}
        onMobileClose={() => setMobileOpen(false)}
        onNavigate={(label) => {
          setMobileOpen(false);
          if (label === "Home" || label === "My prompts") {
            setCurrentPage(label);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          handleAction(`${label} opened`);
        }}
      />
      <TopNavbar
        collapsed={sidebarCollapsed}
        onMenu={() => setMobileOpen(true)}
        onSearch={openSearch}
        onAction={handleAction}
      />
      <main
        className={cn(
          "min-h-screen pt-[72px] transition-[padding] duration-300",
          sidebarCollapsed ? "lg:pl-[76px]" : "lg:pl-[248px]",
        )}
      >
        {currentPage === "Prompt detail" ? (
          <PromptDetailPage
            onBack={() => setCurrentPage("My prompts")}
            onEdit={() => setCurrentPage("Create prompt")}
            onAction={handleAction}
          />
        ) : currentPage === "Create prompt" ? (
          <CreatePromptPage
            onBack={() => setCurrentPage("My prompts")}
            onAction={handleAction}
          />
        ) : currentPage === "My prompts" ? (
          <MyPromptsPage
            onAction={handleAction}
            onCreatePrompt={() => setCurrentPage("Create prompt")}
          />
        ) : (
          <HomePage onAction={handleAction} />
        )}
      </main>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onAction={handleAction} />

      <div
        role="status"
        aria-live="polite"
        className={cn(
          "fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-lg border border-white/[.1] bg-[#1c2128] px-4 py-3 text-xs text-slate-200 shadow-2xl transition duration-200",
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <CheckCircle2 className="size-4 text-emerald-400" />
        {toast}
      </div>
    </div>
  );
}
