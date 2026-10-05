# REST API

Planned endpoints. Each is documented in more detail as it is implemented.

All routes are prefixed with `/api/v1`. Private routes require the auth cookie.

Error shape: `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }`
Status codes:
- 400 validation
- 401 unauthenticated
- 404 not found / not owned
- 409 email taken
- 429 rate limited
- 502 AI provider failure

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | liveness + DB check |
| POST | `/auth/register` | 201, sets cookie |
| POST | `/auth/login` | 200, sets cookie; generic "invalid credentials" message |
| POST | `/auth/logout` | 204 |
| GET | `/auth/me` | 200 / 401 |
| GET / PUT | `/profile` | own profile |
| GET | `/applications?search=&status=APPLIED,INTERVIEWING&location=&sort=dateApplied\|updatedAt&order=desc&page=1&pageSize=20` | `{ data, page, pageSize, total }` |
| POST | `/applications` | 201 |
| GET / PATCH / DELETE | `/applications/:id` | 200 / 200 / 204. A PATCH that changes status writes history in the same transaction |
| GET | `/applications/:id/status-history` | |
| GET / POST | `/applications/:id/interviews` | nested create/list |
| PATCH / DELETE | `/interviews/:id` | shallow routes; ownership via the application |
| GET | `/interviews?from=&to=` | across all applications (calendar/upcoming) |
| GET | `/dashboard` | counts, upcoming interviews, follow-ups, recent activity |
| GET | `/analytics?from=&to=` | byStatus, perWeek, interviewRate, offerRate |
| *v1.1* | | |
| CRUD | `/projects`, `/projects/:id`, `/experiences`, `/experiences/:id` | |
| POST / GET | `/applications/:id/job-analysis` | generate (201) / fetch, with a `stale` flag |
| POST | `/practice-sessions` | `{ applicationId?, sessionType, count }` → creates the session and AI questions |
| GET | `/practice-sessions`, `/practice-sessions/:id` | |
| PATCH | `/practice-sessions/:id` | mark complete |
| POST | `/practice-questions/:id/answer` | `{ answer }` → saves the answer and returns structured feedback |
| POST | `/application-responses/draft` | `{ applicationId?, question }` → returns a draft and does NOT save it |
| CRUD | `/application-responses` | the user saves their edited version |

