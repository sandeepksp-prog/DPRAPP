"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Box, Truck, Clock, AlertTriangle, Send } from 'lucide-react';

export default function MaterialsRequest() {
  const [urgency, setUrgency] = useState(3);
  const [requestType, setRequestType] = useState<'MATERIAL' | 'VEHICLE'>('MATERIAL');

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
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Store & Logistics</p>
          <h1 className="text-lg font-black text-slate-900 leading-tight">New Request</h1>
        </div>
      </div>

      {/* Train Schedule Gate Banner */}
      <div className="bg-[#cdb4db] border-b-[1.5px] border-slate-900 px-6 py-3 flex items-center gap-3">
         <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse border border-slate-900"></div>
         <p className="text-[11px] font-bold text-slate-900">
           Gate Open: Submitting for <strong className="font-black">Tomorrow</strong>
         </p>
      </div>

      <div className="px-6 mt-6 space-y-6">
        
        {/* Type Toggle */}
        <div className="flex bg-white border-[1.5px] border-slate-900 rounded-[20px] p-1 shadow-[0_4px_0_rgba(15,23,42,1)]">
          <button 
            onClick={() => setRequestType('MATERIAL')}
            className={`flex-1 py-3 flex justify-center items-center gap-2 rounded-[16px] text-xs font-black transition-all ${requestType === 'MATERIAL' ? 'bg-[#bde0fe] border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)]' : 'text-slate-500'}`}
          >
            <Box size={16} /> Material
          </button>
          <button 
            onClick={() => setRequestType('VEHICLE')}
            className={`flex-1 py-3 flex justify-center items-center gap-2 rounded-[16px] text-xs font-black transition-all ${requestType === 'VEHICLE' ? 'bg-[#fcf6bd] border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)]' : 'text-slate-500'}`}
          >
            <Truck size={16} /> Vehicle
          </button>
        </div>

        {/* Dynamic Form */}
        <div className="bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)] space-y-4">
          
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Location</label>
            <select className="w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 appearance-none">
              <option>Sarnau - Phase 1</option>
              <option>Aliganj - Main Road</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
              {requestType === 'MATERIAL' ? 'Item Name & Specs' : 'Vehicle Type'}
            </label>
            <input 
              type="text" 
              placeholder={requestType === 'MATERIAL' ? "e.g. HDPE Pipes 90mm" : "e.g. Backhoe Loader (JCB)"}
              className="w-full bg-transparent border-b-[1.5px] border-slate-900 px-2 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#bde0fe]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Quantity</label>
              <input 
                type="text" 
                placeholder={requestType === 'MATERIAL' ? "e.g. 50 Meters" : "e.g. 1 Unit"}
                className="w-full bg-transparent border-b-[1.5px] border-slate-900 px-2 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12}/> Time</label>
              <input 
                type="time" 
                defaultValue="09:00"
                className="w-full bg-transparent border-b-[1.5px] border-slate-900 px-2 py-2 text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Purpose / Remarks</label>
            <textarea 
              rows={2}
              placeholder="Why is this needed?"
              className="w-full bg-slate-50 border-[1.5px] border-slate-900 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* Urgency Slider */}
        <div className="bg-[#ffc8dd] border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-sm font-black text-slate-900 flex items-center gap-2"><AlertTriangle size={16} /> Urgency Level</h3>
             <span className="text-xs font-black bg-white border-[1.5px] border-slate-900 px-2 py-0.5 rounded-full">{urgency}/5</span>
           </div>
           <input 
             type="range" 
             min="1" max="5" 
             value={urgency} 
             onChange={(e) => setUrgency(parseInt(e.target.value))}
             className="w-full mt-4 accent-slate-900 h-2 bg-white rounded-full appearance-none border-[1.5px] border-slate-900" 
           />
           <div className="flex justify-between text-[9px] font-black uppercase text-slate-600 mt-2 px-1">
             <span>Routine</span>
             <span>Critical</span>
           </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button className="w-full bg-slate-900 text-white border-[1.5px] border-slate-900 rounded-[20px] py-4 flex items-center justify-center gap-2 font-black text-sm shadow-[0_4px_0_rgba(203,213,225,1)] active:shadow-none active:translate-y-1 transition-all">
            Submit Request to Store <Send size={16} strokeWidth={3} />
          </button>
        </div>

      </div>
    </div>
  );
}
