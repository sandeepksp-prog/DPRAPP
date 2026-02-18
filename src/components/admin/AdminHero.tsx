"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";

export default function AdminHero() {
    return (
        <div className="relative bg-slate-900 pb-32 overflow-visible">

            {/* HEROBACKGROUND: Deep Blue Gradient + Construction Silhouette */}
            <div className="absolute inset-0 h-[500px] bg-gradient-to-b from-[#0072BC] via-[#1B3E6E] to-[#0D1B2A] overflow-hidden">

                {/* 1. Abstract Construction Grid/Cranes Pattern (CSS) */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(255,255,255,0.1) 0%, transparent 60%)' }}>
                </div>

                {/* 2. Construction Silhouette Overlay (Simulated with repeating linear gradients for now as placeholder for image) */}
                <div className="absolute bottom-0 left-0 right-0 h-64 opacity-30 pointer-events-none">
                    {/* Building Silhouettes - placeholders until user adds specific image or we can gen one */}
                    <div className="absolute bottom-0 left-[10%] w-20 h-40 bg-black/40"></div>
                    <div className="absolute bottom-0 left-[20%] w-32 h-64 bg-black/30"></div>
                    <div className="absolute bottom-0 right-[15%] w-24 h-52 bg-black/40"></div>
                    <div className="absolute bottom-0 right-[5%] w-40 h-32 bg-black/20"></div>
                    {/* Crane Arm Simplification */}
                    <div className="absolute bottom-40 right-[18%] w-64 h-2 bg-black/30 rotate-[-15deg] origin-bottom-left"></div>
                </div>

                {/* 3. Cube Texture (Logo Infusion) */}
                <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"></div>

                {/* 4. Bottom Fade to blend with Wave */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D1B2A] to-transparent"></div>
            </div>

            {/* CONTENT CONTAINER */}
            <div className="relative z-10 px-6 md:px-8 max-w-[1920px] mx-auto pt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                    {/* LEFT: BRANDING */}
                    <div className="flex items-center gap-4">
                        {/* LOGO PLACEHOLDER */}
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl transition-transform hover:scale-105 duration-300">
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
                            <div className="flex items-center gap-3 text-xs font-bold text-blue-200 uppercase tracking-widest mt-1.5 opacity-90">
                                <span className="flex items-center gap-1.5 bg-blue-500/20 px-2 py-1 rounded border border-blue-400/30 backdrop-blur-sm">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
                                    SYNCED
                                </span>
                                <span>Central Command • v2.0</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: GLOBAL TOOLS */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* SEARCH */}
                        <div className="flex-1 md:flex-none relative group">
                            <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative flex items-center bg-white/5 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 focus-within:bg-white/10 focus-within:border-white/30 transition-all w-full md:w-80 shadow-inner">
                                <Search size={18} className="text-cyan-200" />
                                <input
                                    type="text"
                                    placeholder="Search projects, schemes..."
                                    className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-blue-200/50 font-medium"
                                />
                            </div>
                        </div>

                        {/* NOTIFICATIONS */}
                        <button className="relative p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/10 text-white group shadow-lg">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-blue-900 shadow-[0_0_8px_rgba(244,63,94,0.6)] group-hover:scale-110 transition-transform"></span>
                        </button>

                        {/* USER PROFILE */}
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-bold text-white leading-none tracking-wide text-shadow-sm">Admin User</p>
                                <p className="text-[10px] text-cyan-300 font-bold uppercase mt-1">Super Admin</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-xl shadow-blue-900/50 hover:shadow-cyan-500/20 transition-shadow">
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
