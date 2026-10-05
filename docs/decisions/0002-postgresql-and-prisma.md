# 0002. PostgreSQL with Prisma ORM

**Status:** Accepted (2026-10-05)

## Context
The data is relational (users own applications, applications own interviews) and needs ownership-scoped queries, migrations, array columns (skills, technologies), and JSON columns (structured AI output). It must run locally and on a free managed tier.

Options considered: Prisma, Drizzle, Knex/raw SQL.

## Decision
PostgreSQL, accessed through Prisma, with schema changes managed by Prisma Migrate.

## Consequences
- Declarative schema, generated types, and versioned migrations out of the box.
- Native `text[]` and `jsonb` support; free hosting on Neon or Supabase; local Postgres via Docker Compose.
- Prisma hides SQL. To keep SQL skills visible, complex queries (analytics) may use `$queryRaw` with parameters, and generated queries are reviewed during performance work.
