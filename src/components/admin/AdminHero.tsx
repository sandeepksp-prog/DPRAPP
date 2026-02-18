"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";

export default function AdminHero() {
    return (
        <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 pt-6 pb-32 overflow-hidden">

            {/* BACKGROUND TEXTURE / IMAGE OVERLAY */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                {/* Fallback Abstract Construction Pattern if Image Generation Fails */}
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="cons-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#cons-pattern)" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
            </div>

            {/* CONTENT CONTAINER */}
            <div className="relative z-10 px-6 md:px-8 max-w-[1920px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                    {/* LEFT: BRANDING */}
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl font-black text-2xl tracking-tighter border border-white/20 shadow-2xl">
                            KSPPL<span className="text-blue-400">.</span>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                                Project Management System
                            </h1>
                            <div className="flex items-center gap-3 text-xs font-bold text-blue-200 uppercase tracking-widest mt-1">
                                <span className="flex items-center gap-1.5 bg-blue-500/20 px-2 py-1 rounded border border-blue-400/30">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
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
                            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative flex items-center bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 focus-within:bg-white/20 focus-within:border-white/30 transition-all w-full md:w-64">
                                <Search size={18} className="text-blue-200" />
                                <input
                                    type="text"
                                    placeholder="Search projects, schemes..."
                                    className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white placeholder:text-blue-200/50 font-medium"
                                />
                            </div>
                        </div>

                        {/* NOTIFICATIONS */}
                        <button className="relative p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/10 text-white group">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-blue-900 shadow-sm group-hover:scale-110 transition-transform"></span>
                        </button>

                        {/* USER PROFILE */}
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-bold text-white leading-none">Admin User</p>
                                <p className="text-[10px] text-blue-300 font-bold uppercase mt-1">Super Admin</p>
                            </div>
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 p-0.5 shadow-lg shadow-blue-900/50">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white border-2 border-transparent">
                                    <User size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HERO STATS OVERLAY (Optional - can be added here if needed to sit on background) */}
            </div>

            {/* WAVY BOTTOM SHAPE */}
            <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
                <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
                    <path d="M0,0V15.81C13,36.92,47.64,50.79,98.28,60.47c94,17.94,220.69-24,310-74.47,81.44-46.06,177.36-9.76,211.39,3.77,53.25,21.19,101.44,57.14,142.34,70.63,49.88,16.45,108.33,14.65,160.28,12.75,23.16-.84,47.19-2.31,70.92-2.18,52.23.27,91.86,9.16,133.51,21.94,16.51,5.07,31.7,11.23,43.28,18.09V0Z" opacity=".5" className="fill-white"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-slate-50"></path>
                </svg>
            </div>
        </div>
    );
}
