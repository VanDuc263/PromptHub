import { useState } from "react";
import { DeleteDialog } from "@/components/prompt-detail/delete-dialog";
import { DetailHeader } from "@/components/prompt-detail/detail-header";
import { DetailTabs, type DetailTabId } from "@/components/prompt-detail/detail-tabs";
import { InformationPanel } from "@/components/prompt-detail/information-panel";
import { PromptSummary } from "@/components/prompt-detail/prompt-summary";
import { ShareDialog } from "@/components/prompt-detail/share-dialog";

export function PromptDetailPage({
  onBack,
  onEdit,
  onAction,
  initialTab = "overview",
  newVersionCreated = false,
  onCreateVersion,
  onCompareVersion,
}: {
  onBack: () => void;
  onEdit: () => void;
  onAction: (label: string) => void;
  initialTab?: DetailTabId;
  newVersionCreated?: boolean;
  onCreateVersion: () => void;
  onCompareVersion: (version: string) => void;
}) {
  const [favorite, setFavorite] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTabId>(initialTab);

  const usePrompt = () => {
    setActiveTab("overview");
    window.setTimeout(() => {
      document.getElementById("use-prompt")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  return (
    <>
      <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 xl:px-8">
        <DetailHeader
          favorite={favorite}
          onBack={onBack}
          onFavorite={() => {
            setFavorite((value) => !value);
            onAction(favorite ? "Removed from favorites" : "Added to favorites");
          }}
          onShare={() => setShareOpen(true)}
          onEdit={onEdit}
          onUse={usePrompt}
          onAction={onAction}
          onDelete={() => setDeleteOpen(true)}
        />

        <div className="mt-6 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0 space-y-5">
            <PromptSummary />
            <DetailTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onAction={onAction}
              onCreateVersion={onCreateVersion}
              onCompareVersion={onCompareVersion}
              newVersionCreated={newVersionCreated}
            />
          </main>
          <InformationPanel onEdit={onEdit} onAction={onAction} />
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/[.06] py-5 text-[11px] text-slate-700 sm:flex-row">
          <p>© 2026 PromptHub. Crafted for better prompting.</p>
          <p>Java Code Reviewer · Private · v4</p>
        </footer>
      </div>

      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} onAction={onAction} />
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          onAction("Java Code Reviewer deleted");
          window.setTimeout(onBack, 500);
        }}
      />
    </>
  );
}
