# 0003. JWT stored in an httpOnly cookie

**Status:** Accepted (2026-10-05)

## Context
Users need to log in and access only their own data. Options considered: JWT in an httpOnly cookie, server-side sessions in Postgres, and JWT in localStorage (rejected: readable by any injected script).

## Decision
On login or register, the API issues a signed JWT (user id only, ~1 day expiry) in a cookie with `HttpOnly`, `Secure` (in production), and `SameSite=Lax`. Passwords are hashed with argon2id. The frontend calls the API same-origin (Vite proxy locally, a hosting rewrite in production) so the cookie stays first-party.

## Consequences
- Stateless: no session table or session store.
- JavaScript cannot read the token, which limits the damage from XSS.
- **Logout only clears the cookie.** A stolen token stays valid until it expires. A short expiry limits the window. A token denylist or refresh-token rotation can be added later if needed.
- Cookie-based auth needs CSRF consideration. `SameSite=Lax` plus JSON-only mutation endpoints covers the MVP.
