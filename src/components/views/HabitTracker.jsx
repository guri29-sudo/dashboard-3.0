import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Trash2, X, Repeat, Zap, MessageSquare } from 'lucide-react';

import { useStore } from '../../lib/store';
import HabitHeatmap from '../widgets/HabitHeatmap';

const HabitTracker = () => {
    const { habits, addHabit, toggleHabit, deleteHabit, addNotification } = useStore();
    const [habitType, setHabitType] = useState('permanent');
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newHabit, setNewHabit] = useState('');

    const handleAddHabit = () => {
        if (!newHabit) return;
        addHabit(newHabit, habitType);
        setNewHabit('');
        setIsAdding(false);
    };

    const handleToggle = (id) => {
        const habit = habits.find(h => h.id === id);
        if (habit && !habit.completed) {
            // Check if becoming completed
            if (addNotification) {
                addNotification({
                    title: 'Protocol Match',
                    message: `Mission objective "${habit.name}" completed successfully.`,
                    type: 'success'
                });
            }
        }
        toggleHabit(id);
    };

    const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);

    return (
        <div className="glass-card p-6 md:p-10 space-y-8 h-auto pb-20 md:pb-10 min-w-[320px]">
            <div className="flex justify-between items-center">
                <h3 className="text-gray-400 font-semibold tracking-widest text-[10px] uppercase">DAILY HABIT TRACKER</h3>
                <span className="text-[var(--neon-green)] font-bold text-[10px] uppercase tracking-widest">{totalStreak} TOTAL STREAK</span>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {habits.map((habit, index) => (
                        <motion.div
                            key={habit.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ x: 5 }}
                            className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-[var(--neon-green)]/30 transition-all flex flex-col gap-4"
                        >
                            <div className="flex items-center justify-between transition-all cursor-pointer">
                                <div className="flex items-center gap-4 flex-1" onClick={() => handleToggle(habit.id)}>
                                    <div className={`p-2 rounded-xl transition-all ${habit.completed ? 'bg-[var(--neon-green)] text-black shadow-[0_0_15px_var(--neon-green-glow)]' : 'bg-white/5 text-gray-500'}`}>
                                        {habit.completed ? <CheckCircle2 size={18} /> : (habit.type === 'permanent' ? <Repeat size={18} /> : <Zap size={18} />)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-bold text-sm transition-all ${habit.completed ? 'text-white' : 'text-gray-400'}`}>{habit.name}</p>
                                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest ${habit.type === 'permanent' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                {habit.type}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{habit.streak} DAY STREAK</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setActiveNoteId(activeNoteId === habit.id ? null : habit.id)}
                                        className={`p-2 rounded-xl transition-all ${activeNoteId === habit.id ? 'text-[var(--neon-green)] bg-[var(--neon-green)]/10' : 'text-gray-600 hover:text-white'}`}
                                    >
                                        <MessageSquare size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
                                        className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Capture Thought (Note) */}
                            <AnimatePresence>
                                {activeNoteId === habit.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <textarea
                                            placeholder="Capture thought for this objective..."
                                            value={habit.note || ''}
                                            onChange={(e) => useStore.getState().updateHabit(habit.id, { note: e.target.value })}
                                            className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-gray-300 outline-none focus:border-[var(--neon-green)]/30 transition-all resize-none h-20"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {isAdding ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-2"
                >
                    <input
                        autoFocus
                        type="text"
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                        placeholder="Habit name..."
                        className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-sm outline-none focus:border-[var(--neon-green)] transition-all"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setHabitType('permanent')}
                            className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${habitType === 'permanent' ? 'bg-[var(--neon-green)] text-black border-[var(--neon-green)]' : 'bg-white/5 text-gray-500 border-white/5'}`}
                        >
                            Permanent
                        </button>
                        <button
                            onClick={() => setHabitType('temporary')}
                            className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${habitType === 'temporary' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white/5 text-gray-500 border-white/5'}`}
                        >
                            Temporary
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddHabit} className="flex-1 py-3 bg-[var(--neon-green)] text-black font-black text-[10px] rounded-xl uppercase tracking-widest">Confirm Objective</button>
                        <button onClick={() => setIsAdding(false)} className="px-4 py-3 bg-white/5 text-gray-500 rounded-xl hover:bg-white/10 transition-all"><X size={16} /></button>
                    </div>
                </motion.div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-500 font-bold text-xs hover:border-[var(--neon-green)]/50 hover:text-[var(--neon-green)] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <Plus size={14} /> Add New Habit
                </button>
            )}
        </div>
    );
};

export default HabitTracker;
