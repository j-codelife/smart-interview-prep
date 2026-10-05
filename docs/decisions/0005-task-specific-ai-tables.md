# 0005. Task-specific AI tables instead of a chat log

**Status:** Accepted (2026-10-05)

## Context
The initial ERD modeled AI as `AIConversation` + `AIMessage`, a generic chat log. The requirements say the AI should be integrated into specific features, not offered as a generic chatbot. Each feature produces structured output: JD analysis, practice questions with feedback, and draft application responses the user edits and saves.

## Decision
Drop `AIConversation`/`AIMessage`. Store AI results in tables shaped for each task:
- `job_analyses`: 1:1 with an application, `jsonb` analysis, plus a hash of the job description to detect staleness
- `practice_sessions` / `practice_questions`: structured `jsonb` feedback and a 1–10 score
- `application_responses`: the AI draft and the user's final edited version, stored separately

Optionally, an `ai_requests` table logs usage (tokens, latency, feature) for quotas and cost tracking.

## Consequences
- Each result can be queried, validated with a schema, and reused (for example, the question generator reads the stored JD analysis).
- Keeping the AI draft and the final version separate shows what the user changed.
- A free-form chat feature would need its own tables later. It is out of scope.
