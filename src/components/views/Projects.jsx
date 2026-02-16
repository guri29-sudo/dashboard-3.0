import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, BookOpen, ExternalLink, Sparkles, X, CheckSquare, Layers } from 'lucide-react';

import { useStore } from '../../lib/store';
import { AiService } from '../../lib/ai';

const Projects = () => {
    const { projects, addProject, toggleProject, deleteProject } = useStore();
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);

    const handleAddProject = async () => {
        if (!name) return;

        const research = await AiService.generateProjectResearch(name, desc);
        addProject({ name, desc, research });
        setName('');
        setDesc('');
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Microprojects</h1>
                    <p className="text-gray-500 mt-1 md:mt-2 font-medium text-xs md:text-base">Research tactical objectives with AI.</p>
                </div>
            </div>

            <div className="glass-card p-8 border-[var(--neon-green)]/10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Project Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Build a Carbon Fiber Drone"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-[var(--neon-green)] transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Goal/Objective</label>
                        <input
                            type="text"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="What are we researching?"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-[var(--neon-green)] transition-all"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAddProject}
                    className="w-full py-4 bg-[var(--neon-green)] text-black font-black text-xs rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest"
                >
                    Initialize AI Research Protocol
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 md:pb-0">
                <AnimatePresence>
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`glass-card p-6 flex flex-col justify-between group h-full transition-all ${project.completed ? 'opacity-60 border-l-[var(--neon-green)]' : ''}`}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-xl transition-all ${project.completed ? 'bg-[var(--neon-green)] text-black' : 'bg-white/5 text-[var(--neon-green)]'}`}>
                                        <BookOpen size={20} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleProject(project.id)}
                                            className={`p-2 transition-all ${project.completed ? 'text-[var(--neon-green)]' : 'text-gray-600 hover:text-var(--neon-green)]'}`}
                                            title={project.completed ? "Mark as Incomplete" : "Mark as Completed"}
                                        >
                                            <CheckSquare size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold tracking-tight transition-all ${project.completed ? 'line-through text-gray-400' : 'text-white'}`}>{project.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{project.desc}</p>
                                    {project.completed && (
                                        <span className="inline-block mt-3 px-3 py-1 bg-[var(--neon-green)]/10 text-[var(--neon-green)] text-[8px] font-black uppercase rounded-lg">Protocol Complete</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={() => setSelectedProject(project)}
                                    className="w-full py-3 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest group-hover:border-[var(--neon-green)]/50 group-hover:text-[var(--neon-green)] transition-all flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={14} />
                                    Review AI Insights
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {projects.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                        <p className="text-gray-600 font-bold uppercase tracking-[0.2em]">Launch your first project to begin AI research.</p>
                    </div>
                )}
            </div>

            {/* AI Insights Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl max-h-[90vh] bg-white/5 dark:bg-white/5 light-mode:bg-black/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-y-auto no-scrollbar"
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-all"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-[var(--neon-green)] text-black rounded-2xl shadow-[0_0_20px_var(--neon-green-glow)]">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <p className="text-[var(--neon-green)] text-[10px] font-black uppercase tracking-widest">AI Research Results</p>
                                    <h2 className="text-3xl font-black tracking-tighter uppercase">{selectedProject.name}</h2>
                                </div>
                            </div>

                            {selectedProject.research?.brief && (
                                <div className="mb-8 p-6 bg-[var(--neon-green)]/5 border-l-4 border-[var(--neon-green)] rounded-r-2xl">
                                    <p className="text-sm font-medium text-gray-300 italic leading-relaxed">
                                        "{selectedProject.research.brief}"
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="p-6 bg-white/5 rounded-[24px] border border-white/5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-[var(--neon-green)]" size={18} />
                                        <h4 className="text-xs font-black uppercase tracking-wider">{selectedProject.research?.primary_list_label || "Required Materials"}</h4>
                                    </div>
                                    <div className="space-y-3">
                                        {(selectedProject.research?.primary_list || selectedProject.research?.materials || []).map((m, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                                <div className="w-1.5 h-1.5 bg-[var(--neon-green)] rounded-full shrink-0"></div>
                                                <span className="truncate">{m}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-white/5 rounded-[24px] border border-white/5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckSquare className="text-[var(--neon-green)]" size={18} />
                                        <h4 className="text-xs font-black uppercase tracking-wider">{selectedProject.research?.secondary_list_label || "Implementation Steps"}</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {(selectedProject.research?.secondary_list || selectedProject.research?.steps || []).map((s, i) => (
                                            <div key={i} className="flex gap-3">
                                                <span className="text-[var(--neon-green)] font-black text-xs">{i + 1}.</span>
                                                <p className="text-sm text-gray-400 font-medium leading-tight">{s}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {selectedProject.research?.tactical_intel && (
                                <div className="mb-10 p-6 bg-white/5 rounded-[24px] border border-white/5">
                                    <h4 className="text-xs font-black uppercase tracking-wider mb-4 text-[var(--neon-green)]">Tactical Intelligence</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedProject.research.tactical_intel.map((intel, i) => (
                                            <div key={i} className="flex gap-3 items-start">
                                                <div className="w-1 h-5 bg-[var(--neon-green)]/40 rounded-full mt-0.5" />
                                                <p className="text-[11px] font-bold text-gray-400 leading-tight uppercase tracking-tight">{intel}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <div className="flex-1 p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Complexity</p>
                                    <p className="text-white font-bold">{selectedProject.research?.difficulty}</p>
                                </div>
                                <div className="flex-1 p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Est. Duration</p>
                                    <p className="text-white font-bold">{selectedProject.research?.estTime}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedProject(null)}
                                className="w-full mt-10 py-4 bg-[var(--neon-green)] text-black font-black text-xs rounded-2xl hover:brightness-110 transition-all uppercase tracking-widest"
                            >
                                Close Insights
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Projects;
