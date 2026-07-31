import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
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
import { NotificationButton } from "@/components/layout/notification-popover";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/auth-api";

interface TopNavbarProps {
  collapsed: boolean;
  onMenu: () => void;
  onSearch: () => void;
  onAction: (label: string) => void;
  user: AuthUser | null;
}

function initialsFor(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function UserDropdown({ onAction, user }: { onAction: (label: string) => void; user: AuthUser | null }) {
  const displayName = user?.displayName ?? "PromptHub User";
  const email = user?.email ?? "user@prompthub.com";
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" className="flex items-center gap-2 rounded-lg p-1 outline-none transition hover:bg-white/[.05] focus-visible:ring-2 focus-visible:ring-violet-500/60">
          <Avatar initials={initialsFor(displayName) || "PH"} />
          <div className="hidden text-left xl:block">
            <p className="text-xs font-medium text-slate-200">{displayName}</p>
            <p className="text-[10px] text-slate-600">Personal</p>
          </div>
          <ChevronDown className="hidden size-3.5 text-slate-600 xl:block" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="dropdown-content w-56 p-1.5">
          <div className="px-2.5 py-2">
            <p className="text-xs font-medium text-slate-100">{displayName}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{email}</p>
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

export function TopNavbar({ collapsed, onMenu, onSearch, onAction, user }: TopNavbarProps) {
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
        {user ? (
          <UserDropdown onAction={onAction} user={user} />
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => onAction("Sign in selected")}>Sign in</Button>
            <Button size="sm" onClick={() => onAction("Create account selected")}>Create account</Button>
          </div>
        )}
      </div>
    </header>
  );
}
