import {
  Boxes,
  Code2,
  Coffee,
  Crown,
  FileCode2,
  GitFork,
  Heart,
  Medal,
  PackagePlus,
  Rocket,
  ShieldCheck,
  Star,
  Trophy,
  UserRoundCheck,
  Users,
  Wrench,
} from "lucide-react";
import type {
  ProfileAchievement,
  ProfileActivity,
  ProfileCollection,
  ProfilePrompt,
  ProfileReview,
} from "@/types";

export const creatorProfile = {
  name: "Đức Nguyễn",
  username: "@ducnguyen",
  initials: "ĐN",
  verified: true,
  bio: "Java Backend Developer creating practical prompts for Spring Boot, system design, code review, and API development.",
  location: "Ho Chi Minh City, Vietnam",
  website: "ducnguyen.dev",
  github: "github.com/ducnguyen",
  linkedin: "linkedin.com/in/ducnguyen",
  joinedAt: "Joined March 2025",
  lastActive: "Active 2 hours ago",
  skills: ["Java", "Spring Boot", "Backend", "Microservices", "Prompt Engineering", "Code Review"],
  preferredModels: ["GPT-5", "Claude", "Gemini", "DeepSeek"],
};

export type CreatorProfileData = typeof creatorProfile & { avatarUrl?: string | null };

export const profileStats = [
  { label: "Public Prompts", value: "48", icon: FileCode2, change: "+4 this month" },
  { label: "Collections", value: "12", icon: Boxes, change: "+2 this month" },
  { label: "Followers", value: "3.2K", icon: Users, change: "+186 this month" },
  { label: "Following", value: "186", icon: UserRoundCheck },
  { label: "Prompt Copies", value: "24.8K", icon: GitFork, change: "+12.4% this month" },
  { label: "Average Rating", value: "4.8", icon: Star, change: "126 reviews" },
];

export const profilePrompts: ProfilePrompt[] = [
  {
    id: 1,
    title: "Spring Boot REST API Generator",
    description: "Generate production-ready REST APIs using validation, exception handling, DTO mapping, and clean architecture.",
    category: "Programming",
    tags: ["Spring Boot", "REST API", "Java"],
    models: ["GPT-5", "Claude"],
    version: "v6",
    rating: 4.9,
    copies: 6240,
    forks: 482,
    saves: 731,
    likes: 1028,
    updatedAt: "3 hours ago",
    featured: true,
    icon: Code2,
    accent: "bg-emerald-500/10 text-emerald-300",
  },
  {
    id: 2,
    title: "Senior Java Code Reviewer",
    description: "Review Java code for correctness, maintainability, performance, security, and Spring Boot best practices.",
    category: "Code Review",
    tags: ["Java", "Review", "Security"],
    models: ["GPT-5", "Claude", "DeepSeek"],
    version: "v4",
    rating: 4.8,
    copies: 5120,
    forks: 396,
    saves: 642,
    likes: 894,
    updatedAt: "2 days ago",
    featured: true,
    icon: ShieldCheck,
    accent: "bg-violet-500/10 text-violet-300",
  },
  {
    id: 3,
    title: "Microservice Architecture Planner",
    description: "Design scalable Java microservices with API Gateway, discovery, messaging, observability, and deployment strategies.",
    category: "Programming",
    tags: ["Microservices", "Architecture", "Cloud"],
    models: ["GPT-5", "Gemini"],
    version: "v5",
    rating: 4.8,
    copies: 4380,
    forks: 318,
    saves: 584,
    likes: 776,
    updatedAt: "4 days ago",
    featured: true,
    icon: Boxes,
    accent: "bg-sky-500/10 text-sky-300",
  },
  {
    id: 4,
    title: "JPA Query Performance Analyst",
    description: "Diagnose inefficient repository queries, fetch strategies, indexes, and transaction boundaries.",
    category: "Code Review",
    tags: ["JPA", "Database", "Performance"],
    models: ["GPT-5", "DeepSeek"],
    version: "v3",
    rating: 4.7,
    copies: 2860,
    forks: 174,
    saves: 356,
    likes: 492,
    updatedAt: "1 week ago",
    icon: Wrench,
    accent: "bg-amber-500/10 text-amber-300",
  },
  {
    id: 5,
    title: "System Design Interview Coach",
    description: "Run adaptive backend system design interviews with trade-off analysis and calibrated feedback.",
    category: "Education",
    tags: ["Interview", "System Design", "Career"],
    models: ["Claude", "GPT-5"],
    version: "v7",
    rating: 4.9,
    copies: 2410,
    forks: 141,
    saves: 312,
    likes: 448,
    updatedAt: "9 days ago",
    icon: Trophy,
    accent: "bg-rose-500/10 text-rose-300",
  },
  {
    id: 6,
    title: "Kafka Event Contract Designer",
    description: "Design reliable event schemas, compatibility rules, consumers, retries, and observability conventions.",
    category: "Programming",
    tags: ["Kafka", "Events", "Backend"],
    models: ["GPT-5", "Gemini"],
    version: "v2",
    rating: 4.6,
    copies: 1790,
    forks: 118,
    saves: 234,
    likes: 328,
    updatedAt: "2 weeks ago",
    icon: Rocket,
    accent: "bg-orange-500/10 text-orange-300",
  },
];

export const profileCollections: ProfileCollection[] = [
  { id: 1, name: "Java Backend Toolkit", description: "Reusable prompts for designing, implementing, and reviewing production Java services.", prompts: 18, followers: 2860, updatedAt: "Updated yesterday", tags: ["Java", "Backend"], icon: Wrench, accent: "bg-violet-500/10 text-violet-300" },
  { id: 2, name: "Spring Boot Production Prompts", description: "Architecture, security, testing, observability, and delivery workflows for Spring Boot.", prompts: 14, followers: 2240, updatedAt: "Updated 3 days ago", tags: ["Spring Boot", "Production"], icon: Rocket, accent: "bg-emerald-500/10 text-emerald-300" },
  { id: 3, name: "System Design Essentials", description: "Structured prompts for scalable system design and technical decision making.", prompts: 11, followers: 1840, updatedAt: "Updated 1 week ago", tags: ["Architecture", "Scale"], icon: Boxes, accent: "bg-sky-500/10 text-sky-300" },
  { id: 4, name: "Developer Productivity", description: "Focused assistants for documentation, debugging, planning, and review.", prompts: 9, followers: 1260, updatedAt: "Updated 2 weeks ago", tags: ["Productivity", "Developer"], icon: Coffee, accent: "bg-amber-500/10 text-amber-300" },
];

export const profileActivities: ProfileActivity[] = [
  { id: 1, type: "Prompts", description: "Published version v4 of", related: "Senior Java Code Reviewer", timestamp: "2 hours ago", group: "Today", icon: Rocket, tone: "bg-violet-500/10 text-violet-300" },
  { id: 2, type: "Collections", description: "Created the collection", related: "Microservice Essentials", timestamp: "6 hours ago", group: "Today", icon: PackagePlus, tone: "bg-sky-500/10 text-sky-300" },
  { id: 3, type: "Prompts", description: "Forked", related: "Database Schema Optimizer", timestamp: "Yesterday at 16:42", group: "Yesterday", icon: GitFork, tone: "bg-emerald-500/10 text-emerald-300" },
  { id: 4, type: "Reviews", description: "Received a 5-star review on", related: "Spring Boot REST API Generator", timestamp: "Yesterday at 09:18", group: "Yesterday", icon: Star, tone: "bg-amber-500/10 text-amber-300" },
  { id: 5, type: "Followers", description: "Reached 20,000 total prompt copies", timestamp: "4 days ago", group: "This Week", icon: Trophy, tone: "bg-rose-500/10 text-rose-300" },
  { id: 6, type: "Profile", description: "Updated profile information", timestamp: "3 weeks ago", group: "Earlier", icon: UserRoundCheck, tone: "bg-white/[.04] text-slate-500" },
];

export const profileAchievements: ProfileAchievement[] = [
  { name: "Verified Creator", description: "Identity and expertise verified", earnedAt: "Earned Apr 2025", icon: ShieldCheck, tone: "bg-emerald-500/10 text-emerald-300" },
  { name: "Top Java Creator", description: "Top-ranked Java prompt author", earnedAt: "Earned Jun 2026", icon: Crown, tone: "bg-amber-500/10 text-amber-300" },
  { name: "10K Copies", description: "Prompts copied over 10,000 times", earnedAt: "Earned Feb 2026", icon: Trophy, tone: "bg-violet-500/10 text-violet-300" },
  { name: "Community Contributor", description: "Consistent community support", earnedAt: "Earned Nov 2025", icon: Heart, tone: "bg-rose-500/10 text-rose-300" },
  { name: "Early Adopter", description: "Joined during the early access period", earnedAt: "Earned Mar 2025", icon: Rocket, tone: "bg-sky-500/10 text-sky-300" },
  { name: "Highly Rated", description: "Maintain a 4.8+ creator rating", earnedAt: "Locked · 92% complete", icon: Medal, tone: "bg-white/[.04] text-slate-600", locked: true },
];

export const profileReviews: ProfileReview[] = [
  { id: 1, reviewer: "Minh Trần", initials: "MT", rating: 5, prompt: "Spring Boot REST API Generator", text: "The generated architecture is practical and production-aware. Validation and exception handling were especially strong.", date: "2 hours ago", helpful: 24, reply: "Thank you! I’m adding more database-specific examples in the next release.", tone: "bg-violet-500/15 text-violet-300" },
  { id: 2, reviewer: "Linh Hoàng", initials: "LH", rating: 5, prompt: "Senior Java Code Reviewer", text: "Clear findings without noisy stylistic comments. It caught a transaction boundary issue our initial review missed.", date: "Yesterday", helpful: 18, tone: "bg-sky-500/15 text-sky-300" },
  { id: 3, reviewer: "An Phạm", initials: "AP", rating: 4, prompt: "Microservice Architecture Planner", text: "Very useful structure. A little more guidance for data ownership would make it even stronger.", date: "4 days ago", helpful: 11, reply: "Good suggestion. Data ownership checks are planned for v6.", tone: "bg-emerald-500/15 text-emerald-300" },
];

export const suggestedCreators = [
  { name: "Minh Trần", initials: "MT", expertise: "Cloud Architecture", followers: 5100, tone: "bg-violet-500/15 text-violet-300" },
  { name: "Linh Hoàng", initials: "LH", expertise: "Technical Writing", followers: 3900, tone: "bg-sky-500/15 text-sky-300" },
  { name: "An Phạm", initials: "AP", expertise: "Product Strategy", followers: 3400, tone: "bg-emerald-500/15 text-emerald-300" },
];

export const endorsedSkills = [
  ["Java", 128],
  ["Spring Boot", 114],
  ["Backend", 96],
  ["Microservices", 82],
  ["Code Review", 74],
] as const;

export const contributionLevels = Array.from({ length: 52 * 7 }, (_, index) => {
  const wave = (index * 17 + Math.floor(index / 7) * 11) % 13;
  return wave < 4 ? 0 : wave < 7 ? 1 : wave < 10 ? 2 : wave < 12 ? 3 : 4;
});
