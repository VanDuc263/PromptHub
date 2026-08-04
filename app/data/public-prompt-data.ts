import type {
  CommunityComment,
  PublicPromptExample,
  PublicPromptVariable,
  PublicPromptVersion,
} from "@/types";

export const publicPrompt = {
  title: "Spring Boot API Generator",
  description:
    "Generate production-ready Spring Boot REST APIs with validation, persistence, testing, exception handling, and clear API documentation.",
  category: "Programming",
  author: "Đức Nguyễn",
  username: "@ducnguyen",
  authorInitials: "ĐN",
  verified: true,
  publishedAt: "Published July 12, 2026",
  updatedAt: "Updated 3 hours ago",
  models: ["GPT-5", "Claude", "Gemini", "DeepSeek"],
  difficulty: "Intermediate",
  estimatedTokens: "1,860",
  estimatedCost: "~$0.02",
  language: "English",
  version: "v6",
  visibility: "Public",
  license: "MIT",
  tags: ["Spring Boot", "Backend", "REST API", "Java", "Programming"],
};

export const publicPromptContent = `You are a senior Spring Boot architect with deep expertise in production Java systems.

Generate a complete {{api_type}} API for the {{domain}} domain.

Technical requirements:

- Java 21 and Spring Boot 3.4
- {{database}} persistence with Spring Data JPA
- Request validation using Jakarta Validation
- Consistent exception handling with RFC 9457 Problem Details
- OpenAPI 3 documentation
- Unit and integration tests
- Docker-ready configuration

Use {{language}} for documentation and a {{tone}} writing style.

Return the implementation in this order:

1. Domain model and database migration
2. Repository and service layers
3. Request and response DTOs
4. REST controller
5. Exception handling
6. Tests
7. OpenAPI usage examples

Do not omit imports. Explain important architecture decisions after the code.`;

export const publicSystemMessage = "You are a senior software architect. Produce accurate, production-ready output and clearly state any assumptions.";

export const publicVariables: PublicPromptVariable[] = [
  { name: "domain", description: "Business domain or resource", defaultValue: "Product catalog", required: true, example: "Order management" },
  { name: "api_type", description: "API interaction pattern", defaultValue: "CRUD", required: true, example: "Search and CRUD" },
  { name: "database", description: "Target relational database", defaultValue: "PostgreSQL", required: true, example: "MySQL" },
  { name: "language", description: "Output language", defaultValue: "English", required: true, example: "Vietnamese" },
  { name: "tone", description: "Documentation writing style", defaultValue: "Professional", required: false, example: "Concise" },
];

export const publicExamples: PublicPromptExample[] = [
  {
    id: 1,
    title: "Product CRUD API",
    input: "Generate CRUD APIs for a Spring Boot product catalog using PostgreSQL.",
    output: `## Generated architecture

- \`Product\` aggregate with UUID identifiers
- PostgreSQL migration using Flyway
- Validated create and update request DTOs
- Transactional service with explicit boundaries
- REST controller returning RFC 9457 errors
- Testcontainers integration test suite`,
  },
  {
    id: 2,
    title: "Order workflow API",
    input: "Create an order management API with state transitions, inventory validation, and idempotent checkout.",
    output: `## Order API design

The generated implementation models order state explicitly, validates inventory before confirmation, and uses an idempotency key for checkout requests. Each transition is covered by focused unit tests.`,
  },
];

export const publicVersions: PublicPromptVersion[] = [
  { version: "v6", note: "Added Java 21 and RFC 9457 guidance", date: "3 hours ago", current: true },
  { version: "v5", note: "Improved integration testing requirements", date: "5 days ago" },
  { version: "v4", note: "Added OpenAPI output examples", date: "12 days ago" },
  { version: "v3", note: "Refined architecture constraints", date: "3 weeks ago" },
];

export const publicComments: CommunityComment[] = [
  {
    id: 1,
    author: "Minh Trần",
    initials: "MT",
    rating: 5,
    comment: "The generated layering is unusually clean. I especially like that the prompt asks for architecture decisions after the code instead of mixing explanations into every file.",
    createdAt: "2 hours ago",
    replies: 3,
    likes: 18,
    tone: "bg-violet-500/15 text-violet-300",
  },
  {
    id: 2,
    author: "Lan Phạm",
    initials: "LP",
    rating: 5,
    comment: "Used this for an internal inventory service. The validation and Problem Details sections saved a lot of setup time.",
    createdAt: "Yesterday",
    replies: 1,
    likes: 12,
    tone: "bg-sky-500/15 text-sky-300",
  },
  {
    id: 3,
    author: "Quân Lê",
    initials: "QL",
    rating: 4,
    comment: "Strong baseline. I would recommend adding an optional variable for Gradle versus Maven in a future version.",
    createdAt: "3 days ago",
    replies: 0,
    likes: 7,
    tone: "bg-emerald-500/15 text-emerald-300",
  },
];

export const publicStats = {
  views: 18400,
  copies: 3240,
  forks: 486,
  saves: 572,
  likes: 846,
  rating: 4.8,
};

export const authorStats = {
  followers: 4200,
  publicPrompts: 38,
  averageRating: 4.9,
  joinedAt: "Joined March 2025",
};

export const relatedPrompts = [
  { title: "Spring Security Blueprint", category: "Programming", author: "Minh Trần", rating: 4.9 },
  { title: "JPA Query Optimizer", category: "Code Review", author: "An Phạm", rating: 4.7 },
  { title: "Testcontainers Setup Guide", category: "Programming", author: "Linh Hoàng", rating: 4.8 },
];
