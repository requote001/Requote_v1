# Requote Backend Structure

This repository keeps the current Next.js application as the web client and adds a separate NestJS API and worker foundation. The structure follows the technical implementation plan: the API owns business rules and private data access, the worker owns asynchronous jobs, and shared packages define the boundaries used by both.

## Repository shape

```text
apps/
  web/       Next.js web application target (the current app is still at the repository root)
  api/       NestJS REST and WebSocket API
  worker/    NestJS BullMQ worker for asynchronous jobs
packages/
  contracts/      Zod HTTP and event contracts
  database/       Drizzle schema, migrations, and database client boundary
  events/         Domain event names and payload boundaries
  auth/           Authorization policies and guards
  config/         Typed environment configuration
  observability/  Logging, tracing, and error setup
  ui/             Future shared accessible UI primitives
```

## API module boundaries

The API starts with a health module and empty domain modules so feature work can be added without putting business logic in one global controller. The planned domains are identity, profiles, requests, matching, offers, negotiations, messaging, agreements, deals, payments, fulfillment, notifications, trust, AI, analytics, and settings.

All HTTP routes are intended to live under `/api/v1`. The API foundation includes placeholders for request IDs, configuration validation, authorization, and global error handling. The first health endpoints are safe scaffolding only; they do not claim that a database, Redis, Supabase Auth, Paystack, or AI provider is connected.

## Worker boundary

The worker is intentionally separate from the API. It will later consume transactional outbox events through BullMQ for email, notifications, media processing, matching refreshes, payment reconciliation, and scheduled checks. Jobs should be idempotent, retryable, and reviewable through a dead-letter path.

## First implementation sequence

1. Install the API and worker dependencies in their own workspaces.
2. Add typed environment validation and a local Docker Compose profile for PostgreSQL and Redis.
3. Connect Supabase JWT validation, the database client, and migrations.
4. Implement identity, profile, request, and matching modules first.
5. Add outbox dispatch, observability, CI checks, and staging health checks before payment work.

This is a template foundation. The current web application and waitlist continue to use their existing preview and Supabase paths until each backend boundary is implemented and tested.
