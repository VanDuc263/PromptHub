import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfigurationPanel } from "@/components/prompt-editor/configuration-panel";
import { EditorHeader } from "@/components/prompt-editor/editor-header";
import { LivePreviewPanel } from "@/components/prompt-editor/live-preview-panel";
import { NotesSection } from "@/components/prompt-editor/notes-section";
import { PromptEditorPanel } from "@/components/prompt-editor/prompt-editor-panel";
import {
  defaultPromptVariables,
  initialPromptContent,
} from "@/data/mock-data";
import type { PromptEditorMetadata, PromptVariable } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { createPrompt, updatePrompt } from "@/store/my-prompts-slice";
import { fetchPromptEditorRequest } from "@/lib/create-prompt-api";

const initialMetadata: PromptEditorMetadata = {
  title: "Java Code Reviewer",
  description: "Review Java and Spring Boot code using practical engineering standards.",
  category: "Programming",
  visibility: "Private",
  model: "GPT-5",
  language: "English",
  tags: ["Code Review", "Java", "Backend"],
};

export function CreatePromptPage({
  onBack,
  onAction,
  onCreated,
  promptId,
}: {
  onBack: () => void;
  onAction: (label: string) => void;
  onCreated: (promptId: string) => void;
  promptId: string | null;
}) {
  const [metadata, setMetadata] = useState<PromptEditorMetadata>(initialMetadata);
  const [variables, setVariables] = useState<PromptVariable[]>(defaultPromptVariables);
  const [values, setValues] = useState<Record<string, string>>({
    role: "Senior Java engineer",
    source_code: "",
    requirements: "SOLID principles",
  });
  const [notes, setNotes] = useState(
    "Best used for focused pull request reviews. Include relevant interfaces or related classes when the implementation depends on surrounding context.",
  );
  const [systemMessage, setSystemMessage] = useState(
    "You are a senior Java and Spring Boot engineer. Give precise, actionable feedback and prioritize correctness and security.",
  );
  const [history, setHistory] = useState([initialPromptContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingEditor, setLoadingEditor] = useState(Boolean(promptId));
  const [configCollapsed, setConfigCollapsed] = useState(true);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const { createStatus, createError } = useAppSelector((state) => state.myPrompts);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (!promptId || !accessToken) return;
    let cancelled = false;
    void fetchPromptEditorRequest(promptId, accessToken).then((prompt) => {
      if (cancelled) return;
      setMetadata({
        title: prompt.title,
        description: prompt.description,
        category: prompt.category,
        visibility: prompt.visibility,
        model: prompt.model,
        language: prompt.language,
        tags: prompt.tags,
      });
      setVariables(prompt.variables.map((variable, index) => ({ ...variable, id: `variable-${index}-${variable.name}` })));
      setValues(Object.fromEntries(prompt.variables.map((variable) => [variable.name, ""])));
      setSystemMessage(prompt.systemMessage);
      setNotes(prompt.notes);
      setHistory([prompt.content]);
      setHistoryIndex(0);
      setLoadingEditor(false);
    }).catch((error: unknown) => {
      if (cancelled) return;
      setLoadError(error instanceof Error ? error.message : "Could not load this prompt.");
      setLoadingEditor(false);
    });
    return () => { cancelled = true; };
  }, [accessToken, promptId]);

  const content = history[historyIndex];

  const savePrompt = (publish: boolean) => {
    if (loadingEditor || (promptId && loadError)) return;
    if (!metadata.title.trim()) {
      setValidationError("Prompt title is required.");
      return;
    }
    if (!content.trim()) {
      setValidationError("Prompt content is required.");
      return;
    }
    setValidationError(null);
    const payload = { metadata, content, systemMessage, variables, notes, publish };
    const request = promptId ? dispatch(updatePrompt({ promptId, payload })) : dispatch(createPrompt(payload));
    void request
      .unwrap()
      .then((result) => {
        onAction(promptId ? `${result.title} updated` : publish ? `${result.title} created` : `${result.title} saved as draft`);
        onCreated(result.id);
      })
      .catch(() => undefined);
  };

  const updateVariables = (nextVariables: PromptVariable[]) => {
    setVariables(nextVariables);
    setValues((currentValues) =>
      Object.fromEntries(
        nextVariables.map((variable) => [
          variable.name,
          currentValues[variable.name] ?? "",
        ]),
      ),
    );
  };

  const updateContent = (nextContent: string) => {
    setHistory((currentHistory) => [
      ...currentHistory.slice(0, historyIndex + 1),
      nextContent,
    ]);
    setHistoryIndex((currentIndex) => currentIndex + 1);
  };

  const scrollToPreview = () => {
    setPreviewCollapsed(false);
    document.getElementById("live-preview")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 xl:px-8">
      <EditorHeader
        saveStatus={createStatus === "loading" ? "Saving..." : "Saved"}
        saving={createStatus === "loading" || loadingEditor || Boolean(promptId && loadError)}
        onBack={onBack}
        onPreview={scrollToPreview}
        onSaveDraft={() => savePrompt(false)}
        onSubmit={() => savePrompt(true)}
        editing={Boolean(promptId)}
        promptTitle={metadata.title}
      />

      {(validationError || createError || loadError) && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-500/[.06] px-4 py-3 text-xs text-red-200">
          <AlertTriangle className="size-4 shrink-0" /> {validationError ?? createError ?? loadError}
        </div>
      )}

      <div className={loadingEditor ? "pointer-events-none mt-6 grid min-w-0 animate-pulse gap-4 opacity-50 xl:grid-cols-[280px_minmax(420px,1fr)_320px] 2xl:grid-cols-[300px_minmax(520px,1fr)_340px]" : "mt-6 grid min-w-0 gap-4 xl:grid-cols-[280px_minmax(420px,1fr)_320px] 2xl:grid-cols-[300px_minmax(520px,1fr)_340px]"}>
        <ConfigurationPanel
          metadata={metadata}
          variables={variables}
          collapsed={configCollapsed}
          onToggle={() => setConfigCollapsed((value) => !value)}
          onMetadataChange={setMetadata}
          onVariablesChange={updateVariables}
        />

        <div className="min-w-0 space-y-4">
          <section className="rounded-xl border border-white/[.07] bg-[#161b22] p-4">
            <label htmlFor="system-message" className="text-xs font-semibold text-slate-200">System message</label>
            <p className="mt-1 text-[10px] text-slate-600">Sets the model's role and behavior before the user prompt.</p>
            <textarea
              id="system-message"
              value={systemMessage}
              onChange={(event) => setSystemMessage(event.target.value)}
              rows={4}
              placeholder="You are a helpful assistant..."
              className="mt-3 w-full resize-y rounded-lg border border-white/[.08] bg-[#0d1117] p-3 font-mono text-xs leading-5 text-slate-300 outline-none placeholder:text-slate-700 focus:border-violet-500/50"
            />
          </section>
          <PromptEditorPanel
            content={content}
            variables={variables}
            onChange={updateContent}
            onUndo={() => setHistoryIndex((index) => Math.max(0, index - 1))}
            onRedo={() => setHistoryIndex((index) => Math.min(history.length - 1, index + 1))}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />
          <NotesSection notes={notes} onChange={setNotes} />
        </div>

        <LivePreviewPanel
          content={content}
          variables={variables}
          values={values}
          collapsed={previewCollapsed}
          onToggle={() => setPreviewCollapsed((value) => !value)}
          onValuesChange={setValues}
        />
      </div>
    </div>
  );
}
