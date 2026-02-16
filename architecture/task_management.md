# SOP: Task Prioritization & AI Assistance

## Goal
To use AI to analyze tasks and provide actionable breakdowns and prioritization to increase user productivity.

## Inputs
- `tasks` table data (title, description, status, priority, due_date).
- User productivity context (current time, pending tasks).

## AI Logic
1. Fetch all pending tasks with high priority or near due dates.
2. Send to Gemini 2.5 Flash to:
   - Identify the "Quick Win" (short task to gain momentum).
   - Breakdown complex tasks into 3 sub-steps.
   - Suggest a "Focus Session" order.

## Tool Logic
- Use `ai_helper.ts` (Supabase Edge Function) or `tools/ai_assistant.py` for local processing.
- Output formatted as a `notification` item in the database.

## Edge Cases
- **Rate Limits:** If Gemini API returns 429, retry after 60s or skip AI analysis and use deterministic priority.
- **Empty Task List:** Prompt user to add a "Seed Task" to start the day.
