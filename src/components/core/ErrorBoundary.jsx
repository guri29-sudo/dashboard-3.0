import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#030303] text-[var(--neon-green)] p-10 flex flex-col items-center justify-center font-mono selection:bg-[var(--neon-green)] selection:text-black">
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--neon-green)]/10 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 w-full max-w-4xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                    Critical <span className="text-red-500">Kernel Panic</span>
                                </h1>
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-2">Error Code: CRITICAL_PROCESS_DIED // SECTOR: 0x7FF</p>
                            </div>
                        </div>

                        <div className="glass-card p-8 border-red-500/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full" />
                            <p className="text-red-400 font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                EXCEPTION_CAUGHT: {this.state.error && this.state.error.toString()}
                            </p>
                            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 font-mono text-[11px] text-gray-400 overflow-x-auto custom-scrollbar leading-relaxed">
                                <pre className="whitespace-pre-wrap">
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col md:flex-row items-center gap-6">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full md:w-auto px-10 py-5 bg-[var(--neon-green)] text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_var(--neon-green-glow)]"
                            >
                                Reboot System Core
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full md:w-auto px-10 py-5 bg-white/5 text-gray-400 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                            >
                                Return to Safe Mode
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
