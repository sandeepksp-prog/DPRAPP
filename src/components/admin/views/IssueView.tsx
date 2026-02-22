'use client';

import React from 'react';
import {
    AlertTriangle, Target, Clock, CheckCircle2,
    TrendingUp, BarChart2, ShieldAlert, Search,
    Filter, ArrowUpRight, AlertCircle, Zap, History as HistoryIcon
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Area, AreaChart
} from 'recharts';

// --- MOCK DATA FOR ISSUE DASHBOARD ---
const ISSUE_TRENDS = [
    { month: 'Sep', discovery: 42, resolution: 38 },
    { month: 'Oct', discovery: 35, resolution: 40 },
    { month: 'Nov', discovery: 48, resolution: 35 },
    { month: 'Dec', discovery: 52, resolution: 48 },
    { month: 'Jan', discovery: 38, resolution: 45 },
    { month: 'Feb', discovery: 30, resolution: 42 },
];

const ISSUE_PROFILE = [
    { category: 'Financial', val: 85, fullMark: 100 },
    { category: 'Technical', val: 45, fullMark: 100 },
    { category: 'Local ROW', val: 95, fullMark: 100 },
    { category: 'Material', val: 60, fullMark: 100 },
    { category: 'Labour', val: 30, fullMark: 100 },
];

const ACTIVE_TICKETS = [
    { id: 'TKT-9042', scheme: 'Aliganj Zone B', status: 'In Review', severity: 'Critical', age: '48h', category: 'Local ROW' },
    { id: 'TKT-8851', scheme: 'Shitalpur Block', status: 'On Hold', severity: 'High', age: '5d', category: 'Financial' },
    { id: 'TKT-9122', scheme: 'Awagarh Center', status: 'Work In Progress', severity: 'Medium', age: '2d', category: 'Technical' },
    { id: 'TKT-8740', scheme: 'Jalesar Phase 2', status: 'In Review', severity: 'High', age: '12h', category: 'Material' },
    { id: 'TKT-9201', scheme: 'Sakit Outer', status: 'Assigned', severity: 'Low', age: '3h', category: 'Labour' },
];

const TOP_BLOCKERS = [
    { title: 'Pipeline Excavation Halt', location: 'Nidhauli Kalan', frequency: 12, impact: 'High' },
    { title: 'OHT Foundation Delay', location: 'Aliganj Zone A', frequency: 8, impact: 'Medium' },
    { title: 'Vendor Supply Chain Gap', location: 'Cross-Project', frequency: 15, impact: 'Critical' },
    { title: 'FHTC Registration Error', location: 'Awagarh Village', frequency: 22, impact: 'Low' },
];

export default function IssueView({ subMenu }: { subMenu?: string }) {

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mb-12">

            {/* TIER 1: PERFORMANCE HERO HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Issues */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">TOTAL ISSUES LOGGED</p>
                        <h2 className="text-3xl font-black text-slate-800">142<span className="text-lg text-slate-400 font-bold ml-1">Tickets</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-2">12 Active Today</p>
                    </div>
                </div>

                {/* Pending Critical */}
                <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded-2xl p-6 shadow-lg border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                            <ShieldAlert size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1 text-rose-200/50">PENDING CRITICAL</p>
                        <h2 className="text-3xl font-black text-white">08<span className="text-lg text-rose-400 font-bold ml-1">Blockers</span></h2>
                        <p className="text-xs font-bold text-rose-400 mt-2 flex items-center gap-1">
                            <Zap size={12} fill="currentColor" /> High Site Priority
                        </p>
                    </div>
                </div>

                {/* Resolution Rate */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">RESOLUTION RATE (SLA)</p>
                        <h2 className="text-3xl font-black text-emerald-600">88.5<span className="text-lg text-slate-500 font-bold ml-1">%</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-2">+2.4% vs Previous Month</p>
                    </div>
                </div>

                {/* Avg Resolution Speed */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Clock size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">AVG. RESOLUTION SPEED</p>
                        <h2 className="text-3xl font-black text-slate-800">4.2<span className="text-lg text-slate-400 font-bold ml-1">Days</span></h2>
                        <p className="text-xs font-bold text-blue-600 mt-2">Target: &lt; 5.0 Days</p>
                    </div>
                </div>
            </div>

            {/* TIER 2: TRENDS & IMPACT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Discovery vs Resolution Line Chart */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <TrendingUp size={18} className="text-indigo-600" />
                                discovery vs Resolution Velocity
                            </h3>
                            <p className="text-xs font-bold text-slate-500 mt-1">Ticket lifecycle performance analysis</p>
                        </div>
                        <div className="flex gap-4 text-[10px] font-black tracking-wider uppercase">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-0.5 rounded-sm bg-rose-500"></div>
                                <span className="text-slate-600">New Issues</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-0.5 rounded-sm bg-emerald-500"></div>
                                <span className="text-slate-600">Closed Out</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[280px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ISSUE_TRENDS} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase' }}
                                />
                                <Line type="monotone" dataKey="discovery" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="resolution" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Issue Impact Radar */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2 mb-2">
                        <Target size={18} className="text-rose-600" />
                        Risk Impact Profile
                    </h3>
                    <p className="text-xs font-bold text-slate-500">Distribution of site hindrances by severity</p>

                    <div className="flex-1 min-h-[250px] relative mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={ISSUE_PROFILE}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="category" tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                                <Radar
                                    name="Issue Density"
                                    dataKey="val"
                                    stroke="#f43f5e"
                                    strokeWidth={2}
                                    fill="#f43f5e"
                                    fillOpacity={0.2}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* TIER 3: DATA GRIDS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Active Ticket Table */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <BarChart2 size={18} className="text-blue-600" />
                            Priority Ticket Roster
                        </h3>
                        <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition-all text-slate-500">
                                <Filter size={14} />
                            </button>
                            <button className="p-1.5 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition-all text-slate-500">
                                <Search size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                    <th className="py-3 px-4">Issue Details</th>
                                    <th className="py-3 px-4">Scheme Location</th>
                                    <th className="py-3 px-4 text-center">Severity</th>
                                    <th className="py-3 px-4 text-right">Age</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-slate-700">
                                {ACTIVE_TICKETS.map((tkt, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-slate-800 flex items-center gap-2">
                                                {tkt.id}
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{tkt.category}</span>
                                            </div>
                                            <div className="text-[11px] text-slate-500 font-bold uppercase mt-0.5">{tkt.status}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm text-slate-800 font-bold">{tkt.scheme}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">District Area</div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${tkt.severity === 'Critical' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                                                tkt.severity === 'High' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                                                    'bg-blue-50 text-blue-600 border border-blue-200'
                                                }`}>
                                                {tkt.severity}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right font-black text-slate-500">
                                            {tkt.age}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Recurring Bottlenecks Feed */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                    <div className="p-5 border-b border-slate-100 bg-rose-50/30 flex justify-between items-center">
                        <h3 className="text-lg font-black text-rose-800 tracking-tight flex items-center gap-2">
                            <HistoryIcon size={18} className="text-rose-600" />
                            Recurring Bottlenecks
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20 custom-scrollbar space-y-3">
                        {TOP_BLOCKERS.map((blocker, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-rose-200 transition-colors group relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${blocker.impact === 'Critical' ? 'bg-rose-500' : 'bg-orange-500'
                                    }`}></div>

                                <div className="flex justify-between items-start mb-1 pl-2">
                                    <h4 className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors leading-tight">{blocker.title}</h4>
                                    <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                                        {blocker.frequency}x
                                    </span>
                                </div>

                                <div className="pl-2 mt-2 flex justify-between items-end">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <AlertTriangle size={12} className="text-orange-500" />
                                        <span className="text-[11px] font-bold uppercase truncate max-w-[120px]">{blocker.location}</span>
                                    </div>
                                    <div className="text-[10px] font-black tracking-wider text-rose-500 uppercase">
                                        Impact: {blocker.impact}
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
