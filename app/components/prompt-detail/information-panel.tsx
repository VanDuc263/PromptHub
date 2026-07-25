import {
  Archive,
  Bot,
  CalendarDays,
  CopyPlus,
  Edit3,
  FolderPlus,
  Globe2,
  LockKeyhole,
  Tag,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { promptDetail, promptStats } from "@/data/prompt-detail-data";

export function InformationPanel({
  onEdit,
  onAction,
}: {
  onEdit: () => void;
  onAction: (label: string) => void;
}) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-[96px] xl:self-start">
      <Panel title="About">
        <dl className="space-y-3">
          <MetaRow icon={Tag} label="Category" value={promptDetail.category} />
          <MetaRow icon={Bot} label="AI model" value={promptDetail.model} />
          <MetaRow icon={Globe2} label="Language" value={promptDetail.language} />
          <MetaRow icon={LockKeyhole} label="Visibility" value={promptDetail.visibility} />
          <MetaRow icon={CalendarDays} label="Version" value={promptDetail.version} />
        </dl>
      </Panel>

      <Panel title="Tags">
        <div className="flex flex-wrap gap-1.5">{promptDetail.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
      </Panel>

      <Panel title="Statistics">
        <div className="grid grid-cols-2 gap-2">
          {promptStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-white/[.06] bg-white/[.025] p-3">
              <p className="text-lg font-semibold tracking-[-.03em] text-slate-200">{stat.value}</p>
              <p className="mt-1 text-[9px] text-slate-700">{stat.shortLabel}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="History">
        <div className="space-y-3 text-[11px] text-slate-500">
          <p className="flex items-start gap-2"><UserRound className="mt-0.5 size-3.5 shrink-0 text-slate-700" /><span>Created by <strong className="font-medium text-slate-300">{promptDetail.author}</strong></span></p>
          <p className="flex items-start gap-2"><CalendarDays className="mt-0.5 size-3.5 shrink-0 text-slate-700" /><span>{promptDetail.createdAt}<br />{promptDetail.updatedAt}</span></p>
        </div>
      </Panel>

      <Panel title="Quick actions">
        <div className="space-y-1">
          <QuickAction icon={Edit3} label="Edit prompt" onClick={onEdit} />
          <QuickAction icon={CopyPlus} label="Duplicate" onClick={() => onAction("Prompt duplicated")} />
          <QuickAction icon={FolderPlus} label="Add to collection" onClick={() => onAction("Collection picker opened")} />
          <QuickAction icon={Archive} label="Archive" onClick={() => onAction("Prompt archived")} />
        </div>
      </Panel>
    </aside>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/[.07] bg-[#161b22] p-4">
      <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-600">{title}</h2>
      {children}
    </section>
  );
}

function MetaRow({ icon: Icon, label, value }: { icon: typeof Tag; label: string; value: string }) {
  return (
    <div className="flex items-center text-[11px]">
      <Icon className="mr-2 size-3.5 text-slate-700" />
      <dt className="text-slate-600">{label}</dt>
      <dd className="ml-auto font-medium text-slate-300">{value}</dd>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: typeof Tag; label: string; onClick: () => void }) {
  return (
    <Button variant="ghost" className="h-9 w-full justify-start px-2.5 text-xs" onClick={onClick}>
      <Icon className="size-3.5" /> {label}
    </Button>
  );
}
