import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, MessageSquare, Terminal, Cpu } from 'lucide-react';
import { AiService } from '../../lib/ai';

const AiAssistant = ({ tasks, projects }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Systems online. Cortex ready for input.", sender: 'ai' }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Process with AI Service
        try {
            const responseText = await AiService.chat(input, { tasks, projects });

            const aiMsg = {
                id: Date.now() + 1,
                text: responseText,
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now(), text: "Error: Neural Link unstable.", sender: 'ai' }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--neon-green)] rounded-full shadow-[0_0_20px_rgba(175,252,65,0.4)] flex items-center justify-center z-40 text-black hover:bg-white transition-colors"
            >
                <Sparkles size={24} className="animate-pulse" />
            </motion.button>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[500px] bg-black/90 backdrop-blur-xl border border-[var(--neon-green)]/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[var(--neon-green)]/20 rounded-lg text-[var(--neon-green)]">
                                    <Cpu size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Cortex AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse"></span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-white/10 text-white rounded-tr-sm border border-white/5'
                                            : 'bg-[var(--neon-green)]/10 text-[var(--neon-green)] rounded-tl-sm border border-[var(--neon-green)]/20'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="flex gap-1 p-3 bg-[var(--neon-green)]/5 rounded-2xl rounded-tl-sm">
                                        <span className="w-1.5 h-1.5 bg-[var(--neon-green)] rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-[var(--neon-green)] rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-[var(--neon-green)] rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[var(--neon-green)]/50 transition-colors">
                                <Terminal size={14} className="text-gray-500" />
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Enter command..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-600 font-mono"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="p-1.5 bg-[var(--neon-green)] text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AiAssistant;
