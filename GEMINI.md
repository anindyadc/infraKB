# InfraKB Project Mandates

This document contains foundational mandates for all AI agents working on the InfraKB codebase. Adhere to these principles to maintain system integrity and architectural consistency.

## 1. Architectural Principles

- **Layered Backend**: Maintain a strict separation between Routers, Controllers, and Services. Logic must reside in Services.
- **Stateless Auth**: Use JWT for access tokens and DB-backed refresh tokens. Never store sensitive data in local storage on the frontend; use httpOnly cookies for refresh tokens and memory-based state for access tokens.
- **Type Safety**: TypeScript is mandatory across both backend and frontend. Avoid `any` at all costs. Use Zod for runtime validation and Prisma for type-safe database queries.
- **Markdown-Native**: Documents are stored as raw Markdown. The frontend is responsible for rendering. The rendering pipeline must include sanitization (`DOMPurify`).

## 2. Coding Standards

- **ES Modules**: Use `.js` or `.ts` extensions in imports (NodeNext resolution).
- **Service-Oriented**: Controllers should handle request parsing and response formatting, while services handle business logic and database interactions.
- **Component Design**: Use functional components with hooks in React. Prioritize `shadcn/ui` patterns and Tailwind CSS for styling.
- **State Management**: Use Zustand for global UI and auth state. Use TanStack Query for all server-state (fetching, caching, mutations).

## 3. Database & Search

- **Prisma Schema**: All schema changes must be done via `prisma/schema.prisma` and migrations.
- **FULLTEXT Search**: Search functionality relies on MySQL `FULLTEXT` indexes. Ensure query optimization and appropriate fallbacks for short strings.
- **Soft Deletes**: Use `isActive` flag for user "deletion" to preserve activity logs. Hard delete documents only when specifically requested.

## 4. Security

- **Credential Protection**: Never hardcode secrets. Use the validated `config/env.ts` in the backend and `import.meta.env` in the frontend.
- **RBAC**: Always verify user roles (`ADMIN`, `EDITOR`, `VIEWER`) using the `authorize` middleware for sensitive routes.
- **Input Validation**: Every API endpoint receiving data must validate it using a Zod schema before processing.
