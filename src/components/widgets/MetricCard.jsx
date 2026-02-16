import React from 'react';
import { Sparkles, Clock } from 'lucide-react';

const MetricCard = ({ title, value1, label1, value2, label2, type }) => (
    <div className="glass-card p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            {type === 'up' ? <Sparkles size={40} /> : <Clock size={40} />}
        </div>
        <div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{value1}</span>
                <span className="text-[9px] font-bold text-[var(--neon-green)] uppercase tracking-wider">{label1}</span>
            </div>
        </div>
        <div className="flex items-center gap-2 mt-auto">
            <div className={`w-1.5 h-1.5 rounded-full ${type === 'up' ? 'bg-[var(--neon-green)]' : 'bg-orange-500'}`}></div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{value2} {label2}</span>
        </div>
    </div>
);

export default MetricCard;
