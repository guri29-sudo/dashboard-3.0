import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle2, X } from 'lucide-react';

import { useStore } from '../../lib/store';



const Notifications = () => {
    const { notifications, markNotificationRead, deleteNotification, clearAllNotifications } = useStore();

    // Actions are now direct from store

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle2 size={20} className="text-[var(--neon-green)]" />;
            case 'warning': return <AlertTriangle size={20} className="text-[var(--neon-orange)]" />;
            default: return <Info size={20} className="text-blue-400" />;
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-[var(--text-main)]">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse"></div>
                        <h2 className="text-sm font-black text-[var(--neon-green)] uppercase tracking-[0.4em]">Tactical Feed</h2>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">Notifications</h1>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={clearAllNotifications}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2"
                    >
                        <Trash2 size={14} /> Clear Archive
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <motion.div
                                key={n.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`glass-card p-6 flex items-start gap-6 border-white/5 group relative transition-all duration-300 ${n.read ? 'opacity-60' : 'border-l-[var(--neon-green)]/30 bg-[var(--neon-green)]/[0.02]'}`}
                            >
                                <div className={`p-4 rounded-2xl ${n.read ? 'bg-white/5' : 'bg-[var(--neon-green)]/10'} shrink-0 transition-colors`}>
                                    {getIcon(n.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className={`text-lg font-bold tracking-tight mb-1 truncate transition-colors ${n.read ? 'text-gray-400' : 'text-[var(--text-main)]'}`}>
                                            {n.title}
                                        </h3>
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest shrink-0 mt-1">{n.time}</span>
                                    </div>
                                    <p className={`text-sm ${n.read ? 'text-gray-500' : 'text-gray-400'} font-medium leading-relaxed`}>
                                        {n.message}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!n.read && (
                                        <button
                                            onClick={() => markNotificationRead(n.id)}
                                            className="p-2 bg-white/5 hover:bg-[var(--neon-green)]/10 text-gray-500 hover:text-[var(--neon-green)] rounded-lg transition-all"
                                            title="Mark as Read"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(n.id)}
                                        className="p-2 bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-24 text-center border-2 border-dashed border-white/5 rounded-[40px]"
                        >
                            <div className="inline-flex p-6 bg-white/5 rounded-[32px] text-gray-700 mb-6 font-black scale-150">
                                <Bell size={32} />
                            </div>
                            <p className="text-gray-600 font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">Tactical Feed Clear. No urgent updates detected.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notifications;
