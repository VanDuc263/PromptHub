import type { VariableChange, VersionChangeMetric } from "@/types";

export const versionDraftContent = `You are a senior {{role}} with extensive experience in Java and Spring Boot.

Review the following {{project_name}} source code:

{{source_code}}

Analyze the implementation based on:

- Clean Code and SOLID principles
- Security risks and input validation
- Runtime performance and database access
- Error handling and observability
- Long-term maintainability

Additional requirements:

{{requirements}}

Think through the most important risks before answering. Return the result in {{output_format}} format and write all explanations in {{language}}.`;

export const currentVersionInfo = {
  version: "v4",
  createdAt: "2 hours ago",
  author: "Đức Nguyễn",
  commitMessage: "Improved prompt formatting",
};

export const versionChangeMetrics: VersionChangeMetric[] = [
  { label: "Lines added", value: "+18", tone: "positive" },
  { label: "Lines removed", value: "-4", tone: "negative" },
  { label: "Variables updated", value: "2", tone: "neutral" },
  { label: "Prompt length", value: "1,320 → 1,458 chars", tone: "positive" },
  { label: "Estimated tokens", value: "322 → 351", tone: "neutral" },
];

export const variableChanges: VariableChange[] = [
  { name: "project_name", type: "Added", newValue: "Dynamic project identifier" },
  { name: "framework", type: "Removed", oldValue: "Spring Boot" },
  { name: "language", type: "Modified", oldValue: "English", newValue: "Vietnamese" },
];

export const compatibleModels = ["GPT-5", "GPT-4.1", "Claude", "Gemini"];
