import React from 'react';
import { Grid } from 'lucide-react';
import { useStore } from '../../lib/store';
import { subDays, format, eachDayOfInterval, isSameDay } from 'date-fns';

const HabitHeatmap = () => {
    const { habits, habitLogs } = useStore();

    // Last 12 weeks
    const today = new Date();
    const startDate = subDays(today, 83);
    const days = eachDayOfInterval({ start: startDate, end: today });

    // Map logs for quick lookup or count per day
    const getIntensity = (day) => {
        const dailyLogs = (habitLogs || []).filter(log => {
            const logDate = log.date?.$date ? new Date(log.date.$date) : new Date(log.date);
            return isSameDay(logDate, day);
        });

        if (dailyLogs.length === 0) return 0;
        if (dailyLogs.length === 1) return 1;
        if (dailyLogs.length <= 3) return 2;
        if (dailyLogs.length <= 5) return 3;
        return 4;
    };

    const getColor = (level) => {
        switch (level) {
            case 0: return 'bg-white/5 dark:bg-white/5'; // Adaptive
            case 1: return 'bg-[var(--neon-green)]/20';
            case 2: return 'bg-[var(--neon-green)]/40';
            case 3: return 'bg-[var(--neon-green)]/60';
            case 4: return 'bg-[var(--neon-green)]';
            default: return 'bg-white/5';
        }
    };

    return (
        <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Grid size={14} /> Consistency Map
                </h3>
            </div>

            <div className="flex-1 flex flex-wrap content-start gap-1">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-[2px] ${getColor(getIntensity(day))}`}
                        title={format(day, 'MMM dd')}
                    />
                ))}
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-[9px] text-gray-600">Less</span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-[1px] bg-white/5" />
                    <div className="w-2 h-2 rounded-[1px] bg-[var(--neon-green)]/40" />
                    <div className="w-2 h-2 rounded-[1px] bg-[var(--neon-green)]" />
                </div>
                <span className="text-[9px] text-gray-600">More</span>
            </div>
        </div>
    );
};

export default HabitHeatmap;
