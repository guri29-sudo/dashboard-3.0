# Technical Architecture: Crystal OS

## 🧠 Intelligence Layer
The "brain" of Crystal OS is a two-tier system:
1.  **Tactical Advisor (Local)**: A deterministic entry engine that analyzes current task counts, completion rates, and habit streaks to provide immediate, zero-latency situational awareness.
2.  **Cortex Neural (Cloud)**: An LLM-powered service that ingest the entire user context (timetable, projects, historical logs) to generate strategic insights and motivational foresight.

## 🔄 State & Persistence Model
- **Zustand + Persist**: We use a refined Zustand store with selective persistence. Essential user session data and theme preferences are cached locally to prevent "flash of unauthenticated content" (FOUC) and ensure instant hydration.
- **Supabase Real-time**: Every mutation (task completion, habit toggle) is broadcasted via Supabase Real-time. This ensures that if a user completes an objective on mobile, the desktop dashboard updates its velocity metrics and tactical grid instantly without a refresh.

## 📦 Modular Component Design
We transitioned from a flat structure to a specialized folder hierarchy:
- **Core**: Structural pillars (Layout, Sidebar, Global Command Palette).
- **Views**: Full-page entry points (Dashboard, Projects, etc.).
- **Widgets**: Atomic, data-rich components meant for data visualization.
- **Shared**: Reuseable logic and overlays (Focus Mode, AI Assistant).

## 🎨 Design System: Neural Aesthetic
- **High-Density Information**: Unlike traditional "bubbly" SaaS designs, Crystal OS prioritizes information density.
- **Glassmorphism 2.0**: Utilizing Backdrop filters and selective opacity for a crystallized, premium feel.
- **Micro-Animations**: Extensive use of Framer Motion for non-blocking, subtle transitions that guide the user's eye towards important tactical updates.

## 🛡️ Security & Scalability
- **RLS (Row Level Security)**: All Supabase queries are hardened with explicit user-id filters and database-level security policies.
- **Optimistic Updates**: Most interactions use optimistic state updates to ensure the application feels instantaneous, regardless of network conditions.
