"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Wallet, FileText, Send, Image as ImageIcon } from 'lucide-react';

export default function LabourBillsPipeline() {
  const [pipelineState, setPipelineState] = useState<'DRAFT' | 'PENDING_ENGINEER'>('DRAFT');

  return (
    <div className="flex flex-col min-h-full bg-[#F2F5F8] text-slate-900 pb-24 relative">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 md:pt-10 flex items-center justify-between bg-white border-b-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dpr">
            <div className="w-10 h-10 rounded-full bg-slate-100 border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 active:translate-y-0.5 transition-transform">
              <ArrowLeft size={18} strokeWidth={2.5} />
            </div>
          </Link>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Week 21 • Ramkumar Gang</p>
            <h1 className="text-lg font-black text-slate-900 leading-tight">Labour Bill</h1>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        
        {/* Bill Ledger */}
        <div className="bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded-full bg-[#d8f3dc] border border-slate-900 flex items-center justify-center">
               <Wallet size={14} className="text-slate-900" strokeWidth={2.5} />
             </div>
             <span className="text-[12px] font-black text-slate-900 uppercase tracking-wide">Daily Extraction</span>
          </div>

          <div className="overflow-hidden rounded-xl border-[1.5px] border-slate-900">
            <table className="w-full text-left text-xs font-bold text-slate-900">
              <thead className="bg-[#d8f3dc] border-b-[1.5px] border-slate-900">
                <tr>
                  <th className="p-3">Day</th>
                  <th className="p-3">Masons</th>
                  <th className="p-3">Helpers</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y-[1.5px] divide-slate-900 bg-white">
                {[
                  { d: 'Mon', m: 2, h: 4, amt: '2,800' },
                  { d: 'Tue', m: 2, h: 5, amt: '3,100' },
                  { d: 'Wed', m: 2, h: 4, amt: '2,800' },
                  { d: 'Thu', m: 3, h: 6, amt: '4,200' },
                  { d: 'Fri', m: 2, h: 4, amt: '2,800' },
                  { d: 'Sat', m: 2, h: 4, amt: '2,800' },
                  { d: 'Sun', m: 0, h: 0, amt: '0' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-slate-600">{row.d}</td>
                    <td className="p-3">{row.m}</td>
                    <td className="p-3">{row.h}</td>
                    <td className="p-3 text-right">₹{row.amt}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-black">
                <tr>
                  <td colSpan={3} className="p-3 uppercase">Total Payable</td>
                  <td className="p-3 text-right">₹18,500</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Photo Gallery (14 Photos) */}
        <div className="bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-900 flex items-center justify-center">
               <ImageIcon size={14} className="text-slate-900" strokeWidth={2.5} />
             </div>
             <span className="text-[12px] font-black text-slate-900 uppercase tracking-wide">Extracted Evidence</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {Array.from({length: 14}).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 border-[1.5px] border-slate-900 rounded-xl overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-[#bde0fe] opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm text-white">
                  <ImageIcon size={16} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-500 mt-3 text-center">14 photos automatically compiled from DPR logs</p>
        </div>

        {/* Approval Pipeline */}
        <div className="bg-[#fcf6bd] border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
           <h3 className="text-xs font-black uppercase tracking-wide text-slate-900 mb-4">Approval Pipeline</h3>
           <div className="flex justify-between items-center relative">
             <div className="absolute top-1/2 left-4 right-4 h-[1.5px] bg-slate-900 -translate-y-1/2 z-0"></div>
             
             {['Draft', 'Engineer', 'PM', 'Accounts'].map((step, idx) => {
               const isActive = pipelineState === 'DRAFT' ? idx === 0 : idx <= 1;
               return (
                 <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                   <div className={`w-6 h-6 rounded-full border-[1.5px] border-slate-900 flex items-center justify-center text-[10px] font-black ${isActive ? 'bg-emerald-400 text-slate-900' : 'bg-white text-slate-300'}`}>
                     {isActive ? '✓' : idx + 1}
                   </div>
                   <span className={`text-[9px] font-bold uppercase ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                 </div>
               )
             })}
           </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button 
            onClick={() => setPipelineState('PENDING_ENGINEER')}
            disabled={pipelineState !== 'DRAFT'}
            className="w-full bg-slate-900 text-white border-[1.5px] border-slate-900 rounded-[20px] py-4 flex items-center justify-center gap-2 font-black text-sm shadow-[0_4px_0_rgba(203,213,225,1)] disabled:opacity-50 disabled:active:shadow-[0_4px_0_rgba(203,213,225,1)] disabled:active:translate-y-0 active:shadow-none active:translate-y-1 transition-all"
          >
            {pipelineState === 'DRAFT' ? (
              <>Send for Review <Send size={16} strokeWidth={3} /></>
            ) : (
              <>Pending PM Review <FileText size={16} strokeWidth={3} /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
