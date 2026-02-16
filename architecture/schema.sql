-- Personal Dashboard Supabase Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Tasks Table
create table if not exists public.tasks (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    status text default 'pending' check (status in ('pending', 'in_progress', 'completed')),
    priority text default 'medium' check (priority in ('low', 'medium', 'high')),
    due_date timestamp with time zone,
    user_id uuid references auth.users not null
);

-- Notifications Table
create table if not exists public.notifications (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users not null,
    title text not null,
    message text not null,
    type text check (type in ('task_reminder', 'ai_suggestion', 'system')),
    is_read boolean default false
);

-- Push Subscriptions Table
create table if not exists public.push_subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    subscription_json jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habits Table
create table if not exists public.habits (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users not null,
    name text not null,
    streak integer default 0,
    last_completed_at timestamp with time zone
);

-- Time Table (User Schedule)
create table if not exists public.time_table (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    day_of_week text not null, -- 'Monday', 'Tuesday', etc.
    start_time time not null,
    end_time time not null,
    activity text not null
);

-- RLS Policies
alter table public.tasks enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.habits enable row level security;
alter table public.time_table enable row level security;

-- Policies (Simplified for user 'Goat')
create policy "Users can manage their own habits" on public.habits
    for all using (auth.uid() = user_id);
create policy "Users can manage their own time_table" on public.time_table
    for all using (auth.uid() = user_id);
