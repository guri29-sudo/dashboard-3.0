import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Activity, ChevronRight, Zap, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import HabitHeatmap from './HabitHeatmap';

const DailyObjectivesWidget = () => {
    const { habits, toggleHabit, addNotification } = useStore();
    const navigate = useNavigate();

    // Show only a few habits for the dashboard
    const displayHabits = (habits || []).slice(0, 3);

    const handleToggle = (id) => {
        const habit = habits.find(h => h.id === id);
        if (habit && !habit.completed && addNotification) {
            addNotification({
                title: 'Objective Synchronized',
                message: `Task "${habit.name}" logged to consistency map.`,
                type: 'success'
            });
        }
        toggleHabit(id);
    };

    return (
        <div className="glass-card p-8 h-[360px] flex flex-col group hover:border-[var(--neon-green)]/20 transition-all overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Activity size={16} className="text-[var(--neon-green)]" /> Consistency Protocol
                </h3>
                <button
                    onClick={() => navigate('/habits')}
                    className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-[var(--neon-green)] hover:bg-[var(--neon-green)]/10 transition-all"
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Micro Heatmap */}
            <div className="mb-6 h-[100px] overflow-hidden">
                <HabitHeatmap compact />
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                {displayHabits.length > 0 ? (
                    displayHabits.map((habit) => (
                        <div
                            key={habit.id}
                            onClick={() => handleToggle(habit.id)}
                            className="flex items-center gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-white/5 transition-all cursor-pointer group/item"
                        >
                            <div className={`transition-all ${habit.completed ? 'text-[var(--neon-green)]' : 'text-gray-600 group-hover/item:text-gray-400'}`}>
                                {habit.completed ? <CheckCircle2 size={16} /> : (habit.type === 'permanent' ? <Repeat size={16} /> : <Zap size={16} />)}
                            </div>
                            <div className="flex-1">
                                <p className={`text-[11px] font-bold transition-all ${habit.completed ? 'text-white' : 'text-gray-500'}`}>
                                    {habit.name}
                                </p>
                            </div>
                            {habit.streak > 0 && (
                                <span className="text-[8px] font-mono text-[var(--neon-green)]/40 font-black">{habit.streak}d</span>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-20">
                        <Activity size={32} className="mb-2" />
                        <p className="text-[9px] font-black uppercase">Initialize Habits</p>
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate('/habits')}
                className="mt-4 w-full py-2.5 text-[8px] text-gray-500 hover:text-[var(--neon-green)] font-black uppercase tracking-[0.3em] transition-all"
            >
                View Tactical Analysis
            </button>
        </div>
    );
};

export default DailyObjectivesWidget;
