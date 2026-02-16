import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Square, Volume2, CloudRain, Music, Wind, Waves } from 'lucide-react';
import { useStore } from '../../lib/store';

const SOUNDS = [
    { id: 'rain', icon: <CloudRain size={18} />, url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3', label: 'Rain' },
    { id: 'waves', icon: <Waves size={18} />, url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3', label: 'Waves' },
    { id: 'wind', icon: <Wind size={18} />, url: 'https://assets.mixkit.co/sfx/preview/mixkit-wind-howl-loop-1193.mp3', label: 'Wind' },
    { id: 'lofi', icon: <Music size={18} />, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', label: 'Cyber Lofi' },
];

const FocusMode = () => {
    const {
        focusMode,
        setFocusActive,
        setFocusTime,
        setFocusOpen,
        ambient,
        setAmbient,
        tasks,
        habitLogs
    } = useStore();

    const [isExpanded, setIsExpanded] = React.useState(false);
    const [showTactical, setShowTactical] = React.useState(false);
    const audioRef = useRef(null);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Audio Control
    useEffect(() => {
        if (!audioRef.current) return;

        if (ambient.isPlaying && ambient.track !== 'none') {
            const track = SOUNDS.find(s => s.id === ambient.track);
            if (track) {
                audioRef.current.src = track.url;
                audioRef.current.volume = ambient.volume;
                audioRef.current.play().catch(e => console.log('Audio play failed:', e));
            }
        } else {
            audioRef.current.pause();
        }
    }, [ambient.isPlaying, ambient.track]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = ambient.volume;
        }
    }, [ambient.volume]);

    // Timer Interval
    useEffect(() => {
        let interval;
        if (focusMode.isActive && focusMode.timeLeft > 0) {
            interval = setInterval(() => {
                setFocusTime(focusMode.timeLeft - 1);
            }, 1000);
        } else if (focusMode.timeLeft === 0) {
            setFocusActive(false);
        }
        return () => clearInterval(interval);
    }, [focusMode.isActive, focusMode.timeLeft, setFocusTime, setFocusActive]);

    return (
        <AnimatePresence>
            {focusMode.isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-8 overflow-hidden font-sans"
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div
                            animate={{
                                scale: focusMode.isActive ? [1, 1.1, 1] : 1,
                                opacity: focusMode.isActive ? [0.05, 0.1, 0.05] : 0.05
                            }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[var(--neon-green)] rounded-full blur-[250px]"
                        />
                    </div>

                    {/* Controls Bar */}
                    <div className="absolute top-10 w-full px-10 flex justify-between items-center z-20">
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setFocusActive(false); setFocusTime(15 * 60); }}
                                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[var(--neon-green)] transition-all"
                            >
                                15 MIN
                            </button>
                            <button
                                onClick={() => { setFocusActive(false); setFocusTime(20 * 60); }}
                                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[var(--neon-green)] transition-all"
                            >
                                20 MIN
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowTactical(!showTactical)}
                                className={`px-6 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${showTactical ? 'bg-[var(--neon-green)] text-black border-[var(--neon-green)]' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}`}
                            >
                                Tactical Overlay
                            </button>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all"
                            >
                                {isExpanded ? 'MINIMIZE' : 'EXPAND'}
                            </button>
                            <button
                                onClick={() => setFocusOpen(false)}
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-red-500 transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <audio ref={audioRef} loop />

                    {/* Main Interaction Area */}
                    <div className={`relative z-10 flex flex-col items-center transition-all duration-700 ${isExpanded ? 'gap-24' : 'gap-12'}`}>
                        {!isExpanded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center"
                            >
                                <h3 className="text-[10px] font-black text-[var(--neon-green)] uppercase tracking-[0.6em] mb-4">Tactical Immersion Active</h3>
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Deep Work State</h2>
                            </motion.div>
                        )}

                        {/* Large Timer */}
                        <div className="flex flex-col items-center group">
                            <motion.div
                                animate={{
                                    scale: focusMode.isActive ? 1.05 : 1,
                                    filter: focusMode.isActive ? 'drop-shadow(0 0 50px var(--neon-green-glow))' : 'none'
                                }}
                                className={`${isExpanded ? 'text-[250px] md:text-[450px]' : 'text-[150px] md:text-[250px]'} font-mono font-black text-white tracking-tighter leading-none transition-all duration-700`}
                            >
                                {formatTime(focusMode.timeLeft)}
                            </motion.div>

                            <div className="flex justify-center gap-8 mt-12 bg-white/5 backdrop-blur-xl p-6 rounded-[40px] border border-white/10">
                                <button
                                    onClick={() => setFocusActive(!focusMode.isActive)}
                                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${focusMode.isActive ? 'bg-yellow-500 text-black' : 'bg-[var(--neon-green)] text-black shadow-2xl shadow-[var(--neon-green)]/40 hover:scale-110'}`}
                                >
                                    {focusMode.isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                                </button>
                                <button
                                    onClick={() => { setFocusActive(false); setFocusTime(25 * 60); }}
                                    className="w-24 h-24 rounded-full bg-white/5 border border-white/10 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                >
                                    <Square size={32} fill="currentColor" />
                                </button>
                            </div>
                        </div>

                        {!isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl p-8 rounded-[40px] border border-white/10 space-y-6"
                            >
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                                        <Volume2 size={16} className="text-[var(--neon-green)]" /> Ambient Protocol
                                    </h4>
                                    <div className="flex items-center gap-4 flex-1 max-w-[200px] ml-10">
                                        <input
                                            type="range" min="0" max="1" step="0.01"
                                            value={ambient.volume}
                                            onChange={(e) => setAmbient({ volume: parseFloat(e.target.value) })}
                                            className="w-full h-1 bg-white/10 rounded-full appearance-none accent-[var(--neon-green)]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {SOUNDS.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setAmbient({
                                                track: ambient.track === s.id ? 'none' : s.id,
                                                isPlaying: ambient.track === s.id ? false : true
                                            })}
                                            className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all ${ambient.track === s.id ? 'bg-[var(--neon-green)] text-black border-[var(--neon-green)]' : 'bg-white/5 text-gray-600 border-white/5 hover:border-white/20'}`}
                                        >
                                            {s.icon}
                                            <span className="text-[8px] font-black uppercase tracking-widest">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                    {/* Tactical Stream Sidebar */}
                    <AnimatePresence>
                        {showTactical && (
                            <motion.div
                                initial={{ x: 400, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 400, opacity: 0 }}
                                className="fixed right-0 top-0 bottom-0 w-[350px] bg-black/60 backdrop-blur-3xl border-l border-white/5 p-10 z-50 overflow-y-auto"
                            >
                                <div className="space-y-10">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">TACTICAL_LIVE_STREAM</h4>
                                        <div className="h-0.5 w-12 bg-[var(--neon-green)]" />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[9px] font-mono text-gray-500 uppercase mb-2">Completion_Inertia</p>
                                            <div className="flex items-end gap-2 text-3xl font-mono font-black text-white">
                                                {Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100)}%
                                                <span className="text-[10px] text-[var(--neon-green)] uppercase mb-1">Sector_Clear</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[9px] font-mono text-gray-500 uppercase">Recent_Pulse_Activity</p>
                                            {tasks.slice(0, 5).map((t, i) => (
                                                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${t.completed ? 'bg-[var(--neon-green)]' : 'bg-white/10 animate-pulse'}`} />
                                                    <span className={`text-[11px] font-bold truncate ${t.completed ? 'text-white/40' : 'text-white'}`}>{t.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-20 opacity-20 hover:opacity-100 transition-opacity">
                                        <p className="text-[8px] font-mono text-gray-600 uppercase tracking-[0.3em] leading-relaxed">
                                            System: Crystal_OS_v2.4<br />
                                            Module: Tactical_Immersion_09<br />
                                            Status: Operating_Optimal
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FocusMode;
