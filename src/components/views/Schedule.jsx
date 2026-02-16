import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Trash2, Calendar, Coffee, Laptop, Book, Brain, Heart, User, ChevronLeft, ChevronRight, Repeat, CalendarCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { Circle, Edit3 } from 'lucide-react';

import { useStore } from '../../lib/store';

const Schedule = () => {
    const { timetable, addTimetableItem, updateTimetableItem, deleteTimetableItem, toggleTimetableItem } = useStore();
    // Current focus date (defaults to today)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [activity, setActivity] = useState('');
    const [type, setType] = useState('Work');
    const [recurrence, setRecurrence] = useState('weekly'); // weekly | once
    const [customDate, setCustomDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    // Week calculation
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const handleSaveActivity = () => {
        if (!activity) return;

        const entryData = {
            day: format(currentDate, 'EEEE'),
            startTime,
            endTime,
            activity,
            type,
            recurrence,
            date: recurrence === 'once' ? customDate : null
        };

        if (editingId) {
            updateTimetableItem(editingId, entryData);
            setEditingId(null);
        } else {
            addTimetableItem(entryData);
        }

        setActivity('');
        setIsAdding(false);
    };

    const handleEdit = (entry) => {
        setEditingId(entry.id);
        setActivity(entry.activity);
        setStartTime(entry.startTime);
        setEndTime(entry.endTime);
        setType(entry.type);
        setRecurrence(entry.recurrence);
        if (entry.date) setCustomDate(entry.date);
        setIsAdding(true);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Health': return <Heart size={20} />;
            case 'Learning': return <Book size={20} />;
            case 'Personal': return <User size={20} />;
            case 'Work': default: return <Laptop size={20} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Health': return 'bg-rose-500/10 text-rose-500';
            case 'Learning': return 'bg-blue-500/10 text-blue-500';
            case 'Personal': return 'bg-purple-500/10 text-purple-500';
            case 'Work': default: return 'bg-[var(--neon-green)]/10 text-[var(--neon-green)]';
        }
    };

    // Advanced Filtering Logic
    const dailyActivities = (timetable || []).filter(entry => {
        const entryDay = entry.day;
        const currentDayName = format(currentDate, 'EEEE');
        const currentDateStr = format(currentDate, 'yyyy-MM-dd');

        // Weekly recurring tasks on the same day of the week
        if (entry.recurrence === 'weekly' && entryDay === currentDayName) return true;

        // One-time tasks on the specific date
        if (entry.recurrence === 'once' && entry.date === currentDateStr) return true;

        return false;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-[var(--text-main)]">
                <div className="md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse"></div>
                        <h2 className="text-[10px] font-black text-[var(--neon-green)] uppercase tracking-[0.4em]">Tactical Grid</h2>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">Timetable</h1>
                </div>
                <div className="w-full md:w-auto mt-4 md:mt-0">
                    <div className="px-4 md:px-6 py-3 md:py-4 bg-[var(--card-bg)] border border-white/5 rounded-xl md:rounded-2xl flex items-center justify-between md:justify-start gap-4 shadow-xl">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{format(currentDate, 'MMMM yyyy')}</p>
                            <p className="font-bold text-lg leading-none">{format(currentDate, 'EEEE, do')}</p>
                        </div>
                        <div className="p-3 bg-[var(--neon-green)] text-black rounded-xl">
                            <Calendar size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Date-Aware Horizontal Carousel (Aule Inspiration) */}
            <div className="bg-[var(--card-bg)] border border-white/5 p-6 rounded-xl overflow-hidden flex items-center justify-between gap-4 shadow-inner transition-colors duration-300">
                <button
                    onClick={() => setCurrentDate(addDays(currentDate, -7))}
                    className="p-3 bg-white/5 rounded-2xl hover:bg-[var(--neon-green)] hover:text-black transition-all text-gray-500 shrink-0"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-4 md:gap-8 justify-center">
                    {days.map((d) => (
                        <motion.div
                            key={d.toISOString()}
                            onClick={() => setCurrentDate(d)}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center gap-1 cursor-pointer transition-all min-w-[55px] md:min-w-[90px] p-2 md:p-4 rounded-xl md:rounded-2xl relative ${isSameDay(currentDate, d) ? 'bg-[var(--neon-green)]/[0.1] border border-[var(--neon-green)]/20 shadow-lg shadow-[var(--neon-green)]/5' : 'bg-white/[0.02] opacity-40 hover:opacity-100 hover:bg-white/5'}`}
                        >
                            {isSameDay(new Date(), d) && (
                                <span className="absolute -top-1 px-2 py-0.5 bg-[var(--neon-orange)] text-white text-[8px] font-black rounded-full uppercase tracking-tighter shadow-lg">Today</span>
                            )}
                            {isSameDay(currentDate, d) && !isSameDay(new Date(), d) && (
                                <span className="absolute -top-1 px-2 py-0.5 bg-[var(--neon-green)] text-black text-[8px] font-black rounded-full uppercase tracking-tighter shadow-lg">Focus</span>
                            )}
                            <span className={`text-2xl md:text-3xl font-black ${isSameDay(currentDate, d) ? 'text-[var(--neon-green)]' : ''}`}>{format(d, 'd')}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{format(d, 'EEE')}</span>
                        </motion.div>
                    ))}
                </div>

                <button
                    onClick={() => setCurrentDate(addDays(currentDate, 7))}
                    className="p-3 bg-white/5 rounded-2xl hover:bg-[var(--neon-green)] hover:text-black transition-all text-gray-500 shrink-0"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 md:pb-0">
                <AnimatePresence mode="popLayout">
                    {dailyActivities.map((activity) => (
                        <motion.div
                            key={activity.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`glass-card flex flex-col items-center justify-between p-8 text-center gap-6 border-white/5 group relative transition-all duration-300 ${activity.completed ? 'opacity-60 grayscale-[0.5] border-l-[var(--neon-green)]/40 shadow-[inset_0_0_20px_rgba(175,252,65,0.05)]' : 'hover:border-[var(--neon-green)]/30'}`}
                        >
                            {/* Permanent Visible Checkbox */}
                            <div
                                onClick={() => toggleTimetableItem(activity.id)}
                                className={`absolute top-6 left-6 cursor-pointer transition-all duration-300 z-10 p-2 rounded-xl ${activity.completed ? 'text-[var(--neon-green)] bg-[var(--neon-green)]/10 scale-110' : 'text-gray-700 hover:text-gray-400 bg-white/5'}`}
                            >
                                {activity.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </div>

                            <div className="absolute top-6 right-6 flex items-center gap-1 opacity-100 transition-opacity z-20">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(activity); }}
                                    className="text-gray-600 hover:text-[var(--neon-green)] p-2 transition-colors bg-white/5 rounded-lg hover:bg-[var(--neon-green)]/10"
                                    title="Refit Protocol (Edit)"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteTimetableItem(activity.id); }}
                                    className="text-gray-600 hover:text-red-500 p-2 transition-colors bg-white/5 rounded-lg hover:bg-red-500/10"
                                    title="Terminate Protocol (Delete)"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="mt-8 flex flex-col items-center gap-6 w-full">
                                <div className={`p-5 rounded-xl shadow-lg transition-all ${activity.completed ? 'bg-gray-800/50 text-gray-600 scale-90' : getTypeColor(activity.type)}`}>
                                    {getIcon(activity.type)}
                                </div>

                                <div className="space-y-1">
                                    <h3 className={`text-xl font-bold tracking-tight transition-colors ${activity.completed ? 'line-through text-gray-600' : 'text-[var(--text-main)]'}`}>{activity.activity}</h3>
                                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <Clock size={12} className="opacity-50" />
                                        <span>{activity.startTime} — {activity.endTime}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 w-full">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex gap-1 justify-center">
                                        {activity.recurrence === 'weekly' ? (
                                            <span className="text-[8px] font-black bg-[var(--neon-green)]/10 text-[var(--neon-green)] px-2 py-0.5 rounded-full uppercase tracking-tighter">Weekly Protocol</span>
                                        ) : (
                                            <span className="text-[8px] font-black bg-white/5 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Tactical Deployment</span>
                                        )}
                                    </div>
                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activity.completed ? 'text-[var(--neon-green)]' : 'text-gray-800 opacity-50'}`}>
                                        {activity.completed ? 'MISSION COMPLETE' : 'AWAITING SIGN-OFF'}
                                    </p>
                                </div>
                            </div>

                            {/* Click to Toggle Overlay (Subtle) */}
                            <div
                                onClick={() => toggleTimetableItem(activity.id)}
                                className="absolute inset-0 cursor-pointer z-0"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Placeholder Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsAdding(true)}
                    className="border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center p-8 gap-4 cursor-pointer hover:border-[var(--neon-green)]/30 hover:bg-[var(--neon-green)]/[0.02] transition-all group min-h-[300px]"
                >
                    <div className="p-4 bg-white/5 rounded-2xl text-gray-600 group-hover:text-[var(--neon-green)] transition-all">
                        <Plus size={32} />
                    </div>
                    <div className="text-center">
                        <p className="font-bold uppercase text-xs tracking-widest text-gray-500 group-hover:text-[var(--neon-green)] transition-all">Deploy Action</p>
                        <p className="text-[10px] text-gray-800 mt-1 uppercase tracking-tight">Expand Tactical Grid</p>
                    </div>
                </motion.div>
            </div>

            {/* Advanced Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setIsAdding(false); setEditingId(null); setActivity(''); }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-lg bg-white/5 dark:bg-white/5 light-mode:bg-black/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--neon-green)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-main)]">
                                    {editingId ? 'Refit Objective' : 'New Objective'}
                                </h2>
                                {editingId && (
                                    <span className="text-[10px] font-black bg-[var(--neon-green)] text-black px-2 py-1 rounded uppercase tracking-widest">Edit Mode</span>
                                )}
                            </div>

                            <div className="space-y-6 relative z-10 pb-4">
                                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
                                    <button
                                        onClick={() => setRecurrence('weekly')}
                                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${recurrence === 'weekly' ? 'bg-[var(--neon-green)] text-black' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <Repeat size={14} /> Weekly
                                    </button>
                                    <button
                                        onClick={() => setRecurrence('once')}
                                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${recurrence === 'once' ? 'bg-[var(--neon-green)] text-black' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <CalendarCheck size={14} /> One-time
                                    </button>
                                </div>

                                {recurrence === 'once' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 overflow-hidden">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Operation Date</label>
                                        <input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-[var(--neon-green)] text-[var(--text-main)]" />
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Launch Time</label>
                                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-[var(--neon-green)] text-[var(--text-main)]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">End Time</label>
                                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-[var(--neon-green)] text-[var(--text-main)]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Objective Description</label>
                                    <input type="text" value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="e.g., Tactical Briefing" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-bold outline-none focus:border-[var(--neon-green)] text-[var(--text-main)]" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sector Category</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {[
                                            { value: 'Work', icon: <Laptop size={14} />, color: 'var(--neon-green)' },
                                            { value: 'Health', icon: <Heart size={14} />, color: '#f43f5e' },
                                            { value: 'Learning', icon: <Book size={14} />, color: '#3b82f6' },
                                            { value: 'Personal', icon: <User size={14} />, color: '#a855f7' },
                                        ].map(t => (
                                            <button
                                                key={t.value}
                                                onClick={() => setType(t.value)}
                                                className={`py-3 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${type === t.value ? 'border-[var(--neon-green)] text-[var(--neon-green)] bg-[var(--neon-green)]/10' : 'border-white/5 text-gray-500 hover:border-white/20'}`}
                                                style={type === t.value ? { borderColor: t.color, color: t.color, backgroundColor: `${t.color}15` } : {}}
                                            >
                                                {t.icon} {t.value}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-6">
                                    <button onClick={handleSaveActivity} className="w-full py-5 bg-[var(--neon-green)] text-black font-black text-xs rounded-2xl uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[var(--neon-green)]/20 active:scale-[0.98] transition-all">
                                        {editingId ? 'Apply Refit' : 'Deploy to Matrix'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsAdding(false);
                                            setEditingId(null);
                                            setActivity('');
                                        }}
                                        className="w-full py-4 bg-white/5 text-gray-500 font-black text-xs rounded-2xl uppercase tracking-widest hover:bg-white/10 active:scale-[0.98] transition-all"
                                    >
                                        Abort Objective
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Schedule;
