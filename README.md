# Smart Internship Tracker + AI Interview Prep

A full-stack web app that helps college students and recent graduates track internship and job applications, manage interviews and follow-ups, and prepare for interviews with context-aware AI.

> **Status:** early development (Phase 2: project foundation). Features below are planned unless marked done.

## Features

**MVP (v1.0)**
- [ ] Secure accounts (register, login, logout); each user sees only their own data
- [ ] Application tracking: create, edit, delete, status changes with history
- [ ] Search, filter, sort, and paginate applications
- [ ] Interviews and follow-up dates per application
- [ ] Dashboard and basic analytics (status breakdown, applications over time, conversion rates)

**AI (v1.1)**
- [ ] Job description analysis (skills, qualifications, likely interview topics)
- [ ] Personalized interview question generation
- [ ] Structured feedback on practice answers
- [ ] Application question drafting from your real projects and experience

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite, TypeScript, React Router, TanStack Query, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript, Zod validation, pino logging |
| Database | PostgreSQL with Prisma ORM and migrations |
| Auth | JWT in an httpOnly cookie, argon2id password hashing |
| Testing | Vitest, Supertest, React Testing Library, Playwright (E2E) |
| CI/CD | GitHub Actions |

Decisions and their tradeoffs are recorded in [docs/decisions](docs/decisions).

## Repository layout

```
frontend/   React single-page app
backend/    Express REST API
docs/       Architecture, database, API, and decision records
```

## Getting started

> Setup instructions will be filled in as the foundation lands (Phase 2).

Prerequisites: Node.js 20+, npm, Docker (for local PostgreSQL).

```bash
# Frontend
cd frontend && npm install && npm run dev
```

Copy `.env.example` to `backend/.env` and fill in the values. Never commit `.env` files.

## Documentation

- [Architecture overview](docs/architecture/overview.md)
- [Database design (ERD)](docs/database/erd.md)
- [REST API](docs/api/rest-api.md)
- [Architecture decision records](docs/decisions)

## License

[MIT](LICENSE)
