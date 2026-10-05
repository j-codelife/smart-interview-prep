# Database Design

Relational design (PostgreSQL via Prisma). This revises the initial conceptual ERD from the project specification; the reasoning for each change is below.

## Changes from the initial ERD

**Statuses and interview types → no lookup table.** Use an enum defined once in code and enforced in the DB (a Prisma enum → Postgres enum, or `varchar` + `CHECK`). Adding a status later is a one-line migration. A lookup table only pays off if users can define custom statuses, which isn't planned.

**`skills` and `technologies` → Postgres `text[]` arrays, not join tables.** They're simple to read and write, queryable with `ANY` / `&&`, and GIN-indexable later. A normalized `skills` + `user_skills` design is only worth it for cross-user skill analytics or a canonical skill catalog. Even JD↔skill gap matching works fine with array intersection.

**Company → a plain string** (no Company table). Group case-insensitively in queries if needed.

**UserProfile → keep it 1:1 and separate** (keeps auth data away from profile data). Make `user_id UNIQUE`, create the profile at registration, and add `resume_text`.

**Interview → no `user_id` column.** Check ownership through `application.user_id` (one join). Denormalizing it adds a second source of truth to keep in sync.

**Replace AIConversation/AIMessage with:**
- `job_analyses`: 1:1 with Application. Stores `analysis jsonb`, `jd_hash` (detects a stale analysis after the JD is edited), `model`, `created_at`
- `application_responses`: `user_id`, nullable `application_id`, `question`, `ai_draft`, `final_response`, timestamps
- Optional (Phase 6/7): `ai_requests` usage log (`user_id`, `feature`, `model`, `input_tokens`, `output_tokens`, `latency_ms`, `status`), for quotas and cost tracking. It also makes a good resume talking point

**Practice tables:** `feedback jsonb` (strengths, weaknesses, suggestions, improved_answer) instead of free text; `score smallint CHECK 1–10`; add `position` (ordering) and `answered_at`.

**Add `application_status_history`:** `application_id`, `from_status` (nullable), `to_status`, `changed_at`.

**General conventions:**
- UUID primary keys (`gen_random_uuid()`)
- `timestamptz` timestamps
- Email stored lowercased, with a unique index
- Cascades: deleting a User cascades to everything. Deleting an Application cascades to interviews, history and analysis, and sets `application_id` to NULL on practice sessions and responses
- Indexes: `applications(user_id, status)`, `(user_id, date_applied)`, `(user_id, updated_at)`, `interviews(application_id, interview_date)`

```mermaid
erDiagram
  USER ||--|| USER_PROFILE : has
  USER ||--o{ APPLICATION : owns
  USER ||--o{ PROJECT : owns
  USER ||--o{ EXPERIENCE : owns
  APPLICATION ||--o{ INTERVIEW : has
  APPLICATION ||--o{ APPLICATION_STATUS_HISTORY : logs
  APPLICATION ||--o| JOB_ANALYSIS : "analyzed by"
  USER ||--o{ PRACTICE_SESSION : runs
  APPLICATION |o--o{ PRACTICE_SESSION : "targets"
  PRACTICE_SESSION ||--o{ PRACTICE_QUESTION : contains
  USER ||--o{ APPLICATION_RESPONSE : writes
  APPLICATION |o--o{ APPLICATION_RESPONSE : "for"

  USER { uuid id PK; string first_name; string last_name; string email UK; string password_hash; timestamptz created_at; timestamptz updated_at }
  USER_PROFILE { uuid id PK; uuid user_id FK,UK; string school; string major; date graduation_date; text bio; text_array skills; text resume_text }
  APPLICATION { uuid id PK; uuid user_id FK; string company; string position; string location; enum employment_type; string job_url; int salary_min; int salary_max; enum salary_period; enum status; text job_description; date date_applied; date follow_up_date; text notes }
  APPLICATION_STATUS_HISTORY { uuid id PK; uuid application_id FK; enum from_status; enum to_status; timestamptz changed_at }
  INTERVIEW { uuid id PK; uuid application_id FK; enum interview_type; int round; bool is_final; timestamptz interview_date; string interviewer_name; enum outcome; text notes }
  PROJECT { uuid id PK; uuid user_id FK; string name; text description; text_array technologies; string project_url; string repository_url }
  EXPERIENCE { uuid id PK; uuid user_id FK; string organization; string title; text description; date start_date; date end_date }
  JOB_ANALYSIS { uuid id PK; uuid application_id FK,UK; jsonb analysis; string jd_hash; string model }
  PRACTICE_SESSION { uuid id PK; uuid user_id FK; uuid application_id FK; enum session_type; timestamptz completed_at }
  PRACTICE_QUESTION { uuid id PK; uuid session_id FK; int position; text question; enum question_type; text user_answer; jsonb feedback; smallint score; timestamptz answered_at }
  APPLICATION_RESPONSE { uuid id PK; uuid user_id FK; uuid application_id FK; text question; text ai_draft; text final_response }
```
The MVP migration creates only USER, USER_PROFILE, APPLICATION, APPLICATION_STATUS_HISTORY and INTERVIEW. The other tables arrive in Phase 6.

