# 0001. Use TypeScript for frontend and backend

**Status:** Accepted (2026-10-05)

## Context
The starter template was plain JavaScript with no application code yet, so switching cost almost nothing. The stack relies on Prisma and Zod, which both generate or infer types.

## Decision
Write both `frontend/` and `backend/` in TypeScript with `strict` mode enabled.

## Consequences
- Types flow from the Prisma schema and Zod validators through services to API responses, catching mismatches at compile time.
- CI gains a `typecheck` step.
- More upfront learning and some boilerplate compared to JavaScript.
