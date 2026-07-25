import type {
  MetricComparison,
  VariableComparison,
  VersionDiffRow,
} from "@/types";

export const availableVersions = ["v1", "v2", "v3", "v4", "v5"];

export const changeHighlights = [
  "Added stricter response formatting.",
  "Improved system instructions.",
  "Added JSON output requirements.",
  "Removed duplicated constraints.",
  "Improved hallucination prevention.",
];

export const versionDiffRows: VersionDiffRow[] = [
  {
    oldLine: "You are an experienced Java code reviewer.",
    newLine: "You are a senior {{role}} specializing in Java and Spring Boot.",
    oldType: "modified",
    newType: "modified",
  },
  { oldLine: "", newLine: "", oldType: "unchanged", newType: "unchanged" },
  {
    oldLine: "Review the following code:",
    newLine: "Review the following {{project_name}} source code:",
    oldType: "modified",
    newType: "modified",
  },
  { oldLine: "", newLine: "", oldType: "unchanged", newType: "unchanged" },
  { oldLine: "{{source_code}}", newLine: "{{source_code}}", oldType: "unchanged", newType: "unchanged" },
  { oldLine: "", newLine: "", oldType: "unchanged", newType: "unchanged" },
  {
    oldLine: "Check for bugs and code quality issues.",
    newLine: "Analyze the implementation using these criteria:",
    oldType: "modified",
    newType: "modified",
  },
  { oldLine: "", newLine: "", oldType: "unchanged", newType: "unchanged" },
  { oldLine: "- Code quality", newLine: "- Clean Code and SOLID principles", oldType: "modified", newType: "modified" },
  { oldLine: "- Performance", newLine: "- Runtime performance and database access", oldType: "modified", newType: "modified" },
  { oldLine: "- Security", newLine: "- Security risks and input validation", oldType: "modified", newType: "modified" },
  { oldLine: "- Error handling", newLine: "- Error handling and observability", oldType: "unchanged", newType: "unchanged" },
  { oldLine: "- Maintainability", newLine: "- Long-term maintainability", oldType: "modified", newType: "modified" },
  { oldLine: "", newLine: "", oldType: "unchanged", newType: "unchanged" },
  { oldLine: "Do not repeat the input.", oldType: "removed", newType: "unchanged" },
  { oldLine: "Keep the answer concise.", oldType: "removed", newType: "unchanged" },
  {
    newLine: "Before answering, identify the highest-risk issues and verify each claim against the provided code.",
    oldType: "unchanged",
    newType: "added",
  },
  {
    newLine: "Do not invent dependencies, runtime behavior, or security findings that cannot be supported by the input.",
    oldType: "unchanged",
    newType: "added",
  },
  { oldLine: "", newLine: "", oldType: "unchanged", newType: "unchanged" },
  {
    oldLine: "Return a list of recommendations.",
    newLine: 'Return valid JSON using this structure:',
    oldType: "modified",
    newType: "modified",
  },
  {
    newLine: '{ "summary": string, "issues": Issue[], "revised_code": string }',
    oldType: "unchanged",
    newType: "added",
  },
  { oldLine: "", newLine: "", oldType: "unchanged", newType: "unchanged" },
  {
    oldLine: "Use a friendly tone.",
    newLine: "Use a professional, direct tone. Limit the response to {{max_length}} words.",
    oldType: "modified",
    newType: "modified",
  },
];

export const variableComparisons: VariableComparison[] = [
  { name: "language", oldValue: "English", newValue: "English" },
  { name: "tone", oldValue: "Friendly", newValue: "Professional" },
  { name: "max_length", oldValue: "500", newValue: "800" },
  { name: "temperature", oldValue: "0.7", newValue: "0.4" },
];

export const metricComparisons: MetricComparison[] = [
  { label: "Characters", oldValue: "5,042", newValue: "5,712" },
  { label: "Words", oldValue: "914", newValue: "1,038" },
  { label: "Estimated tokens", oldValue: "1,260", newValue: "1,428" },
  { label: "Variables", oldValue: "4", newValue: "6" },
  { label: "Instructions", oldValue: "8", newValue: "12" },
  { label: "Output examples", oldValue: "1", newValue: "2" },
  { label: "Complexity score", oldValue: "Medium", newValue: "High" },
];
