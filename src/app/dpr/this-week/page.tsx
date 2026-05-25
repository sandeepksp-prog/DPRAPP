"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, CheckCircle, Clock } from 'lucide-react';

export default function ThisWeekProgress() {
  return (
    <div className="flex flex-col min-h-full bg-[#F2F5F8] text-slate-900 pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 md:pt-10 flex items-center gap-4 bg-white border-b-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] sticky top-0 z-20">
        <Link href="/dpr">
          <div className="w-10 h-10 rounded-full bg-slate-100 border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 active:translate-y-0.5 transition-transform">
            <ArrowLeft size={18} strokeWidth={2.5} />
          </div>
        </Link>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Insights</p>
          <h1 className="text-lg font-black text-slate-900 leading-tight">This Week Progress</h1>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        
        {/* Top Section: AI Target Dashboard */}
        <div className="w-full bg-[#ffc8dd] border-[1.5px] border-slate-900 rounded-[24px] p-5 relative shadow-[0_4px_0_rgba(15,23,42,1)]">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-white border border-slate-900 flex items-center justify-center">
                 <Zap size={14} className="text-slate-900" strokeWidth={2.5} />
               </div>
               <span className="text-[12px] font-black text-slate-900 uppercase tracking-wide">Target Prediction</span>
             </div>
             <span className="text-xl font-black text-emerald-700">95%</span>
          </div>

          <div className="bg-white/50 border-[1.5px] border-slate-900 rounded-[16px] p-4 mb-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-slate-700">CC Restoration (Sarnau)</span>
              <span className="text-sm font-black text-slate-900">80 / 250m</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 bg-white border-[1.5px] border-slate-900 rounded-full overflow-hidden">
               <div className="h-full bg-slate-900 w-[32%] border-r-[1.5px] border-slate-900"></div>
            </div>
            <p className="text-[11px] font-bold text-rose-600 mt-2 text-right">170m remaining (4 days)</p>
          </div>

          <div className="space-y-2 text-xs font-bold text-slate-800 bg-white border-[1.5px] border-slate-900 rounded-[16px] p-4">
            <p className="flex items-start gap-2">
              <CheckCircle size={14} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>100% completion on time requires <span className="font-black text-slate-900">24 to 32 mandays</span>.</span>
            </p>
            <p className="flex items-start gap-2 pt-2 border-t border-slate-900/10">
              <span className="shrink-0 text-[14px]">💡</span>
              <span>Increase labor to <span className="font-black text-slate-900">2 Masons, 6 Helpers</span>. Extra expenditure burn will be <span className="font-black text-slate-900">₹4,000</span>.</span>
            </p>
          </div>
        </div>

        {/* Middle Section: Reports Submitted */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 pl-2">Reports Submitted</h2>
          <div className="space-y-3">
            {[
              { day: 'Wed, 27 May', type: 'Civil Works', status: 'Verified' },
              { day: 'Tue, 26 May', type: 'Civil Works', status: 'Pending Review' },
            ].map((report, idx) => (
              <div key={idx} className="bg-white border-[1.5px] border-slate-900 rounded-2xl p-4 flex justify-between items-center shadow-[0_2px_0_rgba(15,23,42,1)]">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{report.day}</h4>
                  <p className="text-[11px] font-bold text-slate-500">{report.type}</p>
                </div>
                <div className={`px-3 py-1 rounded-full border-[1.5px] border-slate-900 text-[10px] font-black uppercase ${report.status === 'Verified' ? 'bg-[#d8f3dc] text-emerald-800' : 'bg-[#fcf6bd] text-yellow-800'}`}>
                  {report.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Store Requests */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 pl-2">Store Requests</h2>
          <div className="space-y-3">
             <div className="bg-white border-[1.5px] border-slate-900 rounded-2xl p-4 shadow-[0_2px_0_rgba(15,23,42,1)]">
               <div className="flex justify-between items-center mb-2">
                 <h4 className="text-sm font-bold text-slate-900">Cement (OPC 43) - 50 Bags</h4>
                 <Clock size={14} className="text-slate-400" />
               </div>
               <div className="flex items-center justify-between text-[11px] font-bold">
                 <span className="text-slate-500">Requested for: Tomorrow 8:00 AM</span>
                 <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">Dispatched</span>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
