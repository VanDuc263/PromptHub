import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Bell,
  Bookmark,
  Check,
  Folder,
  GitFork,
  Heart,
  History,
  MessageCircle,
  MoreHorizontal,
  Settings,
  Trash2,
  TrendingUp,
  Trophy,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotificationType =
  | "comment"
  | "like"
  | "fork"
  | "favorite"
  | "collection"
  | "follow"
  | "version"
  | "trending"
  | "achievement"
  | "system";

type NotificationGroup = "Today" | "Yesterday" | "Earlier";
type NotificationTab = "all" | "unread" | "mentions";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  subject?: string;
  description: string;
  timestamp: string;
  group: NotificationGroup;
  unread: boolean;
  mention?: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "comment", title: "Minh commented on", subject: "SQL Query Optimizer", description: '"Great optimization! Consider using an index."', timestamp: "5 minutes ago", group: "Today", unread: true, mention: true },
  { id: 2, type: "like", title: "Linh liked", subject: "React Test Generator", description: "Your prompt received its 42nd like.", timestamp: "18 minutes ago", group: "Today", unread: true },
  { id: 3, type: "fork", title: "Alex forked", subject: "API Documentation Writer", description: "A new public fork was created from v4.", timestamp: "1 hour ago", group: "Today", unread: true },
  { id: 4, type: "follow", title: "Mai started following you", description: "You have a new follower from the PromptHub community.", timestamp: "2 hours ago", group: "Today", unread: true },
  { id: 5, type: "favorite", title: "Your prompt was favorited", subject: "Clean Code Reviewer", description: "Daniel saved it to their favorites.", timestamp: "4 hours ago", group: "Today", unread: false },
  { id: 6, type: "collection", title: "Added to a collection", subject: "Developer Essentials", description: "Nora added your prompt to a public collection.", timestamp: "6 hours ago", group: "Today", unread: false },
  { id: 7, type: "version", title: "Version published", subject: "Email Tone Refiner v3", description: "Your latest version is now available to everyone.", timestamp: "Yesterday at 8:45 PM", group: "Yesterday", unread: false },
  { id: 8, type: "trending", title: "Your prompt is trending", subject: "Programming", description: "SQL Query Optimizer is gaining attention this week.", timestamp: "Yesterday at 4:12 PM", group: "Yesterday", unread: false },
  { id: 9, type: "comment", title: "Huy mentioned you on", subject: "UX Research Assistant", description: '"@VanDuc could you share the variables you used?"', timestamp: "Yesterday at 1:20 PM", group: "Yesterday", unread: false, mention: true },
  { id: 10, type: "achievement", title: "Achievement unlocked", subject: "Community Builder", description: "Ten people have forked one of your prompts.", timestamp: "Yesterday at 9:02 AM", group: "Yesterday", unread: false },
  { id: 11, type: "system", title: "Security check complete", description: "Your account security review found no issues.", timestamp: "Jul 23", group: "Earlier", unread: false },
  { id: 12, type: "like", title: "An liked", subject: "Meeting Notes Summarizer", description: "Your prompt received a new like.", timestamp: "Jul 22", group: "Earlier", unread: false },
  { id: 13, type: "fork", title: "Sofia forked", subject: "Product Description Studio", description: "A private fork was created from v2.", timestamp: "Jul 20", group: "Earlier", unread: false },
  { id: 14, type: "favorite", title: "Saved to favorites", subject: "Interview Question Builder", description: "Chris bookmarked your prompt.", timestamp: "Jul 18", group: "Earlier", unread: false },
  { id: 15, type: "collection", title: "Featured in a collection", subject: "Top Productivity Prompts", description: "Your prompt was added by the PromptHub team.", timestamp: "Jul 16", group: "Earlier", unread: false },
  { id: 16, type: "follow", title: "Quinn started following you", description: "They discovered you through Explore.", timestamp: "Jul 12", group: "Earlier", unread: false },
  { id: 17, type: "version", title: "Version published", subject: "Bug Report Analyzer v2", description: "The new version passed all checks.", timestamp: "Jul 9", group: "Earlier", unread: false },
  { id: 18, type: "system", title: "Weekly digest ready", description: "See how your prompts performed last week.", timestamp: "Jul 7", group: "Earlier", unread: false },
];

const notificationStyles: Record<NotificationType, { icon: LucideIcon; color: string; surface: string }> = {
  comment: { icon: MessageCircle, color: "text-violet-400", surface: "bg-violet-500/12" },
  like: { icon: Heart, color: "text-pink-400", surface: "bg-pink-500/12" },
  fork: { icon: GitFork, color: "text-sky-400", surface: "bg-sky-500/12" },
  favorite: { icon: Bookmark, color: "text-amber-300", surface: "bg-amber-400/12" },
  collection: { icon: Folder, color: "text-emerald-400", surface: "bg-emerald-500/12" },
  follow: { icon: UserPlus, color: "text-cyan-400", surface: "bg-cyan-500/12" },
  version: { icon: History, color: "text-orange-400", surface: "bg-orange-500/12" },
  trending: { icon: TrendingUp, color: "text-indigo-400", surface: "bg-indigo-500/12" },
  achievement: { icon: Trophy, color: "text-yellow-300", surface: "bg-yellow-400/12" },
  system: { icon: Bell, color: "text-slate-400", surface: "bg-slate-500/12" },
};

const groups: NotificationGroup[] = ["Today", "Yesterday", "Earlier"];

export function NotificationButton({ onAction }: { onAction: (label: string) => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!open || hasLoaded.current) return;
    setLoading(true);
    const timeout = window.setTimeout(() => {
      setLoading(false);
      hasLoaded.current = true;
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [open]);

  const filtered = useMemo(
    () =>
      notifications.filter((notification) => {
        if (tab === "unread") return notification.unread;
        if (tab === "mentions") return notification.mention;
        return true;
      }),
    [notifications, tab],
  );

  const unreadCount = notifications.filter((notification) => notification.unread).length;
  const mentionCount = notifications.filter((notification) => notification.mention).length;

  const announce = (label: string) => onAction(label);
  const markRead = (id: number) => {
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item));
    announce("Notification marked as read");
  };
  const remove = (id: number, action: "archived" | "deleted") => {
    setNotifications((items) => items.filter((item) => item.id !== id));
    announce(`Notification ${action}`);
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const cards = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[data-notification-card]"));
    if (!cards.length) return;
    event.preventDefault();
    const currentIndex = cards.indexOf(document.activeElement as HTMLElement);
    const nextIndex = event.key === "ArrowDown"
      ? (currentIndex + 1) % cards.length
      : (currentIndex <= 0 ? cards.length : currentIndex) - 1;
    cards[nextIndex]?.focus();
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button variant="icon" size="icon" className="relative" aria-label={`Notifications, ${unreadCount} unread`}>
          <Bell className="size-[18px]" />
          {unreadCount > 0 && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-400 ring-2 ring-[#0d1117]" />}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <div className="notification-backdrop" aria-hidden onClick={() => setOpen(false)} />
      </DropdownMenu.Portal>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={9}
          collisionPadding={12}
          className="notification-popover"
          aria-label="Notifications"
        >
          <div className="sticky top-0 z-20 border-b border-white/[.07] bg-[#171c24]/95 backdrop-blur-xl">
            <div className="flex h-14 items-center justify-between px-4">
              <h2 className="text-sm font-semibold tracking-tight text-slate-100">Notifications</h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded-md px-2 py-1.5 text-[11px] font-medium text-violet-400 outline-none transition hover:bg-violet-500/10 hover:text-violet-300 focus-visible:ring-2 focus-visible:ring-violet-500/70"
                  onClick={() => {
                    setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
                    announce("Notifications marked as read");
                  }}
                >
                  Mark all as read
                </button>
                <button
                  type="button"
                  className="rounded-md p-2 text-slate-500 outline-none transition hover:bg-white/[.06] hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-violet-500/70"
                  aria-label="Notification settings"
                  onClick={() => announce("Notification settings opened")}
                >
                  <Settings className="size-4" />
                </button>
              </div>
            </div>
            <div className="flex h-10 gap-5 px-4" role="tablist" aria-label="Notification filters">
              {([
                ["all", `All (${notifications.length})`],
                ["unread", `Unread (${unreadCount})`],
                ["mentions", `Mentions (${mentionCount})`],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={tab === value}
                  className={cn(
                    "relative h-full text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500/70",
                    tab === value ? "text-white" : "text-slate-500 hover:text-slate-300",
                  )}
                  onClick={() => setTab(value)}
                >
                  {label}
                  {tab === value && (
                    <motion.span
                      layoutId="notification-tab-indicator"
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-400"
                      transition={{ type: "spring", stiffness: 450, damping: 34 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="notification-scroll" onKeyDown={handleListKeyDown}>
            {loading ? (
              <NotificationSkeleton />
            ) : filtered.length === 0 ? (
              <EmptyNotifications onExplore={() => {
                setOpen(false);
                announce("Explore opened");
              }} />
            ) : (
              <AnimatePresence initial={false}>
                {groups.map((group) => {
                  const items = filtered.filter((notification) => notification.group === group);
                  if (!items.length) return null;
                  return (
                    <motion.section layout key={group} className="px-3 pb-1 pt-3" aria-labelledby={`notification-group-${group}`}>
                      <h3 id={`notification-group-${group}`} className="mb-2 px-1 text-[9px] font-semibold uppercase tracking-[.16em] text-slate-600">
                        {group}
                      </h3>
                      <div className="space-y-2">
                        <AnimatePresence initial={false}>
                          {items.map((notification) => (
                            <NotificationCard
                              key={notification.id}
                              notification={notification}
                              onOpen={() => announce(`Opened ${notification.subject ?? notification.title}`)}
                              onRead={() => markRead(notification.id)}
                              onArchive={() => remove(notification.id, "archived")}
                              onDelete={() => remove(notification.id, "deleted")}
                              onMore={() => announce("More notification actions opened")}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.section>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          <div className="sticky bottom-0 z-20 grid grid-cols-2 border-t border-white/[.07] bg-[#171c24]/95 px-2 py-2 backdrop-blur-xl">
            <button
              type="button"
              className="rounded-md px-2 py-2 text-[11px] font-medium text-slate-400 outline-none transition hover:bg-white/[.05] hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-violet-500/70"
              onClick={() => {
                setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
                announce("Notifications marked as read");
              }}
            >
              Mark all as read
            </button>
            <button
              type="button"
              className="rounded-md px-2 py-2 text-[11px] font-medium text-slate-400 outline-none transition hover:bg-white/[.05] hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-violet-500/70"
              onClick={() => {
                setNotifications((items) => items.filter((item) => item.unread));
                announce("Read notifications cleared");
              }}
            >
              Clear read
            </button>
            <button
              type="button"
              className="col-span-2 rounded-md px-2 py-2 text-xs font-medium text-violet-400 outline-none transition hover:bg-violet-500/10 hover:text-violet-300 focus-visible:ring-2 focus-visible:ring-violet-500/70"
              onClick={() => announce("All notifications opened")}
            >
              View all notifications <span aria-hidden>→</span>
            </button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function NotificationCard({
  notification,
  onOpen,
  onRead,
  onArchive,
  onDelete,
  onMore,
}: {
  notification: Notification;
  onOpen: () => void;
  onRead: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onMore: () => void;
}) {
  const style = notificationStyles[notification.type];
  const Icon = style.icon;

  const action = (callback: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    callback();
  };

  return (
    <motion.div
      layout
      exit={{ height: 0, opacity: 0, marginBottom: 0, transition: { duration: 0.2 } }}
      data-notification-card
      role="button"
      tabIndex={0}
      className={cn(
        "notification-card group relative grid grid-cols-[36px_minmax(0,1fr)_auto] gap-3 overflow-hidden rounded-xl border p-3 outline-none",
        notification.unread
          ? "border-white/[.09] bg-white/[.055]"
          : "border-white/[.055] bg-white/[.018] opacity-70",
      )}
      style={{ borderLeftColor: notification.unread ? "rgb(139 92 246 / .9)" : undefined }}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen();
      }}
    >
      <div className={cn("flex size-9 items-center justify-center rounded-lg", style.surface)}>
        <Icon className={cn("size-[17px]", style.color)} />
      </div>
      <div className="min-w-0">
        <p className="text-xs leading-[1.4] text-slate-300">
          <span className="font-medium text-slate-100">{notification.title}</span>{" "}
          {notification.subject && <span className="font-semibold text-slate-200">{notification.subject}</span>}
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-[1.45] text-slate-500">{notification.description}</p>
        <p className="mt-1.5 text-[10px] text-slate-600">{notification.timestamp}</p>
        <div className="notification-actions mt-2 flex flex-wrap items-center gap-1">
          {notification.unread && <CardAction label="Mark as read" icon={Check} onClick={action(onRead)} />}
          <CardAction label="Archive" icon={Archive} onClick={action(onArchive)} />
          <CardAction label="Delete" icon={Trash2} onClick={action(onDelete)} danger />
          <CardAction label="More" icon={MoreHorizontal} onClick={action(onMore)} />
        </div>
      </div>
      <div className="flex h-5 items-center gap-1">
        {notification.unread && <span className="notification-unread-dot size-2 rounded-full bg-violet-400" aria-label="Unread" />}
        <button
          type="button"
          className="notification-more rounded p-1 text-slate-600 outline-none transition hover:bg-white/[.08] hover:text-slate-200 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-violet-500/70"
          aria-label="More actions"
          onClick={action(onMore)}
        >
          <MoreHorizontal className="size-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function CardAction({
  label,
  icon: Icon,
  onClick,
  danger,
}: {
  label: string;
  icon: LucideIcon;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-1 text-[9px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500/70",
        danger ? "text-rose-400 hover:bg-rose-500/10" : "text-slate-500 hover:bg-white/[.07] hover:text-slate-200",
      )}
      onClick={onClick}
    >
      <Icon className="size-3" />
      {label}
    </button>
  );
}

function NotificationSkeleton() {
  return (
    <div className="space-y-2 p-3" aria-label="Loading notifications" aria-busy="true">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="grid animate-pulse grid-cols-[36px_1fr] gap-3 rounded-xl border border-white/[.05] bg-white/[.02] p-3">
          <div className="size-9 rounded-lg bg-white/[.07]" />
          <div className="space-y-2">
            <div className="h-2.5 w-3/4 rounded bg-white/[.08]" />
            <div className="h-2 w-full rounded bg-white/[.05]" />
            <div className="h-2 w-20 rounded bg-white/[.04]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyNotifications({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="flex min-h-[390px] flex-col items-center justify-center px-8 text-center">
      <div className="relative mb-5 flex size-20 items-center justify-center rounded-full border border-violet-400/15 bg-violet-500/[.08]">
        <div className="absolute size-14 rounded-full border border-violet-400/10" />
        <Bell className="size-8 text-violet-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-slate-100">No notifications</h3>
      <p className="mt-2 max-w-[280px] text-xs leading-5 text-slate-500">
        When someone likes, comments or forks your prompts, they&apos;ll appear here.
      </p>
      <Button size="sm" className="mt-5" onClick={onExplore}>Explore Community</Button>
    </div>
  );
}
