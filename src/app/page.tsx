'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, HardHat, ArrowRight, Lock } from 'lucide-react';

export default function LoginPortal() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<'admin' | 'field' | null>(null);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Mock Authentication Logic
        setTimeout(() => {
            if (selectedRole === 'admin') {
                if (pin === 'admin') {
                    router.push('/admin');
                } else {
                    setError('Invalid Admin PIN');
                    setLoading(false);
                }
            } else {
                if (pin === '1234') {
                    router.push('/field');
                } else {
                    setError('Invalid Field PIN (Try 1234)');
                    setLoading(false);
                }
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[40vh] bg-[#0066CC] rounded-b-[3rem] shadow-2xl z-0" />
            <div className="absolute top-10 right-10 opacity-10 text-white animate-pulse">
                <ShieldCheck size={120} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Infra-OS</h1>
                    <p className="text-blue-200 text-sm font-medium mt-2 tracking-wider uppercase">Construction ERP Phase-II</p>
                </div>

                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] p-8 border border-white/50">

                    {!selectedRole ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold text-slate-800 text-center">Select Your Profile</h2>

                            <button
                                onClick={() => setSelectedRole('admin')}
                                className="w-full group relative overflow-hidden bg-white hover:bg-[#f0f9ff] border-2 border-slate-100 hover:border-[#0066CC] p-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md text-left flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-[#0066CC] flex items-center justify-center transition-colors">
                                    <ShieldCheck size={24} className="text-slate-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-[#0066CC] transition-colors">Project Manager</h3>
                                    <p className="text-xs text-slate-400">Admin Dashboard & Analytics</p>
                                </div>
                                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#0066CC]">
                                    <ArrowRight size={20} />
                                </div>
                            </button>

                            <button
                                onClick={() => setSelectedRole('field')}
                                className="w-full group relative overflow-hidden bg-white hover:bg-[#f0fdf4] border-2 border-slate-100 hover:border-[#15803d] p-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md text-left flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-[#15803d] flex items-center justify-center transition-colors">
                                    <HardHat size={24} className="text-slate-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-[#15803d] transition-colors">Field Engineer</h3>
                                    <p className="text-xs text-slate-400">Site Reports & DPR Entry</p>
                                </div>
                                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#15803d]">
                                    <ArrowRight size={20} />
                                </div>
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="text-center">
                                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedRole === 'admin' ? 'bg-blue-50 text-[#0066CC]' : 'bg-green-50 text-[#15803d]'
                                    }`}>
                                    {selectedRole === 'admin' ? <ShieldCheck size={32} /> : <HardHat size={32} />}
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 capitalize">
                                    {selectedRole === 'admin' ? 'Manager Access' : 'Engineer Access'}
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">Enter your secure PIN to continue</p>
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="Enter PIN"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-center font-bold text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-all placeholder:tracking-normal placeholder:font-normal"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <p className="text-center text-red-500 text-xs font-bold animate-pulse">{error}</p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setSelectedRole(null); setPin(''); setError(''); }}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' :
                                            selectedRole === 'admin' ? 'bg-[#0066CC] hover:bg-blue-700' : 'bg-[#15803d] hover:bg-green-700'
                                        }`}
                                >
                                    {loading ? 'Verifying...' : 'Access Portal'}
                                    {!loading && <ArrowRight size={16} />}
                                </button>
                            </div>
                        </form>
                    )}

                </div>

                <p className="text-center text-slate-400 text-[10px] mt-8">
                    Secured by Infra-OS Identity • KSPL Construction
                </p>
            </div>
        </div>
    );
}
