import { ActivityItem } from "@/components/dashboard/activity-item";
import { HeroSection } from "@/components/dashboard/hero-section";
import { PromptCard } from "@/components/dashboard/prompt-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { TrendingCard } from "@/components/dashboard/trending-card";
import {
  activities,
  prompts,
  quickActions,
  statistics,
  trendingPrompts,
} from "@/data/mock-data";

export function HomePage({ onAction }: { onAction: (label: string) => void }) {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <HeroSection onAction={onAction} />

      <section>
        <SectionHeading title="Quick actions" />
        <div className="grid gap-3 md:grid-cols-3">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} action={action} onClick={() => onAction(`${action.title} opened`)} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Overview" eyebrow="This month" />
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {statistics.map((statistic) => <StatisticCard key={statistic.title} statistic={statistic} />)}
        </div>
      </section>

      <section>
        <SectionHeading title="Recent prompts" action="View all" onAction={() => onAction("All prompts opened")} />
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
          {prompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} onAction={onAction} />)}
        </div>
      </section>

      <div className="grid gap-8 2xl:grid-cols-[minmax(0,1fr)_350px]">
        <section className="min-w-0">
          <SectionHeading title="Trending" action="Explore all" onAction={() => onAction("Trending prompts opened")} />
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {trendingPrompts.map((prompt) => <TrendingCard key={prompt.rank} prompt={prompt} onAction={onAction} />)}
          </div>
        </section>

        <section>
          <SectionHeading title="Recent activity" action="View all" onAction={() => onAction("Activity opened")} />
          <div className="rounded-xl border border-white/[.07] bg-[#161b22] px-5 pb-1 pt-5">
            {activities.map((activity, index) => (
              <ActivityItem key={activity.id} activity={activity} isLast={index === activities.length - 1} />
            ))}
          </div>
        </section>
      </div>

      <footer className="flex flex-col items-center justify-between gap-2 border-t border-white/[.06] py-5 text-[11px] text-slate-700 sm:flex-row">
        <p>© 2026 PromptHub. Crafted for better prompting.</p>
        <div className="flex gap-5"><button className="hover:text-slate-500">Help</button><button className="hover:text-slate-500">Changelog</button><button className="hover:text-slate-500">Privacy</button></div>
      </footer>
    </div>
  );
}
