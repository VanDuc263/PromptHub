import {
  Bookmark,
  Clock3,
  FolderHeart,
  Heart,
  Medal,
  Tag,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  communityPrompts,
  exploreCategories,
  popularTags,
  suggestedCollections,
  topCreators,
} from "@/data/explore-data";
import { cn, formatCompact } from "@/lib/utils";

export function ExploreLeftSidebar({
  activeCategory,
  activeSort,
  onCategoryChange,
  onSortChange,
  onAction,
}: {
  activeCategory: string;
  activeSort: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onAction: (label: string) => void;
}) {
  const categories = ["All", "Trending", "Newest", ...exploreCategories.slice(1, 7), "Prompt Engineering"];

  return (
    <aside className="lg:sticky lg:top-[96px] lg:self-start">
      <h2 className="px-2 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-700">Quick categories</h2>
      <nav className="mt-3 flex gap-1 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => {
              if (category === "Trending" || category === "Newest") {
                onSortChange(category);
              } else {
                onCategoryChange(category);
              }
            }}
            className={cn(
              "flex h-9 shrink-0 items-center rounded-lg px-3 text-[11px] transition lg:w-full",
              (activeCategory === category &&
                (category !== "All" ||
                  (activeSort !== "Trending" && activeSort !== "Newest"))) ||
              ((category === "Trending" || category === "Newest") &&
                activeSort === category)
                ? "bg-emerald-500/[.08] font-medium text-emerald-300"
                : "text-slate-600 hover:bg-white/[.035] hover:text-slate-300",
            )}
          >
            <span>{category}</span>
            {category === "All" && <span className="ml-auto hidden text-[9px] text-slate-700 lg:inline">{communityPrompts.length}</span>}
          </button>
        ))}
      </nav>
      <div className="my-4 hidden h-px bg-white/[.06] lg:block" />
      <div className="hidden space-y-1 lg:block">
        <SideAction icon={Heart} label="Favorites" onClick={() => onAction("Community favorites opened")} />
        <SideAction icon={Bookmark} label="Bookmarks" onClick={() => onAction("Community bookmarks opened")} />
      </div>
    </aside>
  );
}

export function ExploreRightSidebar({
  onTag,
  onAction,
}: {
  onTag: (tag: string) => void;
  onAction: (label: string) => void;
}) {
  return (
    <aside className="grid gap-4 sm:grid-cols-2 xl:col-span-2 2xl:sticky 2xl:top-[96px] 2xl:col-span-1 2xl:block 2xl:self-start 2xl:space-y-4">
      <CommunityPanel icon={Medal} title="Top creators">
        <div className="space-y-3">
          {topCreators.slice(0, 3).map((creator, index) => (
            <button type="button" key={creator.name} onClick={() => onAction(`${creator.name}'s profile opened`)} className="flex w-full items-center text-left">
              <span className="mr-2 w-3 font-mono text-[9px] text-slate-700">{index + 1}</span>
              <Avatar initials={creator.initials} className={cn("size-7 text-[8px]", creator.tone)} />
              <span className="ml-2 min-w-0 flex-1">
                <span className="block truncate text-[10px] font-medium text-slate-300">{creator.name}</span>
                <span className="mt-0.5 block text-[8px] text-slate-700">{creator.prompts} prompts</span>
              </span>
              <span className="text-[9px] text-emerald-400">{formatCompact(creator.saves)} saves</span>
            </button>
          ))}
        </div>
      </CommunityPanel>

      <CommunityPanel icon={TrendingUp} title="Weekly leaderboard">
        <div className="space-y-2.5">
          {topCreators.map((creator, index) => (
            <div key={creator.name} className="flex items-center text-[10px]">
              <span className={cn("grid size-5 place-items-center rounded-md font-mono text-[8px]", index === 0 ? "bg-amber-500/10 text-amber-400" : "bg-white/[.03] text-slate-700")}>#{index + 1}</span>
              <span className="ml-2 text-slate-500">{creator.name}</span>
              <span className="ml-auto text-slate-700">+{formatCompact(creator.saves / 4)}</span>
            </div>
          ))}
        </div>
      </CommunityPanel>

      <CommunityPanel icon={Tag} title="Popular tags">
        <div className="flex flex-wrap gap-1.5">
          {popularTags.map((tag) => (
            <button type="button" key={tag} onClick={() => onTag(tag)} className="rounded-md border border-white/[.06] bg-white/[.025] px-2 py-1 text-[9px] text-slate-600 transition hover:border-emerald-500/20 hover:text-emerald-300">
              #{tag.replace(/\s+/g, "")}
            </button>
          ))}
        </div>
      </CommunityPanel>

      <CommunityPanel icon={Clock3} title="Recently viewed">
        <div className="space-y-3">
          {communityPrompts.slice(0, 2).map((prompt) => (
            <button type="button" key={prompt.id} onClick={() => onAction(`Opened ${prompt.title}`)} className="flex w-full gap-2.5 text-left">
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", prompt.accent)}><prompt.icon className="size-3.5" /></span>
              <span className="min-w-0">
                <span className="block truncate text-[10px] font-medium text-slate-300">{prompt.title}</span>
                <span className="mt-1 block text-[8px] text-slate-700">{prompt.author}</span>
              </span>
            </button>
          ))}
        </div>
      </CommunityPanel>

      <CommunityPanel icon={FolderHeart} title="Suggested collections" className="sm:col-span-2 2xl:col-span-1">
        <div className="space-y-2">
          {suggestedCollections.map((collection) => {
            const Icon = collection.icon;
            return (
              <button type="button" key={collection.title} onClick={() => onAction(`${collection.title} collection opened`)} className="flex w-full items-center rounded-lg border border-white/[.05] bg-white/[.02] p-2.5 text-left transition hover:border-white/[.1]">
                <Icon className="size-3.5 text-emerald-400" />
                <span className="ml-2 text-[10px] text-slate-400">{collection.title}</span>
                <span className="ml-auto text-[8px] text-slate-700">{collection.count}</span>
              </button>
            );
          })}
        </div>
      </CommunityPanel>
    </aside>
  );
}

function SideAction({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[11px] text-slate-600 transition hover:bg-white/[.035] hover:text-slate-300">
      <Icon className="size-3.5" /> {label}
    </button>
  );
}

function CommunityPanel({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-white/[.07] bg-[#161b22] p-4", className)}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-3.5 text-emerald-400" />
        <h2 className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-600">{title}</h2>
      </div>
      {children}
    </section>
  );
}
