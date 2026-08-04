import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  CopyPublicPromptDialog,
  ForkPromptDialog,
} from "@/components/public-prompt/public-prompt-dialogs";
import { PublicPromptHeader } from "@/components/public-prompt/public-prompt-header";
import { PublicPromptSidebar } from "@/components/public-prompt/public-prompt-sidebar";
import { PublicPromptTabs } from "@/components/public-prompt/public-prompt-tabs";
import { PromptHeroCard } from "@/components/public-prompt/prompt-hero-card";
import { useSavedPrompts } from "@/hooks/use-saved-prompts";
import { PublicPromptProvider, type PublicPromptContextValue } from "@/context/public-prompt-context";
import { apiPromptToExplorePrompt } from "@/data/explore-data";
import { publicPrompt, publicPromptContent, publicStats, publicSystemMessage, publicVariables } from "@/data/public-prompt-data";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchPromptDetail } from "@/store/explore-slice";
import type { ExplorePromptApi } from "@/lib/explore-api";
import { Button } from "@/components/ui/button";

export function PublicPromptDetailPage({
  onBack,
  onAction,
  promptId,
}: {
  onBack: () => void;
  onAction: (label: string) => void;
  promptId: string | null;
}) {
  const dispatch = useAppDispatch();
  const { selectedPrompt, detailStatus, detailError } = useAppSelector((state) => state.explore);
  const { isSaved, toggleSaved } = useSavedPrompts();
  const savedKey = promptId ?? "spring-boot-api-generator";
  const saved = isSaved(savedKey);
  const [liked, setLiked] = useState(false);
  const [forkOpen, setForkOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const requestedPromptRef = useRef<string | null>(null);

  useEffect(() => {
    if (promptId && requestedPromptRef.current !== promptId) {
      requestedPromptRef.current = promptId;
      void dispatch(fetchPromptDetail(promptId));
    }
  }, [dispatch, promptId]);

  if (promptId && (detailStatus === "loading" || selectedPrompt?.id !== promptId)) {
    if (detailStatus === "failed") {
      return <PublicPromptError message={detailError ?? "Could not load this prompt."} onBack={onBack} onRetry={() => void dispatch(fetchPromptDetail(promptId))} />;
    }
    return <PublicPromptSkeleton />;
  }

  const data = selectedPrompt && selectedPrompt.id === promptId
    ? buildPromptData(selectedPrompt)
    : buildStaticPromptData();

  return (
    <PublicPromptProvider value={data}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8"
      >
        <PublicPromptHeader
          saved={saved}
          bookmarked={saved}
          liked={liked}
          onBack={onBack}
          onSave={() => {
            const willSave = toggleSaved(savedKey);
            onAction(willSave ? "Saved to My Library" : "Removed from Saved");
          }}
          onUse={() => document.getElementById("use-prompt")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          onBookmark={() => {
            const willSave = toggleSaved(savedKey);
            onAction(willSave ? "Prompt saved" : "Removed from Saved");
          }}
          onLike={() => {
            setLiked((value) => !value);
            onAction(liked ? "Like removed" : "Prompt liked");
          }}
          onFork={() => setForkOpen(true)}
          onCopy={() => setCopyOpen(true)}
          onAction={onAction}
          onViewProfile={() => onAction("Author profile opened")}
        />

        <div className="mt-5"><PromptHeroCard /></div>

        <div className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0 space-y-5">
            <PublicPromptTabs key={promptId ?? "static"} promptId={promptId} onAction={onAction} />
          </main>
          <PublicPromptSidebar
            promptId={promptId}
            onAction={onAction}
          />
        </div>

        <footer className="mt-9 flex flex-col items-center justify-between gap-2 border-t border-white/[.06] py-5 text-[11px] text-slate-700 sm:flex-row">
          <p>© 2026 PromptHub Community.</p>
          <p>{data.prompt.title} · {data.prompt.license} License · {data.prompt.visibility}</p>
        </footer>
      </motion.div>

      <ForkPromptDialog open={forkOpen} onOpenChange={setForkOpen} onAction={onAction} />
      <CopyPublicPromptDialog open={copyOpen} onOpenChange={setCopyOpen} onAction={onAction} />
    </PublicPromptProvider>
  );
}

function buildPromptData(api: ExplorePromptApi): PublicPromptContextValue {
  const explorePrompt = apiPromptToExplorePrompt(api);
  const publishedDate = api.publishedAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(api.publishedAt))
    : "Recently published";
  const variables = api.variables.map((name) =>
    publicVariables.find((variable) => variable.name === name) ?? {
      name,
      description: "Value supplied when running this prompt",
      defaultValue: "—",
      required: true,
      example: "Enter a value",
    },
  );
  const runVariables = variables.map((variable) => ({
    name: variable.name,
    label: variable.name.replace(/_/g, " ").replace(/^./, (letter) => letter.toUpperCase()),
    type: /code|content|screen|notes|requirements|message/i.test(variable.name) ? "Long Text" as const : "Text" as const,
    required: variable.required,
    defaultValue: variable.defaultValue === "—" ? "" : variable.defaultValue,
    placeholder: variable.example || `Enter ${variable.name.replace(/_/g, " ")}`,
  }));

  return {
    prompt: {
      ...publicPrompt,
      title: api.title,
      description: api.description,
      category: api.category,
      author: api.author,
      username: `@${api.author.toLowerCase().replace(/[^a-z0-9]+/g, "") || "creator"}`,
      authorInitials: api.authorInitials,
      publishedAt: `Published ${publishedDate}`,
      models: api.models,
      estimatedTokens: api.tokens ? api.tokens.toLocaleString() : publicPrompt.estimatedTokens,
      visibility: api.visibility,
      tags: api.tags.length ? api.tags : publicPrompt.tags,
    },
    explorePrompt,
    content: api.snippet || publicPromptContent,
    systemMessage: api.systemMessage || publicSystemMessage,
    variables: variables.length ? variables : publicVariables,
    runVariables: runVariables.length ? runVariables : publicVariables.map((variable) => ({
      name: variable.name,
      label: variable.name.replace(/_/g, " ").replace(/^./, (letter) => letter.toUpperCase()),
      type: "Text" as const,
      required: variable.required,
      defaultValue: variable.defaultValue,
      placeholder: variable.example,
    })),
    stats: {
      ...publicStats,
      copies: api.copies,
      likes: api.likes,
      saves: api.saves,
      rating: api.rating || publicStats.rating,
    },
  };
}

function buildStaticPromptData(): PublicPromptContextValue {
  return buildPromptData({
    id: "static",
    title: publicPrompt.title,
    description: publicPrompt.description,
    category: publicPrompt.category,
    tags: publicPrompt.tags,
    models: publicPrompt.models,
    author: publicPrompt.author,
    authorInitials: publicPrompt.authorInitials,
    publishedAt: null,
    copies: publicStats.copies,
    likes: publicStats.likes,
    saves: publicStats.saves,
    rating: publicStats.rating,
    tokens: Number(publicPrompt.estimatedTokens.replace(/,/g, "")),
    visibility: "Public",
    systemMessage: publicSystemMessage,
    snippet: publicPromptContent,
    variables: publicVariables.map((variable) => variable.name),
    featured: true,
  });
}

function PublicPromptError({ message, onBack, onRetry }: { message: string; onBack: () => void; onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <AlertTriangle className="mx-auto size-9 text-amber-400" />
      <h1 className="mt-5 text-xl font-semibold text-slate-100">Unable to load prompt</h1>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="secondary" onClick={onBack}>Back to Explore</Button>
        <Button onClick={onRetry}><RefreshCw className="size-4" /> Try again</Button>
      </div>
    </div>
  );
}

function PublicPromptSkeleton() {
  return (
    <div className="mx-auto max-w-[1680px] animate-pulse px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <div className="h-4 w-64 rounded bg-white/[.04]" />
      <div className="mt-6 h-10 w-2/3 rounded bg-white/[.05]" />
      <div className="mt-3 h-3 w-1/2 rounded bg-white/[.035]" />
      <div className="mt-6 h-16 rounded-2xl border border-white/[.05] bg-[#161b22]" />
      <div className="mt-5 h-64 rounded-2xl border border-white/[.05] bg-[#161b22]" />
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="h-[620px] rounded-2xl border border-white/[.05] bg-[#161b22]" />
        <div className="space-y-4">
          <div className="h-52 rounded-2xl border border-white/[.05] bg-[#161b22]" />
          <div className="h-64 rounded-2xl border border-white/[.05] bg-[#161b22]" />
        </div>
      </div>
    </div>
  );
}
