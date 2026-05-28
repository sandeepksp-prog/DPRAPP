"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  Package, 
  Banknote,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data Structure
type HistoryItem = {
  id: string;
  type: 'DPR' | 'ISSUE' | 'REQUIREMENT' | 'LABOUR_BILL';
  date: string;
  timestamp: string;
  title: string;
  subtitle: string;
  status: 'Synced' | 'Pending' | 'Resolved';
  syncTime?: string;
};

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: 'DPR-4029',
    type: 'DPR',
    date: 'Today',
    timestamp: '10:45 AM',
    title: 'Civil Progress - Aliganj Zone A',
    subtitle: 'Formwork & Concrete pouring completed for block B.',
    status: 'Synced',
    syncTime: '10:47 AM'
  },
  {
    id: 'REQ-102',
    type: 'REQUIREMENT',
    date: 'Today',
    timestamp: '09:15 AM',
    title: 'Material Request: Cement',
    subtitle: '150 Bags required at Marehra OHT by tomorrow morning.',
    status: 'Pending'
  },
  {
    id: 'ISS-045',
    type: 'ISSUE',
    date: 'Yesterday',
    timestamp: '04:30 PM',
    title: 'Water Logging at Site',
    subtitle: 'Heavy rain caused water logging near foundation trench.',
    status: 'Resolved'
  },
  {
    id: 'LB-089',
    type: 'LABOUR_BILL',
    date: 'Yesterday',
    timestamp: '11:00 AM',
    title: 'Weekly Labour Wages',
    subtitle: 'Submitted attendance and wage request for 45 masons and helpers.',
    status: 'Synced',
    syncTime: '11:05 AM'
  },
  {
    id: 'DPR-4028',
    type: 'DPR',
    date: 'May 26, 2026',
    timestamp: '06:15 PM',
    title: 'Pipeline - Jalesar Phase 1',
    subtitle: '200m HDPE pipe laid and backfilled.',
    status: 'Synced',
    syncTime: '06:20 PM'
  }
];

export default function DPRHistory() {
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'DPR' | 'ISSUE' | 'REQUIREMENT' | 'LABOUR_BILL'>('ALL');

  const filteredHistory = filter === 'ALL' 
    ? MOCK_HISTORY 
    : MOCK_HISTORY.filter(item => item.type === filter);

  // Group by Date
  const groupedHistory = filteredHistory.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, HistoryItem[]>);

  const getTypeConfig = (type: HistoryItem['type']) => {
    switch(type) {
      case 'DPR': return { color: 'bg-[#bde0fe]', icon: FileText, label: 'DPR Report' }; // Blue (Home: Progress Report)
      case 'ISSUE': return { color: 'bg-[#ffadad]', icon: AlertTriangle, label: 'Issue Raised' }; // Rose (Home: Issue Reporting)
      case 'REQUIREMENT': return { color: 'bg-[#cdb4db]', icon: Package, label: 'Material/Machinery' }; // Lavender (Home: Materials)
      case 'LABOUR_BILL': return { color: 'bg-[#d8f3dc]', icon: Banknote, label: 'Labour Bill' }; // Green (Home: Labour Bills)
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-[#F2F5F8] min-h-screen relative flex flex-col overflow-x-hidden shadow-2xl">
        
        {/* HEADER - NEO BRUTALIST */}
        <div className="px-6 pt-10 pb-6 border-b-[1.5px] border-slate-900 bg-white shadow-sm z-20 sticky top-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center shrink-0 text-slate-900 transition-all"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  History & Logs
                </h1>
                <p className="text-slate-500 text-[11px] font-bold tracking-widest uppercase mt-0.5">
                  Track all submissions
                </p>
              </div>
            </div>
            
            {/* Sync Status Badge */}
            <div className="flex items-center gap-1.5 bg-lime-100 border-[1.5px] border-slate-900 px-3 py-1.5 rounded-full shadow-[0_2px_0_rgba(15,23,42,1)]">
              <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-900 uppercase">Online</span>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            {[
              { id: 'ALL', label: 'All Logs' },
              { id: 'DPR', label: 'DPRs' },
              { id: 'ISSUE', label: 'Issues' },
              { id: 'REQUIREMENT', label: 'Materials' },
              { id: 'LABOUR_BILL', label: 'Bills' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border-[1.5px] border-slate-900 flex-shrink-0 ${
                  filter === f.id 
                    ? 'bg-slate-900 text-white shadow-[0_2px_0_rgba(15,23,42,1)]' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 shadow-[0_2px_0_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* TIMELINE BODY */}
        <div className="flex-1 p-6 space-y-8 relative z-10 pb-24">
          <AnimatePresence mode="popLayout">
            {Object.keys(groupedHistory).length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-12 flex flex-col items-center justify-center opacity-50"
              >
                <div className="w-16 h-16 rounded-full bg-slate-200 border-[1.5px] border-slate-400 flex items-center justify-center mb-4">
                  <Filter size={24} className="text-slate-500" />
                </div>
                <h3 className="text-slate-500 font-black uppercase tracking-widest text-sm">No records found</h3>
                <p className="text-slate-400 text-xs font-bold mt-2">Try changing the filters above.</p>
              </motion.div>
            ) : (
              Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date} className="space-y-4">
                  {/* Date Header */}
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase bg-slate-200 px-3 py-1 rounded-full border-[1.5px] border-slate-300">
                      {date}
                    </div>
                    <div className="flex-1 h-[1.5px] bg-slate-300"></div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-4">
                    {items.map((item, idx) => {
                      const config = getTypeConfig(item.type);
                      const Icon = config.icon;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white rounded-[20px] border-[1.5px] border-slate-900 p-4 shadow-[0_4px_0_rgba(15,23,42,1)] relative overflow-hidden"
                        >
                          {/* Type Indicator Tag */}
                          <div className={`absolute top-0 right-0 ${config.color} border-l-[1.5px] border-b-[1.5px] border-slate-900 px-3 py-1 rounded-bl-xl font-black text-[9px] uppercase tracking-widest text-slate-900`}>
                            {config.label}
                          </div>

                          <div className="flex gap-4">
                            {/* Icon Box */}
                            <div className={`w-12 h-12 rounded-2xl border-[1.5px] border-slate-900 flex items-center justify-center shrink-0 shadow-[0_2px_0_rgba(15,23,42,1)] ${config.color}`}>
                              <Icon size={24} className="text-slate-900" strokeWidth={2.5} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                              <h3 className="font-black text-slate-900 text-sm leading-tight pr-20">{item.title}</h3>
                              <p className="text-slate-600 text-xs font-semibold mt-1 leading-snug line-clamp-2 pr-2">
                                {item.subtitle}
                              </p>

                              {/* Footer Meta */}
                              <div className="flex items-center justify-between mt-3 pt-3 border-t-[1.5px] border-slate-100">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[9px] font-bold text-slate-500 uppercase">{item.id}</span>
                                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                  <span className="text-[10px] font-bold text-slate-500">{item.timestamp}</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {item.status === 'Synced' && (
                                    <>
                                      <CheckCircle2 size={12} className="text-lime-600" strokeWidth={3} />
                                      <span className="text-[10px] font-black text-lime-600 uppercase tracking-wider">Synced</span>
                                    </>
                                  )}
                                  {item.status === 'Pending' && (
                                    <>
                                      <Clock size={12} className="text-amber-500" strokeWidth={3} />
                                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">Pending</span>
                                    </>
                                  )}
                                  {item.status === 'Resolved' && (
                                    <>
                                      <CheckCircle2 size={12} className="text-emerald-500" strokeWidth={3} />
                                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Resolved</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
