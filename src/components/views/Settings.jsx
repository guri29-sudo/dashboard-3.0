import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Shield, Lock, Bell, Palette as ThemeIcon, Monitor, Sun, Zap } from 'lucide-react';

import { useStore } from '../../lib/store';

const Settings = () => {
    const { themeColor, setThemeColor, isDarkMode, toggleDarkMode, user, logout } = useStore();
    const [status, setStatus] = useState('');

    const colors = [
        { name: 'Neon Green', hex: '#AFFC41' },
        { name: 'Electric Blue', hex: '#00D1FF' },
        { name: 'Cyber Red', hex: '#FF0055' },
        { name: 'Vapor Purple', hex: '#BD00FF' },
        { name: 'Solar Orange', hex: '#F68E1E' },
        { name: 'Pure White', hex: '#FFFFFF' },
    ];

    const updateColor = (hex) => {
        setThemeColor(hex);
        setStatus('Theme Optimized');
        setTimeout(() => setStatus(''), 2000);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <h1 className="text-5xl font-black tracking-tighter uppercase">System Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Identity */}
                <div className="glass-card p-10 space-y-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/5 rounded-[20px] text-[var(--neon-green)]">
                                <ThemeIcon size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold uppercase tracking-tight">Visual Identity</h2>
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Global UI Theme Override</p>
                            </div>
                        </div>

                        {/* Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 border border-white/5' : 'bg-[var(--neon-green)] text-black shadow-lg shadow-[var(--neon-green)]/20'
                                }`}
                        >
                            {isDarkMode ? <Monitor size={14} /> : <Sun size={14} />}
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {colors.map((c) => (
                            <button
                                key={c.hex}
                                onClick={() => updateColor(c.hex)}
                                className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${themeColor === c.hex ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/5' : 'border-white/5 hover:border-white/10'}`}
                            >
                                <div className="w-10 h-10 rounded-full shadow-lg border border-white/10" style={{ backgroundColor: c.hex }}></div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${themeColor === c.hex ? 'text-[var(--neon-green)]' : 'text-gray-400'}`}>{c.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Account Settings */}
                <div className="glass-card p-10 space-y-8">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                        <div className="p-4 bg-white/5 rounded-[20px] text-red-500">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-tight">Account Status</h2>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest truncate max-w-[200px]">Authorized: {user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full py-4 bg-red-500/10 border border-red-500/50 text-red-500 font-black text-xs rounded-2xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
                    >
                        Terminate Session (Logout)
                    </button>
                </div>

                {/* Experimental / Demo */}
                <div className="glass-card p-10 space-y-8 lg:col-span-2">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                        <div className="p-4 bg-white/5 rounded-[20px] text-yellow-500">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-tight">Tactical Demonstration</h2>
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Generate synthetic data for system analysis</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <button
                            onClick={async () => {
                                setStatus('Syncing Demo Data...');
                                await useStore.getState().seedHabitData();
                                setStatus('Demonstration Seeding Complete');
                                setTimeout(() => setStatus(''), 2000);
                            }}
                            className="flex-1 py-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 font-black text-xs rounded-2xl hover:bg-yellow-500 hover:text-black transition-all uppercase tracking-widest"
                        >
                            Seed 30D Consistency Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Status */}
            {status && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-10 right-10 px-8 py-4 bg-[var(--neon-green)] text-black font-black text-xs rounded-2xl shadow-2xl z-50 uppercase tracking-widest"
                >
                    {status}
                </motion.div>
            )}
        </div>
    );
};

export default Settings;
