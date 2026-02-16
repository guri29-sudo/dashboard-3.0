import React from 'react';
import { motion } from 'framer-motion';

const Timeline = () => {
    const dates = ["30.09", "29.09", "28.09", "27.09", "26.09", "25.09", "24.09"];
    const projects = [
        { date: "30.09", color: "var(--neon-green)", width: "160px", left: "20%", icon: "S" },
        { date: "29.09", color: "#F68E1E", width: "200px", left: "45%", icon: "G" },
        { date: "28.09", color: "white", width: "140px", left: "15%", icon: "P" },
        { date: "27.09", color: "var(--neon-green)", width: "180px", left: "30%", icon: "B" },
        { date: "26.09", color: "white", width: "120px", left: "10%", icon: "D" },
        { date: "25.09", color: "#F68E1E", width: "220px", left: "40%", icon: "F" },
        { date: "24.09", color: "var(--neon-green)", width: "150px", left: "55%", icon: "T" },
    ];

    return (
        <div className="glass-card flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-gray-400 font-semibold tracking-widest text-xs uppercase">PROJECTS TIMELINE</h3>
                <span className="text-gray-600 text-lg">...</span>
            </div>

            <div className="flex-1 flex flex-col justify-between py-4 relative">
                {/* Horizontal Grid Lines */}
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="absolute inset-x-0 h-px bg-white/5" style={{ top: `${(i + 1) * 14.28}%` }}></div>
                ))}

                {dates.map((date, i) => {
                    const project = projects.find(p => p.date === date);
                    return (
                        <div key={i} className="flex items-center gap-8 h-full">
                            <span className="text-xs font-bold text-gray-500 w-12">{date}</span>
                            <div className="flex-1 relative h-10">
                                {project && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: project.width, opacity: 1 }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className="absolute h-full rounded-2xl flex items-center px-4 gap-3 cursor-pointer hover:brightness-110 shadow-lg"
                                        style={{ backgroundColor: project.color, left: project.left }}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-[10px] font-bold text-black">
                                            {project.icon}
                                        </div>
                                        <span className="text-black text-[10px] font-bold">Project Task</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--neon-green)]"></div> Customer</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#F68E1E]"></div> Product</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white"></div> Web</span>
                </div>
                <span className="text-sm font-semibold text-gray-400">Total: <span className="text-white">284</span></span>
            </div>
        </div>
    );
};

export default Timeline;
