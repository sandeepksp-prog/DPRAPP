'use client';

import React, { useState } from 'react';
import { IndianRupee, TrendingDown, TrendingUp, AlertCircle, CheckCircle2, Factory, Waves, MapPin, Building, Activity, FileText, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';

// --- MOCK DATA FOR THE BURN CHART ---
const BURN_DATA = [
    { month: 'Jan', revenue: 45, cost: 24, milestone: 'Mobilization' },
    { month: 'Feb', revenue: 30, cost: 35, milestone: 'Land Acq.' },
    { month: 'Mar', revenue: 65, cost: 42, milestone: 'Civil Works' },
    { month: 'Apr', revenue: 85, cost: 58, milestone: 'Pumping Mach.' },
    { month: 'May', revenue: 110, cost: 75, milestone: 'Pipeline' },
    { month: 'Jun', revenue: 95, cost: 68, milestone: 'FHTC' },
];

// --- MOCK DATA FOR JMR RECEIVABLES ---
const AGING_BUCKETS = {
    '0-30': [
        { scheme: "ALIGANJ MAIN", jmr: "JMR-204", amount: "12.4", delay: "14 Days", status: "Client Review" },
        { scheme: "SHITALPUR ZONE B", jmr: "JMR-208", amount: "8.2", delay: "22 Days", status: "Approved" }
    ],
    '30-60': [
        { scheme: "DADUPUR KHURD", jmr: "JMR-192", amount: "24.5", delay: "45 Days", status: "Pending Payment" },
        { scheme: "JAITHRA NW", jmr: "JMR-188", amount: "15.0", delay: "58 Days", status: "Disputed" }
    ],
    '60+': [
        { scheme: "NIDHAULI KALAN", jmr: "JMR-145", amount: "32.8", delay: "82 Days", status: "Escalated" },
        { scheme: "MAREHRA ZONE A", jmr: "JMR-120", amount: "18.4", delay: "115 Days", status: "Legal" }
    ]
};

// --- MOCK DATA FOR VENDOR PAYABLES ---
const VENDOR_PAYABLES = [
    { vendor: "Alpha Cement Works", inv: "INV-4421", amount: "4.5", date: "Due Today", priority: "critical" },
    { vendor: "Ganga Steel & Pipes", inv: "INV-8890", amount: "16.2", date: "Overdue 5 Days", priority: "high" },
    { vendor: "Local Transport Co.", inv: "INV-102", amount: "1.2", date: "Due Tomorrow", priority: "medium" },
    { vendor: "SolarTech Solutions", inv: "INV-993", amount: "8.8", date: "Next Week", priority: "low" },
    { vendor: "JJM Subcontractor B", inv: "RA-04", amount: "11.0", date: "Next Week", priority: "low" },
];

import RAEntryWorkspace from '@/components/billing/RAEntryWorkspace';

interface FinanceViewProps {
    subMenu?: string;
}

export default function FinanceView({ subMenu }: FinanceViewProps) {
    const [activeAgingBucket, setActiveAgingBucket] = useState<'0-30' | '30-60' | '60+'>('30-60');
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

    const isClientBilling = subMenu === 'Client Billing';

    if (isWorkspaceOpen) {
        return (
            <div className="animate-in fade-in zoom-in-95 duration-300 w-full h-[calc(100vh-140px)]">
                <RAEntryWorkspace onClose={() => setIsWorkspaceOpen(false)} />
            </div>
        );
    }

    return (
        <div className="relative space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mb-12">
            
            {/* Header with Add RA Button */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-black text-slate-800">{subMenu || 'Billing & RA Operations'}</h2>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Master Item Matrix</p>
                </div>
                {isClientBilling && (
                    <button 
                        onClick={() => setIsWorkspaceOpen(true)}
                        className="bg-[var(--primary)] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                    >
                        <FileText size={18} />
                        New RA Bill Entry
                    </button>
                )}
            </div>

            {/* TIER 1: STRATEGIC HERO HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Cash Position */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <IndianRupee size={20} />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            <TrendingUp size={12} /> +2.4%
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">CASH POSITION</p>
                        <h2 className="text-3xl font-black text-slate-800">₹14.2<span className="text-lg text-slate-500 font-bold ml-1">Cr</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-2">Bank + In-Transit</p>
                    </div>
                </div>

                {/* Total Receivables */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <FileText size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">APPROVED RECEIVABLES (JMR)</p>
                        <h2 className="text-3xl font-black text-slate-800">₹38.5<span className="text-lg text-slate-500 font-bold ml-1">Cr</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-2">Awaiting Client Payment</p>
                    </div>
                </div>

                {/* Total Payables */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                            <AlertCircle size={20} />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">
                            <TrendingUp size={12} /> +5.1%
                        </span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">OUTSTANDING PAYABLES</p>
                        <h2 className="text-3xl font-black text-slate-800">₹22.8<span className="text-lg text-slate-500 font-bold ml-1">Cr</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-2">Vendor / Sub-Contractor POs</p>
                    </div>
                </div>

                {/* Financial Runway */}
                <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded-2xl p-6 shadow-lg border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-slate-800/80 text-indigo-400 rounded-xl border border-slate-700">
                            <Activity size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">FINANCIAL RUNWAY</p>
                        <h2 className="text-3xl font-black text-white">4.2<span className="text-lg text-slate-400 font-bold ml-1">Months</span></h2>
                        <p className="text-xs font-bold text-indigo-400 mt-2">Based on current burn rate</p>
                    </div>
                </div>
            </div>

            {/* TIER 2: CONTINUOUS BURN RATE MATRIX */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <TrendingDown size={22} className="text-blue-600" />
                            Expenditure Burn vs Revenue Realization
                        </h3>
                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Linked to physical milestones (₹ LAKHS)</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-xs font-bold text-slate-600">JMR Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500" />
                            <span className="text-xs font-bold text-slate-600">Op. Cost</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={BURN_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }}
                                dy={10}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                labelStyle={{ fontWeight: 900, color: '#1e293b' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            <Area type="monotone" dataKey="cost" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* TIER 3: AGING REPORTS & MANAGING CONSTRAINTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left: JMR Receivables Aging Report */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[450px]">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <FileText size={18} className="text-blue-500" />
                                JMR Receivables Aging
                            </h3>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">CLIENT DUES</span>
                        </div>
                    </div>

                    {/* Interactive Bucket Selector */}
                    <div className="flex border-b border-slate-100 bg-slate-50/30">
                        {(['0-30', '30-60', '60+'] as const).map((bucket) => (
                            <button
                                key={bucket}
                                onClick={() => setActiveAgingBucket(bucket)}
                                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-colors ${activeAgingBucket === bucket
                                        ? (bucket === '60+' ? 'border-rose-500 text-rose-600 bg-rose-50/30' : 'border-blue-600 text-blue-700 bg-blue-50/30')
                                        : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {bucket} Days
                            </button>
                        ))}
                    </div>

                    {/* Scrolling Feed */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20 custom-scrollbar">
                        <div className="space-y-3">
                            {AGING_BUCKETS[activeAgingBucket].map((item, idx) => (
                                <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-blue-200 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{item.scheme}</h4>
                                            <p className="text-xs font-bold text-slate-400 mt-0.5">{item.jmr}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-800">₹{item.amount}L</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${activeAgingBucket === '60+' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {item.delay} Overdue
                                        </span>
                                        <span className="text-xs font-bold text-slate-500">{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Vendor Payables Outward Feed */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[450px]">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <AlertCircle size={18} className="text-rose-500" />
                                Vendor Payables Feed
                            </h3>
                            <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                View All <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20 custom-scrollbar">
                        <div className="space-y-3">
                            {VENDOR_PAYABLES.map((item, idx) => (
                                <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-rose-200 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1.5 h-12 rounded-full ${item.priority === 'critical' ? 'bg-rose-500' :
                                                item.priority === 'high' ? 'bg-amber-500' :
                                                    'bg-emerald-500'
                                            }`}></div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-800">{item.vendor}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{item.inv}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-800">₹{item.amount}L</p>
                                        <p className={`text-[10px] font-bold uppercase mt-1 ${item.date.includes('Overdue') ? 'text-rose-500' : 'text-slate-500'
                                            }`}>{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
