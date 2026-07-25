import {
  ArrowLeft,
  Check,
  CircleDot,
  FilePlus2,
  GitCommitHorizontal,
  LockKeyhole,
  Pencil,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChangeSummaryCard, VariableChangesCard } from "@/components/versions/change-summary-card";
import { CreateVersionDialog } from "@/components/versions/create-version-dialog";
import { CurrentVersionCard } from "@/components/versions/current-version-card";
import { VersionPreview } from "@/components/versions/version-preview";
import { Button } from "@/components/ui/button";
import { compatibleModels, versionDraftContent } from "@/data/create-version-data";
import { cn } from "@/lib/utils";

const descriptionExamples = [
  "Added better system prompt",
  "Optimized output format",
  "Improved variable handling",
  "Fixed hallucination issue",
];

export function CreateVersionPage({
  onBack,
  onGoToEditor,
  onSuccess,
}: {
  onBack: () => void;
  onGoToEditor: () => void;
  onSuccess: (version: string) => void;
}) {
  const [commitMessage, setCommitMessage] = useState("");
  const [description, setDescription] = useState("");
  const [customVersion, setCustomVersion] = useState(false);
  const [version, setVersion] = useState("v5");
  const [models, setModels] = useState(compatibleModels);
  const [visibility, setVisibility] = useState("Private");
  const [previewLoading, setPreviewLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const isPromptEmpty = !versionDraftContent.trim();
  const hasChanges = versionDraftContent.length !== 0;

  useEffect(() => {
    const timeout = window.setTimeout(() => setPreviewLoading(false), 650);
    return () => window.clearTimeout(timeout);
  }, []);

  const createVersion = () => {
    setCreating(true);
    window.setTimeout(() => {
      setCreating(false);
      setConfirmOpen(false);
      onSuccess(version);
    }, 950);
  };

  if (isPromptEmpty) {
    return <EmptyVersionState onBack={onBack} onGoToEditor={onGoToEditor} />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 xl:px-8"
      >
        <header className="flex flex-col gap-4 border-b border-white/[.07] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="icon" size="icon" onClick={onBack} aria-label="Back to Version History"><ArrowLeft className="size-[18px]" /></Button>
            <div>
              <h1 className="text-xl font-semibold tracking-[-.025em] text-slate-50 sm:text-2xl">Create New Version</h1>
              <p className="mt-1.5 text-xs text-slate-600">Save the current state of your prompt as a reusable version.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1 sm:flex-none" onClick={onBack}>Cancel</Button>
            <Button
              className="flex-1 bg-emerald-500 text-[#07120b] shadow-[0_8px_24px_rgba(34,197,94,.18)] hover:bg-emerald-400 sm:flex-none"
              onClick={() => setConfirmOpen(true)}
            >
              <GitCommitHorizontal className="size-4" /> Create version
            </Button>
          </div>
        </header>

        <div className="mt-6 grid min-w-0 gap-5 xl:grid-cols-[minmax(340px,.72fr)_minmax(520px,1.28fr)]">
          <div className="min-w-0 space-y-5">
            <CurrentVersionCard />

            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.03 }}
              className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold text-slate-200">New version</h2>
                  <p className="mt-1 text-[9px] text-slate-700">Next number suggested automatically</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomVersion((value) => !value)}
                  className="inline-flex items-center gap-1.5 text-[10px] text-slate-600 transition hover:text-emerald-400"
                >
                  {customVersion ? <X className="size-3" /> : <Pencil className="size-3" />}
                  {customVersion ? "Use suggested" : "Customize"}
                </button>
              </div>
              <div className="mt-4 flex h-12 items-center rounded-lg border border-white/[.08] bg-[#0d1117] px-3.5">
                <GitCommitHorizontal className="size-4 text-emerald-400" />
                {customVersion ? (
                  <input
                    autoFocus
                    value={version}
                    onChange={(event) => setVersion(event.target.value)}
                    className="ml-3 min-w-0 flex-1 bg-transparent font-mono text-lg font-semibold text-slate-100 outline-none"
                    aria-label="Custom version number"
                  />
                ) : (
                  <span className="ml-3 font-mono text-lg font-semibold text-slate-100">{version}</span>
                )}
                {!customVersion && <span className="ml-auto inline-flex items-center gap-1 text-[9px] text-emerald-400"><Check className="size-3" /> Suggested</span>}
              </div>

              <div className="mt-5">
                <label htmlFor="commit-message" className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                  Commit message
                  <span className={cn("font-mono text-[9px]", commitMessage.length >= 75 ? "text-amber-400" : "text-slate-700")}>{commitMessage.length}/80</span>
                </label>
                <input
                  id="commit-message"
                  maxLength={80}
                  value={commitMessage}
                  onChange={(event) => setCommitMessage(event.target.value)}
                  placeholder="Improve reasoning quality"
                  className="mt-2 h-11 w-full rounded-lg border border-white/[.08] bg-[#0d1117] px-3.5 text-xs text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div className="mt-5">
                <label htmlFor="version-description" className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                  Description <span className="font-normal text-slate-700">Markdown supported</span>
                </label>
                <textarea
                  id="version-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={7}
                  placeholder="Describe what changed in this version..."
                  className="mt-2 w-full resize-none rounded-lg border border-white/[.08] bg-[#0d1117] px-3.5 py-3 text-xs leading-5 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                />
                {!description && (
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {descriptionExamples.map((example) => (
                      <button type="button" key={example} onClick={() => setDescription(`- ${example}`)} className="text-[9px] text-slate-700 transition hover:text-slate-400">+ {example}</button>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>

            <PreferencesCard
              models={models}
              visibility={visibility}
              onToggleModel={(model) => setModels((current) => current.includes(model) ? current.filter((item) => item !== model) : [...current, model])}
              onVisibilityChange={setVisibility}
            />
          </div>

          <div className="min-w-0 space-y-5">
            {!hasChanges && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-amber-500/20 bg-amber-500/[.06] p-4">
                <div className="flex gap-3">
                  <TriangleAlert className="size-[18px] shrink-0 text-amber-400" />
                  <div>
                    <p className="text-xs font-medium text-amber-300">No differences were found compared with Version v4.</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="ghost" size="sm" onClick={onBack}>Cancel</Button>
                      <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(true)}>Create anyway</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <ChangeSummaryCard />
            <VersionPreview loading={previewLoading} />
            <VariableChangesCard />
          </div>
        </div>
      </motion.div>

      <CreateVersionDialog
        open={confirmOpen}
        version={version}
        loading={creating}
        onOpenChange={setConfirmOpen}
        onConfirm={createVersion}
      />
    </>
  );
}

function PreferencesCard({
  models,
  visibility,
  onToggleModel,
  onVisibilityChange,
}: {
  models: string[];
  visibility: string;
  onToggleModel: (model: string) => void;
  onVisibilityChange: (visibility: string) => void;
}) {
  const visibilityOptions = [
    { label: "Private", icon: LockKeyhole },
    { label: "Workspace", icon: Users },
    { label: "Public", icon: CircleDot },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.09 }}
      className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"
    >
      <h2 className="text-xs font-semibold text-slate-200">Model compatibility</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {compatibleModels.map((model) => {
          const checked = models.includes(model);
          return (
            <button
              type="button"
              key={model}
              role="checkbox"
              aria-checked={checked}
              onClick={() => onToggleModel(model)}
              className={cn(
                "flex h-9 items-center gap-2 rounded-lg border px-3 text-[11px] outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                checked ? "border-emerald-500/25 bg-emerald-500/[.06] text-slate-300" : "border-white/[.07] text-slate-600",
              )}
            >
              <span className={cn("grid size-4 place-items-center rounded border", checked ? "border-emerald-500 bg-emerald-500 text-[#07120b]" : "border-white/[.12]")}>
                {checked && <Check className="size-3" />}
              </span>
              {model}
            </button>
          );
        })}
      </div>

      <div className="my-5 h-px bg-white/[.06]" />
      <h2 className="text-xs font-semibold text-slate-200">Visibility</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
        {visibilityOptions.map((option) => {
          const Icon = option.icon;
          const checked = visibility === option.label;
          return (
            <button
              type="button"
              role="radio"
              aria-checked={checked}
              key={option.label}
              onClick={() => onVisibilityChange(option.label)}
              className={cn(
                "flex h-10 items-center gap-2 rounded-lg border px-3 text-[10px] outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-500/50",
                checked ? "border-emerald-500/30 bg-emerald-500/[.06] text-emerald-300" : "border-white/[.07] text-slate-600 hover:text-slate-400",
              )}
            >
              <Icon className="size-3.5" /> {option.label}
              <span className={cn("ml-auto size-2 rounded-full border", checked ? "border-emerald-400 bg-emerald-400" : "border-white/[.15]")} />
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}

function EmptyVersionState({
  onBack,
  onGoToEditor,
}: {
  onBack: () => void;
  onGoToEditor: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-xl items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full rounded-2xl border border-white/[.07] bg-[#161b22] px-6 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-emerald-500/15 bg-emerald-500/[.06] text-emerald-400">
          <FilePlus2 className="size-6" />
        </span>
        <h1 className="mt-5 text-lg font-semibold text-slate-100">Nothing to version yet</h1>
        <p className="mt-2 text-sm text-slate-600">Write your prompt before creating a version.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="ghost" onClick={onBack}>Back</Button>
          <Button className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={onGoToEditor}>Go to editor</Button>
        </div>
      </motion.div>
    </div>
  );
}
