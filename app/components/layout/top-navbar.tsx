import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Bell,
  ChevronDown,
  Compass,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/layout/search-bar";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  collapsed: boolean;
  onMenu: () => void;
  onSearch: () => void;
  onAction: (label: string) => void;
}

function NotificationButton({ onAction }: { onAction: (label: string) => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="icon" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-[18px]" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-400 ring-2 ring-[#0d1117]" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={9} className="dropdown-content w-80">
          <div className="flex items-center justify-between border-b border-white/[.07] px-4 py-3">
            <p className="text-sm font-semibold text-slate-100">Notifications</p>
            <button className="text-[11px] text-violet-400 hover:text-violet-300" onClick={() => onAction("Notifications marked as read")}>Mark all read</button>
          </div>
          <button className="flex w-full gap-3 px-4 py-3 text-left hover:bg-white/[.04]" onClick={() => onAction("Opened comment")}>
            <span className="mt-1 size-2 shrink-0 rounded-full bg-violet-400" />
            <span>
              <span className="block text-xs leading-5 text-slate-300">Minh commented on <strong className="font-medium text-slate-100">SQL Query Optimizer</strong></span>
              <span className="mt-1 block text-[11px] text-slate-600">5 hours ago</span>
            </span>
          </button>
          <button className="flex w-full gap-3 px-4 py-3 text-left hover:bg-white/[.04]" onClick={() => onAction("Opened trending prompt")}>
            <span className="mt-1 size-2 shrink-0 rounded-full bg-sky-400" />
            <span>
              <span className="block text-xs leading-5 text-slate-300">Your prompt is trending in <strong className="font-medium text-slate-100">Programming</strong></span>
              <span className="mt-1 block text-[11px] text-slate-600">Yesterday</span>
            </span>
          </button>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function UserDropdown({ onAction }: { onAction: (label: string) => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" className="flex items-center gap-2 rounded-lg p-1 outline-none transition hover:bg-white/[.05] focus-visible:ring-2 focus-visible:ring-violet-500/60">
          <Avatar initials="VD" />
          <div className="hidden text-left xl:block">
            <p className="text-xs font-medium text-slate-200">Van Duc</p>
            <p className="text-[10px] text-slate-600">Personal</p>
          </div>
          <ChevronDown className="hidden size-3.5 text-slate-600 xl:block" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="dropdown-content w-56 p-1.5">
          <div className="px-2.5 py-2">
            <p className="text-xs font-medium text-slate-100">Van Duc</p>
            <p className="mt-0.5 text-[11px] text-slate-500">vanduc@example.com</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Profile opened")}><UserRound /> Profile</DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Settings opened")}><Settings /> Settings</DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
          <DropdownMenu.Item className="dropdown-item text-red-300" onSelect={() => onAction("Sign out selected")}><LogOut /> Sign out</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function TopNavbar({ collapsed, onMenu, onSearch, onAction }: TopNavbarProps) {
  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 h-[72px] border-b border-white/[.07] bg-[#0d1117]/85 backdrop-blur-xl transition-[left] duration-300",
        collapsed ? "lg:left-[76px]" : "lg:left-[248px]",
        "left-0",
      )}
    >
      <div className="flex h-full items-center gap-3 px-4 sm:px-6">
        <Button variant="icon" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open navigation">
          <Menu className="size-5" />
        </Button>
        <div className="flex min-w-0 flex-1 justify-center md:justify-start">
          <div className="hidden w-full md:block"><SearchBar onClick={onSearch} /></div>
          <div className="md:hidden"><SearchBar compact onClick={onSearch} /></div>
        </div>
        <Button variant="secondary" className="hidden sm:inline-flex" onClick={() => onAction("Explore opened")}>
          <Compass className="size-4" /> Explore
        </Button>
        <NotificationButton onAction={onAction} />
        <div className="mx-0.5 hidden h-6 w-px bg-white/[.07] sm:block" />
        <UserDropdown onAction={onAction} />
      </div>
    </header>
  );
}
