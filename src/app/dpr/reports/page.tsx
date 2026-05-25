"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export default function DynamicFormPreview() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Civil Works</p>
          <h1 className="text-lg font-black text-slate-900 leading-tight">Block A Excavation</h1>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        
        {/* Question 1: Dropdown */}
        <div className="w-full bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
          <div className="flex items-start gap-2 mb-4">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">1</span>
            <h3 className="text-sm font-bold text-slate-900">Select the specific grid coordinate for excavation today.</h3>
          </div>
          <select className="w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#bde0fe]">
            <option value="">Choose grid...</option>
            <option value="A1">Grid A1 (North Wing)</option>
            <option value="A2">Grid A2 (South Wing)</option>
            <option value="B1">Grid B1 (Central)</option>
          </select>
        </div>

        {/* Question 2: Roman Numeral Multi-select */}
        <div className="w-full bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
          <div className="flex items-start gap-2 mb-4">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">2</span>
            <h3 className="text-sm font-bold text-slate-900">Which heavy machinery was utilized? (Select all that apply)</h3>
          </div>
          <div className="space-y-3">
            {['Excavator (JCB)', 'Dump Truck', 'Compactor', 'Crane'].map((item, index) => {
              const romans = ['i', 'ii', 'iii', 'iv'];
              return (
                <label key={index} className="flex items-center gap-3 p-3 border-[1.5px] border-slate-200 rounded-xl hover:border-slate-900 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded-[4px] border-[1.5px] border-slate-900 text-slate-900 focus:ring-0 cursor-pointer" />
                  <span className="w-6 text-xs font-bold text-slate-500 text-right">{romans[index]}.</span>
                  <span className="text-sm font-bold text-slate-800">{item}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Question 3: "o" Style Radio with Logic */}
        <div className="w-full bg-[#bde0fe] border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
             <HelpCircle size={16} className="text-slate-600" />
          </div>
          <div className="flex items-start gap-2 mb-4">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">3</span>
            <h3 className="text-sm font-bold text-slate-900 pr-6">Were there any unexpected rock formations encountered?</h3>
          </div>
          <div className="space-y-3">
            {['Yes (Skip to Q5)', 'No (Continue to Q4)'].map((opt) => (
              <label 
                key={opt} 
                className={`flex items-center gap-3 p-3 border-[1.5px] border-slate-900 rounded-xl cursor-pointer transition-colors ${selectedOption === opt ? 'bg-white shadow-[0_2px_0_rgba(15,23,42,1)]' : 'bg-white/50 hover:bg-white'}`}
                onClick={() => setSelectedOption(opt)}
              >
                <div className={`w-5 h-5 rounded-full border-[1.5px] border-slate-900 flex items-center justify-center ${selectedOption === opt ? 'bg-slate-900' : 'bg-white'}`}>
                  {selectedOption === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm font-bold text-slate-800 flex-1">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="pt-6">
          <button className="w-full bg-slate-900 text-white border-[1.5px] border-slate-900 rounded-[20px] py-4 flex items-center justify-center gap-2 font-black text-sm shadow-[0_4px_0_rgba(203,213,225,1)] active:shadow-none active:translate-y-1 transition-all">
            Next Section <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>

      </div>
    </div>
  );
}
