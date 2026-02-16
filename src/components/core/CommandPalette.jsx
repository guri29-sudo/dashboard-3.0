import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Check, ArrowRight, Zap, Calendar, Settings, FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';

const CommandPalette = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const { toggleDarkMode, addTask } = useStore();

    const actions = [
        {
            id: 'task',
            label: 'Create New Task',
            icon: Plus,
            shortcut: 'C',
            action: () => {
                const title = prompt("Task Name:");
                if (title) addTask({ title });
                onClose();
            }
        },
        {
            id: 'home',
            label: 'Go to Dashboard',
            icon: Zap,
            shortcut: 'G H',
            action: () => navigate('/')
        },
        {
            id: 'projects',
            label: 'Go to Projects',
            icon: FileText,
            shortcut: 'G P',
            action: () => navigate('/projects')
        },
        {
            id: 'schedule',
            label: 'Go to Schedule',
            icon: Calendar,
            shortcut: 'G S',
            action: () => navigate('/schedule')
        },
        {
            id: 'settings',
            label: 'Go to Settings',
            icon: Settings,
            shortcut: 'G T',
            action: () => navigate('/settings')
        },
        {
            id: 'theme',
            label: 'Toggle Theme',
            icon: Command,
            shortcut: 'Cmd+T',
            action: () => toggleDarkMode()
        },
    ];

    const filteredActions = actions.filter(action =>
        action.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => (i + 1) % filteredActions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                filteredActions[selectedIndex]?.action();
                onClose();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredActions, selectedIndex, onClose]);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -20 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="relative w-full max-w-2xl bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="flex items-center px-6 py-5 border-b border-white/5 gap-4">
                        <Search className="text-[var(--neon-green)]" size={20} />
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type a command or search..."
                            className="bg-transparent border-none outline-none text-lg text-white placeholder-gray-600 flex-1 font-mono tracking-tight"
                        />
                        <div className="flex gap-2">
                            <kbd className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-xl text-[10px] text-gray-500 font-mono border border-white/5 uppercase">
                                esc
                            </kbd>
                        </div>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto py-4 px-2 no-scrollbar">
                        {filteredActions.length === 0 ? (
                            <div className="px-6 py-12 text-center text-gray-500 text-sm">
                                <div className="mb-2 opacity-20"><Search size={40} className="mx-auto" /></div>
                                No neural commands found.
                            </div>
                        ) : (
                            filteredActions.map((action, index) => (
                                <div
                                    key={action.id}
                                    onClick={() => {
                                        action.action();
                                        onClose();
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-all rounded-[20px] mx-2 mb-1 ${index === selectedIndex ? 'bg-[var(--neon-green)]/10 shadow-[0_4px_12px_var(--neon-green-glow)]' : 'hover:bg-white/[0.02]'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl transition-colors ${index === selectedIndex ? 'bg-[var(--neon-green)] text-black shadow-[0_0_20px_var(--neon-green-glow)]' : 'bg-white/5 text-gray-500'}`}>
                                            <action.icon size={18} strokeWidth={2.5} />
                                        </div>
                                        <span className={`text-sm font-black uppercase tracking-widest ${index === selectedIndex ? 'text-white' : 'text-gray-500'}`}>
                                            {action.label}
                                        </span>
                                    </div>
                                    {action.shortcut && (
                                        <div className="flex gap-1.5">
                                            {action.shortcut.split(' ').map((key, i) => (
                                                <kbd key={i} className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-colors ${index === selectedIndex ? 'border-[var(--neon-green)]/30 text-[var(--neon-green)] bg-[var(--neon-green)]/5' : 'border-white/5 text-gray-600 bg-white/5'}`}>
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="bg-white/5 px-8 py-3 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)]" />
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                Crystal OS Core
                            </span>
                        </div>
                        <div className="flex gap-6">
                            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <span className="text-gray-400">↑↓</span> Navigate
                            </span>
                            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <span className="text-gray-400">↵</span> Select
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CommandPalette;
