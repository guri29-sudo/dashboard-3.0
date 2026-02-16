import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { subDays, format, isSameDay } from 'date-fns';
import { useStore } from '../../lib/store';

const GrowthStreakChart = () => {
    const { habits, tasks, habitLogs } = useStore();

    // Build 14-day growth data combining habits + tasks
    const data = Array.from({ length: 14 }).map((_, i) => {
        const date = subDays(new Date(), 13 - i);
        const dayStr = format(date, 'MMM dd');

        const completedTasks = (tasks || []).filter(t =>
            t.completed && t.completed_at && isSameDay(new Date(t.completed_at), date)
        ).length;

        const completedHabits = (habitLogs || []).filter(l =>
            isSameDay(new Date(l.completed_at), date)
        ).length;

        // Cumulative streak score (compound growth effect)
        const streakBonus = habits.reduce((acc, h) => acc + (h.streak > 0 ? 1 : 0), 0);

        return {
            name: format(date, 'dd'),
            fullDate: dayStr,
            productivity: completedTasks + completedHabits,
            growth: Math.min(10, completedTasks + completedHabits + Math.floor(streakBonus * 0.3)),
        };
    });

    return (
        <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={14} className="text-[var(--neon-green)]" /> Growth Pulse (14d)
                </h3>
                <span className="text-[9px] font-mono text-[var(--neon-green)]/60">
                    {data.reduce((a, d) => a + d.productivity, 0)} TOTAL
                </span>
            </div>

            <div className="flex-1 w-full min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--neon-green)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--neon-green)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#444', fontSize: 9, fontFamily: 'monospace' }}
                            interval={1}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0A0A0A',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                            }}
                            itemStyle={{ color: '#fff' }}
                            labelFormatter={(label) => {
                                const item = data.find(d => d.name === label);
                                return item ? item.fullDate : label;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="growth"
                            stroke="var(--neon-green)"
                            strokeWidth={2}
                            fill="url(#growthGradient)"
                            name="Growth Index"
                        />
                        <Area
                            type="monotone"
                            dataKey="productivity"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="url(#productivityGradient)"
                            name="Productivity"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GrowthStreakChart;
