import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, CheckCircle2, Focus } from 'lucide-react';
import { useStore } from '../../lib/store';

const FocusWidget = () => {
    const {
        tasks,
        toggleTask,
        focusMode,
        setFocusActive,
        setFocusTime,
        setFocusOpen
    } = useStore();

    // Sync timer logic (moved to global or kept here but updating store)
    // For now, we'll keep the interval here but sync to store
    useEffect(() => {
        let interval;
        if (focusMode.isActive && focusMode.timeLeft > 0) {
            interval = setInterval(() => {
                setFocusTime(focusMode.timeLeft - 1);
            }, 1000);
        } else if (focusMode.timeLeft === 0) {
            setFocusActive(false);
        }
        return () => clearInterval(interval);
    }, [focusMode.isActive, focusMode.timeLeft, setFocusActive, setFocusTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const activeTask = (tasks || []).find(t => !t.completed);

    return (
        <div className="glass-card p-6 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-green)] rounded-full blur-[80px] opacity-5 pointer-events-none" />

            <div className="flex justify-between items-start">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${focusMode.isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} /> Live Focus
                </h3>
                <button
                    onClick={() => setFocusOpen(true)}
                    className="p-1 px-2 rounded-md bg-[var(--neon-green)]/10 text-[var(--neon-green)] text-[10px] font-bold hover:bg-[var(--neon-green)]/20 transition-all uppercase tracking-tighter"
                >
                    Expand Mode
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center my-4">
                {activeTask ? (
                    <motion.div
                        key={activeTask.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[80%]"
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                            {activeTask.title}
                        </h2>
                        <button
                            onClick={() => toggleTask(activeTask.id)}
                            className="text-xs text-[var(--neon-green)] hover:underline uppercase tracking-widest font-bold"
                        >
                            Mark Complete
                        </button>
                    </motion.div>
                ) : (
                    <p className="text-gray-500 italic">No active objectives.</p>
                )}
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="font-mono text-2xl font-bold text-white tracking-widest">
                    {formatTime(focusMode.timeLeft)}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFocusActive(!focusMode.isActive)}
                        className={`p-2 rounded-lg transition-colors ${focusMode.isActive ? 'bg-yellow-500/20 text-yellow-500' : 'bg-[var(--neon-green)]/20 text-[var(--neon-green)]'}`}
                    >
                        {focusMode.isActive ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button
                        onClick={() => { setFocusActive(false); setFocusTime(25 * 60); }}
                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 transition-colors"
                    >
                        <Square size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FocusWidget;
