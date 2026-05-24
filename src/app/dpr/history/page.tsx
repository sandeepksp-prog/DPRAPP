"use client";

import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DPRHistory() {
  const history = [
    { id: 'DPR-012', date: 'Today, 10:45 AM', scheme: 'Aliganj Zone A', status: 'Synced', type: 'Progress' },
    { id: 'DPR-011', date: 'Today, 09:15 AM', scheme: 'Marehra OHT', status: 'Pending', type: 'TPI' },
    { id: 'DPR-010', date: 'Yesterday', scheme: 'Jalesar Phase 1', status: 'Synced', type: 'Progress' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="bg-white px-6 py-6 border-b border-slate-100 sticky top-0 z-10 md:pt-10">
        <h1 className="text-xl font-extrabold text-blue-900 tracking-tight">Submission History</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Review your recent reports and sync status.</p>
      </div>

      <div className="p-6 space-y-4">
        {history.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
             {/* Left edge indicator */}
             <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'Synced' ? 'bg-lime-500' : 'bg-amber-500'}`} />
             
             <div className="pl-2 flex gap-4 items-center">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === 'Synced' ? 'bg-lime-50 text-lime-600' : 'bg-amber-50 text-amber-600'}`}>
                 {item.status === 'Synced' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
               </div>
               <div>
                 <h3 className="font-bold text-blue-900 text-sm">{item.scheme}</h3>
                 <div className="flex gap-2 items-center mt-1">
                   <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{item.id}</span>
                   <span className="text-xs text-slate-500">{item.date}</span>
                 </div>
               </div>
             </div>
             <div className="text-right">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${item.status === 'Synced' ? 'text-lime-600 bg-lime-50' : 'text-amber-600 bg-amber-50'}`}>
                  {item.status}
                </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
