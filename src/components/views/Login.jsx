import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Zap, Shield, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../../lib/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
        setLoading(false);

        if (error) {
            console.error(error);
            setError(error.message || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[var(--neon-green)] selection:text-black">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--neon-green)]/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-md p-10 space-y-8"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tighter text-[var(--neon-green)]">G-ASSISTANT</h1>
                    <p className="text-gray-500 mt-2">{isSignUp ? 'Initialize New Protocol' : 'Welcome back, Boss.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-[var(--neon-green)] transition-all"
                            placeholder="agent@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-[var(--neon-green)] transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <motion.button
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-2xl font-bold text-black transition-all ${error ? 'bg-red-500' : 'bg-[var(--neon-green)]'} ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'PROCESSING...' : (error ? error : (isSignUp ? 'INITIATE REGISTRATION' : 'UNSEAL DASHBOARD'))}
                    </motion.button>

                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="w-full text-xs text-gray-500 hover:text-[var(--neon-green)] transition-colors uppercase tracking-widest"
                    >
                        {isSignUp ? 'Already have credentials? Sign In' : 'Need clearance? Register Protocol'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
