import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock } from 'lucide-react';
import { useStore } from '../../lib/store';

const WeeklyFocusBreakdown = () => {
    const { timetable } = useStore();

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const normalizeType = (type) => {
        const t = (type || '').toLowerCase();
        if (t === 'work') return 'work';
        if (t === 'health' || t === 'meal') return 'health';
        if (t === 'learning' || t === 'study') return 'learning';
        if (t === 'personal' || t === 'rest') return 'personal';
        return 'other';
    };

    const data = days.map(day => {
        const dayItems = (timetable || []).filter(item => item.day === day);
        const workCount = dayItems.filter(item => normalizeType(item.type) === 'work').length;
        const healthCount = dayItems.filter(item => normalizeType(item.type) === 'health').length;
        const learnCount = dayItems.filter(item => normalizeType(item.type) === 'learning').length;
        const otherCount = dayItems.filter(item => normalizeType(item.type) === 'other' || normalizeType(item.type) === 'personal').length;

        return {
            name: day.slice(0, 3),
            work: workCount,
            health: healthCount,
            learning: learnCount,
            other: Math.max(0, otherCount),
            total: dayItems.length,
        };
    });

    return (
        <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} className="text-[var(--neon-green)]" /> Weekly Focus Map
                </h3>
                <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[var(--neon-green)]" />
                        <span className="text-[8px] text-gray-600 font-bold">Work</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#f43f5e]" />
                        <span className="text-[8px] text-gray-600 font-bold">Health</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                        <span className="text-[8px] text-gray-600 font-bold">Learn</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' }}
                            interval={0}
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
                        />
                        <Bar dataKey="work" stackId="a" radius={[0, 0, 0, 0]} fill="var(--neon-green)" name="Work" />
                        <Bar dataKey="health" stackId="a" radius={[0, 0, 0, 0]} fill="#f43f5e" name="Health" />
                        <Bar dataKey="learning" stackId="a" radius={[0, 0, 0, 0]} fill="#8b5cf6" name="Learning" />
                        <Bar dataKey="other" stackId="a" radius={[4, 4, 0, 0]} fill="#333" name="Other" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WeeklyFocusBreakdown;
