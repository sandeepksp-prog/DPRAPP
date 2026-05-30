"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Wallet, FileText, Send, Image as ImageIcon, Camera, ChevronDown, ChevronRight } from 'lucide-react';

interface GangDay {
  d: string;
  m: number;
  h: number;
  amt: string;
  photoUrl?: string;
  date: string;
}

interface Gang {
  name: string;
  days: GangDay[];
  total: string;
}

interface Site {
  name: string;
  schemeId: string;
  gangs: Gang[];
}

const SITES_DATA: Site[] = [
  {
    name: 'Sarnau WTP',
    schemeId: 'SAR-001',
    gangs: [
      {
        name: 'Ramkumar Gang',
        total: '18,500',
        days: [
          { d: 'Mon', m: 2, h: 4, amt: '2,800', date: '22 MAY', photoUrl: 'https://images.unsplash.com/photo-1541888081622-4a004eb75960?auto=format&fit=crop&q=80&w=400' },
          { d: 'Tue', m: 2, h: 5, amt: '3,100', date: '23 MAY', photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400' },
          { d: 'Wed', m: 2, h: 4, amt: '2,800', date: '24 MAY', photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400' },
          { d: 'Thu', m: 3, h: 6, amt: '4,200', date: '25 MAY', photoUrl: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&q=80&w=400' },
          { d: 'Fri', m: 2, h: 4, amt: '2,800', date: '26 MAY' },
          { d: 'Sat', m: 2, h: 4, amt: '2,800', date: '27 MAY', photoUrl: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&q=80&w=400' },
          { d: 'Sun', m: 0, h: 0, amt: '0', date: '28 MAY' },
        ]
      },
      {
        name: 'Suresh Construction',
        total: '12,200',
        days: [
          { d: 'Mon', m: 1, h: 3, amt: '1,800', date: '22 MAY', photoUrl: 'https://images.unsplash.com/photo-1541888081622-4a004eb75960?auto=format&fit=crop&q=80&w=400' },
          { d: 'Tue', m: 1, h: 3, amt: '1,800', date: '23 MAY', photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400' },
          { d: 'Wed', m: 1, h: 4, amt: '2,200', date: '24 MAY' },
          { d: 'Thu', m: 2, h: 4, amt: '2,800', date: '25 MAY', photoUrl: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&q=80&w=400' },
          { d: 'Fri', m: 1, h: 3, amt: '1,800', date: '26 MAY', photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400' },
          { d: 'Sat', m: 1, h: 3, amt: '1,800', date: '27 MAY', photoUrl: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&q=80&w=400' },
          { d: 'Sun', m: 0, h: 0, amt: '0', date: '28 MAY' },
        ]
      }
    ]
  },
  {
    name: 'Aliganj OHT',
    schemeId: 'ALI-002',
    gangs: [
      {
        name: 'Local Gang 1',
        total: '9,600',
        days: [
          { d: 'Mon', m: 1, h: 2, amt: '1,400', date: '22 MAY', photoUrl: 'https://images.unsplash.com/photo-1541888081622-4a004eb75960?auto=format&fit=crop&q=80&w=400' },
          { d: 'Tue', m: 1, h: 3, amt: '1,800', date: '23 MAY', photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400' },
          { d: 'Wed', m: 1, h: 2, amt: '1,400', date: '24 MAY', photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400' },
          { d: 'Thu', m: 2, h: 3, amt: '2,200', date: '25 MAY', photoUrl: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?auto=format&fit=crop&q=80&w=400' },
          { d: 'Fri', m: 1, h: 2, amt: '1,400', date: '26 MAY' },
          { d: 'Sat', m: 1, h: 2, amt: '1,400', date: '27 MAY', photoUrl: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&q=80&w=400' },
          { d: 'Sun', m: 0, h: 0, amt: '0', date: '28 MAY' },
        ]
      }
    ]
  }
];

export default function LabourBillsPipeline() {
  const [pipelineState, setPipelineState] = useState<'DRAFT' | 'PENDING_ENGINEER'>('DRAFT');
  const [expandedSites, setExpandedSites] = useState<Record<string, boolean>>({ 'Sarnau WTP': true });
  const [expandedGangs, setExpandedGangs] = useState<Record<string, boolean>>({ 'Ramkumar Gang': true });

  const toggleSite = (name: string) => setExpandedSites(prev => ({ ...prev, [name]: !prev[name] }));
  const toggleGang = (name: string) => setExpandedGangs(prev => ({ ...prev, [name]: !prev[name] }));

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
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Week 21 • Sandeep Kumar S</p>
            <h1 className="text-lg font-black text-slate-900 leading-tight">Labour Bills</h1>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">

        {/* Sites Accordion */}
        {SITES_DATA.map((site) => (
          <div key={site.name} className="bg-white border-[1.5px] border-slate-900 rounded-[24px] shadow-[0_4px_0_rgba(15,23,42,1)] overflow-hidden">
            {/* Site Header */}
            <button
              onClick={() => toggleSite(site.name)}
              className="w-full px-5 py-4 flex items-center justify-between bg-[#d8f3dc]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-900 flex items-center justify-center">
                  <Wallet size={14} className="text-slate-900" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black text-slate-900">{site.name}</h3>
                  <p className="text-[10px] font-bold text-slate-600">{site.schemeId} • {site.gangs.length} Gang{site.gangs.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              {expandedSites[site.name] ? <ChevronDown size={18} strokeWidth={2.5} /> : <ChevronRight size={18} strokeWidth={2.5} />}
            </button>

            {/* Gangs inside Site */}
            {expandedSites[site.name] && (
              <div className="px-4 pb-4 pt-2 space-y-3">
                {site.gangs.map((gang) => (
                  <div key={gang.name} className="border-[1.5px] border-slate-900 rounded-[16px] overflow-hidden">
                    {/* Gang Header */}
                    <button
                      onClick={() => toggleGang(gang.name)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-slate-50"
                    >
                      <div>
                        <span className="text-xs font-black text-slate-900">{gang.name}</span>
                        <span className="text-[10px] font-bold text-slate-500 ml-2">₹{gang.total}</span>
                      </div>
                      {expandedGangs[gang.name] ? <ChevronDown size={14} strokeWidth={2.5} /> : <ChevronRight size={14} strokeWidth={2.5} />}
                    </button>

                    {/* Daily Table */}
                    {expandedGangs[gang.name] && (
                      <>
                      <table className="w-full text-left text-xs font-bold text-slate-900">
                        <thead className="bg-slate-100 border-t-[1.5px] border-slate-900">
                          <tr>
                            <th className="p-2.5">Day</th>
                            <th className="p-2.5">M</th>
                            <th className="p-2.5">H</th>
                            <th className="p-2.5 text-right">Amt</th>
                            <th className="p-2.5 text-center">📷</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {gang.days.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="p-2.5 text-slate-600">{row.d}</td>
                              <td className="p-2.5">{row.m}</td>
                              <td className="p-2.5">{row.h}</td>
                              <td className="p-2.5 text-right">₹{row.amt}</td>
                              <td className="p-2.5 text-center">
                                {row.hasPhoto ? (
                                  <Camera size={12} className="text-emerald-600 mx-auto" strokeWidth={2.5} />
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-900 text-white font-black">
                          <tr>
                            <td colSpan={3} className="p-2.5 uppercase text-[10px]">Total</td>
                            <td className="p-2.5 text-right" colSpan={2}>₹{gang.total}</td>
                          </tr>
                        </tfoot>
                      </table>
                      
                      {/* Gang Photos */}
                      <div className="p-4 border-t-[1.5px] border-slate-900 bg-slate-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-wide">Daily Evidence</span>
                          <button className="flex items-center gap-1 bg-slate-900 text-white px-2 py-1 rounded border-[1.5px] border-slate-900 text-[9px] font-black shadow-[0_2px_0_rgba(203,213,225,1)] active:shadow-none active:translate-y-[2px]">
                            <Camera size={10} strokeWidth={3} />
                            CAPTURE
                          </button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 snap-x">
                          {gang.days.filter(d => d.photoUrl).length === 0 ? (
                            <div className="w-full h-24 bg-slate-200 border-[1.5px] border-slate-900 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-500">
                              <ImageIcon size={20} className="mb-1 opacity-50" />
                              <span className="text-[10px] font-bold">No photos yet</span>
                            </div>
                          ) : (
                            gang.days.map((row, i) => (
                              <div key={i} className="shrink-0 snap-start">
                                {row.photoUrl ? (
                                  <div className="w-28 aspect-square rounded-xl border-[1.5px] border-slate-900 overflow-hidden relative shadow-[0_2px_0_rgba(15,23,42,1)]">
                                    <img src={row.photoUrl} alt={`Evidence ${row.date}`} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 backdrop-blur-sm p-1">
                                      <p className="text-[8px] font-black text-white text-center">{row.date}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-28 aspect-square rounded-xl border-[1.5px] border-slate-900 border-dashed bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                                    <Camera size={16} className="mb-1 opacity-50" />
                                    <span className="text-[8px] font-bold uppercase">{row.date}</span>
                                    <span className="text-[8px] font-bold">Missing</span>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

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
