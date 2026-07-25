import * as Tooltip from "@radix-ui/react-tooltip";
import {
  BookMarked,
  ChevronDown,
  Clock3,
  Compass,
  FolderClosed,
  Heart,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  Sparkle,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  currentPage: string;
  onCollapse: () => void;
  onMobileClose: () => void;
  onNavigate: (label: string) => void;
}

const primaryItems = [
  { label: "Home", icon: Home },
  { label: "Explore", icon: Compass },
];

const libraryItems = [
  { label: "My prompts", icon: Sparkle, count: 124 },
  { label: "Favorites", icon: Heart, count: 58 },
  { label: "Collections", icon: FolderClosed },
  { label: "History", icon: Clock3 },
];

const workspaces = [
  { label: "Personal", icon: BookMarked, marker: "bg-violet-400" },
  { label: "Backend Team", icon: Users, marker: "bg-sky-400" },
];

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
  onCollapse,
  onMobileClose,
  onNavigate,
}: AppSidebarProps) {
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
                active={currentPage === item.label}
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
                      currentPage === "Create version"))
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
            {workspaces.map((workspace) => (
              <button
                type="button"
                key={workspace.label}
                onClick={() => onNavigate(workspace.label)}
                className={cn(
                  "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-slate-400 transition-colors hover:bg-white/[.045] hover:text-slate-200",
                  collapsed && "justify-center px-0",
                )}
              >
                <span className={cn("size-2 rounded-full ring-4 ring-white/[.025]", workspace.marker)} />
                {!collapsed && (
                  <>
                    <span>{workspace.label}</span>
                    {workspace.label === "Personal" && <ChevronDown className="ml-auto size-3.5" />}
                  </>
                )}
              </button>
            ))}
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
