import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import { useStore } from '../../lib/store';

const GoalProgressRadial = () => {
    const { habits, tasks, projects } = useStore();

    const habitsArr = habits || [];
    const tasksArr = tasks || [];
    const projectsArr = projects || [];

    // If a category has 0 items, it's 100% complete (nothing to do = fully achieved)
    const calcPct = (done, total) => total === 0 ? 100 : Math.round((done / total) * 100);

    const segments = [
        { name: 'Habits', value: calcPct(habitsArr.filter(h => h.completed).length, habitsArr.length), color: 'var(--neon-green)' },
        { name: 'Tasks', value: calcPct(tasksArr.filter(t => t.completed).length, tasksArr.length), color: '#8b5cf6' },
        { name: 'Projects', value: calcPct(projectsArr.filter(p => p.completed).length, projectsArr.length), color: '#f59e0b' },
    ];

    const overallScore = Math.round(segments.reduce((a, s) => a + s.value, 0) / segments.length);

    return (
        <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} className="text-[var(--neon-green)]" /> Goal Achievement
                </h3>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                        <Pie
                            data={segments}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            {segments.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-mono font-black text-white">{overallScore}%</p>
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Overall</p>
                </div>
            </div>

            <div className="flex justify-between mt-2">
                {segments.map(s => (
                    <div key={s.name} className="text-center">
                        <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: s.color }} />
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{s.name}</p>
                        <p className="text-xs font-mono font-black" style={{ color: s.color }}>{s.value}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalProgressRadial;
