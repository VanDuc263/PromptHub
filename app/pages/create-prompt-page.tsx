import { useEffect, useMemo, useState } from "react";
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
}: {
  onBack: () => void;
  onAction: (label: string) => void;
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
  const [history, setHistory] = useState([initialPromptContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving...">("Saved");
  const [configCollapsed, setConfigCollapsed] = useState(true);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);

  const content = history[historyIndex];

  const editorState = useMemo(
    () => JSON.stringify({ metadata, content, variables, notes }),
    [content, metadata, notes, variables],
  );

  useEffect(() => {
    const savingTimeout = window.setTimeout(() => setSaveStatus("Saving..."), 0);
    const savedTimeout = window.setTimeout(() => setSaveStatus("Saved"), 850);
    return () => {
      window.clearTimeout(savingTimeout);
      window.clearTimeout(savedTimeout);
    };
  }, [editorState]);

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
        saveStatus={saveStatus}
        onBack={onBack}
        onPreview={scrollToPreview}
        onSaveDraft={() => onAction(`${metadata.title || "Untitled prompt"} saved as draft`)}
        onPublish={() => onAction(`${metadata.title || "Untitled prompt"} published`)}
      />

      <div className="mt-6 grid min-w-0 gap-4 xl:grid-cols-[280px_minmax(420px,1fr)_320px] 2xl:grid-cols-[300px_minmax(520px,1fr)_340px]">
        <ConfigurationPanel
          metadata={metadata}
          variables={variables}
          collapsed={configCollapsed}
          onToggle={() => setConfigCollapsed((value) => !value)}
          onMetadataChange={setMetadata}
          onVariablesChange={updateVariables}
        />

        <div className="min-w-0 space-y-4">
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
