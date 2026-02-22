'use client';

import React from 'react';
import {
    FileText, AlertTriangle, CloudLightning, Users,
    CheckCircle2, Clock, ClipboardList, TrendingUp,
    ShieldAlert, MapPin, Activity
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

// --- MOCK DATA FOR DPR DASHBOARD ---
const DPR_TRENDS = [
    { date: '10 Feb', scheduled: 8.5, actual: 8.2 },
    { date: '11 Feb', scheduled: 8.8, actual: 8.6 },
    { date: '12 Feb', scheduled: 9.0, actual: 8.1 },
    { date: '13 Feb', scheduled: 9.2, actual: 8.9 },
    { date: '14 Feb', scheduled: 9.5, actual: 9.6 },
    { date: '15 Feb', scheduled: 9.8, actual: 9.4 },
    { date: '16 Feb', scheduled: 10.0, actual: 8.5 }, // Weather drop
    { date: '17 Feb', scheduled: 10.2, actual: 9.1 },
    { date: '18 Feb', scheduled: 10.5, actual: 10.6 },
    { date: '19 Feb', scheduled: 10.8, actual: 11.0 }, // Catching up
];

const ISSUE_BREAKDOWN = [
    { name: 'Civil Works Delay', value: 45 },
    { name: 'E&M Access', value: 25 },
    { name: 'Weather / Rain', value: 20 },
    { name: 'Local ROW', value: 10 },
];
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#0ea5e9', '#f59e0b'];

const RECENT_DPRS = [
    { id: 'DPR-4892', scheme: 'Aliganj Zone A', agency: 'Roba Construction', progress: 'OHT Foundation Pouring 100%', status: 'Approved', time: '10:45 AM' },
    { id: 'DPR-4891', scheme: 'Shitalpur Block', agency: 'Metro Civil', progress: 'HDPE Laying 850m', status: 'Pending Review', time: '09:30 AM' },
    { id: 'DPR-4890', scheme: 'Awagarh Main', agency: 'BuildWell Infra', progress: 'Pump House Walling', status: 'Approved', time: 'Yesterday' },
    { id: 'DPR-4889', scheme: 'Jalesar Phase 1', agency: 'City Power & Co', status: 'Rejected', progress: 'Improper Soil Compaction Noted', time: 'Yesterday' },
    { id: 'DPR-4888', scheme: 'Sakit Outer', agency: 'Roba Construction', progress: 'Boundary Wall Executed', status: 'Approved', time: '2 Days Ago' },
];

const OPEN_ISSUES = [
    { title: 'Heavy Rain Flooding Trench', location: 'Nidhauli Kalan', severity: 'High', age: '2 Days' },
    { title: 'Farmer ROW Dispute', location: 'Jaithra Pipeline Route', severity: 'Critical', age: '5 Days' },
    { title: 'Delayed Cement Delivery', location: 'Marehra OHT Site', severity: 'Medium', age: '1 Day' },
    { title: 'Excavator Breakdown', location: 'Aliganj Zone B', severity: 'Low', age: '4 Hours' },
];

export default function DPRView({ subMenu }: { subMenu?: string }) {

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mb-12">

            {/* TIER 1: STRATEGIC HERO HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Reports Submitted */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <ClipboardList size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">REPORTS SUBMITTED TODAY</p>
                        <h2 className="text-3xl font-black text-slate-800">42<span className="text-lg text-slate-400 font-bold ml-1">/ 48</span></h2>
                        <p className="text-xs font-bold text-emerald-500 mt-2">87% Daily Compliance</p>
                    </div>
                </div>

                {/* Active Site Issues */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">ACTIVE SITE ISSUES (NCR)</p>
                        <h2 className="text-3xl font-black text-rose-600">8<span className="text-lg text-slate-500 font-bold ml-1">Open</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-2">2 Critical Blockers Active</p>
                    </div>
                </div>

                {/* Weather / Delays */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                            <CloudLightning size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">WEATHER HINDRANCE</p>
                        <h2 className="text-3xl font-black text-slate-800">3<span className="text-lg text-slate-500 font-bold ml-1">Sites</span></h2>
                        <p className="text-xs font-bold text-amber-500 mt-2">Reporting Rain Delays</p>
                    </div>
                </div>

                {/* Labor Strength */}
                <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded-2xl p-6 shadow-lg border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-slate-800/80 text-indigo-400 rounded-xl border border-slate-700">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">REPORTED LABOR STRENGTH</p>
                        <h2 className="text-3xl font-black text-white">1,240<span className="text-lg text-slate-400 font-bold ml-1">Heads</span></h2>
                        <p className="text-xs font-bold text-emerald-400 mt-2">+5% vs Yesterday</p>
                    </div>
                </div>
            </div>

            {/* TIER 2: TRENDS & BREAKDOWN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Progress vs Target Area Chart */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <TrendingUp size={18} className="text-blue-600" />
                                Daily Progress Velocity (km)
                            </h3>
                            <p className="text-xs font-bold text-slate-500 mt-1">Actual Execution vs Scheduled Target Pipeline Length</p>
                        </div>
                        <div className="flex gap-4 text-[10px] font-black tracking-wider uppercase">
                            <div className="flex items-center gap-1.5 object-contain">
                                <div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div>
                                <span className="text-slate-600">Actual Run</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm bg-slate-200"></div>
                                <span className="text-slate-600">Scheduled Target</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[280px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={DPR_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="scheduled" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorScheduled)" />
                                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fill="url(#colorActual)" activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Issue Breakdown Donut */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2 mb-2">
                        <Activity size={18} className="text-indigo-600" />
                        Hindrance Breakdown
                    </h3>
                    <p className="text-xs font-bold text-slate-500">Distribution of reported site delays</p>

                    <div className="flex-1 min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ISSUE_BREAKDOWN}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {ISSUE_BREAKDOWN.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                            <span className="text-3xl font-black text-slate-800">105</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Logs</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {ISSUE_BREAKDOWN.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }}></div>
                                <span className="text-xs font-bold text-slate-700 truncate">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TIER 3: DATA GRIDS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Recent Submissions Table */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <FileText size={18} className="text-emerald-600" />
                            Recent Operations Logs
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">LIVE FEED</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                    <th className="py-3 px-4">Scheme & Agency</th>
                                    <th className="py-3 px-4">Reported Progress</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-slate-700">
                                {RECENT_DPRS.map((dpr, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-slate-800">{dpr.scheme}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{dpr.agency} • {dpr.id}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-slate-600 font-medium">{dpr.progress}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${dpr.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                                    dpr.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                                                        'bg-amber-50 text-amber-600 border border-amber-200'
                                                }`}>
                                                {dpr.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-slate-500 text-xs">
                                            {dpr.time}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Open Issues Feed */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                    <div className="p-5 border-b border-slate-100 bg-rose-50/30">
                        <h3 className="text-lg font-black text-rose-800 tracking-tight flex items-center gap-2">
                            <ShieldAlert size={18} className="text-rose-600" />
                            Open Site Blockers
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20 custom-scrollbar space-y-3">
                        {OPEN_ISSUES.map((issue, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-rose-200 transition-colors group relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${issue.severity === 'Critical' ? 'bg-rose-500' :
                                        issue.severity === 'High' ? 'bg-orange-500' :
                                            issue.severity === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                                    }`}></div>

                                <div className="flex justify-between items-start mb-1 pl-2">
                                    <h4 className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors leading-tight">{issue.title}</h4>
                                </div>

                                <div className="pl-2 mt-2 flex justify-between items-end">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <MapPin size={12} />
                                        <span className="text-[11px] font-bold uppercase">{issue.location}</span>
                                    </div>
                                    <div className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                        Open: {issue.age}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
