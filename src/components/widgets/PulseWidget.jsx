import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, TrendingUp } from 'lucide-react';
import { useStore } from '../../lib/store';

const PulseWidget = () => {
    const { habits, tasks } = useStore();

    const calculateHealth = () => {
        const safeHabits = habits || [];
        const safeTasks = tasks || [];

        if (safeHabits.length === 0 && safeTasks.length === 0) return 0;

        const habitCompletion = safeHabits.length > 0
            ? (safeHabits.filter(h => h.completed).length / safeHabits.length) * 50
            : 0;

        const taskCompletion = safeTasks.length > 0
            ? (safeTasks.filter(t => t.completed).length / safeTasks.length) * 50
            : 0;

        return Math.round(habitCompletion + taskCompletion);
    };

    const systemHealth = calculateHealth();

    return (
        <div className="glass-card p-6 relative overflow-hidden group h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={80} />
            </div>

            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">System Pulse</h3>
                    <div className="text-4xl font-black text-white tracking-tighter">
                        {systemHealth}%
                    </div>
                </div>
                <div className={`p-2 rounded-full ${systemHealth > 80 ? 'bg-[var(--neon-green)]/20 text-[var(--neon-green)]' : 'bg-red-500/20 text-red-500'}`}>
                    <Zap size={16} />
                </div>
            </div>

            <div className="space-y-3 mt-4 z-10">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] text-gray-400 font-mono uppercase">Protocol Match</span>
                    <span className="text-[10px] text-[var(--neon-green)] font-mono">{(habits || []).filter(h => h.completed).length}/{(habits || []).length}</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${systemHealth}%` }}
                        className="h-full bg-[var(--neon-green)]"
                    />
                </div>
            </div>
        </div>
    );
};

export default PulseWidget;
