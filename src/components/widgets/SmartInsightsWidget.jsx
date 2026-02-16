import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Zap, Shield, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { AiService } from '../../lib/ai';
import { useStore } from '../../lib/store';
import { analyzeTacticalState } from '../../lib/tacticalAdvisor';

const SmartInsightsWidget = () => {
    const { tasks, habits, projects, timetable, setLatestInsight } = useStore();
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const generate = async () => {
        setLoading(true);
        try {
            // Local fallback/baseline
            const state = useStore.getState();
            const localInsight = analyzeTacticalState(state);

            setInsight({
                priority: localInsight.insights[0].type === 'warning' ? 'High' : 'Medium',
                message: localInsight.insights[0].message,
                action: localInsight.insights[0].title,
                motivation: localInsight.motivation,
                mode: 'Local Engine'
            });

            const context = { tasks, habits, projects, timetable };
            const result = await AiService.generateInsight(context);

            if (result) {
                const finalInsight = { ...result, mode: 'Cortex Neural' };
                setInsight(finalInsight);
                setLatestInsight(finalInsight);
            }
            setLastUpdated(new Date());
        } catch (error) {
            console.error("AI Insight Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate on mount if no data
    useEffect(() => {
        if (!insight) generate();
    }, []);

    const getPriorityColor = (p) => {
        if (p === 'High') return 'text-red-400';
        if (p === 'Medium') return 'text-yellow-400';
        return 'text-[var(--neon-green)]';
    };

    const getPriorityIcon = (p) => {
        if (p === 'High') return <AlertTriangle size={16} />;
        if (p === 'Medium') return <Shield size={16} />;
        return <Zap size={16} />;
    };

    return (
        <div className="glass-card p-6 h-full relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles size={80} />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[var(--neon-green)]/10 text-[var(--neon-green)]">
                        <Sparkles size={14} />
                    </div>
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Cortex Intelligence
                    </h3>
                </div>
                <button
                    onClick={generate}
                    disabled={loading}
                    className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-all ${loading ? 'animate-spin' : ''}`}
                >
                    <RefreshCw size={14} />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-10">
                <AnimatePresence mode="wait">
                    {insight ? (
                        <motion.div
                            key={lastUpdated}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="space-y-1">
                                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${getPriorityColor(insight.priority)}`}>
                                    {getPriorityIcon(insight.priority)}
                                    {insight.priority} Priority
                                </div>
                                <p className="text-lg md:text-xl font-bold text-white leading-tight">
                                    {insight.message}
                                </p>
                            </div>

                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Recommended Action</span>
                                <p className="text-sm text-gray-300 font-medium">
                                    {insight.action}
                                </p>
                            </div>

                            {insight.motivation && (
                                <p className="text-xs text-gray-500 italic border-l-2 border-white/10 pl-3">
                                    "{insight.motivation}"
                                </p>
                            )}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-600 gap-2">
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-ping" />
                            <p className="text-xs font-mono">Analyzing System Telemetry...</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center relative z-10">
                <span className="text-[9px] text-gray-600 font-mono">
                    Model: {insight?.mode || 'Initializing...'}
                </span>
                <span className="text-[9px] text-gray-600 font-mono">
                    {lastUpdated ? format(lastUpdated, 'HH:mm:ss') : '--:--:--'}
                </span>
            </div>
        </div>
    );
};

export default SmartInsightsWidget;
