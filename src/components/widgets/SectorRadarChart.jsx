import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import { useStore } from '../../lib/store';

const SectorRadarChart = () => {
    const { timetable } = useStore();

    // Normalize old types to the new categories
    const normalizeType = (type) => {
        const t = (type || '').toLowerCase();
        if (t === 'work') return 'Work';
        if (t === 'health' || t === 'meal') return 'Health';
        if (t === 'learning' || t === 'study') return 'Learning';
        if (t === 'personal' || t === 'rest') return 'Personal';
        return 'Work'; // default
    };

    const categories = ['Work', 'Health', 'Learning', 'Personal'];
    const distribution = categories.map(cat => {
        const count = (timetable || []).filter(item => normalizeType(item.type) === cat).length;

        return {
            subject: cat,
            A: count || 1,
            fullMark: 10,
        };
    });

    return (
        <div className="glass-card p-6 h-full flex flex-col bg-white/[0.03] border-white/5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} className="text-[var(--neon-green)]" /> Sector Analysis
                </h3>
            </div>

            <div className="flex-1 w-full min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={distribution}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }}
                        />
                        <Radar
                            name="Sectors"
                            dataKey="A"
                            stroke="var(--neon-green)"
                            fill="var(--neon-green)"
                            fillOpacity={0.15}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <p className="text-[8px] text-gray-700 font-bold uppercase tracking-widest text-center mt-2">
                Life-Balance Matrix v1.0
            </p>
        </div>
    );
};

export default SectorRadarChart;
