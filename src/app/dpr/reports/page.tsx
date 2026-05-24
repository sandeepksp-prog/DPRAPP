"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, Building2, Droplets, Zap, ShieldCheck, AlertTriangle, Users } from 'lucide-react';

export default function ReportsHub() {
  const sections = [
    { id: 'header', title: 'Basic Details & GPS', icon: FileText, color: 'text-slate-900', bg: 'bg-[#bde0fe]' }, // Baby Blue
    { id: 'civil', title: 'Civil Work Sub-Structures', icon: Building2, color: 'text-slate-900', bg: 'bg-[#ffc8dd]' }, // Light Pink
    { id: 'pipeline', title: 'Pipeline Work Details', icon: Droplets, color: 'text-slate-900', bg: 'bg-[#fcf6bd]' }, // Light Yellow
    { id: 'em', title: 'E&M Work Details', icon: Zap, color: 'text-slate-900', bg: 'bg-[#d8f3dc]' }, // Mint Green
    { id: 'tpi', title: 'TPI Inspection Progress', icon: ShieldCheck, color: 'text-slate-900', bg: 'bg-[#cdb4db]' }, // Lavender
    { id: 'contractor', title: 'Contractor & Labor Details', icon: Users, color: 'text-slate-900', bg: 'bg-[#ffddd2]' }, // Peach
    { id: 'issue', title: 'Issue Reporting', icon: AlertTriangle, color: 'text-slate-900', bg: 'bg-white' }, // White
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#F2F5F8] pb-24">
      <div className="px-6 py-6 sticky top-0 z-10 md:pt-10 flex items-center gap-4 bg-[#F2F5F8]/90 backdrop-blur-md">
        <div className="w-12 h-12 rounded-full border-[1.5px] border-slate-900 bg-white flex items-center justify-center shadow-[0_2px_0_rgba(15,23,42,1)]">
           <FileText size={20} strokeWidth={2.5} />
        </div>
        <div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Report Hub</h1>
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Select Module</p>
        </div>
      </div>

      <div className="p-6 grid gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link 
              key={section.id} 
              href={`/dpr/reports/${section.id}`}
              className={`${section.bg} border-[1.5px] border-slate-900 rounded-[24px] p-5 flex items-center justify-between shadow-[0_4px_0_rgba(15,23,42,1)] hover:translate-y-0.5 hover:shadow-[0_2px_0_rgba(15,23,42,1)] transition-all group`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 flex items-center justify-center ${section.color}`}>
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:underline decoration-2 underline-offset-2">{section.title}</h3>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border-[1.5px] border-slate-900 bg-white flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <ChevronRight size={16} strokeWidth={3} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
