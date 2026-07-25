import { FileSearch2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CompareActionBar } from "@/components/version-compare/compare-action-bar";
import { CompareHeader } from "@/components/version-compare/compare-header";
import { CompareSummary } from "@/components/version-compare/compare-summary";
import { VariableComparisonTable, PromptMetrics } from "@/components/version-compare/comparison-details";
import { DiffViewer, FullscreenDiff } from "@/components/version-compare/diff-viewer";
import { RestoreVersionDialog } from "@/components/version-compare/restore-dialog";
import { Button } from "@/components/ui/button";
import { versionDiffRows } from "@/data/compare-versions-data";

export function CompareVersionsPage({
  initialOldVersion = "v2",
  initialNewVersion = "v4",
  onBack,
  onAction,
}: {
  initialOldVersion?: string;
  initialNewVersion?: string;
  onBack: () => void;
  onAction: (label: string) => void;
}) {
  const [oldVersion, setOldVersion] = useState(initialOldVersion);
  const [newVersion, setNewVersion] = useState(initialNewVersion);
  const [hideUnchanged, setHideUnchanged] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const identical = oldVersion === newVersion;

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timeout);
  }, []);

  const changeVersion = (
    setter: (version: string) => void,
    version: string,
  ) => {
    setter(version);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 420);
  };

  const swapVersions = () => {
    setOldVersion(newVersion);
    setNewVersion(oldVersion);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 420);
  };

  const exportDiff = () => {
    const content = versionDiffRows
      .map((row) => {
        const oldPrefix = row.oldType === "removed" ? "-" : " ";
        const newPrefix = row.newType === "added" ? "+" : " ";
        return `${oldPrefix} ${row.oldLine ?? ""}\n${newPrefix} ${row.newLine ?? ""}`;
      })
      .join("\n");
    const blob = new Blob(
      [`PromptHub diff: ${oldVersion} → ${newVersion}\n\n${content}`],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `prompthub-${oldVersion}-${newVersion}-diff.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    onAction("Version diff exported");
  };

  const restore = () => {
    setRestoring(true);
    window.setTimeout(() => {
      setRestoring(false);
      setRestoreOpen(false);
      onAction(`Version ${oldVersion} restored to the editor`);
      onBack();
    }, 900);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 xl:px-8"
      >
        <CompareHeader
          oldVersion={oldVersion}
          newVersion={newVersion}
          hideUnchanged={hideUnchanged}
          onBack={onBack}
          onOldVersionChange={(version) => changeVersion(setOldVersion, version)}
          onNewVersionChange={(version) => changeVersion(setNewVersion, version)}
          onSwap={swapVersions}
          onHideUnchangedChange={setHideUnchanged}
          onFullscreen={() => setFullscreen(true)}
        />

        {identical ? (
          <IdenticalVersionsState version={oldVersion} onBack={onBack} />
        ) : (
          <div className="mt-6 space-y-5">
            <CompareSummary />
            <DiffViewer
              oldVersion={oldVersion}
              newVersion={newVersion}
              hideUnchanged={hideUnchanged}
              loading={loading}
            />
            <div className="grid gap-5 2xl:grid-cols-[minmax(520px,.9fr)_minmax(0,1.1fr)]">
              <VariableComparisonTable />
              <PromptMetrics />
            </div>
            <CompareActionBar
              oldVersion={oldVersion}
              onRestore={() => setRestoreOpen(true)}
              onDuplicate={() => onAction(`Version ${newVersion} duplicated as a draft`)}
              onExport={exportDiff}
              onCancel={onBack}
            />
          </div>
        )}
      </motion.div>

      <FullscreenDiff
        open={fullscreen}
        oldVersion={oldVersion}
        newVersion={newVersion}
        hideUnchanged={hideUnchanged}
        onClose={() => setFullscreen(false)}
      />
      <RestoreVersionDialog
        open={restoreOpen}
        version={oldVersion}
        loading={restoring}
        onOpenChange={setRestoreOpen}
        onConfirm={restore}
      />
    </>
  );
}

function IdenticalVersionsState({
  version,
  onBack,
}: {
  version: string;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 rounded-2xl border border-white/[.07] bg-[#161b22] px-6 py-20 text-center"
    >
      <div className="relative mx-auto grid size-20 place-items-center">
        <span className="absolute left-1 top-2 h-14 w-12 rotate-[-7deg] rounded-lg border border-white/[.08] bg-[#0d1117]" />
        <span className="absolute right-1 top-2 h-14 w-12 rotate-[7deg] rounded-lg border border-emerald-500/20 bg-emerald-500/[.05]" />
        <FileSearch2 className="relative z-10 size-7 text-emerald-400" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-slate-200">No differences found</h2>
      <p className="mt-2 text-sm text-slate-600">Both versions contain the same content.</p>
      <p className="mt-1 font-mono text-[10px] text-slate-700">{version} compared with {version}</p>
      <Button variant="secondary" className="mt-6" onClick={onBack}>Return to Version History</Button>
    </motion.div>
  );
}
