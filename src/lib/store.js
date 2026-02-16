import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from './supabase';

export const useStore = create(
    persist(
        (set, get) => ({
            // --- USER STATE ---
            user: null,
            tasks: [],
            habits: [],
            projects: [],
            timetable: [],
            habitLogs: [],
            notifications: [],
            latestInsight: null,
            systemStatus: 'optimal', // optimal | syncing | error | offline
            lastError: null,

            setLatestInsight: (insight) => set({ latestInsight: insight }),
            setUser: (user) => set({ user }),
            setSystemStatus: (status) => set({ systemStatus: status }),

            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null, tasks: [], habits: [], projects: [], timetable: [], habitLogs: [], notifications: [], systemStatus: 'optimal' });
                localStorage.removeItem('personal-dashboard-prefs');
            },

            // --- THEME STATE ---
            themeColor: '#AFFC41', // Default Neon Green
            isDarkMode: true,
            setThemeColor: (color) => {
                set({ themeColor: color });
                const user = get().user;
                if (user) supabase.from('profiles').update({ theme_color: color }).eq('id', user.id).then();
            },
            toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

            // --- FOCUS & AMBIENT STATE ---
            focusMode: {
                isActive: false,
                isOpen: false,
                timeLeft: 25 * 60,
                activeTaskId: null,
                sessionType: 'focus', // focus | break
            },
            ambient: {
                track: 'none', // none | rain | lofi | waves | white
                volume: 0.5,
                isPlaying: false,
            },

            setFocusActive: (isActive) => set((state) => ({
                focusMode: { ...state.focusMode, isActive }
            })),
            setFocusOpen: (isOpen) => set((state) => ({
                focusMode: { ...state.focusMode, isOpen }
            })),
            setFocusTime: (timeLeft) => set((state) => ({
                focusMode: { ...state.focusMode, timeLeft }
            })),
            setAmbient: (updates) => set((state) => ({
                ambient: { ...state.ambient, ...updates }
            })),

            // --- INITIAL LOAD ---
            fetchData: async () => {
                const user = get().user;
                if (!user) return;

                set({ systemStatus: 'syncing' });
                try {
                    const [tasks, habits, projects, timetable, notifications, profile, habitLogs] = await Promise.all([
                        supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at'),
                        supabase.from('habits').select('*').eq('user_id', user.id).order('created_at'),
                        supabase.from('projects').select('*').eq('user_id', user.id).order('created_at'),
                        supabase.from('timetable').select('*').eq('user_id', user.id).order('created_at'),
                        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
                        supabase.from('profiles').select('theme_color').eq('id', user.id).single(),
                        supabase.from('habit_logs').select('*').eq('user_id', user.id).gte('date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                    ]);

                    if (tasks.error || habits.error || projects.error || timetable.error) {
                        throw new Error("Operational Data Fetch Failure");
                    }

                    if (profile.data) {
                        set({ themeColor: profile.data.theme_color });
                    }

                    set({
                        tasks: tasks.data || [],
                        habits: habits.data || [],
                        projects: projects.data || [],
                        timetable: timetable.data || [],
                        notifications: notifications.data || [],
                        habitLogs: habitLogs.data || [],
                        systemStatus: 'optimal',
                        lastError: null
                    });
                } catch (error) {
                    console.error("Fetch Error:", error);
                    set({ systemStatus: 'error', lastError: error.message });
                }
            },

            // --- ACTIONS (Optimistic Updates + Supabase Sync) ---

            // Tasks
            setTasks: (tasks) => set({ tasks }),
            addTask: async (title) => {
                const { user } = get();
                if (!user) return;
                const tempId = Date.now();
                set((state) => ({ tasks: [...state.tasks, { id: tempId, title, completed: false, created_at: new Date().toISOString() }] }));

                const { data, error } = await supabase.from('tasks').insert({ title, user_id: user.id }).select().single();
                if (error) {
                    console.error('Error adding task:', error);
                    return;
                }
                if (data) set((state) => ({ tasks: state.tasks.map(t => t.id === tempId ? data : t) }));
            },
            toggleTask: async (id) => {
                const task = get().tasks.find(t => t.id === id);
                if (!task) return;
                const newStatus = !task.completed;
                const completedAt = newStatus ? new Date().toISOString() : null;

                set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, completed: newStatus, completed_at: completedAt } : t) }));
                const { error } = await supabase.from('tasks').update({ completed: newStatus, completed_at: completedAt }).eq('id', id);
                if (error) console.error('Error toggling task:', error);
            },
            deleteTask: async (id) => {
                set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
                const { error } = await supabase.from('tasks').delete().eq('id', id);
                if (error) console.error('Error deleting task:', error);
            },

            // Habits
            setHabits: (habits) => set({ habits }),
            addHabit: async (name, type = 'permanent') => {
                const { user } = get();
                if (!user) return;
                const tempId = Date.now();
                const newHabit = { name, user_id: user.id, completed: false, streak: 0, type, note: '' };

                set((state) => ({ habits: [...state.habits, { ...newHabit, id: tempId }] }));

                const { data, error } = await supabase.from('habits').insert(newHabit).select().single();
                if (error) {
                    console.error('Error adding habit:', error);
                    return;
                }
                if (data) set((state) => ({ habits: state.habits.map(h => h.id === tempId ? data : h) }));
            },
            updateHabit: async (id, updates) => {
                set((state) => ({ habits: state.habits.map(h => h.id === id ? { ...h, ...updates } : h) }));
                const { error } = await supabase.from('habits').update(updates).eq('id', id);
                if (error) console.error('Error updating habit:', error);
            },
            toggleHabit: async (id) => {
                const habits = get().habits;
                const habit = habits.find(h => h.id === id);
                if (!habit) return;

                const user = get().user;
                const newStatus = !habit.completed;
                let updatedStreak = habit.streak;
                let lastCompleted = habit.last_completed_at;

                if (newStatus) {
                    updatedStreak += 1;
                    lastCompleted = new Date().toISOString();

                    // Log to habit_logs
                    const newLog = {
                        user_id: user.id,
                        habit_id: id,
                        completed_at: lastCompleted,
                        date: new Date().toISOString().split('T')[0]
                    };
                    set(state => ({ habitLogs: [...state.habitLogs, newLog] }));
                    const { error: logError } = await supabase.from('habit_logs').upsert(newLog);
                    if (logError) console.error('Error upserting habit log:', logError);
                } else {
                    updatedStreak = Math.max(0, updatedStreak - 1);
                    // Remove from habit_logs
                    const today = new Date().toISOString().split('T')[0];
                    set(state => ({ habitLogs: state.habitLogs.filter(l => !(l.habit_id === id && l.date === today)) }));
                    const { error: deleteLogError } = await supabase.from('habit_logs').delete().match({ habit_id: id, date: today });
                    if (deleteLogError) console.error('Error deleting habit log:', deleteLogError);
                }

                set((state) => ({ habits: state.habits.map(h => h.id === id ? { ...h, completed: newStatus, streak: updatedStreak, last_completed_at: lastCompleted } : h) }));
                const { error } = await supabase.from('habits').update({ completed: newStatus, streak: updatedStreak, last_completed_at: lastCompleted }).eq('id', id);
                if (error) console.error('Error toggling habit:', error);

                // If temporary and completed, maybe delete? User said "temporary tasks... repeated every day as daily habit" 
                // Wait, "temporary tasks and permanent tasks". standard habits are permanent. 
                // Let's keep temporary tasks until the user deletes them or they expire.
            },
            lastResetDate: null,

            dailyReset: async () => {
                const { habits, user, lastResetDate } = get();
                if (!user) return;

                // Use local date for reset logic to match user's physical day
                const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local

                if (lastResetDate === today) return; // Already reset for today

                const updatedHabits = habits.map(h => {
                    if (h.type === 'permanent') {
                        // Check if last completion was on a previous day
                        if (h.last_completed_at) {
                            const lastDate = new Date(h.last_completed_at).toLocaleDateString('en-CA');
                            if (lastDate !== today) {
                                return { ...h, completed: false };
                            }
                        }
                    }
                    return h;
                });

                set({ habits: updatedHabits, lastResetDate: today });

                // Only reset in DB if the last completion was before today's local start
                const localStartOfToday = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
                await supabase.from('habits')
                    .update({ completed: false })
                    .eq('user_id', user.id)
                    .eq('type', 'permanent')
                    .lt('last_completed_at', localStartOfToday);
            },
            deleteHabit: async (id) => {
                set((state) => ({ habits: state.habits.filter(h => h.id !== id) }));
                await supabase.from('habits').delete().eq('id', id);
            },

            // Projects
            setProjects: (projects) => set({ projects }),
            addProject: async (project) => {
                const user = get().user;
                if (!user) return;
                const tempId = Date.now();
                const newProject = { ...project, user_id: user.id, completed: false, progress: project.progress || 0 };

                set((state) => ({ projects: [...state.projects, { ...newProject, id: tempId }] }));
                const { data } = await supabase.from('projects').insert(newProject).select().single();
                if (data) set((state) => ({ projects: state.projects.map(p => p.id === tempId ? data : p) }));
            },
            toggleProject: async (id) => {
                const projects = get().projects;
                const project = projects.find(p => p.id === id);
                if (!project) return;
                const newStatus = !project.completed;

                set((state) => ({ projects: state.projects.map(p => p.id === id ? { ...p, completed: newStatus } : p) }));
                await supabase.from('projects').update({ completed: newStatus }).eq('id', id);
            },
            deleteProject: async (id) => {
                set((state) => ({ projects: state.projects.filter(p => p.id !== id) }));
                await supabase.from('projects').delete().eq('id', id);
            },

            // Timetable
            setTimetable: (timetable) => set({ timetable }),
            addTimetableItem: async (item) => {
                const user = get().user;
                if (!user) return;
                const tempId = Date.now();
                const newItem = { ...item, user_id: user.id, completed: false };

                set((state) => ({ timetable: [...state.timetable, { ...newItem, id: tempId }] }));
                const { data } = await supabase.from('timetable').insert(newItem).select().single();
                if (data) set((state) => ({ timetable: state.timetable.map(t => t.id === tempId ? data : t) }));
            },
            updateTimetableItem: async (id, updates) => {
                set((state) => ({ timetable: state.timetable.map(t => t.id === id ? { ...t, ...updates } : t) }));
                await supabase.from('timetable').update(updates).eq('id', id);
            },
            toggleTimetableItem: async (id) => {
                const timetable = get().timetable;
                const item = timetable.find(t => t.id === id);
                if (!item) return;
                const newStatus = !item.completed;

                set((state) => ({ timetable: state.timetable.map(t => t.id === id ? { ...t, completed: newStatus } : t) }));
                await supabase.from('timetable').update({ completed: newStatus }).eq('id', id);
            },
            deleteTimetableItem: async (id) => {
                set((state) => ({ timetable: state.timetable.filter(t => t.id !== id) }));
                await supabase.from('timetable').delete().eq('id', id);
            },

            // Notifications
            setNotifications: (notifications) => set({ notifications }),
            addNotification: async (notification) => {
                const user = get().user;
                if (!user) return;

                // --- FOCUS MODE SUPPRESSION ---
                if (get().focusMode.isActive) {
                    console.log('Focus Mode Active: Suppressing non-critical notification.');
                    // Optionally, we could still save it to DB but not update local state
                    // or flag it as 'suppressed'/ 'low priority'.
                    // For "Absolute Focus", we'll skip adding it to the active list.
                    return;
                }

                const tempId = Date.now();
                // Notifications might be too chatty for DB, but we'll sync them
                const newNotif = { ...notification, user_id: user.id, read: false, type: notification.type || 'info' };

                set((state) => ({ notifications: [{ ...newNotif, id: tempId, time: 'Just now' }, ...state.notifications] }));
                const { data } = await supabase.from('notifications').insert(newNotif).select().single();
                if (data) set((state) => ({ notifications: state.notifications.map(n => n.id === tempId ? { ...data, time: 'Just now' } : n) }));
            },
            markNotificationRead: async (id) => {
                set((state) => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
                await supabase.from('notifications').update({ read: true }).eq('id', id);
            },
            deleteNotification: async (id) => {
                set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) }));
                await supabase.from('notifications').delete().eq('id', id);
            },
            clearAllNotifications: async () => {
                set({ notifications: [] });
                const user = get().user;
                if (user) await supabase.from('notifications').delete().eq('user_id', user.id);
            },

            // --- REAL-TIME SUBSCRIPTIONS ---
            subscriptions: [],
            subscribeToChanges: () => {
                const user = get().user;
                if (!user) return;

                const { subscriptions } = get();
                if (subscriptions.length > 0) return; // Already subscribed

                const channel = supabase.channel('db-changes')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public' },
                        (payload) => {
                            console.log('Real-time sync event:', payload.table, payload.eventType);
                            get().fetchData();
                        }
                    )
                    .subscribe((status) => {
                        console.log('Supabase real-time status:', status);
                    });

                set({ subscriptions: [channel] });
            },
            unsubscribeFromChanges: () => {
                const { subscriptions } = get();
                subscriptions.forEach(sub => supabase.removeChannel(sub));
                set({ subscriptions: [] });
            },

            // --- COMPUTED SELECTORS (Helpers) ---
            getCompletionRate: () => {
                const state = get();
                const total = state.habits.length + state.tasks.length;
                if (total === 0) return 0;
                const completed = state.habits.filter(h => h.completed).length + state.tasks.filter(t => t.completed).length;
                return Math.round((completed / total) * 100);
            },

            seedHabitData: async () => {
                const user = get().user;
                if (!user) return;

                console.log('--- SEEDING SYSTEM DATA ---');

                // 1. Ensure at least one habit exists
                let habitId;
                const { data: existingHabits } = await supabase.from('habits').select('id').eq('user_id', user.id).limit(1);

                if (!existingHabits?.length) {
                    const { data: newHabit } = await supabase.from('habits').insert({
                        name: 'Deep Work Session',
                        type: 'permanent',
                        user_id: user.id,
                        completed: false,
                        streak: 12
                    }).select().single();
                    habitId = newHabit?.id;
                } else {
                    habitId = existingHabits[0].id;
                }

                if (!habitId) return;

                // 2. Generate logs for the last 30 days
                const logs = [];
                const now = new Date();
                for (let i = 0; i < 30; i++) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];

                    // Randomly decide intensity (number of logs for that day)
                    const count = Math.floor(Math.random() * 6); // 0 to 5 logs per day
                    for (let j = 0; j < count; j++) {
                        logs.push({
                            user_id: user.id,
                            habit_id: habitId,
                            date: dateStr,
                            completed_at: new Date(date.getTime() + j * 3600000).toISOString()
                        });
                    }
                }

                // 3. Batch insert (clear old demo logs if needed, but upsert is safer)
                if (logs.length > 0) {
                    await supabase.from('habit_logs').upsert(logs);
                    console.log(`Seeded ${logs.length} habit logs.`);
                }

                get().fetchData(); // Refresh local state
            }
        }),
        {
            name: 'personal-dashboard-prefs',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isDarkMode: state.isDarkMode,
                themeColor: state.themeColor,
                tasks: state.tasks,
                habits: state.habits,
                projects: state.projects,
                timetable: state.timetable,
                notifications: state.notifications,
                latestInsight: state.latestInsight,
                lastResetDate: state.lastResetDate
            }),
        }
    )
);
