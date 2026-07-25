import { CheckCircle2 } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { SearchDialog } from "@/components/search-dialog";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { cn } from "@/lib/utils";
import { HomePage } from "@/pages/home-page";
import { MyPromptsPage } from "@/pages/my-prompts-page";
import { CreatePromptPage } from "@/pages/create-prompt-page";
import { PromptDetailPage } from "@/pages/prompt-detail-page";
import type { DetailTabId } from "@/components/prompt-detail/detail-tabs";

const CreateVersionPage = lazy(() =>
  import("@/pages/create-version-page").then((module) => ({
    default: module.CreateVersionPage,
  })),
);

const CompareVersionsPage = lazy(() =>
  import("@/pages/compare-versions-page").then((module) => ({
    default: module.CompareVersionsPage,
  })),
);

export function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState("Home");
  const [detailInitialTab, setDetailInitialTab] = useState<DetailTabId>("overview");
  const [newVersionCreated, setNewVersionCreated] = useState(false);
  const [compareOldVersion, setCompareOldVersion] = useState("v2");

  const handleAction = useCallback((label: string) => {
    if (label === "New prompt created" || label === "Create prompt opened") {
      setCurrentPage("Create prompt");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (label === "Opened Java Code Reviewer") {
      setDetailInitialTab("overview");
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
        {currentPage === "Compare versions" ? (
          <Suspense fallback={<VersionPageSkeleton />}>
            <CompareVersionsPage
              initialOldVersion={compareOldVersion}
              initialNewVersion={newVersionCreated ? "v5" : "v4"}
              onBack={() => {
                setDetailInitialTab("versions");
                setCurrentPage("Prompt detail");
              }}
              onAction={handleAction}
            />
          </Suspense>
        ) : currentPage === "Create version" ? (
          <Suspense fallback={<VersionPageSkeleton />}>
            <CreateVersionPage
              onBack={() => {
                setDetailInitialTab("versions");
                setCurrentPage("Prompt detail");
              }}
              onGoToEditor={() => setCurrentPage("Create prompt")}
              onSuccess={(version) => {
                setNewVersionCreated(true);
                setDetailInitialTab("versions");
                setCurrentPage("Prompt detail");
                handleAction(`Version ${version} created successfully.`);
              }}
            />
          </Suspense>
        ) : currentPage === "Prompt detail" ? (
          <PromptDetailPage
            onBack={() => setCurrentPage("My prompts")}
            onEdit={() => setCurrentPage("Create prompt")}
            onAction={handleAction}
            initialTab={detailInitialTab}
            newVersionCreated={newVersionCreated}
            onCreateVersion={() => setCurrentPage("Create version")}
            onCompareVersion={(version) => {
              setCompareOldVersion(
                version === "v4" || version === "v5" ? "v2" : version,
              );
              setCurrentPage("Compare versions");
            }}
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

function VersionPageSkeleton() {
  return (
    <div className="mx-auto max-w-[1580px] animate-pulse px-4 py-6 sm:px-6 xl:px-8">
      <div className="h-16 border-b border-white/[.07]" />
      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(340px,.72fr)_minmax(520px,1.28fr)]">
        <div className="space-y-5">
          <div className="h-44 rounded-2xl border border-white/[.06] bg-[#161b22]" />
          <div className="h-[520px] rounded-2xl border border-white/[.06] bg-[#161b22]" />
        </div>
        <div className="space-y-5">
          <div className="h-40 rounded-2xl border border-white/[.06] bg-[#161b22]" />
          <div className="h-[560px] rounded-2xl border border-white/[.06] bg-[#161b22]" />
        </div>
      </div>
    </div>
  );
}
