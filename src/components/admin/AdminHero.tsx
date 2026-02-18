"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";

interface AdminHeroProps {
    variant?: 'blue' | 'sunset' | 'tech';
}

export default function AdminHero({ variant = 'blue' }: AdminHeroProps) {

    // VARIANT CONFIGURATION
    const styles = {
        blue: {
            bg: "bg-gradient-to-b from-[#0072BC] via-[#1B3E6E] to-[#0D1B2A]",
            accent: "#22D3EE",
            sky: "from-cyan-400/30 to-blue-600/10",
            metal: ["#0B2038", "#2A4B7C", "#0B2038"],
            pipe: ["#1B3E6E", "#3B82F6", "#1B3E6E"],
            crane: "#080F18",
            button: "bg-blue-500",
            buttonBorder: "border-blue-400"
        },
        sunset: {
            bg: "bg-gradient-to-b from-[#EA580C] via-[#9A3412] to-[#2D1B0D]",
            accent: "#FDBA74",
            sky: "from-orange-400/30 to-rose-600/10",
            metal: ["#2D1B0D", "#7C2D12", "#2D1B0D"],
            pipe: ["#7C2D12", "#EA580C", "#7C2D12"],
            crane: "#140A05",
            button: "bg-orange-500",
            buttonBorder: "border-orange-400"
        },
        tech: {
            bg: "bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#020617]",
            accent: "#00FF9D",
            sky: "from-emerald-400/20 to-cyan-600/10",
            metal: ["#020617", "#1E293B", "#020617"],
            pipe: ["#064E3B", "#10B981", "#064E3B"],
            crane: "#020617",
            button: "bg-emerald-500",
            buttonBorder: "border-emerald-400"
        }
    };

    const s = styles[variant];

    return (
        <div className="relative bg-slate-900 pb-32 overflow-visible">

            {/* HEROBACKGROUND: Deep Blue Gradient + Construction Silhouette */}
            <div className={`absolute inset-0 h-[500px] ${s.bg} overflow-hidden transition-colors duration-1000`}>

                {/* 1. Abstract Construction Grid/Cranes Pattern (CSS) */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(255,255,255,0.1) 0%, transparent 60%)' }}>
                </div>

                {/* 3. CONSTRUCTION SCENE (SVG) */}
                <div className="absolute bottom-0 left-0 right-0 h-full w-full pointer-events-none z-0">
                    <svg className="w-full h-full" viewBox="0 0 1920 500" preserveAspectRatio="xMidYBottom slice">
                        <defs>
                            <linearGradient id={`metal-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={s.metal[0]} />
                                <stop offset="50%" stopColor={s.metal[1]} />
                                <stop offset="100%" stopColor={s.metal[2]} />
                            </linearGradient>
                            <linearGradient id={`pipe-grad-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={s.pipe[0]} />
                                <stop offset="50%" stopColor={s.pipe[1]} />
                                <stop offset="100%" stopColor={s.pipe[2]} />
                            </linearGradient>
                        </defs>

                        {/* BACKGROUND SILHOUETTE */}
                        <path d="M0,500 L0,350 L50,350 L50,320 L120,320 L120,380 L200,380 L200,250 L300,250 L300,500 Z" fill={s.metal[0]} opacity="0.4" />
                        <path d="M1600,500 L1600,300 L1700,300 L1700,250 L1800,250 L1800,500 Z" fill={s.metal[0]} opacity="0.4" />

                        {/* OHT STRUCTURE */}
                        <rect x="1300" y="200" width="25" height="300" fill={`url(#metal-grad-${variant})`} />
                        <rect x="1450" y="200" width="25" height="300" fill={`url(#metal-grad-${variant})`} />
                        <line x1="1312" y1="250" x2="1462" y2="300" stroke={s.metal[1]} strokeWidth="6" opacity="0.8" />
                        <line x1="1312" y1="350" x2="1462" y2="400" stroke={s.metal[1]} strokeWidth="6" opacity="0.8" />
                        <line x1="1462" y1="250" x2="1312" y2="300" stroke={s.metal[1]} strokeWidth="6" opacity="0.8" />

                        {/* Tank Body */}
                        <path d="M1270,100 L1500,100 C1520,100 1530,120 1530,150 L1530,200 L1240,200 L1240,150 C1240,120 1250,100 1270,100 Z" fill={`url(#metal-grad-${variant})`} />
                        <ellipse cx="1385" cy="100" rx="130" ry="15" fill={s.metal[1]} opacity="0.5" />
                        <rect x="1240" y="140" width="290" height="15" fill={s.accent} opacity="0.4" />

                        {/* PIPELINES */}
                        <path d="M-50,460 L1200,460 C1280,460 1320,420 1330,300" stroke={`url(#pipe-grad-${variant})`} strokeWidth="16" fill="none" opacity="0.9" />
                        <path d="M1330,300 L1330,200" stroke={`url(#pipe-grad-${variant})`} strokeWidth="12" fill="none" strokeDasharray="15 10" opacity="0.8" />

                        {/* CRANE */}
                        <rect x="400" y="200" width="12" height="300" fill={s.metal[0]} opacity="0.7" />
                        <line x1="400" y1="200" x2="650" y2="130" stroke={s.metal[0]} strokeWidth="6" opacity="0.7" />
                        <line x1="650" y1="130" x2="650" y2="280" stroke={s.metal[0]} strokeWidth="2" opacity="0.4" />

                        {/* DATA OVERLAY */}
                        <g transform="translate(1080, 240)">
                            <rect x="0" y="0" width="140" height="70" rx="12" fill={`${s.metal[0]}CC`} stroke={`${s.accent}4D`} strokeWidth="1" />
                            <text x="15" y="25" fill={s.accent} fontSize="12" fontFamily="monospace" letterSpacing="1">PRESSURE</text>
                            <text x="15" y="50" fill="white" fontSize="20" fontWeight="bold" fontFamily="monospace">240 PSI</text>
                            <circle cx="120" cy="35" r="4" fill={variant === 'sunset' ? '#F59E0B' : '#10B981'} className="animate-pulse" />
                        </g>
                    </svg>
                </div>

                {/* CUBE TEXTURE */}
                <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

                {/* BOTTOM FADE */}
                <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0D1B2A] to-transparent`}></div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 px-6 md:px-8 max-w-[1920px] mx-auto pt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* LEFT: BRANDING */}
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl hover:scale-105 duration-300">
                            <img
                                src="/assets/logo.png"
                                alt="KSPPL Logo"
                                className="h-12 w-auto object-contain drop-shadow-md"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = '<div class="text-white font-black text-2xl tracking-tighter px-2">KSPPL<span class="text-blue-400">.</span></div>';
                                }}
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                                Project Management System
                            </h1>
                            <div className={`flex items-center gap-3 text-xs font-bold text-blue-200 uppercase tracking-widest mt-1.5 opacity-90`}>
                                <span className={`flex items-center gap-1.5 bg-${variant === 'sunset' ? 'orange' : 'blue'}-500/20 px-2 py-1 rounded border border-${variant === 'sunset' ? 'orange' : 'blue'}-400/30 backdrop-blur-sm`}>
                                    <span className={`w-2 h-2 rounded-full bg-${variant === 'sunset' ? 'orange' : 'cyan'}-400 animate-pulse`}></span>
                                    SYNCED
                                </span>
                                <span>Central Command • v2.0</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: TOOLS */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none relative group">
                            <div className={`absolute inset-0 bg-${variant === 'sunset' ? 'orange' : 'blue'}-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            <div className="relative flex items-center bg-white/5 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 w-full md:w-80 shadow-inner">
                                <Search size={18} className={`text-${variant === 'sunset' ? 'orange' : 'cyan'}-200`} />
                                <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-white/50" />
                            </div>
                        </div>
                        <button className="relative p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/10 text-white shadow-lg">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-blue-900 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-bold text-white">Admin User</p>
                                <p className={`text-[10px] text-${variant === 'sunset' ? 'orange' : 'cyan'}-300 font-bold uppercase mt-1`}>Super Admin</p>
                            </div>
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${variant === 'sunset' ? 'orange' : 'cyan'}-400 to-${variant === 'sunset' ? 'rose' : 'blue'}-600 p-0.5 shadow-xl`}>
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white border-2 border-transparent">
                                    <User size={22} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* WAVY BOTTOM SHAPE (Positioned lower to allow cards to overlap) */}
            <div className="absolute top-[380px] left-0 right-0 w-full overflow-hidden leading-[0] z-0 opacity-90">
                <svg className="relative block w-[calc(100%+1.3px)] h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".1" className="fill-white"></path>
                    <path d="M0,0V15.81C13,36.92,47.64,50.79,98.28,60.47c94,17.94,220.69-24,310-74.47,81.44-46.06,177.36-9.76,211.39,3.77,53.25,21.19,101.44,57.14,142.34,70.63,49.88,16.45,108.33,14.65,160.28,12.75,23.16-.84,47.19-2.31,70.92-2.18,52.23.27,91.86,9.16,133.51,21.94,16.51,5.07,31.7,11.23,43.28,18.09V0Z" opacity=".3" className="fill-white"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-slate-50"></path>
                </svg>
            </div>
        </div>
    );
}
