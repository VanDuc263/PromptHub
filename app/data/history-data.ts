import type { HistoryRecord } from "@/types";

const now = Date.now();
const hour = 60 * 60 * 1000;

export const initialHistoryRecords: HistoryRecord[] = [
  { id: "h1", type: "Viewed", title: "Spring Boot REST API Generator", description: "Viewed “Spring Boot REST API Generator” 4 times today", contentType: "Community Prompt", source: "Explore", group: "Today", timestamp: "Today at 10:32 AM", createdAt: now - hour, category: "Programming", author: "Đức Nguyễn", metadata: "Spring Boot · REST API" },
  { id: "h2", type: "Copied", title: "Senior Java Code Reviewer", description: "Copied “Senior Java Code Reviewer”", contentType: "Prompt", source: "Saved", group: "Today", timestamp: "Today at 9:18 AM", createdAt: now - 2 * hour, category: "Code Review", author: "Minh Trần", metadata: "1,840 characters copied" },
  { id: "h3", type: "Run", title: "Database Schema Optimizer", description: "Ran “Database Schema Optimizer” using GPT-5", contentType: "Prompt", source: "My Prompts", group: "Today", timestamp: "Today at 8:46 AM", createdAt: now - 3 * hour, category: "Programming", model: "GPT-5", version: "v3", run: { status: "Completed", tokens: 1284, runtime: "4.2 seconds", variables: "Schema type, database engine, optimization goal" } },
  { id: "h4", type: "Forked", title: "Microservice Architecture Planner", description: "Forked “Microservice Architecture Planner” into My Prompts", contentType: "Community Prompt", source: "Public Prompt Detail", group: "Yesterday", timestamp: "Yesterday at 4:20 PM", createdAt: now - 25 * hour, category: "Architecture", author: "An Phạm", metadata: "Created editable copy v1" },
  { id: "h5", type: "Saved", title: "Backend Interview Coach", description: "Saved “Backend Interview Coach”", contentType: "Community Prompt", source: "Explore", group: "Yesterday", timestamp: "Yesterday at 2:11 PM", createdAt: now - 27 * hour, category: "Interview", author: "Huy Vũ" },
  { id: "h6", type: "Removed from Saved", title: "Marketing Content Generator", description: "Removed “Marketing Content Generator” from Saved", contentType: "Community Prompt", source: "Saved", group: "Yesterday", timestamp: "Yesterday at 11:05 AM", createdAt: now - 30 * hour, category: "Marketing", author: "Mai Nguyễn" },
  { id: "h7", type: "Added to Collection", title: "Java Code Reviewer", description: "Added “Java Code Reviewer” to “Java Backend Toolkit”", contentType: "Prompt", source: "Collections", group: "This Week", timestamp: "Monday at 3:42 PM", createdAt: now - 3 * 24 * hour, category: "Code Review", collection: "Java Backend Toolkit", metadata: "Private collection" },
  { id: "h8", type: "Created Collection", title: "System Design Essentials", description: "Created collection “System Design Essentials”", contentType: "Collection", source: "Collections", group: "This Week", timestamp: "Monday at 10:16 AM", createdAt: now - 3.2 * 24 * hour, category: "Architecture", metadata: "Public · 6 prompts" },
  { id: "h9", type: "Created Version", title: "Spring Security Audit Prompt", description: "Updated “Spring Security Audit Prompt” to version v5", contentType: "Prompt", source: "My Prompts", group: "This Week", timestamp: "Sunday at 7:30 PM", createdAt: now - 4 * 24 * hour, category: "Security", version: "v5", metadata: "+18 lines · 2 variables updated" },
  { id: "h10", type: "Deleted", title: "Legacy Servlet Helper", description: "Deleted “Legacy Servlet Helper”", contentType: "Prompt", source: "My Prompts", group: "This Week", timestamp: "Saturday at 1:09 PM", createdAt: now - 5 * 24 * hour, category: "Programming", trashDays: 26 },
  { id: "h11", type: "Restored", title: "SQL Query Optimizer", description: "Restored “SQL Query Optimizer” from Trash", contentType: "Prompt", source: "My Prompts", group: "Earlier", timestamp: "July 14 at 9:22 AM", createdAt: now - 11 * 24 * hour, category: "Programming", metadata: "Restored to My Prompts" },
  { id: "h12", type: "Edited", title: "REST API Error Handler", description: "Edited “REST API Error Handler”", contentType: "Prompt", source: "My Prompts", group: "Earlier", timestamp: "July 10 at 5:40 PM", createdAt: now - 15 * 24 * hour, category: "Programming", version: "v2", metadata: "Description and tags updated" },
  { id: "h13", type: "Run", title: "Java Unit Test Generator", description: "Ran “Java Unit Test Generator” using Claude", contentType: "Prompt", source: "My Prompts", group: "Earlier", timestamp: "July 8 at 2:18 PM", createdAt: now - 17 * 24 * hour, category: "Programming", model: "Claude", version: "v4", run: { status: "Completed", tokens: 964, runtime: "3.7 seconds", variables: "Testing framework, source class, coverage goal" } },
  { id: "h14", type: "Viewed", title: "Technical Documentation Writer", description: "Viewed “Technical Documentation Writer”", contentType: "Community Prompt", source: "User Profile", group: "Earlier", timestamp: "June 28 at 11:04 AM", createdAt: now - 27 * 24 * hour, category: "Writing", author: "Quân Lê" },
  { id: "h15", type: "Deleted", title: "Old JSP Migration Helper", description: "Deleted “Old JSP Migration Helper”", contentType: "Prompt", source: "My Prompts", group: "Earlier", timestamp: "May 12 at 8:34 AM", createdAt: now - 74 * 24 * hour, category: "Programming", permanentlyDeleted: true },
];

export const historySummary = [
  { label: "Viewed Prompts", value: "128", change: "+12 this week" },
  { label: "Copied Prompts", value: "46", change: "+8 this month" },
  { label: "Prompt Runs", value: "32", change: "+5 this week" },
  { label: "Recent Activities", value: "18", change: "this week" },
];

export const recentlyViewed = initialHistoryRecords.filter((record) => record.type === "Viewed").slice(0, 5);
