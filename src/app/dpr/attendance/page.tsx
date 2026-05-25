"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, ChevronDown } from 'lucide-react';

export default function AttendanceCalendar() {
  const [selectedMonth, setSelectedMonth] = useState('May 2026');

  // Generate 31 days array
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  // Mock data: Present = 22, Absent = 4, Future = 5
  // We'll use random generation but deterministic for display
  const getStatus = (day: number) => {
    if (day > 26) return 'future'; // Assuming today is 26th
    if ([4, 11, 18, 25].includes(day)) return 'absent'; // Sundays/Leaves
    return 'present';
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F2F5F8] text-slate-900 pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 md:pt-10 flex items-center justify-between bg-white border-b-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dpr">
            <div className="w-10 h-10 rounded-full bg-slate-100 border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 active:translate-y-0.5 transition-transform">
              <ArrowLeft size={18} strokeWidth={2.5} />
            </div>
          </Link>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">Attendance</h1>
          </div>
        </div>

        {/* Month Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 bg-[#fcf6bd] border-[1.5px] border-slate-900 rounded-full px-4 py-2 text-xs font-bold text-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)]">
            {selectedMonth} <ChevronDown size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-8">
        
        {/* Calendar Matrix Grid */}
        <div className="bg-white border-[1.5px] border-slate-900 rounded-[24px] p-6 shadow-[0_4px_0_rgba(15,23,42,1)]">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-8 h-8 rounded-full bg-[#fcf6bd] border border-slate-900 flex items-center justify-center">
               <CalendarDays size={14} className="text-slate-900" strokeWidth={2.5} />
             </div>
             <span className="text-[12px] font-black text-slate-900 uppercase tracking-wide">Team Matrix</span>
          </div>

          <div className="grid grid-cols-7 gap-y-4 gap-x-2 place-items-center">
            {/* Day Headers */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={`header-${i}`} className="text-[10px] font-black text-slate-400">{d}</div>
            ))}
            
            {/* Empty slots for start of month (e.g., starts on Friday) */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8" />
            ))}

            {/* Days */}
            {daysInMonth.map(day => {
              const status = getStatus(day);
              let circleClass = "w-8 h-8 rounded-full border-[1.5px] border-slate-900 flex items-center justify-center text-xs font-bold cursor-pointer transition-transform hover:scale-110 ";
              
              if (status === 'present') circleClass += "bg-[#bde0fe] text-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)]";
              else if (status === 'absent') circleClass += "bg-slate-100 text-slate-400 line-through opacity-60";
              else circleClass += "bg-white text-slate-300 border-dashed";

              return (
                <div key={day} className={circleClass}>
                  {day}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#bde0fe] border border-slate-900" /> Present
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-900 relative">
                <div className="absolute inset-0 m-auto w-[1px] h-[80%] bg-slate-900 rotate-45" />
              </div> Absent
            </div>
          </div>
        </div>

        {/* Summary Sticky Block */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#bde0fe] border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)] text-center">
            <p className="text-[11px] font-bold text-slate-700 uppercase">Payable Days</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">22</h2>
          </div>
          <div className="bg-[#ffc8dd] border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)] text-center">
            <p className="text-[11px] font-bold text-slate-700 uppercase">Absent Days</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">04</h2>
          </div>
        </div>

        {/* Trend Graph */}
        <div className="bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
           <h3 className="text-xs font-black uppercase tracking-wide text-slate-900 mb-4">30-Day Trend</h3>
           <div className="flex items-end justify-between h-20 gap-1">
             {Array.from({length: 30}).map((_, i) => {
               const height = 40 + Math.random() * 60; // 40-100%
               return (
                 <div key={i} className="w-full bg-slate-200 rounded-t-sm relative group">
                   <div 
                     className="absolute bottom-0 w-full bg-slate-900 rounded-t-sm transition-all" 
                     style={{ height: `${height}%` }}
                   ></div>
                 </div>
               )
             })}
           </div>
        </div>

      </div>
    </div>
  );
}
