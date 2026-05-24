"use client";

import React from 'react';
import { User, Lock, LogOut, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DPRSettings() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('dpr_pin_code');
    router.push('/dpr/login');
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="bg-white px-6 py-6 border-b border-slate-100 sticky top-0 z-10 md:pt-10">
        <h1 className="text-xl font-extrabold text-blue-900 tracking-tight">Settings & Profile</h1>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Profile Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
           <div className="w-full h-20 bg-sky-100 absolute top-0 left-0 right-0 z-0" />
           <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-md relative z-10 mt-4 overflow-hidden">
             <img src="/assets/ksppl-logo.png" alt="Profile" className="w-12 h-12 object-contain" />
           </div>
           <h2 className="text-xl font-extrabold text-blue-900 mt-3 relative z-10">Rajiv Sharma</h2>
           <p className="text-sm font-semibold text-slate-500 relative z-10">Site Engineer</p>
           <p className="text-xs text-sky-500 font-mono mt-1 relative z-10">ID: EMP-8492</p>
        </div>

        {/* Options */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <button className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left">
            <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-blue-900 text-sm">Account Details</div>
              <div className="text-xs text-slate-500 font-medium">Update phone, email, assigned regions</div>
            </div>
          </button>

          <button className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left">
            <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-blue-900 text-sm">Change PIN</div>
              <div className="text-xs text-slate-500 font-medium">Update your 4-digit offline access PIN</div>
            </div>
          </button>

          <button className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
              <Info size={20} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-blue-900 text-sm">App Version</div>
              <div className="text-xs text-slate-500 font-medium">v2.1.0 - KSPPL PMS</div>
            </div>
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-rose-100 transition-colors border border-rose-100"
        >
          <LogOut size={20} />
          Sign Out & Clear Drafts
        </button>

      </div>
    </div>
  );
}
