import {
  Activity,
  BarChart3,
  BookOpenText,
  CheckCircle2,
  Clock3,
  Eye,
  GitCompareArrows,
  GitBranchPlus,
  Info,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { promptActivities, promptStats, promptVersions } from "@/data/prompt-detail-data";
import { cn } from "@/lib/utils";
import { TemplateCard } from "@/components/prompt-detail/template-card";
import { UsePromptWorkspace } from "@/components/prompt-detail/use-prompt-workspace";
import { PromptComments, PromptReviews } from "@/components/prompt-detail/prompt-feedback-sections";

const tabs = [
  { id: "overview", label: "Overview", icon: BookOpenText },
  { id: "versions", label: "Versions", icon: Clock3 },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

export type DetailTabId = (typeof tabs)[number]["id"];

export function DetailTabs({
  activeTab,
  onTabChange,
  onAction,
  onCreateVersion,
  onCompareVersion,
  newVersionCreated,
  promptId,
}: {
  activeTab: DetailTabId;
  onTabChange: (tab: DetailTabId) => void;
  onAction: (label: string) => void;
  onCreateVersion: () => void;
  onCompareVersion: (version: string) => void;
  newVersionCreated: boolean;
  promptId: string | null;
}) {
  return (
    <section>
      <div className="overflow-x-auto border-b border-white/[.07]">
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative inline-flex h-11 items-center gap-2 px-3 text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500/60",
                  activeTab === tab.id ? "text-violet-300" : "text-slate-600 hover:text-slate-300",
                )}
              >
                <Icon className="size-3.5" /> {tab.label}
                {activeTab === tab.id && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t bg-violet-400" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <TemplateCard />
            <UsePromptWorkspace onAction={onAction} />
            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard title="Usage instructions">
                Add the complete class or method you want reviewed. Include relevant interfaces and dependencies when context affects behavior. Select the output format that best fits your workflow.
              </InfoCard>
              <InfoCard title="Notes">
                Optimized for Java 17+ and Spring Boot projects. Recommendations prioritize correctness and maintainability before stylistic preferences.
              </InfoCard>
            </div>
            {promptId && <PromptComments promptId={promptId} readOnly />}
            {promptId && <PromptReviews promptId={promptId} />}
          </div>
        )}
        {activeTab === "versions" && (
          <VersionsTab
            onAction={onAction}
            onCreateVersion={onCreateVersion}
            onCompareVersion={onCompareVersion}
            newVersionCreated={newVersionCreated}
          />
        )}
        {activeTab === "activity" && <ActivityTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </section>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-xl border border-white/[.07] bg-[#161b22] p-5">
      <div className="flex items-center gap-2"><Info className="size-4 text-violet-400" /><h3 className="text-xs font-semibold text-slate-200">{title}</h3></div>
      <p className="mt-3 text-xs leading-6 text-slate-500">{children}</p>
    </article>
  );
}

function VersionsTab({
  onAction,
  onCreateVersion,
  onCompareVersion,
  newVersionCreated,
}: {
  onAction: (label: string) => void;
  onCreateVersion: () => void;
  onCompareVersion: (version: string) => void;
  newVersionCreated: boolean;
}) {
  const versions = newVersionCreated
    ? [
        {
          version: "v5",
          note: "Improve reasoning quality",
          author: "Đức Nguyễn",
          createdAt: "Just now",
          current: true,
        },
        ...promptVersions.map((version) => ({ ...version, current: false })),
      ]
    : promptVersions;

  return (
    <div className="rounded-xl border border-white/[.07] bg-[#161b22] p-5">
      <div className="mb-5 flex items-center justify-between border-b border-white/[.06] pb-4">
        <div>
          <h2 className="text-xs font-semibold text-slate-200">Version history</h2>
          <p className="mt-1 text-[9px] text-slate-700">Immutable snapshots of this prompt</p>
        </div>
        <Button
          size="sm"
          onClick={onCreateVersion}
          className="bg-emerald-500 text-[#07120b] shadow-[0_8px_20px_rgba(34,197,94,.14)] hover:bg-emerald-400"
        >
          <GitBranchPlus className="size-3.5" /> Create version
        </Button>
      </div>
      {versions.map((version, index) => (
        <div
          key={version.version}
          className={cn(
            "relative -mx-2 flex gap-4 rounded-lg px-2 pb-6 last:pb-2",
            newVersionCreated && index === 0 && "mb-3 bg-emerald-500/[.045] pt-2 ring-1 ring-emerald-500/15",
          )}
        >
          {index < versions.length - 1 && <span className="absolute bottom-0 left-[23px] top-8 w-px bg-white/[.07]" />}
          <span className={cn("relative grid size-8 shrink-0 place-items-center rounded-full border text-[10px] font-semibold", version.current ? "border-violet-500/35 bg-violet-500/10 text-violet-300" : "border-white/[.08] bg-[#0d1117] text-slate-600")}>
            {version.current ? <CheckCircle2 className="size-3.5" /> : version.version}
          </span>
          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-xs font-medium text-slate-200">{version.version}</h3>
                {version.current && <Badge className="border-violet-500/20 bg-violet-500/[.08] py-0.5 text-violet-300">Current</Badge>}
              </div>
              <p className="mt-1.5 text-xs text-slate-400">{version.note}</p>
              <p className="mt-1 text-[10px] text-slate-700">{version.author} · {version.createdAt}</p>
            </div>
            <div className="mt-3 flex gap-1 sm:mt-0">
              <Button variant="ghost" size="sm" onClick={() => onAction(`${version.version} opened`)}><Eye className="size-3.5" /> View</Button>
              <Button variant="ghost" size="sm" onClick={() => onCompareVersion(version.version)}><GitCompareArrows className="size-3.5" /> Compare</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityTab() {
  return (
    <div className="rounded-xl border border-white/[.07] bg-[#161b22] p-5">
      {promptActivities.map((activity, index) => (
        <div key={activity.id} className="relative flex gap-3.5 pb-6 last:pb-0">
          {index < promptActivities.length - 1 && <span className="absolute bottom-0 left-[15px] top-8 w-px bg-white/[.07]" />}
          <Avatar initials={activity.initials} className={cn("size-8 text-[9px]", activity.tone)} />
          <div>
            <p className="text-xs leading-5 text-slate-400"><strong className="font-medium text-slate-200">{activity.actor}</strong> {activity.action}</p>
            <p className="mt-1 text-[10px] text-slate-700">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {promptStats.map((stat) => (
        <article key={stat.label} className="rounded-xl border border-white/[.07] bg-[#161b22] p-5">
          <p className="text-[11px] text-slate-600">{stat.label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-[-.03em] text-slate-100">{stat.value}</p>
          <p className="mt-2 text-[10px] text-emerald-400">Active this month</p>
        </article>
      ))}
    </div>
  );
}
