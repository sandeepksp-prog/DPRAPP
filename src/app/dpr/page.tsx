"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, ClipboardEdit, ArrowRight, CalendarDays, Wallet, Box, AlertTriangle } from 'lucide-react';
import MapBanner from '@/components/dpr/MapBanner';
import UserAvatar from '@/components/dpr/UserAvatar';
import ProgressAnalysisBlock from '@/components/dpr/ProgressAnalysisBlock';
import NotificationsPanel from '@/components/dpr/NotificationsPanel';

export default function DPRHome() {
  const [profile, setProfile] = useState<any>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dpr_user_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      // Fallback if accessed without onboarding
      setProfile({ name: 'Rajiv Sharma', gender: 'male' });
    }
  }, []);

  if (!profile) return null; // Avoid hydration mismatch

  return (
    <div className="flex flex-col min-h-full bg-[#F2F5F8] text-slate-900 pb-24">
      
      {/* Header Profile Section */}
      <div className="px-6 pt-3 pb-2 md:pt-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <UserAvatar seed={profile.name} gender={profile.gender} traits={profile.avatarTraits} size={48} />
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HEY, WELCOME !</p>
            <h1 className="text-xl font-black text-slate-900 leading-none mt-1 uppercase">{profile.name}</h1>
          </div>
        </div>
        
        <div className="flex gap-2">

          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 transition-all"
          >
            <Bell size={18} strokeWidth={2.5} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-[1.5px] border-slate-900"></span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 mt-4 space-y-5">
        
        {/* 1. Map Banner Segment */}
        <MapBanner />

        {/* 2. START PROGRESS REPORT (Blue Segment) */}
        <Link href="/dpr/form" className="block">
          <div className="w-full bg-[#bde0fe] border-[1.5px] border-slate-900 rounded-[24px] p-5 relative overflow-hidden group hover:scale-[1.01] transition-transform shadow-[0_4px_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-1">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-2 bg-white/60 border border-slate-900 rounded-full px-3 py-1">
                  <ClipboardEdit size={14} strokeWidth={2.5} />
                  <span className="text-[11px] font-bold">Daily Update</span>
               </div>
               <div className="w-8 h-8 rounded-full border-[1.5px] border-slate-900 flex items-center justify-center bg-white text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <ArrowRight size={16} strokeWidth={2.5} />
               </div>
            </div>
            
            <h2 className="text-xl font-black text-slate-900 leading-tight mb-2">
              START PROGRESS REPORT
            </h2>
            <p className="text-sm font-bold text-slate-800 leading-snug max-w-[85%]">
              Fill out your daily DPR logs and track site progress.
            </p>
          </div>
        </Link>

        {/* 3. THIS WEEK PROGRESS (Dynamic AI Block) */}
        <ProgressAnalysisBlock />

        {/* 2x2 Grid for Other Segments */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* 4. ATTENDANCE (Yellow Segment) */}
          <Link href="/dpr/attendance" className="block h-full">
            <div className="group bg-[#fcf6bd] border-[1.5px] border-slate-900 rounded-[24px] p-4 flex flex-col justify-between h-full shadow-[0_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform cursor-pointer">
             <div className="flex items-center justify-between mb-4">
               <div className="w-8 h-8 rounded-full bg-white border border-slate-900 flex items-center justify-center">
                 <CalendarDays size={14} className="text-slate-900" strokeWidth={2.5} />
               </div>
               <div className="w-6 h-6 rounded-full border border-slate-900 flex items-center justify-center bg-white text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <ArrowRight size={10} strokeWidth={3} />
               </div>
             </div>
             <div>
               <h3 className="text-sm font-black uppercase tracking-wide mb-1">Attendance</h3>
               <p className="text-xs font-bold text-slate-700">Team Calendar</p>
               {/* Mini Mock Graph */}
               <div className="mt-3 flex gap-1 items-end h-8">
                 {[40, 70, 40, 90, 60].map((h, i) => (
                   <div key={i} className="w-full bg-slate-900 rounded-t-sm" style={{ height: `${h}%` }}></div>
                 ))}
               </div>
             </div>
            </div>
          </Link>

          {/* 5. LABOUR BILLS (Green Segment) */}
          <Link href="/dpr/labour-bills" className="block h-full">
            <div className="group bg-[#d8f3dc] border-[1.5px] border-slate-900 rounded-[24px] p-4 flex flex-col justify-between h-full shadow-[0_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform cursor-pointer">
             <div className="flex items-center justify-between mb-4">
               <div className="w-8 h-8 rounded-full bg-white border border-slate-900 flex items-center justify-center">
                 <Wallet size={14} className="text-slate-900" strokeWidth={2.5} />
               </div>
               <div className="w-6 h-6 rounded-full border border-slate-900 flex items-center justify-center bg-white text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <ArrowRight size={10} strokeWidth={3} />
               </div>
             </div>
             <div>
               <h3 className="text-sm font-black uppercase tracking-wide mb-1">Labour Bills</h3>
               <p className="text-xs font-bold text-slate-700">Weekly Payouts</p>
               <h4 className="text-lg font-black text-slate-900 mt-2">12 <span className="text-[10px] text-slate-600">Pending</span></h4>
             </div>
            </div>
          </Link>

        </div>

        {/* 6. MATERIALS & MACHINERY (Lavender Segment) */}
        <Link href="/dpr/materials" className="block mb-4">
          <div className="w-full group bg-[#cdb4db] border-[1.5px] border-slate-900 rounded-[24px] p-4 relative overflow-hidden shadow-[0_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform cursor-pointer">
           <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 flex items-center justify-center">
                 <Box size={18} className="text-slate-900" strokeWidth={2.5} />
               </div>
               <div>
                 <h3 className="text-md font-black uppercase tracking-wide">Materials & Machinery</h3>
                 <p className="text-xs font-bold text-slate-800">Store Requests</p>
               </div>
             </div>
             <div className="w-8 h-8 rounded-full border-[1.5px] border-slate-900 flex items-center justify-center bg-white text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <ArrowRight size={14} strokeWidth={2.5} />
             </div>
           </div>
           
           <div className="mt-3 flex items-center gap-2 bg-white/40 border-[1.5px] border-slate-900 rounded-[12px] p-2 text-[10px] font-bold text-slate-900 uppercase">
             {new Date().getHours() >= 22 ? (
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse border border-slate-900"></div>
             ) : (
                <div className="w-2 h-2 rounded-full bg-emerald-500 border border-slate-900"></div>
             )}
             <span>Gate will be closed by tonight 12 AM</span>
           </div>
          </div>
        </Link>

        {/* 7. ISSUE REPORTING (Rose Segment) */}
        <Link href="/dpr/forms/issue" className="block mb-6">
          <div className="w-full group bg-[#ffadad] border-[1.5px] border-slate-900 rounded-[24px] p-5 relative overflow-hidden shadow-[0_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform cursor-pointer">
           <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 flex items-center justify-center text-rose-600">
                 <AlertTriangle size={18} strokeWidth={2.5} />
               </div>
               <div>
                 <h3 className="text-md font-black uppercase tracking-wide text-slate-900">Issue Reporting</h3>
                 <p className="text-xs font-bold text-slate-800">Blockers, Damages, HR</p>
               </div>
             </div>
             <div className="w-8 h-8 rounded-full border-[1.5px] border-slate-900 flex items-center justify-center bg-white text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <ArrowRight size={14} strokeWidth={2.5} />
             </div>
           </div>
          </div>
        </Link>

      </div>

      {/* Notifications Panel Modal */}
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
}
