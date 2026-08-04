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
import { AddToCollectionDialog } from "@/components/collections/collection-dialogs";
import { useHistory } from "@/hooks/use-history";
import { LoginPage } from "@/pages/login-page";
import { RegisterPage } from "@/pages/register-page";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearAuthError, logoutUser } from "@/store/auth-slice";

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

const ExplorePage = lazy(() =>
  import("@/pages/explore-page").then((module) => ({
    default: module.ExplorePage,
  })),
);

const PublicPromptDetailPage = lazy(() =>
  import("@/pages/public-prompt-detail-page").then((module) => ({
    default: module.PublicPromptDetailPage,
  })),
);

const UserProfilePage = lazy(() =>
  import("@/pages/user-profile-page").then((module) => ({
    default: module.UserProfilePage,
  })),
);

const SavedPage = lazy(() =>
  import("@/pages/saved-page").then((module) => ({
    default: module.SavedPage,
  })),
);

const CollectionsPage = lazy(() =>
  import("@/pages/collections-page").then((module) => ({
    default: module.CollectionsPage,
  })),
);

const HistoryPage = lazy(() =>
  import("@/pages/history-page").then((module) => ({
    default: module.HistoryPage,
  })),
);

const WorkspaceManagementPage = lazy(() =>
  import("@/pages/workspace-management-page").then((module) => ({
    default: module.WorkspaceManagementPage,
  })),
);

function collectionIdFromPath(path: string) {
  const match = path.match(/^\/collections\/([^/]+)\/?$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function pageFromPath(path: string) {
  if (path === "/history") return "History";
  if (path === "/collections" || collectionIdFromPath(path)) return "Collections";
  if (path.startsWith("/prompts/")) return "Public prompt detail";
  return "Home";
}

export function App() {
  const { recordAction } = useHistory();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(() => pageFromPath(window.location.pathname));
  const [selectedPublicPromptId, setSelectedPublicPromptId] = useState<string | null>(() => {
    const match = window.location.pathname.match(/^\/prompts\/([^/]+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  });
  const [selectedPrivatePromptId, setSelectedPrivatePromptId] = useState<string | null>(null);
  const [detailInitialTab, setDetailInitialTab] = useState<DetailTabId>("overview");
  const [newVersionCreated, setNewVersionCreated] = useState(false);
  const [compareOldVersion, setCompareOldVersion] = useState("v2");
  const [collectionPrompt, setCollectionPrompt] = useState<string | null>(null);
  const [workspaceInitialId, setWorkspaceInitialId] = useState("personal");
  const selectedCollectionId = collectionIdFromPath(pathname);

  const handleAction = useCallback((label: string) => {
    if (label === "Sign in selected" || label === "Create account selected") {
      const path = label === "Sign in selected" ? "/login" : "/register";
      window.history.pushState({}, "", path);
      setPathname(path);
      window.scrollTo({ top: 0 });
      return;
    }
    if (
      !user &&
      [
        "New prompt created",
        "Create prompt opened",
        "Saved opened",
        "Collections opened",
        "Collection picker opened",
        "Profile opened",
      ].some((action) => label === action || label.startsWith("Add "))
    ) {
      window.history.pushState({}, "", "/login");
      setPathname("/login");
      return;
    }
    if (label === "Sign out selected") {
      void dispatch(logoutUser()).then(() => {
        window.history.replaceState({}, "", "/login");
        setPathname("/login");
        setCurrentPage("Home");
      });
      return;
    }
    if (label === "New prompt created" || label === "Create prompt opened") {
      if (label === "New prompt created") recordAction(label);
      setSelectedPrivatePromptId(null);
      setCurrentPage("Create prompt");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (label === "Opened Java Code Reviewer") {
      recordAction(label);
      setDetailInitialTab("overview");
      setCurrentPage("Prompt detail");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (label === "Explore opened") {
      setCurrentPage("Explore");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (label === "Saved opened") {
      setCurrentPage("Saved");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (label === "Collections opened") {
      window.history.pushState({}, "", "/collections");
      setPathname("/collections");
      setCurrentPage("Collections");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (
      label === "Collection picker opened" ||
      (label.startsWith("Add ") && label.endsWith(" to collection"))
    ) {
      setCollectionPrompt(
        label === "Collection picker opened"
          ? "Java Code Reviewer"
          : label.slice(4, -" to collection".length),
      );
      return;
    }
    if (label === "Opened public prompt detail") {
      recordAction("Opened Spring Boot API Generator");
      setCurrentPage("Public prompt detail");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (
      label === "Author profile opened" ||
      label === "Đức Nguyễn's profile opened"
    ) {
      recordAction(label);
      setCurrentPage("User profile public");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (label === "Profile opened") {
      setCurrentPage("User profile owner");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    recordAction(label);
    setToast(label);
  }, [dispatch, recordAction, user]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const openSearch = useCallback(() => {
    if (currentPage === "Explore" || currentPage === "Saved" || currentPage === "Collections") {
      window.dispatchEvent(
        new Event(
          currentPage === "Explore"
            ? "prompthub:focus-explore-search"
            : currentPage === "Saved"
              ? "prompthub:focus-saved-search"
              : "prompthub:focus-collections-search",
        ),
      );
      return;
    }
    if (currentPage === "History") {
      window.dispatchEvent(new Event("prompthub:focus-history-search"));
      return;
    }
    setSearchOpen(true);
  }, [currentPage]);
  useKeyboardShortcut("k", openSearch, { ctrlOrMeta: true });

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = window.location.pathname;
      setPathname(nextPath);
      const promptMatch = nextPath.match(/^\/prompts\/([^/]+)$/);
      if (promptMatch) {
        setSelectedPublicPromptId(decodeURIComponent(promptMatch[1]));
        setCurrentPage("Public prompt detail");
      } else if (nextPath === "/collections" || collectionIdFromPath(nextPath)) {
        setCurrentPage("Collections");
      } else if (nextPath === "/history") {
        setCurrentPage("History");
      } else {
        setCurrentPage("Home");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentPage]);

  const navigate = useCallback((path: string) => {
    dispatch(clearAuthError());
    window.history.pushState({}, "", path);
    setPathname(path);
    if (path === "/") setCurrentPage("Home");
    window.scrollTo({ top: 0 });
  }, [dispatch]);

  if (pathname === "/login") return <LoginPage onNavigate={navigate} />;
  if (pathname === "/register") return <RegisterPage onNavigate={navigate} />;
  if (
    !user &&
    !["Home", "Explore", "Public prompt detail", "User profile public"].includes(currentPage)
  ) {
    return <LoginPage onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-200">
      <AppSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        currentPage={currentPage}
        activeWorkspaceId={workspaceInitialId}
        onCollapse={() => setSidebarCollapsed((value) => !value)}
        onMobileClose={() => setMobileOpen(false)}
        onWorkspaceNavigate={(workspaceId) => {
          setMobileOpen(false);
          setWorkspaceInitialId(workspaceId);
          setCurrentPage("Workspace Management");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigate={(label) => {
          setMobileOpen(false);
          if (!user && label !== "Home" && label !== "Explore") {
            handleAction("Sign in selected");
            return;
          }
          if (
            label === "Home" ||
            label === "My prompts" ||
            label === "Explore" ||
            label === "Saved" ||
            label === "Collections" ||
            label === "History"
          ) {
            setCurrentPage(label);
            const path = label === "History" ? "/history" : label === "Collections" ? "/collections" : "/";
            window.history.pushState({}, "", path);
            setPathname(path);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          if (label === "Create workspace") {
            setWorkspaceInitialId("personal");
            setCurrentPage("Workspace Management");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          handleAction(`${label} opened`);
        }}
      />
      <TopNavbar
        collapsed={sidebarCollapsed}
        user={user}
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
        {currentPage === "Workspace Management" ? (
          <Suspense fallback={<VersionPageSkeleton />}>
            <WorkspaceManagementPage
              key={workspaceInitialId}
              initialWorkspaceId={workspaceInitialId}
              onWorkspaceChange={setWorkspaceInitialId}
              onAction={handleAction}
            />
          </Suspense>
        ) : currentPage === "History" ? (
          <Suspense fallback={<VersionPageSkeleton />}>
            <HistoryPage
              onExplore={() => {
                window.history.pushState({}, "", "/");
                setCurrentPage("Explore");
              }}
              onDashboard={() => {
                window.history.pushState({}, "", "/");
                setCurrentPage("Home");
              }}
              onAction={handleAction}
            />
          </Suspense>
        ) : currentPage === "Collections" ? (
          <Suspense fallback={<VersionPageSkeleton />}>
            <CollectionsPage
              collectionId={selectedCollectionId}
              onOpenCollection={(collectionId) => {
                const path = `/collections/${encodeURIComponent(collectionId)}`;
                window.history.pushState({}, "", path);
                setPathname(path);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onBackToCollections={() => {
                window.history.pushState({}, "", "/collections");
                setPathname("/collections");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onAction={handleAction}
            />
          </Suspense>
        ) : currentPage === "Saved" ? (
          <Suspense fallback={<VersionPageSkeleton />}>
            <SavedPage
              onExplore={() => setCurrentPage("Explore")}
              onAction={handleAction}
              onOpenPrompt={(promptId, visibility) => {
                if (visibility === "Private") {
                  setSelectedPrivatePromptId(promptId);
                  setDetailInitialTab("overview");
                  setCurrentPage("Prompt detail");
                } else {
                  setSelectedPublicPromptId(promptId);
                  window.history.pushState({}, "", `/prompts/${encodeURIComponent(promptId)}`);
                  setCurrentPage("Public prompt detail");
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </Suspense>
        ) : currentPage === "User profile public" || currentPage === "User profile owner" ? (
          <Suspense fallback={<VersionPageSkeleton />}>
            <UserProfilePage
              isOwner={currentPage === "User profile owner"}
              onAction={handleAction}
            />
          </Suspense>
        ) : currentPage === "Public prompt detail" ? (
          <Suspense fallback={<VersionPageSkeleton />}>
            <PublicPromptDetailPage
              promptId={selectedPublicPromptId}
              onBack={() => {
                window.history.pushState({}, "", "/");
                setCurrentPage("Explore");
              }}
              onAction={handleAction}
            />
          </Suspense>
        ) : currentPage === "Explore" ? (
          <Suspense fallback={<VersionPageSkeleton />}>
            <ExplorePage
              onAction={handleAction}
              onOpenPrompt={(promptId) => {
                setSelectedPublicPromptId(promptId);
                window.history.pushState({}, "", `/prompts/${encodeURIComponent(promptId)}`);
                setCurrentPage("Public prompt detail");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </Suspense>
        ) : currentPage === "Compare versions" ? (
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
            promptId={selectedPrivatePromptId}
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
            key={selectedPrivatePromptId ?? "new-prompt"}
            promptId={selectedPrivatePromptId}
            onBack={() => setCurrentPage("My prompts")}
            onAction={handleAction}
            onCreated={() => setCurrentPage("My prompts")}
          />
        ) : currentPage === "My prompts" ? (
          <MyPromptsPage
            onAction={handleAction}
            onCreatePrompt={() => {
              setSelectedPrivatePromptId(null);
              setCurrentPage("Create prompt");
            }}
            onEditPrompt={(promptId) => {
              setSelectedPrivatePromptId(promptId);
              setCurrentPage("Create prompt");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenPrompt={(promptId) => {
              recordAction(`Opened prompt ${promptId}`);
              setSelectedPrivatePromptId(promptId);
              setDetailInitialTab("overview");
              setCurrentPage("Prompt detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : (
          <HomePage
            onAction={handleAction}
            onNavigate={(destination) => {
              if (destination === "Create prompt") setSelectedPrivatePromptId(null);
              setCurrentPage(destination);
              window.history.pushState({}, "", destination === "History" ? "/history" : "/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenPublicPrompt={(promptId) => {
              setSelectedPublicPromptId(promptId);
              window.history.pushState({}, "", `/prompts/${encodeURIComponent(promptId)}`);
              setCurrentPage("Public prompt detail");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onAction={handleAction} />
      <AddToCollectionDialog
        key={collectionPrompt}
        open={Boolean(collectionPrompt)}
        onOpenChange={(open) => !open && setCollectionPrompt(null)}
        promptTitle={collectionPrompt ?? ""}
        onDone={() => {
          if (collectionPrompt) recordAction(`Add ${collectionPrompt} to collection`);
          setCollectionPrompt(null);
          setToast("Prompt added to collection");
        }}
      />

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
