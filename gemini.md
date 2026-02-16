# Project Constitution (gemini.md)

## Data Schemas (Supabase Table Structures)

### `tasks`
```json
{
  "id": "uuid",
  "created_at": "timestamp",
  "title": "text",
  "description": "text",
  "status": "enum (pending, in_progress, completed)",
  "priority": "enum (low, medium, high)",
  "due_date": "timestamp",
  "user_id": "uuid"
}
```

### `notifications`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "text",
  "message": "text",
  "type": "enum (task_reminder, ai_suggestion, system)",
  "is_read": "boolean",
  "created_at": "timestamp"
}
```

## Behavioral Rules
- **Free of Cost:** Prioritize free tiers (Supabase Free, Gemini API Free).
- **AI Integration:** AI should assist with task breakdown, prioritization, and motivational notifications.
- **UI/UX:** Must support Light/Dark mode toggle (User provided UI).
- **Connectivity:** Architecture must handle Supabase real-time subscriptions for notifications.
- **Deterministic Logic:** LLM used for "Navigation" layer but core status updates are deterministic.

## Maintenance Log
- **2026-02-13:** Project Core Built. Verified Supabase (REST) and Gemini (2.5 Flash) connectivity.
- **Dependencies:** React 18, Vite 5, Framer Motion, Supabase-js.
- **Trigger Strategy:** Manual deployment to Vercel/Netlify. AI cycle triggered via `navigation.py`.

## Environment Configuration
| Variable | Usage |
| --- | --- |
| `VITE_SUPABASE_URL` | Frontend connection to Supabase |
| `VITE_SUPABASE_ANON_KEY` | Frontend public key |
| `GEMINI_API_KEY` | Key for `ai_assistant.py` logic |

## Architectural Invariants
- 3-Layer A.N.T. Architecture: Architecture (SOPs), Navigation (Logic), Tools (APIs).
