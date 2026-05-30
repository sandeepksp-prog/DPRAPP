"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Box, Truck, Clock, AlertTriangle, Send, CheckCircle2, Circle } from 'lucide-react';

const MATERIAL_ITEMS = [
  "Cement OPC 43", "Cement OPC 53", "TMT Steel 8mm", "TMT Steel 12mm", "TMT Steel 16mm",
  "HDPE Pipe 90mm", "HDPE Pipe 110mm", "Sand (Fine)", "Sand (Coarse)",
  "Jelly 20mm", "Jelly 40mm", "Bricks", "MS Plates"
];

const SCHEMES = ["Sarnau - Phase 1", "Aliganj - Main Road", "Motihari - WTP"];

interface ApprovalStep {
  label: string;
  status: 'done' | 'pending';
  timestamp?: string;
  note?: string;
}

const MOCK_REQUESTS = [
  {
    id: 'MAT-SAR-250528-001',
    item: 'Cement OPC 43',
    qty: '50 Bags',
    scheme: 'Sarnau - Phase 1',
    steps: [
      { label: 'Request Raised', status: 'done' as const, timestamp: 'May 28, 08:00 AM' },
      { label: 'Incharge Approval', status: 'done' as const, timestamp: 'May 28, 10:30 AM', note: 'Available in Stock' },
      { label: 'Indent Raised', status: 'pending' as const },
      { label: 'Gatepass Raised', status: 'pending' as const },
      { label: 'Material Received', status: 'pending' as const },
    ]
  },
  {
    id: 'MAT-SAR-250527-002',
    item: 'TMT Steel 12mm',
    qty: '200 kg',
    scheme: 'Sarnau - Phase 1',
    steps: [
      { label: 'Request Raised', status: 'done' as const, timestamp: 'May 27, 07:30 AM' },
      { label: 'Incharge Approval', status: 'done' as const, timestamp: 'May 27, 09:00 AM', note: 'Partial Stock' },
      { label: 'Indent Raised', status: 'done' as const, timestamp: 'May 27, 02:00 PM' },
      { label: 'Gatepass Raised', status: 'done' as const, timestamp: 'May 28, 08:00 AM' },
      { label: 'Material Received', status: 'pending' as const },
    ]
  }
];

export default function MaterialsRequest() {
  const [urgency, setUrgency] = useState(3);
  const [requestType, setRequestType] = useState<'MATERIAL' | 'VEHICLE'>('MATERIAL');
  const [activeTab, setActiveTab] = useState<'new' | 'track'>('new');

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
          <h1 className="text-lg font-black text-slate-900 leading-tight">Materials & Machinery</h1>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="px-6 mt-4">
        <div className="flex bg-white border-[1.5px] border-slate-900 rounded-[20px] p-1 shadow-[0_4px_0_rgba(15,23,42,1)]">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2.5 flex justify-center items-center gap-2 rounded-[16px] text-xs font-black transition-all ${activeTab === 'new' ? 'bg-[#bde0fe] border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)]' : 'text-slate-500'}`}
          >
            <Send size={14} /> New Request
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2.5 flex justify-center items-center gap-2 rounded-[16px] text-xs font-black transition-all ${activeTab === 'track' ? 'bg-[#d8f3dc] border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)]' : 'text-slate-500'}`}
          >
            <Clock size={14} /> Track Requests
          </button>
        </div>
      </div>

      {activeTab === 'new' ? (
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

          {/* Form */}
          <div className="bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)] space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Scheme</label>
              <select className="w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 appearance-none">
                <option value="" disabled>Select Scheme</option>
                {SCHEMES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                {requestType === 'MATERIAL' ? 'Item Name' : 'Vehicle Type'}
              </label>
              {requestType === 'MATERIAL' ? (
                <select className="w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 appearance-none">
                  <option value="" disabled>Select Material</option>
                  {MATERIAL_ITEMS.map(m => <option key={m}>{m}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Backhoe Loader (JCB)"
                  className="w-full bg-transparent border-b-[1.5px] border-slate-900 px-2 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              )}
            </div>

            {requestType === 'MATERIAL' && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Specification / Grade</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 43, 90mm dia"
                  className="w-full bg-transparent border-b-[1.5px] border-slate-900 px-2 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            )}

            {requestType === 'MATERIAL' && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Material ID (PMS)</label>
                <input
                  type="text"
                  placeholder="Auto-generated or enter manually"
                  defaultValue={`MAT-SAR-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-001`}
                  className="w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Quantity</label>
                <input
                  type="text"
                  placeholder={requestType === 'MATERIAL' ? "e.g. 50 Bags" : "e.g. 1 Unit"}
                  className="w-full bg-transparent border-b-[1.5px] border-slate-900 px-2 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Need by Date</label>
                <input
                  type="date"
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

          {/* Urgency */}
          <div className="bg-[#ffc8dd] border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2"><AlertTriangle size={16} /> Urgency Level</h3>
              <span className="text-xs font-black bg-white border-[1.5px] border-slate-900 px-2 py-0.5 rounded-full">{urgency}/5</span>
            </div>
            <input
              type="range" min="1" max="5"
              value={urgency}
              onChange={(e) => setUrgency(parseInt(e.target.value))}
              className="w-full mt-4 accent-slate-900 h-2 bg-white rounded-full appearance-none border-[1.5px] border-slate-900"
            />
            <div className="flex justify-between text-[9px] font-black uppercase text-slate-600 mt-2 px-1">
              <span>Routine</span>
              <span>Critical</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button className="w-full bg-slate-900 text-white border-[1.5px] border-slate-900 rounded-[20px] py-4 flex items-center justify-center gap-2 font-black text-sm shadow-[0_4px_0_rgba(203,213,225,1)] active:shadow-none active:translate-y-1 transition-all">
              Submit Request to Store <Send size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      ) : (
        /* TRACKING TAB */
        <div className="px-6 mt-6 space-y-6">
          {MOCK_REQUESTS.map((req) => (
            <div key={req.id} className="bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">{req.item}</h3>
                  <p className="text-xs font-bold text-slate-500">{req.qty} • {req.scheme}</p>
                </div>
                <span className="text-[9px] font-black bg-slate-100 border-[1.5px] border-slate-900 px-2 py-0.5 rounded-full text-slate-700">{req.id}</span>
              </div>

              {/* 5-Step Timeline */}
              <div className="space-y-0">
                {req.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    {/* Vertical line + dot */}
                    <div className="flex flex-col items-center">
                      {step.status === 'done' ? (
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" fill="#d1fae5" strokeWidth={2.5} />
                      ) : (
                        <Circle size={18} className="text-slate-300 shrink-0" strokeWidth={2} />
                      )}
                      {idx < req.steps.length - 1 && (
                        <div className={`w-[2px] h-8 ${step.status === 'done' ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-4">
                      <p className={`text-xs font-black ${step.status === 'done' ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                      {step.timestamp && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{step.timestamp}</p>}
                      {step.note && <p className="text-[10px] font-bold text-emerald-700 mt-0.5">{step.note}</p>}
                      {step.status === 'pending' && <p className="text-[10px] font-bold text-slate-300 mt-0.5">Pending</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
