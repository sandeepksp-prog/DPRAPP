"use client";

import React from 'react';
import Link from 'next/link';
import { Search, Bell, Plus, Activity, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DPRHome() {
  return (
    <div className="flex flex-col min-h-full bg-[#F2F5F8] text-slate-900 pb-24">
      
      {/* Header Profile Section */}
      <div className="px-6 pt-6 pb-2 md:pt-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-[1.5px] border-slate-900 overflow-hidden">
             <img src="/assets/ksppl-logo.png" alt="Profile" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">Welcome 👋</p>
            <h1 className="text-[15px] font-extrabold text-slate-900 leading-none mt-1">Rajiv Sharma</h1>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors">
            <Search size={18} strokeWidth={2.5} />
          </button>
          <button className="relative w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors">
            <Bell size={18} strokeWidth={2.5} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
          </button>
        </div>
      </div>

      <div className="px-6 mt-4">
        <h2 className="text-[28px] font-black leading-[1.1] text-slate-900 tracking-tight">
          Here's your<br/>project at a glance
        </h2>
      </div>

      {/* Main Content Grid */}
      <div className="px-6 mt-6 space-y-4">
        
        {/* Wide Card - Daily Target */}
        <Link href="/dpr/reports">
          <div className="w-full bg-[#bde0fe] border-[1.5px] border-slate-900 rounded-[24px] p-5 relative overflow-hidden group hover:scale-[1.01] transition-transform shadow-[0_4px_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-2 bg-white/60 border border-slate-900 rounded-full px-3 py-1">
                  <Activity size={14} strokeWidth={2.5} />
                  <span className="text-[11px] font-bold">Daily Target</span>
               </div>
               <div className="w-6 h-6 rounded-full border-[1.5px] border-slate-900 flex items-center justify-center bg-white text-slate-900">
                  <ArrowRight size={12} strokeWidth={3} />
               </div>
            </div>
            
            <p className="text-sm font-bold text-slate-800 leading-snug max-w-[80%] pr-4">
              Complete civil structural logs for Aliganj Phase 1 before 6 PM today 🏗️
            </p>
            
            <div className="mt-4 inline-flex items-center gap-1 bg-white border-[1.5px] border-slate-900 px-4 py-1.5 rounded-full text-[11px] font-bold">
               Start Now <ArrowRight size={12} />
            </div>
          </div>
        </Link>

        {/* Split Cards */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Submissions Card */}
          <div className="bg-[#ffc8dd] border-[1.5px] border-slate-900 rounded-[24px] p-4 flex flex-col justify-between shadow-[0_4px_0_rgba(15,23,42,1)]">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-full bg-white border border-slate-900 flex items-center justify-center">
                 <Zap size={14} className="text-slate-900" strokeWidth={2.5} />
               </div>
               <span className="text-[11px] font-bold text-slate-800">Total FHTC</span>
             </div>
             
             <div>
               {/* Progress bar visual */}
               <div className="flex gap-1 mb-2">
                 {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className={`w-2.5 h-8 rounded-full border border-slate-900 ${i < 5 ? 'bg-white' : 'bg-transparent'}`}></div>
                 ))}
               </div>
               <h3 className="text-xl font-black">2,695</h3>
             </div>
          </div>

          {/* Active Schemes Card */}
          <div className="bg-[#fcf6bd] border-[1.5px] border-slate-900 rounded-[24px] p-4 flex flex-col justify-between shadow-[0_4px_0_rgba(15,23,42,1)]">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-full bg-white border border-slate-900 flex items-center justify-center">
                 <svg className="w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
               </div>
               <span className="text-[11px] font-bold text-slate-800">Schemes</span>
             </div>
             
             <div>
               {/* Simple curved line visualization */}
               <svg className="w-full h-8 mb-2 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                 <path d="M0 25 Q25 0 50 15 T100 5 L100 30 L0 30 Z" fill="#fcf6bd" stroke="#0f172a" strokeWidth="2" />
                 <path d="M0 25 Q25 0 50 15 T100 5" fill="none" stroke="#0f172a" strokeWidth="2" />
                 <circle cx="20" cy="15" r="3" fill="white" stroke="#0f172a" strokeWidth="1.5" />
                 <circle cx="80" cy="10" r="3" fill="white" stroke="#0f172a" strokeWidth="1.5" />
               </svg>
               <h3 className="text-xl font-black">14 <span className="text-sm font-bold text-slate-600">Active</span></h3>
             </div>
          </div>

        </div>

        {/* Sync Status / Emotion Check */}
        <div className="mt-6">
          <h3 className="text-lg font-black mb-3 text-slate-900">Overall Progress</h3>
          <div className="w-full bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 flex items-center justify-between shadow-[0_4px_0_rgba(15,23,42,1)]">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-4 bg-[#fcf6bd] border-[1px] border-slate-900 rounded-sm"></div>
                  <span className="text-xs font-bold text-slate-900">Civil Works</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">In Progress</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-4 bg-[#bde0fe] border-[1px] border-slate-900 rounded-sm"></div>
                  <span className="text-xs font-bold text-slate-900">Pipeline</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">Started</span>
              </div>
            </div>

            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Circular Ring SVG */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#bde0fe]"
                  strokeDasharray="60, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black">60<span className="text-sm">%</span></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
