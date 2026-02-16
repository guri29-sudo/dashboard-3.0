import React from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, BookOpen, Settings, Heart, Bell, LogOut, Sun, Moon, Activity } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, isDarkMode, toggleDarkMode, notifications, tasks, habits, timetable } = useStore();

    // Determine active view based on current path
    const getActiveView = () => {
        const path = location.pathname;
        if (path === '/') return 'home';
        return path.substring(1); // 'projects', 'schedule', 'settings', 'notifications'
    };

    const activeView = getActiveView();
    const unreadCount = notifications.filter(n => !n.read).length;

    const menuItems = [
        { icon: Home, label: 'Home', id: 'home', path: '/' },
        { icon: BookOpen, label: 'Projects', id: 'projects', path: '/projects' },
        { icon: Activity, label: 'Habits', id: 'habits', path: '/habits' },
        { icon: Calendar, label: 'Schedule', id: 'schedule', path: '/schedule' },
        { icon: Settings, label: 'Settings', id: 'settings', path: '/settings' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <>
            {/* Desktop Vertical Sidebar */}
            <nav className="hidden md:flex w-24 border-r border-white/5 flex-col items-center py-10 gap-10 sticky top-0 h-screen bg-[#030303]/80 backdrop-blur-2xl z-50">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    onClick={() => handleNavigation('/')}
                    className="text-[var(--neon-green)] text-2xl font-black tracking-tighter cursor-pointer flex flex-col items-center"
                >
                    <span className="leading-none text-gradient-green">CR</span>
                    <span className="text-[8px] tracking-[0.3em] opacity-50 font-black">OS</span>
                </motion.div>

                {/* System Status Dot */}
                <div className="flex flex-col items-center gap-1 -mt-4">
                    <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_var(--neon-green-glow)] ${useStore.getState().systemStatus === 'optimal' ? 'bg-[var(--neon-green)]' :
                        useStore.getState().systemStatus === 'syncing' ? 'bg-blue-400 animate-pulse' :
                            'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                        }`} />
                    <span className="text-[6px] font-black text-gray-600 uppercase tracking-widest">
                        {useStore.getState().systemStatus}
                    </span>
                </div>

                <div className="flex flex-col gap-8 flex-1">
                    {menuItems.map((item, index) => {
                        const hasPending =
                            (item.id === 'home' && tasks.some(t => !t.completed)) ||
                            (item.id === 'habits' && habits.some(h => !h.completed)) ||
                            (item.id === 'schedule' && timetable.some(t => !t.completed));

                        return (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNavigation(item.path)}
                                title={item.label}
                                className={`cursor-pointer transition-all p-3 rounded-2xl relative group ${activeView === item.id ? 'text-[var(--neon-green)] bg-[var(--neon-green)]/10 shadow-[0_0_20px_var(--neon-green-glow)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <item.icon size={22} strokeWidth={2.5} />
                                {hasPending && (
                                    <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#030303] shadow-[0_0_5px_rgba(239,68,68,0.5)] animate-pulse" />
                                )}
                                {activeView === item.id && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--neon-green)] rounded-full shadow-[0_0_10px_var(--neon-green)]"
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-6 items-center mb-4">
                    <motion.button
                        onClick={toggleDarkMode}
                        whileHover={{ scale: 1.1 }}
                        className="p-3 rounded-2xl bg-white/5 text-[var(--neon-green)] hover:bg-[var(--neon-green)]/10 transition-all border border-white/5"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>

                    <div
                        onClick={() => handleNavigation('/notifications')}
                        className={`p-3 rounded-2xl bg-white/5 cursor-pointer relative hover:bg-white/10 transition-all border border-white/5 group ${activeView === 'notifications' ? 'bg-[var(--neon-green)]/10 border-[var(--neon-green)]/20' : ''}`}
                    >
                        {unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full border-2 border-[#030303] flex items-center justify-center text-[8px] font-black text-white shadow-lg">
                                {unreadCount}
                            </div>
                        )}
                        <Bell size={20} className={activeView === 'notifications' ? 'text-[var(--neon-green)]' : 'text-gray-500 group-hover:text-white'} />
                    </div>

                    <motion.button
                        onClick={logout}
                        whileHover={{ scale: 1.1, color: '#FF4B4B' }}
                        className="text-gray-700 p-2 mt-2"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </motion.button>
                </div>
            </nav>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/10 flex md:hidden items-center justify-around px-4 z-50">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleNavigation(item.path)}
                        className={`flex flex-col items-center gap-1 transition-all ${activeView === item.id ? 'text-[var(--neon-green)]' : 'text-gray-500'}`}
                    >
                        <item.icon size={20} />
                        <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
                    </button>
                ))}
                <button
                    onClick={() => handleNavigation('/notifications')}
                    className={`flex flex-col items-center gap-1 relative transition-all ${activeView === 'notifications' ? 'text-[var(--neon-green)]' : 'text-gray-500'}`}
                >
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 min-w-[12px] h-[12px] bg-red-500 rounded-full flex items-center justify-center text-[7px] font-black text-white">
                            {unreadCount}
                        </div>
                    )}
                    <Bell size={20} />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Alerts</span>
                </button>
                <button
                    onClick={toggleDarkMode}
                    className="flex flex-col items-center gap-1 text-[var(--neon-green)]"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="text-[8px] font-black uppercase tracking-tighter">Theme</span>
                </button>
                <button
                    onClick={logout}
                    className="flex flex-col items-center gap-1 text-gray-700"
                >
                    <LogOut size={20} />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Exit</span>
                </button>
            </nav>
        </>
    );
};

export default Sidebar;
