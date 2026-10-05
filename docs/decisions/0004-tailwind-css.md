# 0004. Tailwind CSS for styling

**Status:** Accepted (2026-10-05)

## Context
The UI needs to look polished for a public portfolio deployment without a dedicated designer. Options considered: Tailwind CSS, CSS Modules.

## Decision
Use Tailwind CSS, with small shared components (Button, Input, Card) in `frontend/src/components` to avoid repeating long class lists.

## Consequences
- Fast iteration and consistent spacing and color scales.
- Markup becomes class-heavy. Extracting shared components keeps it manageable.
