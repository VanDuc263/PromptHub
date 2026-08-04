import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Clock3,
  Compass,
  FolderClosed,
  Bookmark,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  Sparkle,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchWorkspacesRequest } from "@/lib/workspace-api";
import { fetchMyPromptsRequest } from "@/lib/my-prompts-api";
import { fetchSavedPromptsRequest } from "@/lib/saved-prompts-api";
import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import type { WorkspaceSummary } from "@/data/workspace-data";

interface AppSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  currentPage: string;
  activeWorkspaceId: string;
  onCollapse: () => void;
  onMobileClose: () => void;
  onNavigate: (label: string) => void;
  onWorkspaceNavigate: (workspaceId: string) => void;
}

const primaryItems = [
  { label: "Home", icon: Home },
  { label: "Explore", icon: Compass },
];

const libraryItems = [
  { label: "My prompts", icon: Sparkle },
  { label: "Saved", icon: Bookmark },
  { label: "Collections", icon: FolderClosed },
  { label: "History", icon: Clock3 },
];

const workspaceMarkers: Record<WorkspaceSummary["tone"], string> = {
  violet: "bg-violet-400",
  sky: "bg-sky-400",
  emerald: "bg-emerald-400",
  slate: "bg-slate-400",
};

function SidebarItem({
  icon: Icon,
  label,
  active,
  count,
  collapsed,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  count?: number;
  collapsed: boolean;
  onClick: () => void;
}) {
  const item = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-500/60",
        active
          ? "bg-violet-500/10 font-medium text-violet-300"
          : "text-slate-400 hover:bg-white/[.045] hover:text-slate-200",
        collapsed && "justify-center px-0",
      )}
    >
      {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-r bg-violet-400" />}
      <Icon className="size-[17px] shrink-0" strokeWidth={1.8} />
      {!collapsed && (
        <>
          <span className="truncate">{label}</span>
          {count !== undefined && (
            <span className="ml-auto text-[11px] tabular-nums text-slate-600">{count}</span>
          )}
        </>
      )}
    </button>
  );

  if (!collapsed) return item;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{item}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={10}
          className="z-50 rounded-md border border-white/10 bg-[#1c2128] px-2.5 py-1.5 text-xs text-slate-200 shadow-xl"
        >
          {label}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export function AppSidebar({
  collapsed,
  mobileOpen,
  currentPage,
  activeWorkspaceId,
  onCollapse,
  onMobileClose,
  onNavigate,
  onWorkspaceNavigate,
}: AppSidebarProps) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [workspacesLoading, setWorkspacesLoading] = useState(true);
  const [workspaceError, setWorkspaceError] = useState(false);
  const [libraryCounts, setLibraryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    fetchWorkspacesRequest(accessToken)
      .then((items) => {
        if (!active) return;
        setWorkspaces(items);
        setWorkspaceError(false);
      })
      .catch(() => active && setWorkspaceError(true))
      .finally(() => active && setWorkspacesLoading(false));
    return () => { active = false; };
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    Promise.allSettled([
      fetchMyPromptsRequest(accessToken),
      fetchSavedPromptsRequest(accessToken),
    ]).then(([myPrompts, savedPrompts]) => {
      if (!active) return;
      setLibraryCounts({
        ...(myPrompts.status === "fulfilled" ? { "My prompts": myPrompts.value.length } : {}),
        ...(savedPrompts.status === "fulfilled" ? { Saved: savedPrompts.value.length } : {}),
      });
    });
    return () => { active = false; };
  }, [accessToken]);

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={cn(
          "fixed inset-0 z-40 bg-black/65 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onMobileClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[.07] bg-[#0d1117] transition-[width,transform] duration-300",
          collapsed ? "w-[76px]" : "w-[248px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "max-lg:w-[268px]",
        )}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/[.07] px-5">
          <Logo compact={collapsed} />
          <Button
            variant="ghost"
            size="icon"
            className="size-8 lg:hidden"
            aria-label="Close sidebar"
            onClick={onMobileClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {primaryItems.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
                count={libraryCounts[item.label]}
                active={
                  currentPage === item.label ||
                  (item.label === "Explore" &&
                    (currentPage === "Public prompt detail" ||
                      currentPage === "User profile public"))
                }
                collapsed={collapsed}
                onClick={() => onNavigate(item.label)}
              />
            ))}
          </div>

          <div className="my-5 h-px bg-white/[.06]" />
          {!collapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-600">Library</p>}
          <div className="space-y-1">
            {libraryItems.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
                active={
                  currentPage === item.label ||
                  (item.label === "My prompts" &&
                    (currentPage === "Create prompt" ||
                      currentPage === "Prompt detail" ||
                      currentPage === "Create version" ||
                      currentPage === "Compare versions"))
                }
                collapsed={collapsed}
                onClick={() => onNavigate(item.label)}
              />
            ))}
          </div>

          <div className="my-5 h-px bg-white/[.06]" />
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-600">
              Workspace
            </p>
          )}
          <div className="space-y-1">
            {workspacesLoading && [0, 1].map((item) => (
              <div key={item} className={cn("mx-2 h-10 animate-pulse rounded-lg bg-white/[.035]", collapsed && "mx-0")} />
            ))}
            {workspaces.map((workspace) => (
              <button
                type="button"
                key={workspace.id}
                title={collapsed ? workspace.name : undefined}
                onClick={() => onWorkspaceNavigate(workspace.id)}
                className={cn(
                  "relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-slate-400 outline-none transition-colors hover:bg-white/[.045] hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-violet-500/60",
                  currentPage === "Workspace Management" && workspace.id === activeWorkspaceId && "bg-violet-500/10 text-violet-300",
                  collapsed && "justify-center px-0",
                )}
              >
                {currentPage === "Workspace Management" && workspace.id === activeWorkspaceId && <span className="absolute inset-y-2 left-0 w-0.5 rounded-r bg-violet-400" />}
                <span className={cn("size-2 shrink-0 rounded-full ring-4 ring-white/[.025]", workspaceMarkers[workspace.tone])} />
                {!collapsed && (
                  <>
                    <span className="truncate">{workspace.name}</span>
                    <span className="ml-auto text-[10px] tabular-nums text-slate-600">{workspace.prompts}</span>
                  </>
                )}
              </button>
            ))}
            {workspaceError && !collapsed && <p className="px-3 py-2 text-[10px] leading-4 text-rose-400/80">Unable to load workspaces.</p>}
            <SidebarItem
              icon={Plus}
              label="Create workspace"
              collapsed={collapsed}
              onClick={() => onNavigate("Create workspace")}
            />
          </div>
        </nav>

        <div className="space-y-1 border-t border-white/[.07] p-3">
          <SidebarItem icon={Settings} label="Settings" collapsed={collapsed} onClick={() => onNavigate("Settings")} />
          <button
            type="button"
            onClick={onCollapse}
            className="hidden h-10 w-full items-center justify-center gap-2 rounded-lg text-xs text-slate-500 transition-colors hover:bg-white/[.045] hover:text-slate-300 lg:flex"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            {!collapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
