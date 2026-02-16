# SOP: Push Notifications & Reminders

## Goal
To deliver real-time alerts for deadlines and AI-generated motivation via PWA Push API.

## Inputs
- `notifications` table inserts.
- User `push_subscriptions`.

## Logic
1. Monitor `notifications` table via Supabase Webhooks.
2. Trigger `push_sender.ts` Edge Function.
3. Fetch user's active push subscriptions.
4. Deliver payload (title, body, icon, click_action) via Web Push protocol.

## Tool Logic
- Use VAPID keys stored in `.env`.
- Service worker handles the background display.

## Edge Cases
- **Permission Denied:** Silent fail but log status in DB.
- **Token Expired:** Remove invalid subscription from `push_subscriptions`.
