import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value1, label1, value2, label2, type }) => {
    return (
        <div className="glass-card relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-400 font-semibold tracking-widest text-xs uppercase">{title}</h3>
                <span className="text-gray-600 text-lg">...</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--neon-green)]"></div>
                        <span className="text-3xl font-bold tracking-tight">{value1}</span>
                    </div>
                    <p className="text-gray-500 text-xs font-medium">{label1}</p>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#F68E1E]"></div>
                        <span className="text-3xl font-bold tracking-tight">{value2}</span>
                    </div>
                    <p className="text-gray-500 text-xs font-medium">{label2}</p>
                </div>
            </div>

            {/* Mini Chart Mockup - Animated */}
            <div className="mt-8 h-12 relative flex items-end">
                <svg className="w-full h-full opacity-60" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.4, 0.8, 0.4],
                            d: [
                                "M0,50 Q20,20 40,45 T80,10 T120,40 T160,5 T200,30",
                                "M0,40 Q25,30 45,35 T85,15 T125,50 T165,10 T200,25",
                                "M0,50 Q20,20 40,45 T80,10 T120,40 T160,5 T200,30"
                            ]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        fill="none"
                        stroke={type === 'up' ? "var(--neon-green)" : "#F68E1E"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    {/* Shadow Path for depth */}
                    <motion.path
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            d: [
                                "M0,40 Q25,30 45,35 T85,15 T125,50 T165,10 T200,25",
                                "M0,50 Q20,20 40,45 T80,10 T120,40 T160,5 T200,30",
                                "M0,40 Q25,30 45,35 T85,15 T125,50 T165,10 T200,25"
                            ]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: 0.2,
                            ease: "easeInOut"
                        }}
                        fill="none"
                        stroke={type === 'up' ? "var(--neon-green)" : "#F68E1E"}
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </div>
    );
};

export default MetricCard;
