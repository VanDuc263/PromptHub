import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Activity,
  Bookmark,
  CalendarDays,
  Clock3,
  Copy,
  Eye,
  FileClock,
  Filter,
  FolderMinus,
  FolderPlus,
  GitFork,
  History,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClearHistoryDialog, RemoveHistoryDialog } from "@/components/history/history-dialogs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { historySummary } from "@/data/history-data";
import { useHistory } from "@/hooks/use-history";
import { cn } from "@/lib/utils";
import type { HistoryActivityType, HistoryRecord } from "@/types";

const quickFilters = ["All Activity", "Viewed", "Copied", "Run", "Created", "Edited", "Forked", "Saved", "Collections", "Deleted"];
const dateRanges = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Last 90 Days", "Custom Range"];
const summaryIcons = [Eye, Copy, Play, Activity];
const activityIcons: Record<HistoryActivityType, { icon: LucideIcon; tone: string }> = {
  Viewed: { icon: Eye, tone: "bg-violet-500/10 text-violet-300" },
  Copied: { icon: Copy, tone: "bg-violet-500/10 text-violet-300" },
  Run: { icon: Play, tone: "bg-violet-500/10 text-violet-300" },
  Created: { icon: Plus, tone: "bg-emerald-500/10 text-emerald-300" },
  Edited: { icon: Pencil, tone: "bg-violet-500/10 text-violet-300" },
  "Created Version": { icon: History, tone: "bg-emerald-500/10 text-emerald-300" },
  Forked: { icon: GitFork, tone: "bg-violet-500/10 text-violet-300" },
  Saved: { icon: Bookmark, tone: "bg-violet-500/10 text-violet-300" },
  "Removed from Saved": { icon: Bookmark, tone: "bg-rose-500/10 text-rose-300" },
  "Added to Collection": { icon: FolderPlus, tone: "bg-emerald-500/10 text-emerald-300" },
  "Removed from Collection": { icon: FolderMinus, tone: "bg-rose-500/10 text-rose-300" },
  "Created Collection": { icon: FolderPlus, tone: "bg-emerald-500/10 text-emerald-300" },
  "Updated Collection": { icon: Pencil, tone: "bg-violet-500/10 text-violet-300" },
  Deleted: { icon: Trash2, tone: "bg-rose-500/10 text-rose-300" },
  Restored: { icon: RotateCcw, tone: "bg-emerald-500/10 text-emerald-300" },
};

export function HistoryPage({ onExplore, onDashboard, onAction }: { onExplore: () => void; onDashboard: () => void; onAction: (label: string) => void }) {
  const { records, removeRecord, clearRecords } = useHistory();
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("search") ?? "");
  const [quickFilter, setQuickFilter] = useState(() => routeTypeToFilter(new URLSearchParams(window.location.search).get("type")));
  const [dateRange, setDateRange] = useState(() => routeRangeToLabel(new URLSearchParams(window.location.search).get("range")));
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advanced, setAdvanced] = useState({ activity: "All activity types", content: "All content", source: "All sources", date: "Any date" });
  const [draftAdvanced, setDraftAdvanced] = useState(advanced);
  const [hideViewed, setHideViewed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [clearOpen, setClearOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const timeout = window.setTimeout(() => setLoading(false), 550); return () => window.clearTimeout(timeout); }, []);
  useEffect(() => { const focus = () => searchRef.current?.focus(); window.addEventListener("prompthub:focus-history-search", focus); return () => window.removeEventListener("prompthub:focus-history-search", focus); }, []);
  useEffect(() => {
    const params = new URLSearchParams();
    if (quickFilter !== "All Activity") params.set("type", quickFilter.toLowerCase());
    if (dateRange !== "Last 30 Days") params.set("range", dateLabelToRoute(dateRange));
    if (query) params.set("search", query);
    window.history.replaceState({}, "", `/history${params.size ? `?${params}` : ""}`);
  }, [dateRange, query, quickFilter]);

  const filtered = useMemo(() => records.filter((record) => {
    const haystack = `${record.description} ${record.title} ${record.author ?? ""} ${record.type} ${record.category ?? ""} ${record.model ?? ""} ${record.collection ?? ""}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (!matchesQuickFilter(record, quickFilter)) return false;
    if (advanced.activity !== "All activity types" && record.type !== advanced.activity.replace(" Prompt", "")) return false;
    if (advanced.content !== "All content" && record.contentType !== advanced.content) return false;
    if (advanced.source !== "All sources" && record.source !== advanced.source) return false;
    return matchesDate(record, dateRange);
  }), [advanced, dateRange, query, quickFilter, records]);

  const groups = ["Today", "Yesterday", "This Week", "Earlier"] as const;
  const activeRecords = filtered.slice(0, visibleCount);
  const clearFilters = () => { setQuery(""); setQuickFilter("All Activity"); setDateRange("Last 30 Days"); const reset = { activity: "All activity types", content: "All content", source: "All sources", date: "Any date" }; setAdvanced(reset); setDraftAdvanced(reset); };

  if (loadError) return <HistoryError onRetry={() => { setLoadError(false); setLoading(true); window.setTimeout(() => setLoading(false), 500); }} onDashboard={onDashboard} />;

  return <>
    <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      {loading ? <HeaderSkeleton /> : <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-violet-400">Personal activity</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">History</h1><p className="mt-2 text-sm text-slate-500">Review your recent activity across prompts, collections, and the community.</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="relative min-w-0 sm:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-700" /><input ref={searchRef} value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(8); }} placeholder="Search your activity history..." className="form-input pl-9" /></label><Button variant="secondary" onClick={() => setAdvancedOpen((open) => !open)}><Filter className="size-4" /> Filter</Button><label className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" /><select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="form-input min-w-40 pl-9">{dateRanges.map((range) => <option key={range}>{range}</option>)}</select></label><Button variant="ghost" className="text-rose-400 hover:text-rose-300" onClick={() => setClearOpen(true)}><Trash2 className="size-4" /> Clear History</Button></div></header>}

      {advancedOpen && <AdvancedFilters value={draftAdvanced} onChange={setDraftAdvanced} onReset={() => setDraftAdvanced({ activity: "All activity types", content: "All content", source: "All sources", date: "Any date" })} onApply={() => { setAdvanced(draftAdvanced); setAdvancedOpen(false); setVisibleCount(8); }} onClose={() => setAdvancedOpen(false)} />}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{loading ? Array.from({ length: 4 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl border border-white/[.06] bg-[#161b22]" />) : historySummary.map((stat, index) => { const Icon = summaryIcons[index]; return <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }} className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[.12em] text-slate-600">{stat.label}</p><Icon className="size-4 text-violet-400" /></div><div className="mt-3 flex items-end justify-between"><p className="text-xl font-semibold text-slate-100">{stat.value}</p><span className="text-[9px] text-emerald-400">{stat.change}</span></div></motion.div>; })}</div>

      <div className="sticky top-[72px] z-20 -mx-4 mt-5 border-y border-white/[.06] bg-[#0d1117]/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 xl:-mx-8 xl:px-8"><div className="flex gap-1.5 overflow-x-auto pb-1">{quickFilters.map((filter) => <button type="button" key={filter} onClick={() => { setQuickFilter(filter); setVisibleCount(8); }} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-[10px] outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500/60", quickFilter === filter ? "border-violet-500/30 bg-violet-500/10 text-violet-300" : "border-white/[.07] text-slate-600 hover:text-slate-300")}>{filter}</button>)}</div></div>

      {!hideViewed && quickFilter === "All Activity" && !query && <RecentlyViewed onHide={() => setHideViewed(true)} onAction={onAction} loading={loading} />}

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
        <main className="min-w-0">
          {loading ? <TimelineSkeleton /> : !records.length ? <EmptyState icon={Clock3} title="No activity yet" subtitle="Your viewed, copied, run, and saved prompts will appear here." action="Explore Prompts" onAction={onExplore} /> : !filtered.length ? <EmptyState icon={Search} title={quickFilter === "Run" ? "No prompt runs yet" : "No matching activity"} subtitle={quickFilter === "Run" ? "Run a prompt to see its execution history here." : "Try changing your search, filters, or date range."} action={quickFilter === "Run" ? "Open My Prompts" : "Clear Filters"} onAction={quickFilter === "Run" ? onDashboard : clearFilters} /> : <>
            <motion.div layout className="space-y-7">{groups.map((group) => { const groupRecords = activeRecords.filter((record) => record.group === group); if (!groupRecords.length) return null; return <section key={group}><h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-600">{group}</h2><div className="rounded-2xl border border-white/[.07] bg-[#161b22] px-3 sm:px-5">{groupRecords.map((record, index) => <HistoryRow key={record.id} record={record} last={index === groupRecords.length - 1} query={query} onRemove={() => setRemoveTarget(record.id)} onAction={onAction} />)}</div></section>; })}</motion.div>
            <div className="mt-6 flex flex-col items-center gap-3"><p className="text-[10px] text-slate-700">Showing 1–{Math.min(visibleCount, filtered.length)} of 286 activities</p>{visibleCount < filtered.length && <Button variant="secondary" onClick={() => setVisibleCount((count) => count + 8)}>Load More</Button>}</div>
          </>}
        </main>
        <HistorySidebar onFilter={(filter) => setQuickFilter(filter)} onAction={onAction} />
      </div>
    </div>
    <RemoveHistoryDialog open={Boolean(removeTarget)} onOpenChange={(open) => !open && setRemoveTarget(null)} onConfirm={() => { if (removeTarget) removeRecord(removeTarget); setRemoveTarget(null); onAction("Activity removed from history"); }} />
    <ClearHistoryDialog key={clearOpen ? "open" : "closed"} open={clearOpen} onOpenChange={setClearOpen} onConfirm={(mode) => { clearRecords(mode); setClearOpen(false); onAction("Activity history cleared"); }} />
  </>;
}

function HistoryRow({ record, last, query, onRemove, onAction }: { record: HistoryRecord; last: boolean; query: string; onRemove: () => void; onAction: (label: string) => void }) {
  const config = activityIcons[record.type];
  const Icon = config.icon;
  return <motion.article layout initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="group relative flex gap-3 py-4 sm:gap-4">
    {!last && <span className="absolute bottom-0 left-[17px] top-11 w-px bg-white/[.07] sm:left-[19px]" />}
    <span className={cn("relative grid size-9 shrink-0 place-items-center rounded-full sm:size-10", config.tone)}><Icon className="size-4" /></span>
    <div className="min-w-0 flex-1">
      <p className="text-xs leading-5 text-slate-400"><Highlighted text={record.description} query={query} /></p>
      <button type="button" onClick={() => onAction(`Opened ${record.title}`)} className="mt-1 truncate text-left text-xs font-medium text-violet-300 outline-none transition hover:text-violet-200 focus-visible:ring-2 focus-visible:ring-violet-500/60">{record.title}</button>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-slate-700"><span>From {record.source}</span><span>{record.timestamp}</span>{record.collection && <span>{record.collection}</span>}{record.metadata && <span className="hidden sm:inline">{record.metadata}</span>}</div>
      {record.run && <div className="mt-3 grid gap-2 rounded-xl border border-white/[.06] bg-[#0d1117] p-3 text-[9px] sm:grid-cols-5"><RunMeta label="Model" value={record.model ?? "GPT-5"} /><RunMeta label="Version" value={record.version ?? "v1"} /><RunMeta label="Status" value={record.run.status} positive={record.run.status === "Completed"} /><RunMeta label="Tokens" value={record.run.tokens.toLocaleString()} /><RunMeta label="Runtime" value={record.run.runtime} /><p className="col-span-full text-slate-700">Variables: {record.run.variables}</p></div>}
      {record.type === "Deleted" && <p className={cn("mt-2 text-[10px]", record.permanentlyDeleted ? "text-slate-700" : "text-amber-400")}>{record.permanentlyDeleted ? "No longer available" : `Available in Trash for ${record.trashDays} more days`}</p>}
    </div>
    <div className="flex shrink-0 items-start gap-1"><Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => onAction(`Opened ${record.title}`)}>{record.type === "Run" ? "View Result" : record.type === "Deleted" && !record.permanentlyDeleted ? "Restore" : "Open"}</Button><HistoryMenu record={record} onRemove={onRemove} onAction={onAction} /></div>
  </motion.article>;
}

function HistoryMenu({ record, onRemove, onAction }: { record: HistoryRecord; onRemove: () => void; onAction: (label: string) => void }) {
  return <DropdownMenu.Root><DropdownMenu.Trigger asChild><Button variant="icon" size="icon" className="size-8" aria-label={`Actions for ${record.title}`}><MoreHorizontal className="size-4" /></Button></DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content align="end" className="dropdown-content w-48 p-1.5"><DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Opened ${record.title}`)}><Eye /> Open {record.contentType}</DropdownMenu.Item>{record.type === "Copied" && <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`${record.title} copied again`)}><Copy /> Copy Again</DropdownMenu.Item>}{record.type === "Run" && <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Ran ${record.title} again`)}><Play /> Run Again</DropdownMenu.Item>}{!["Saved", "Removed from Saved", "Deleted"].includes(record.type) && <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Saved ${record.title}`)}><Bookmark /> Save</DropdownMenu.Item>}{record.type !== "Deleted" && <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Add ${record.title} to collection`)}><FolderPlus /> Add to Collection</DropdownMenu.Item>}{record.type === "Deleted" && !record.permanentlyDeleted && <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Restored ${record.title}`)}><RotateCcw /> Restore</DropdownMenu.Item>}<DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" /><DropdownMenu.Item className="dropdown-item text-rose-400" onSelect={onRemove}><X /> Remove from History</DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>;
}

function AdvancedFilters({ value, onChange, onReset, onApply, onClose }: { value: { activity: string; content: string; source: string; date: string }; onChange: (value: { activity: string; content: string; source: string; date: string }) => void; onReset: () => void; onApply: () => void; onClose: () => void }) {
  const activityTypes = ["All activity types", "Viewed Prompt", "Copied Prompt", "Ran Prompt", "Created Prompt", "Edited Prompt", "Created Version", "Forked Prompt", "Saved Prompt", "Removed from Saved", "Added to Collection", "Removed from Collection", "Created Collection", "Updated Collection", "Deleted Prompt", "Restored Prompt"];
  return <motion.section initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-white/[.1] bg-[#161b22] p-4 shadow-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-8 sm:top-[150px] sm:w-[620px]"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-200">Advanced Filters</h2><Button variant="icon" size="icon" className="size-8" onClick={onClose}><X className="size-4" /></Button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><FilterSelect label="Activity Type" value={value.activity} options={activityTypes} onChange={(activity) => onChange({ ...value, activity })} /><FilterSelect label="Content Type" value={value.content} options={["All content", "Prompt", "Collection", "Profile", "Community Prompt"]} onChange={(content) => onChange({ ...value, content })} /><FilterSelect label="Source" value={value.source} options={["All sources", "My Prompts", "Explore", "Saved", "Collections", "Public Prompt Detail", "User Profile"]} onChange={(source) => onChange({ ...value, source })} /><FilterSelect label="Date" value={value.date} options={["Any date", "Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Custom Range"]} onChange={(date) => onChange({ ...value, date })} /></div><div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={onReset}>Reset</Button><Button className="bg-violet-500 hover:bg-violet-400" onClick={onApply}>Apply Filters</Button></div></motion.section>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label><span className="mb-2 block text-[9px] uppercase tracking-wider text-slate-700">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="form-input">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }

const recentCards = [
  ["Spring Boot REST API Generator", "Programming", "Đức Nguyễn", "12 min ago"],
  ["Senior Java Code Reviewer", "Code Review", "Minh Trần", "1 hour ago"],
  ["Database Schema Optimizer", "Programming", "Van Duc", "3 hours ago"],
  ["Backend Interview Coach", "Interview", "Huy Vũ", "Yesterday"],
  ["Microservice Architecture Planner", "Architecture", "An Phạm", "Yesterday"],
];

function RecentlyViewed({ onHide, onAction, loading }: { onHide: () => void; onAction: (label: string) => void; loading: boolean }) {
  return <section className="mt-6"><div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-slate-300">Recently Viewed</h2><p className="mt-1 text-[10px] text-slate-700">Jump back into your latest prompts.</p></div><Button variant="ghost" size="sm" onClick={onHide}>Hide</Button></div><div className="flex gap-3 overflow-x-auto pb-2">{loading ? Array.from({ length: 5 }, (_, index) => <div key={index} className="h-28 min-w-56 animate-pulse rounded-xl border border-white/[.06] bg-[#161b22]" />) : recentCards.map(([title, category, author, time]) => <article key={title} className="min-w-56 rounded-xl border border-white/[.07] bg-[#161b22] p-3 transition hover:-translate-y-0.5 hover:border-violet-500/20"><Badge className="py-0.5 text-[8px]">{category}</Badge><h3 className="mt-2 truncate text-xs font-medium text-slate-300">{title}</h3><p className="mt-1 text-[9px] text-slate-700">{author} · {time}</p><Button variant="ghost" size="sm" className="mt-2" onClick={() => onAction(`Opened ${title}`)}>Open</Button></article>)}</div></section>;
}

function HistorySidebar({ onFilter, onAction }: { onFilter: (filter: string) => void; onAction: (label: string) => void }) {
  return <aside className="space-y-3"><SideCard title="Activity Summary"><Summary label="Most viewed category" value="Programming" /><Summary label="Most used model" value="GPT-5" /><Summary label="Most copied prompt" value="Spring Boot API Generator" /><Summary label="Most active day" value="Saturday" /></SideCard><SideCard title="Quick Links">{[["Recently Viewed", "Viewed"], ["Run History", "Run"], ["Saved Prompts", "Saved"], ["Trash", "Deleted"], ["History Settings", "Settings"]].map(([label, target]) => <button type="button" key={label} onClick={() => target === "Settings" ? onAction("History settings opened") : onFilter(target)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[11px] text-slate-600 transition hover:bg-white/[.04] hover:text-violet-300"><ChevronLinkIcon target={target} />{label}</button>)}</SideCard><section className="rounded-2xl border border-violet-500/15 bg-violet-500/[.035] p-4"><ShieldCheck className="size-5 text-violet-400" /><h2 className="mt-3 text-xs font-semibold text-slate-300">History Privacy</h2><p className="mt-2 text-[11px] leading-5 text-slate-600">Your activity history is visible only to you.</p><Button variant="ghost" size="sm" className="mt-2 px-0 text-violet-300" onClick={() => onAction("History settings opened")}>Manage History Settings</Button></section></aside>;
}

function ChevronLinkIcon({ target }: { target: string }) { if (target === "Viewed") return <Eye className="size-3.5" />; if (target === "Run") return <Play className="size-3.5" />; if (target === "Saved") return <Bookmark className="size-3.5" />; if (target === "Deleted") return <Trash2 className="size-3.5" />; return <Settings className="size-3.5" />; }
function SideCard({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4"><h2 className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-500">{title}</h2><div className="mt-3">{children}</div></section>; }
function Summary({ label, value }: { label: string; value: string }) { return <div className="border-b border-white/[.05] py-2 last:border-0"><p className="text-[9px] text-slate-700">{label}</p><p className="mt-1 text-[11px] text-slate-400">{value}</p></div>; }
function RunMeta({ label, value, positive }: { label: string; value: string; positive?: boolean }) { return <div><p className="text-slate-800">{label}</p><p className={cn("mt-1 text-slate-500", positive && "text-emerald-400")}>{value}</p></div>; }

function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "gi"));
  return <>{parts.map((part, index) => part.toLowerCase() === query.toLowerCase() ? <mark key={`${part}-${index}`} className="rounded bg-violet-500/25 text-violet-200">{part}</mark> : part)}</>;
}
function escapeRegex(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function matchesQuickFilter(record: HistoryRecord, filter: string) { if (filter === "All Activity") return true; if (filter === "Collections") return record.type.includes("Collection"); if (filter === "Created") return record.type.startsWith("Created"); if (filter === "Deleted") return record.type === "Deleted"; return record.type === filter; }
function matchesDate(record: HistoryRecord, range: string) { const age = Date.now() - record.createdAt; const day = 24 * 60 * 60 * 1000; if (range === "Today") return record.group === "Today"; if (range === "Yesterday") return record.group === "Yesterday"; if (range === "Last 7 Days") return age <= 7 * day; if (range === "Last 30 Days") return age <= 30 * day; if (range === "Last 90 Days") return age <= 90 * day; return true; }
function routeTypeToFilter(type: string | null) { const match = quickFilters.find((filter) => filter.toLowerCase() === type); return match ?? "All Activity"; }
function routeRangeToLabel(range: string | null) { return ({ today: "Today", yesterday: "Yesterday", "7d": "Last 7 Days", "30d": "Last 30 Days", "90d": "Last 90 Days" } as Record<string, string>)[range ?? ""] ?? "Last 30 Days"; }
function dateLabelToRoute(label: string) { return ({ Today: "today", Yesterday: "yesterday", "Last 7 Days": "7d", "Last 30 Days": "30d", "Last 90 Days": "90d", "Custom Range": "custom" } as Record<string, string>)[label] ?? "30d"; }

function EmptyState({ icon: Icon, title, subtitle, action, onAction }: { icon: LucideIcon; title: string; subtitle: string; action: string; onAction: () => void }) { return <div className="rounded-2xl border border-dashed border-white/[.08] px-6 py-20 text-center"><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-violet-500/[.05]"><Icon className="size-7 text-violet-400/60" /></div><h2 className="mt-5 text-base font-semibold text-slate-200">{title}</h2><p className="mt-2 text-sm text-slate-600">{subtitle}</p><Button className="mt-6 bg-violet-500 hover:bg-violet-400" onClick={onAction}>{action}</Button></div>; }
function HistoryError({ onRetry, onDashboard }: { onRetry: () => void; onDashboard: () => void }) { return <div className="mx-auto max-w-[1000px] px-4 py-24 text-center"><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-500/[.07]"><FileClock className="size-7 text-rose-400" /></div><h1 className="mt-5 text-xl font-semibold text-slate-200">Unable to load history</h1><p className="mt-2 text-sm text-slate-600">Something went wrong while loading your activity.</p><div className="mt-6 flex justify-center gap-2"><Button onClick={onRetry}>Retry</Button><Button variant="secondary" onClick={onDashboard}>Go to Dashboard</Button></div></div>; }
function HeaderSkeleton() { return <div className="animate-pulse"><div className="h-8 w-36 rounded bg-white/[.05]" /><div className="mt-3 h-3 w-96 max-w-full rounded bg-white/[.035]" /></div>; }
function TimelineSkeleton() { return <div className="space-y-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl border border-white/[.06] bg-[#161b22]" />)}</div>; }
