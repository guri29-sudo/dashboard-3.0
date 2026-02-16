import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import FocusMode from '../shared/FocusMode';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const location = useLocation();

    // Global Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Toggle Command Palette (Cmd+K or Ctrl+K or /)
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                setIsCommandPaletteOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] font-sans selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
            {/* Sidebar (Collapsed by default on mobile, always visible on desktop) */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Top Bar / Breadcrumbs */}
                <header className="h-16 border-b border-white/5 flex items-center px-10 justify-between shrink-0 bg-[#030303]/40 backdrop-blur-md relative z-20">
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse" />
                            <span className="text-white opacity-80">System Node</span>
                        </div>
                        <span className="opacity-20">/</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[var(--neon-green)]">{location.pathname === '/' ? 'DASHBOARD' : location.pathname.substring(1).toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div
                            className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all group"
                            onClick={() => setIsCommandPaletteOpen(true)}
                        >
                            <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest font-bold">Search Core</span>
                            <kbd className="text-[9px] text-[var(--neon-green)] font-mono bg-[var(--neon-green)]/10 px-1.5 py-0.5 rounded border border-[var(--neon-green)]/20 shadow-[0_0_10px_var(--neon-green-glow)]">⌘K</kbd>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {children}
                </div>
            </main>

            {/* Global Focus Mode Immersive Overlay */}
            <FocusMode />

            {/* Global Command Palette Overlay */}
            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
            />
        </div>
    );
};

export default Layout;
