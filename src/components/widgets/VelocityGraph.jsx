import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity } from 'lucide-react';
import { isSameDay, subDays, format } from 'date-fns';
import { useStore } from '../../lib/store';

const VelocityGraph = () => {
    const { tasks, habitLogs } = useStore();

    // Group tasks by completion date for the last 7 days
    const data = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayStr = format(date, 'EEE');

        // Filter tasks completed on this specific day
        const completedTasks = tasks.filter(t =>
            t.completed &&
            t.completed_at &&
            isSameDay(new Date(t.completed_at), date)
        ).length;

        const completedHabits = (habitLogs || []).filter(l =>
            isSameDay(new Date(l.completed_at), date)
        ).length;

        const totalCompleted = completedTasks + completedHabits;

        return {
            name: dayStr,
            tasks: totalCompleted,
            fullDate: format(date, 'MMM dd'),
        };
    });

    return (
        <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> Velocity (7 Days)
                </h3>
            </div>

            <div className="flex-1 w-full min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
                            interval={0}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{
                                backgroundColor: '#0A0A0A',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#888', marginBottom: '4px' }}
                        />
                        <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 6 ? 'var(--neon-green)' : '#333'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VelocityGraph;
