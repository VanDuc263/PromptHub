import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Expand,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/prompt-editor/field";
import { availableVersions } from "@/data/compare-versions-data";
import { cn } from "@/lib/utils";

export function CompareHeader({
  oldVersion,
  newVersion,
  hideUnchanged,
  onBack,
  onOldVersionChange,
  onNewVersionChange,
  onSwap,
  onHideUnchangedChange,
  onFullscreen,
}: {
  oldVersion: string;
  newVersion: string;
  hideUnchanged: boolean;
  onBack: () => void;
  onOldVersionChange: (version: string) => void;
  onNewVersionChange: (version: string) => void;
  onSwap: () => void;
  onHideUnchangedChange: (value: boolean) => void;
  onFullscreen: () => void;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 border-b border-white/[.07] pb-5 xl:flex-row xl:items-center xl:justify-between"
    >
      <div className="flex items-center gap-3">
        <Button variant="icon" size="icon" onClick={onBack} aria-label="Back to Version History">
          <ArrowLeft className="size-[18px]" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold tracking-[-.025em] text-slate-50 sm:text-2xl">Compare Versions</h1>
          <p className="mt-1.5 text-xs text-slate-600">Compare changes between prompt versions.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="w-24">
          <SelectField value={oldVersion} onChange={(event) => onOldVersionChange(event.target.value)} aria-label="Old version">
            {availableVersions.map((version) => <option key={version}>{version}</option>)}
          </SelectField>
        </div>
        <ArrowRight className="size-4 text-slate-700" />
        <div className="w-24">
          <SelectField value={newVersion} onChange={(event) => onNewVersionChange(event.target.value)} aria-label="New version">
            {[...availableVersions].reverse().map((version) => <option key={version}>{version}</option>)}
          </SelectField>
        </div>
        <Button variant="icon" size="icon" onClick={onSwap} aria-label="Swap versions" title="Swap versions">
          <ArrowRightLeft className="size-4" />
        </Button>
        <button
          type="button"
          role="switch"
          aria-checked={hideUnchanged}
          onClick={() => onHideUnchangedChange(!hideUnchanged)}
          className="ml-0 flex h-10 items-center gap-2 rounded-lg border border-white/[.08] bg-white/[.025] px-3 text-[10px] text-slate-500 transition hover:border-white/[.13] sm:ml-2"
        >
          Hide unchanged
          <span className={cn("relative h-4 w-7 rounded-full transition", hideUnchanged ? "bg-emerald-500" : "bg-white/[.1]")}>
            <span className={cn("absolute top-0.5 size-3 rounded-full bg-white transition-transform", hideUnchanged ? "translate-x-3.5" : "translate-x-0.5")} />
          </span>
        </button>
        <Button variant="icon" size="icon" onClick={onFullscreen} aria-label="Open fullscreen comparison" title="Fullscreen">
          <Expand className="size-4" />
        </Button>
      </div>
    </motion.header>
  );
}
