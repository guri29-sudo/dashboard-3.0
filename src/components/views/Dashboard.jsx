import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Activity, Zap, TrendingUp, Target, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../../lib/store';

// Widgets
import PulseWidget from '../widgets/PulseWidget';
import FocusWidget from '../widgets/FocusWidget';
import SmartInsightsWidget from '../widgets/SmartInsightsWidget';
import VelocityGraph from '../widgets/VelocityGraph';
import HabitHeatmap from '../widgets/HabitHeatmap';
import DailyObjectivesWidget from '../widgets/DailyObjectivesWidget';
import GrowthStreakChart from '../widgets/GrowthStreakChart';
import GoalProgressRadial from '../widgets/GoalProgressRadial';
import WeeklyFocusBreakdown from '../widgets/WeeklyFocusBreakdown';
import SectorRadarChart from '../widgets/SectorRadarChart';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }
};

const Dashboard = () => {
    const { user, habits, tasks, projects, timetable, latestInsight, systemStatus, toggleHabit, deleteHabit, addTask, addNotification, getCompletionRate, toggleTimetableItem } = useStore();
    const navigate = useNavigate();
    const [quickTask, setQuickTask] = React.useState('');

    const todayActivities = (timetable || []).filter(item => {
        const todayName = format(new Date(), 'EEEE');
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        return item.recurrence === 'weekly' ? item.day === todayName : item.date === todayStr;
    }).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

    const pendingHabits = (habits || []).filter(h => !h.completed);
    const activeProjects = (projects || []).filter(p => !p.completed);

    const handleQuickDeploy = (e) => {
        if (e.key === 'Enter' && quickTask.trim()) {
            addTask(quickTask.trim());
            setQuickTask('');
            addNotification({
                title: 'Task Deployed',
                message: `Objective "${quickTask}" synced to tactical grid.`,
                type: 'success'
            });
        }
    };

    const userName = user?.email?.split('@')[0] || 'Operator';
    const motivationLine = latestInsight?.motivation || "Initializing tactical sequence. Maintain absolute focus.";

    return (
        <motion.div
            className="space-y-10 max-w-[1600px] mx-auto pb-32 px-4 md:px-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Professional Command Header */}
            <motion.header variants={itemVariants} className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-6 border-b border-white/5">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1.5 h-4 bg-[var(--neon-green)]/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                            <span className="text-[var(--neon-green)] font-black text-[10px] uppercase tracking-[0.4em]">
                                Crystal OS // Command Deck v3.0
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-[var(--text-main)] tracking-tighter leading-none">
                            Welcome, <span className="text-gradient-green opacity-90">{userName}</span>
                        </h1>
                        <p className="text-[var(--text-dim)] text-sm md:text-lg max-w-3xl font-medium leading-relaxed italic border-l-3 border-[var(--neon-green)]/40 pl-8 py-2">
                            "{motivationLine}"
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        {/* System Metadata Stats */}
                        <div className="hidden xl:flex gap-6 mr-6 border-r border-white/10 pr-6">
                            <div className="text-right">
                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Active Ops</p>
                                <p className="text-lg font-black text-white">{activeProjects.length}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Habit Streak</p>
                                <p className="text-lg font-black text-[var(--neon-green)]">{habits.reduce((acc, h) => acc + h.streak, 0)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 px-6 py-4 bg-white/[0.03] rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Efficiency Index</p>
                                <p className="text-3xl font-mono font-black text-white leading-none">{getCompletionRate()}%</p>
                            </div>
                            <div className="w-14 h-14 relative flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" className="text-white/5" />
                                    <motion.circle
                                        cx="28" cy="28" r="24" fill="transparent" stroke="currentColor" strokeWidth="5" className="text-[var(--neon-green)]"
                                        strokeDasharray={150.8}
                                        initial={{ strokeDashoffset: 150.8 }}
                                        animate={{ strokeDashoffset: 150.8 - (150.8 * getCompletionRate()) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <Zap size={18} className="absolute text-[var(--neon-green)] animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Quick Actions Bar */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 group relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--neon-green)] opacity-50">
                        <Target size={20} />
                    </div>
                    <input
                        type="text"
                        value={quickTask}
                        onChange={(e) => setQuickTask(e.target.value)}
                        onKeyDown={handleQuickDeploy}
                        placeholder="DEPLOY MISSION OBJECTIVE (ENTER TO SYNC)..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-sm font-black tracking-widest outline-none focus:border-[var(--neon-green)]/40 transition-all placeholder:text-gray-700 focus:bg-white/[0.05]"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] font-black text-gray-700 tracking-[0.2em]">QUICK_DEPLOY v1.0</div>
                </div>
                <div className="lg:col-span-4 flex gap-4">
                    <div className="flex-1 px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col justify-center">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Protocol Status</p>
                        <p className="text-xs font-bold text-[var(--neon-green)] uppercase mt-1 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-ping" />
                            System Optimal
                        </p>
                    </div>
                    <div className="px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center">
                        <Activity size={20} className="text-gray-700" />
                    </div>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">

                {/* Left Column: Tactical Habits & Schedule */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Tactical Habits View — only show if habits exist */}
                    {habits.length > 0 ? (
                        <motion.div variants={itemVariants} className="glass-card p-10 space-y-8 bg-gradient-to-br from-white/[0.04] to-transparent border-white/5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[var(--neon-green)]/10 rounded-2xl">
                                        <TrendingUp size={24} className="text-[var(--neon-green)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white tracking-tight">Tactical Habit Grid</h3>
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-0.5 font-mono">Real-time behavior synchronization</p>
                                    </div>
                                </div>
                                <span className="text-[10px] bg-white/5 px-4 py-2 rounded-full font-black text-gray-500 uppercase tracking-widest">
                                    {pendingHabits.length} PENDING
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {habits.slice(0, 6).map(habit => (
                                    <motion.div
                                        key={habit.id}
                                        whileHover={{ x: 5 }}
                                        className={`p-5 rounded-3xl border cursor-pointer transition-all flex items-center justify-between group/habit ${habit.completed ? 'bg-[var(--neon-green)]/5 border-[var(--neon-green)]/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center gap-4 flex-1" onClick={() => toggleHabit(habit.id)}>
                                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${habit.completed ? 'bg-[var(--neon-green)] shadow-[0_0_10px_var(--neon-green)]' : 'bg-gray-800'}`} />
                                            <div>
                                                <p className={`font-black text-xs tracking-wide ${habit.completed ? 'text-white line-through opacity-50' : 'text-gray-300'}`}>{habit.name}</p>
                                                <p className="text-[8px] font-bold text-gray-600 uppercase mt-0.5">{habit.streak} DAY STREAK</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Zap size={14} className={habit.completed ? 'text-[var(--neon-green)]' : 'text-gray-800'} />
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
                                                className="opacity-0 group-hover/habit:opacity-100 p-1.5 text-gray-700 hover:text-red-500 transition-all rounded-lg hover:bg-red-500/10"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Integrated Heatmap for maximum density */}
                            <div className="pt-8 border-t border-white/5">
                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-4">Historical Consistency Map</p>
                                <div className="h-[120px] overflow-hidden">
                                    <HabitHeatmap compact />
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/habits')}
                                className="w-full py-4 text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-[var(--neon-green)] transition-all border-t border-white/5 mt-4"
                            >
                                Access Life-Cycle Analytics
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div variants={itemVariants} className="glass-card p-10 bg-gradient-to-br from-white/[0.04] to-transparent border-white/5">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-[var(--neon-green)]/10 rounded-2xl">
                                    <TrendingUp size={24} className="text-[var(--neon-green)]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight">Tactical Habit Grid</h3>
                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-0.5 font-mono">No habits configured</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/habits')}
                                className="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl text-gray-500 font-black text-xs hover:border-[var(--neon-green)]/40 hover:text-[var(--neon-green)] transition-all uppercase tracking-widest"
                            >
                                + Deploy New Habits
                            </button>
                        </motion.div>
                    )}

                    {/* Integrated Tactical Grid — only show if activities exist */}
                    {todayActivities.length > 0 && (
                        <motion.div variants={itemVariants} className="glass-card p-10 bg-black/20 border-white/5">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[var(--neon-green)]/10 rounded-2xl">
                                        <Calendar size={24} className="text-[var(--neon-green)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white tracking-tight">Temporal Grid</h3>
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-0.5 font-mono">Sector: {format(new Date(), 'EEEE, MMM do')}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] bg-white/5 px-4 py-2 rounded-full font-black text-gray-500 uppercase tracking-widest">
                                    {todayActivities.filter(a => !a.completed).length} DEPLOYED
                                </span>
                            </div>

                            <div className="space-y-4">
                                {todayActivities.slice(0, 5).map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 5 }}
                                        onClick={() => toggleTimetableItem(item.id)}
                                        className={`flex items-center gap-6 p-6 rounded-3xl border transition-all group/task cursor-pointer ${item.completed ? 'bg-[var(--neon-green)]/5 border-[var(--neon-green)]/20 opacity-60' : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/5'}`}
                                    >
                                        <div className={`font-mono text-xs font-black min-w-[60px] ${item.completed ? 'text-[var(--neon-green)]/40' : 'text-[var(--neon-green)]'}`}>
                                            {item.startTime || item.time || 'NOW'}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-black uppercase tracking-wider ${item.completed ? 'text-gray-500 line-through' : 'text-gray-100'}`}>{item.activity}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-1 h-1 rounded-full ${item.completed ? 'bg-gray-800' : 'bg-[var(--neon-green)]/40'}`} />
                                                <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">{item.type || 'Standard'}</p>
                                            </div>
                                        </div>
                                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-[var(--neon-green)] border-[var(--neon-green)] shadow-[0_0_15px_var(--neon-green-glow)]' : 'border-white/10 group-hover/task:border-white/20'}`}>
                                            <Zap size={14} className={item.completed ? 'text-black' : 'text-gray-800'} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Growth Pulse Chart — always visible in left column */}
                    <motion.div variants={itemVariants} className="h-[280px]">
                        <GrowthStreakChart />
                    </motion.div>

                    {/* Weekly Focus Map — full width in left column */}
                    <motion.div variants={itemVariants} className="h-[280px]">
                        <WeeklyFocusBreakdown />
                    </motion.div>
                </div>

                {/* Right Column: AI & Performance */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Smart Insights Focus */}
                    <div className="h-[280px]">
                        <SmartInsightsWidget />
                    </div>

                    {/* Velocity Visualization */}
                    <div className="h-[280px]">
                        <VelocityGraph />
                    </div>

                    {/* Active Ops Density Card */}
                    <motion.div variants={itemVariants} className="glass-card p-8 min-h-[300px] flex flex-col group border-[var(--neon-green)]/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Active Commands</h3>
                            <Activity size={14} className="text-[var(--neon-green)]" />
                        </div>
                        <div className="space-y-6 flex-1">
                            {activeProjects.slice(0, 3).map(p => (
                                <div key={p.id} className="cursor-pointer" onClick={() => navigate('/projects')}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.name}</span>
                                        <span className="text-[10px] font-mono text-[var(--neon-green)]">{p.progress || 0}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress || 0}%` }} className="h-full bg-[var(--neon-green)]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => navigate('/projects')} className="mt-8 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] hover:text-white transition-all text-center">
                            Full Matrix View
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Analytics & Growth Section */}
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-[var(--neon-green)]/10 rounded-2xl">
                        <TrendingUp size={24} className="text-[var(--neon-green)]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white tracking-tight">Analytics & Growth</h2>
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-0.5 font-mono">Performance metrics // Personal development index</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Goal Achievement Radial */}
                    <div className="h-[300px]">
                        <GoalProgressRadial />
                    </div>

                    {/* Sector Radar */}
                    <div className="h-[300px]">
                        <SectorRadarChart />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;

