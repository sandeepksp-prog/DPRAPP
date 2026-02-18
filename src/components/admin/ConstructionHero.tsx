import React from 'react';
import { motion } from 'framer-motion';

const ConstructionHero = () => {
    return (
        <div className="h-full min-h-[300px] rounded-2xl relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3b82f6] shadow-2xl border border-white/5 group">

            {/* 1. ATMOSPHERIC GLOWS */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/30 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>

            {/* 2. OHT SILHOUETTE (Overhead Tank) */}
            <div className="absolute right-8 bottom-12 w-32 h-48 opacity-40 mix-blend-overlay">
                {/* Tank Body */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-20 bg-slate-900 rounded-lg shadow-inner border-t border-white/10"></div>
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-4 h-28 bg-slate-900"></div> {/* Main Shaft */}
                {/* Legs */}
                <div className="absolute top-20 left-2 w-2 h-28 bg-slate-900 -rotate-3 origin-top"></div>
                <div className="absolute top-20 right-2 w-2 h-28 bg-slate-900 rotate-3 origin-top"></div>
                {/* Bracing */}
                <div className="absolute top-32 left-0 w-full h-1 bg-slate-900/50"></div>
                <div className="absolute top-44 left-0 w-full h-1 bg-slate-900/50"></div>
            </div>

            {/* 3. CONSTRUCTION WORKERS SHADOWS */}
            {/* Worker 1: On scaffolding/ladder */}
            <div className="absolute right-24 bottom-24 w-6 h-12 opacity-30 mix-blend-multiply flex flex-col items-center">
                <div className="w-2 h-2 bg-black rounded-full mb-0.5"></div> {/* Head */}
                <div className="w-4 h-6 bg-black rounded-sm"></div> {/* Body */}
                <div className="w-1 h-4 bg-black rotate-12"></div> {/* Leg */}
            </div>

            {/* Worker 2: Carrying something at bottom */}
            <div className="absolute left-12 bottom-8 w-8 h-12 opacity-30 mix-blend-multiply flex flex-col items-center transform scale-x-[-1]">
                <div className="w-2 h-2 bg-black rounded-full mb-0.5"></div>
                <div className="w-4 h-5 bg-black rounded-sm skew-x-6"></div>
                <div className="flex gap-1">
                    <div className="w-1 h-5 bg-black rotate-12"></div>
                    <div className="w-1 h-5 bg-black -rotate-12"></div>
                </div>
            </div>

            {/* 4. GROUND & FOREGROUND */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute -bottom-4 left-0 right-0">
                <svg viewBox="0 0 400 50" className="w-full h-full opacity-20 fill-slate-900">
                    <path d="M0,50 L400,50 L400,20 C350,25 300,10 250,20 C200,30 150,40 100,20 C50,0 0,30 0,20 Z" />
                </svg>
            </div>

            {/* 5. TEXT CONTENT (Minimal) */}
            <div className="absolute top-6 left-6 z-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Live Operations</span>
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">
                    Building<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Tomorrow's</span><br />
                    Infrastructure
                </h2>
                <p className="text-blue-200/60 text-xs mt-4 max-w-[150px] leading-relaxed">
                    Real-time monitoring of OHT construction and rapid deployment teams.
                </p>
            </div>

            {/* 6. INTERACTIVE HOVER OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
    );
};

export default ConstructionHero;
