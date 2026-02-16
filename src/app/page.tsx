"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate login delay
        setTimeout(() => {
            const normalizedUser = username.trim().toUpperCase();

            // 1. CHECK PASSWORD (Hardcoded '1111')
            if (password !== "1111") {
                setError("Incorrect Password. Please try again.");
                setLoading(false);
                return;
            }

            // 2. ADMIN LOGIN
            if (normalizedUser === "KSPLA") {
                router.push("/admin");
                return;
            }

            // 3. EMPLOYEE LOGIN (KSPL + Number)
            // Regex: Starts with KSPL followed by digits (e.g., KSPL01, KSPL023)
            const employeeRegex = /^KSPL\d+$/;
            if (employeeRegex.test(normalizedUser)) {
                router.push("/dashboard");
                return;
            }

            // Invalid Username
            setError("Invalid ID. Use KSPLA (Admin) or KSPL+Number (Employee).");
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-blue-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-90"></div>
                    {/* Subtle Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    <div className="relative z-10">
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">KSPPL<span className="text-blue-500">.</span></h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Project Management System</p>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8 pt-10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Username <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 uppercase"
                                    placeholder="Enter your Employee ID"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* PASSWORD FIELD (Required: 1111) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                                    placeholder="........"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded border border-red-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !username || !password}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10">{loading ? "Authenticating..." : "Access Dashboard"}</span>
                            {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                            {loading && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">Restricted Access • KSPPL PMS v2.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
