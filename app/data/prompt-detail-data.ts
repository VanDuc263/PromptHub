import type {
  PromptDetailActivity,
  PromptDetailVariable,
  PromptVersion,
} from "@/types";

export const promptDetail = {
  title: "Java Code Reviewer",
  description:
    "Review Java and Spring Boot source code using Clean Code, SOLID principles, security practices, and performance recommendations.",
  author: "Đức Nguyễn",
  authorInitials: "ĐN",
  category: "Programming",
  model: "Universal",
  language: "English",
  tags: ["Java", "Spring Boot", "Backend", "Code Review"],
  visibility: "Private",
  version: "v4",
  updatedAt: "Updated 2 hours ago",
  createdAt: "Created 12 days ago",
  shareUrl: "https://prompthub.ai/p/java-code-reviewer",
};

export const promptTemplate = `You are a senior {{role}} with extensive experience in Java and Spring Boot.

Review the following source code:

{{source_code}}

Analyze the code based on:

- Clean Code principles
- SOLID principles
- Security risks
- Performance issues
- Error handling
- Maintainability

Additional requirements:

{{requirements}}

Return the result in {{output_format}} format.`;

export const detailVariables: PromptDetailVariable[] = [
  {
    name: "role",
    label: "Role",
    type: "Text",
    required: false,
    defaultValue: "Senior Java Backend Developer",
    placeholder: "Enter a reviewer role",
  },
  {
    name: "source_code",
    label: "Source code",
    type: "Long Text",
    required: true,
    defaultValue: "",
    placeholder: "Paste your Java or Spring Boot source code here...",
  },
  {
    name: "requirements",
    label: "Additional requirements",
    type: "Long Text",
    required: false,
    defaultValue: "",
    placeholder: "Add any specific review requirements...",
  },
  {
    name: "output_format",
    label: "Output format",
    type: "Select",
    required: false,
    defaultValue: "Markdown",
    placeholder: "Choose a format",
    options: ["Markdown", "JSON", "Plain Text", "Structured Report"],
  },
];

export const promptVersions: PromptVersion[] = [
  {
    version: "v4",
    note: "Current version",
    author: "Đức Nguyễn",
    createdAt: "2 hours ago",
    current: true,
  },
  {
    version: "v3",
    note: "Added security and performance review",
    author: "Đức Nguyễn",
    createdAt: "4 days ago",
  },
  {
    version: "v2",
    note: "Added structured output requirements",
    author: "Đức Nguyễn",
    createdAt: "8 days ago",
  },
  {
    version: "v1",
    note: "Initial version",
    author: "Đức Nguyễn",
    createdAt: "12 days ago",
  },
];

export const promptActivities: PromptDetailActivity[] = [
  {
    id: 1,
    actor: "Đức",
    initials: "ĐN",
    action: "updated the prompt to version v4.",
    time: "2 hours ago",
    tone: "bg-violet-500/15 text-violet-300",
  },
  {
    id: 2,
    actor: "Minh",
    initials: "MN",
    action: "copied the prompt.",
    time: "5 hours ago",
    tone: "bg-sky-500/15 text-sky-300",
  },
  {
    id: 3,
    actor: "Lan",
    initials: "LN",
    action: "saved the prompt.",
    time: "Yesterday",
    tone: "bg-rose-500/15 text-rose-300",
  },
  {
    id: 4,
    actor: "Đức",
    initials: "ĐN",
    action: "changed the prompt visibility.",
    time: "3 days ago",
    tone: "bg-emerald-500/15 text-emerald-300",
  },
];

export const promptStats = [
  { label: "Total uses", shortLabel: "Uses", value: 128 },
  { label: "Copies", shortLabel: "Copies", value: 94 },
  { label: "Saves", shortLabel: "Saves", value: 25 },
  { label: "Forks", shortLabel: "Forks", value: 8 },
];
