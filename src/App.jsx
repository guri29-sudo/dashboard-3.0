import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/core/Layout';
import Dashboard from './components/views/Dashboard';
import Login from './components/views/Login';
import Projects from './components/views/Projects';
import Schedule from './components/views/Schedule';
import Settings from './components/views/Settings';
import Notifications from './components/views/Notifications';
import HabitTracker from './components/views/HabitTracker';
import { useStore } from './lib/store';
import { motion, AnimatePresence } from 'framer-motion';

import { onAuthStateChange } from './lib/auth';

function App() {
    const {
        user, setUser,
        themeColor, isDarkMode,
        fetchData,
        habits, setHabits, addNotification
    } = useStore();

    const location = useLocation();

    // Theme Application
    useEffect(() => {
        // Apply Mode
        if (!isDarkMode) {
            document.documentElement.classList.add('light-mode');
        } else {
            document.documentElement.classList.remove('light-mode');
        }

        // Apply Primary Theme Color & Derived Effects
        const root = document.documentElement;
        root.style.setProperty('--neon-green', themeColor);

        // Generate Dynamic Glows
        const hexToRgba = (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        root.style.setProperty('--neon-green-glow', hexToRgba(themeColor, 0.2));
        root.style.setProperty('--selection-bg', themeColor);

    }, [isDarkMode, themeColor]);

    // Auth & Data Subscription
    useEffect(() => {
        const { data: { subscription } } = onAuthStateChange(async (event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                // Fetch fresh data from Supabase
                await fetchData();

                // Run daily reset logic after data is loaded
                const { dailyReset, subscribeToChanges } = useStore.getState();
                await dailyReset();
                subscribeToChanges();
            } else {
                useStore.getState().unsubscribeFromChanges();
            }
        });

        return () => {
            subscription.unsubscribe();
            useStore.getState().unsubscribeFromChanges();
        };
    }, [setUser, fetchData]);

    // Daily Reset Logic (Simplified - ideally moved to store/backend)
    useEffect(() => {
        const checkDayChange = () => {
            // ... keep existing logic if needed, or rely on store
            // For now, let's keep it minimal
        };
        // ...
    }, []);

    if (!user) {
        return <Login />;
    }

    return (
        <Layout>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/habits" element={<HabitTracker />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* Catch all redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AnimatePresence>
        </Layout>
    );
};

export default App;
