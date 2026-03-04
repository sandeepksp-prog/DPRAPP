"use client";

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Home, Zap, Droplet, ArrowUpRight, TrendingUp, AlertCircle, CheckCircle2, Factory, Waves, MapPin, Building, Activity, ChevronDown, ChevronRight } from 'lucide-react';

import { SCHEME_MAP } from '@/lib/scheme-data';
import GanttChart from '@/components/admin/charts/GanttChart';
import { db as database } from '@/lib/firebase/client';
import { ref, onValue } from 'firebase/database';

const ALL_SCHEMES = Object.keys(SCHEME_MAP).map(id => SCHEME_MAP[id].name);

function buildDynamicDetails(seed: number, completedRatio: number, pendingRatio: number) {
    const list = [...ALL_SCHEMES].sort((a, b) => a.localeCompare(b));
    let currentIndex = list.length, temporaryValue, randomIndex;
    let s = seed;
    while (0 !== currentIndex) {
        s = (s * 9301 + 49297) % 233280;
        randomIndex = Math.floor((s / 233280) * currentIndex);
        currentIndex -= 1;
        temporaryValue = list[currentIndex];
        list[currentIndex] = list[randomIndex];
        list[randomIndex] = temporaryValue;
    }

    const count = list.length;
    let cCount = Math.round(count * completedRatio);
    let pCount = Math.round(count * pendingRatio);

    return {
        completed: list.slice(0, cCount),
        pending: list.slice(cCount, cCount + pCount),
        issues: list.slice(cCount + pCount)
    };
}

// --- MOCK DATA FOR JJM SCOPE ---
const JJM_SCOPE_DATA_BASE = [
    { id: 1, item: "OHT Construction", scope: 142, completed: 86, pending: 56, issues: 3, icon: <Factory size={16} /> },
    { id: 2, item: "Pump House", scope: 142, completed: 92, pending: 50, issues: 1, icon: <Home size={16} /> },
    { id: 3, item: "Borewell", scope: 142, completed: 115, pending: 27, issues: 0, icon: <Waves size={16} /> },
    { id: 4, item: "Boundary Wall", scope: 142, completed: 64, pending: 78, issues: 5, icon: <Building size={16} /> },
    { id: 5, item: "Solar Installation", scope: 142, completed: 42, pending: 100, issues: 0, icon: <Zap size={16} /> },
    { id: 6, item: "Sensors & Automation", scope: 142, completed: 21, pending: 121, issues: 0, icon: <Activity size={16} /> },
    { id: 7, item: "Pipe Line (km)", scope: 1250, completed: 890, pending: 360, issues: 12, icon: <Droplet size={16} /> },
    { id: 8, item: "FHTC Connections", scope: 85000, completed: 42500, pending: 42500, issues: 45, icon: <MapPin size={16} /> },
];

const JJM_SCOPE_DATA = JJM_SCOPE_DATA_BASE.map(row => {
    const total = row.completed + row.pending + row.issues || 1;
    return {
        ...row,
        details: buildDynamicDetails(row.id * 1024, row.completed / total, row.pending / total)
    };
});

// --- MOCK DATA FOR JMR TRACKER ---
const JMR_DONUTS = [
    { id: 'civil', name: "CIVIL", value: 68, color: '#3B82F6' },
    { id: 'enm', name: "E&M", value: 45, color: '#F59E0B' },
    { id: 'pipeline', name: "PIPELINE", value: 82, color: '#10B981' },
];

const MISSING_JMR_LIST: Record<string, any[]> = {
    'civil': [
        { scheme: "DADUPUR KHURD", item: "OHT Foundation", date: "Oct 12", delay: "4 Days" },
        { scheme: "KARHALA KASIMPUR", item: "Boundary Wall", date: "Oct 10", delay: "6 Days" },
        { scheme: "BARAGAON", item: "Pump House Roof", date: "Oct 15", delay: "1 Day" }
    ],
    'enm': [
        { scheme: "KHERIYA TAJ", item: "Solar Panels", date: "Oct 11", delay: "5 Days" },
        { scheme: "MANIKPUR", item: "Automation Sensors", date: "Oct 14", delay: "2 Days" }
    ],
    'pipeline': [
        { scheme: "BUDHARRA", item: "500m HDPE Laid", date: "Oct 09", delay: "7 Days" },
        { scheme: "NAGALA FARID", item: "Hydrotest Node 4", date: "Oct 13", delay: "3 Days" }
    ]
};

// --- MOCK DATA FOR ACHIEVEMENTS ---
const RECENT_ACHIEVEMENTS = [
    { text: "💯 FHTC 100% Completed at DADUPUR KHURD", time: "2 hours ago" },
    { text: "🏗️ OHT Foundation poured at KURINA DAULATPUR", time: "5 hours ago" },
    { text: "💧 12km Pipeline pressure tested in PAHRAIYA", time: "Yesterday" },
    { text: "⚡ Solar Grid active at NAGLA DAYAL Pump House", time: "Yesterday" },
    { text: "🎯 5 New Schemes transitioned to O&M", time: "2 Days ago" },
    { text: "🚧 Borewell drilling completed at KHANPUR", time: "3 Days ago" },
];


interface SummaryViewProps {
    onNavigateToScheme?: (schemeName: string) => void;
    activeBranch?: 'UP' | 'KERALA';
}

export default function SummaryView({ onNavigateToScheme, activeBranch = 'UP' }: SummaryViewProps = {}) {
    // State for JMR Toggle
    const [activeJmrCategory, setActiveJmrCategory] = useState<'civil' | 'enm' | 'pipeline'>('civil');
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [activeMetricFilter, setActiveMetricFilter] = useState<string | null>(null);
    const [expandedBlock, setExpandedBlock] = useState<string | null>(null);

    // Firebase Data State
    const [liveSchemes, setLiveSchemes] = useState<Record<string, any>>({});
    const [blocksData, setBlocksData] = useState<Record<string, any[]>>({});

    useEffect(() => {
        if (!database) return;
        const schemesRef = ref(database, 'schemes');
        const unsubscribe = onValue(schemesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setLiveSchemes(data);

                // Group by block
                const groups: Record<string, any[]> = {};
                Object.values(data).forEach((scheme: any) => {
                    const block = scheme.basic_info?.block || 'UNKNOWN';
                    if (!groups[block]) groups[block] = [];
                    groups[block].push(scheme);
                });
                setBlocksData(groups);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mb-12">

            {/* TIER 1: THE POWER HEADER */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Hero Card: Capital Spend */}
                <div className="lg:col-span-4 rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] shadow-lg border border-slate-700/50 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all duration-700"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">TOTAL EXPENDITURE</p>
                            <h2 className="text-xl font-bold text-slate-200">Capital Spend</h2>
                        </div>
                        <div className="mt-4">
                            <h1 className="text-5xl font-black text-white tracking-tighter">₹84.6<span className="text-xl text-slate-400 ml-1">Cr</span></h1>
                            <div className="flex items-center gap-2 mt-3">
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                                    <TrendingUp size={12} /> +12% this month
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary KPIs (Grid of 5) */}
                <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        { title: "TOTAL SCHEMES", value: Object.keys(liveSchemes).length.toString(), icon: <Factory size={22} className="text-blue-500" />, bg: "bg-blue-50/50 hover:bg-blue-50/80 border-blue-100" },
                        { title: "ACTIVE SCHEMES", value: Object.values(liveSchemes).filter(s => s.basic_info?.status === 'ACTIVE').length.toString(), icon: <TrendingUp size={22} className="text-emerald-500" />, bg: "bg-emerald-50/50 hover:bg-emerald-50/80 border-emerald-100" },
                        { title: "TOTAL COMPLETED", value: "0", icon: <CheckCircle2 size={22} className="text-indigo-500" />, bg: "bg-indigo-50/50 hover:bg-indigo-50/80 border-indigo-100" },
                        { title: "UPCOMING", value: "0", icon: <AlertCircle size={22} className="text-amber-500" />, bg: "bg-amber-50/50 hover:bg-amber-50/80 border-amber-100" },
                        { title: "TRANSITION TO O&M", value: "0", icon: <Zap size={22} className="text-rose-500" />, bg: "bg-rose-50/50 hover:bg-rose-50/80 border-rose-100" }
                    ].map((kpi, idx) => (
                        <div
                            key={idx}
                            onClick={() => setActiveMetricFilter(kpi.title)}
                            className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all relative overflow-hidden group cursor-pointer hover:ring-2 hover:ring-blue-400 hover:scale-[1.02] ${kpi.bg}`}
                        >
                            <div className="flex flex-col gap-3 relative z-10">
                                <div className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm self-start">{kpi.icon}</div>
                                <h3 className="text-4xl font-black text-slate-800 tracking-tight mt-1">{kpi.value}</h3>
                            </div>
                            <div className="mt-2 relative z-10">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{kpi.title}</p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 opacity-[0.04] group-hover:opacity-10 transition-all transform group-hover:scale-110 duration-500 pointer-events-none">
                                {React.cloneElement(kpi.icon as React.ReactElement<any>, { size: 100 })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TIER 2: JJM SCOPE MATRIX & ACHIEVEMENT FEED */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left: JJM Scope Matrix */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Scope vs Achieved Matrix</h3>
                        <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">JJM {activeBranch === 'UP' ? 'Etah' : 'Alappuzha'}</span>
                    </div>
                    <div className="overflow-x-auto flex-1 p-2">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Work Component</th>
                                    <th className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Scope</th>
                                    <th className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Completed</th>
                                    <th className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Pending</th>
                                    <th className="p-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Open Issues</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {JJM_SCOPE_DATA.map((row) => {
                                    const percent = Math.round((row.completed / row.scope) * 100) || 0;
                                    const isExpanded = expandedRow === row.id;
                                    return (
                                        <React.Fragment key={row.id}>
                                            <tr
                                                className={`transition-colors group cursor-pointer ${isExpanded ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'}`}
                                                onClick={() => setExpandedRow(isExpanded ? null : row.id)}
                                            >
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>{row.icon}</div>
                                                        <span className={`font-bold text-sm ${isExpanded ? 'text-blue-700' : 'text-slate-700'}`}>{row.item}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right font-medium text-slate-600 font-mono text-sm">{row.scope.toLocaleString()}</td>
                                                <td className="p-3 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-bold text-emerald-600 font-mono text-sm">{row.completed.toLocaleString()}</span>
                                                        <span className="text-[10px] text-emerald-500 font-bold">{percent}%</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right font-medium text-amber-600 font-mono text-sm">{row.pending.toLocaleString()}</td>
                                                <td className="p-3 text-right">
                                                    {row.issues > 0 ? (
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600 font-bold text-xs">
                                                            {row.issues}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan={5} className="p-0 border-b border-slate-100">
                                                        <div className="bg-slate-50 border-t border-blue-100 p-4 animate-in slide-in-from-top-2 fade-in duration-200 shadow-inner">
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                {/* Completed Column */}
                                                                <div className="bg-white rounded-xl border border-emerald-100 p-3 shadow-sm">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <div className="p-1 bg-emerald-50 text-emerald-500 rounded"><CheckCircle2 size={14} /></div>
                                                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Completed</h4>
                                                                    </div>
                                                                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                                                                        {row.details.completed.map((scheme, i) => (
                                                                            <button
                                                                                key={i}
                                                                                onClick={(e) => { e.stopPropagation(); onNavigateToScheme?.(scheme); }}
                                                                                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors border border-transparent hover:border-emerald-100 flex items-center justify-between group/btn"
                                                                            >
                                                                                <span className="truncate pr-2">{scheme}</span>
                                                                                <ArrowUpRight size={12} className="shrink-0 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                                            </button>
                                                                        ))}
                                                                        {row.details.completed.length === 0 && <p className="text-xs text-slate-400 italic px-2">None</p>}
                                                                    </div>
                                                                </div>

                                                                {/* Pending Column */}
                                                                <div className="bg-white rounded-xl border border-amber-100 p-3 shadow-sm">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <div className="p-1 bg-amber-50 text-amber-500 rounded"><Activity size={14} /></div>
                                                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Pending Execution</h4>
                                                                    </div>
                                                                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                                                                        {row.details.pending.map((scheme, i) => (
                                                                            <button
                                                                                key={i}
                                                                                onClick={(e) => { e.stopPropagation(); onNavigateToScheme?.(scheme); }}
                                                                                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 rounded-md transition-colors border border-transparent hover:border-amber-100 flex items-center justify-between group/btn"
                                                                            >
                                                                                <span className="truncate pr-2">{scheme}</span>
                                                                                <ArrowUpRight size={12} className="shrink-0 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                                            </button>
                                                                        ))}
                                                                        {row.details.pending.length === 0 && <p className="text-xs text-slate-400 italic px-2">None</p>}
                                                                    </div>
                                                                </div>

                                                                {/* Issues Column */}
                                                                <div className="bg-white rounded-xl border border-rose-100 p-3 shadow-sm">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <div className="p-1 bg-rose-50 text-rose-500 rounded"><AlertCircle size={14} /></div>
                                                                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Open Issues</h4>
                                                                    </div>
                                                                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                                                                        {row.details.issues.map((scheme, i) => (
                                                                            <button
                                                                                key={i}
                                                                                onClick={(e) => { e.stopPropagation(); onNavigateToScheme?.(scheme); }}
                                                                                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 rounded-md transition-colors border border-transparent hover:border-rose-100 flex items-center justify-between group/btn"
                                                                            >
                                                                                <span className="flex items-center gap-2 truncate pr-2">
                                                                                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                                                    <span className="truncate">{scheme}</span>
                                                                                </span>
                                                                                <ArrowUpRight size={12} className="shrink-0 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                                            </button>
                                                                        ))}
                                                                        {row.details.issues.length === 0 && <p className="text-xs text-slate-400 italic px-2">No Open Issues</p>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Achievement Feed / Drilldown Sidebar */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    {activeMetricFilter === null ? (
                        <>
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    <ArrowUpRight size={18} className="text-blue-500" />
                                    Recent Achievements
                                </h3>
                            </div>
                            <div className="flex-1 p-5 space-y-4">
                                {RECENT_ACHIEVEMENTS.map((ach, idx) => (
                                    <div key={idx} className="flex gap-4 items-start relative before:absolute before:left-[11px] before:top-8 before:bottom-[-20px] before:w-px before:bg-slate-100 last:before:hidden">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 border-[3px] border-white ring-1 ring-blue-100 shrink-0 mt-0.5"></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700 leading-snug">{ach.text}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{ach.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-5 border-b border-slate-100 bg-blue-50/50">
                                <button
                                    onClick={() => setActiveMetricFilter(null)}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2 transition-colors uppercase tracking-wider"
                                >
                                    &larr; Back to Recent Activities
                                </button>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    <Factory size={18} className="text-blue-500" />
                                    {activeMetricFilter} Breakdown
                                </h3>
                            </div>
                            <div className="flex-1 p-4 space-y-2">
                                {Object.keys(blocksData).length === 0 && (
                                    <div className="text-center text-slate-400 text-sm py-10 font-medium">Loading Live Firebase Data...</div>
                                )}
                                {Object.keys(blocksData).sort().map((block, idx) => {
                                    const blockSchemes = blocksData[block];
                                    const isExpanded = expandedBlock === block;

                                    return (
                                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm transition-all">
                                            {/* Block Header Row */}
                                            <div
                                                onClick={() => setExpandedBlock(isExpanded ? null : block)}
                                                className="flex justify-between items-center p-2.5 px-3 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center border text-slate-500 group-hover:bg-blue-100 transition-colors shadow-sm font-bold text-[10px] ${isExpanded ? 'border-blue-300 text-blue-600' : 'border-slate-200'}`}>
                                                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                    </div>
                                                    <span className={`font-bold uppercase text-xs tracking-wide transition-colors ${isExpanded ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-700'}`}>
                                                        {block}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-black text-slate-800 font-mono transition-colors">{blockSchemes.length}</span>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{activeMetricFilter.split(' ')[1] || 'SCHEMES'}</p>
                                                </div>
                                            </div>

                                            {/* Accordion Schemes List */}
                                            {isExpanded && (
                                                <div className="bg-white border-t border-slate-100 p-4 animate-in slide-in-from-top-2 duration-200">
                                                    <ul className="space-y-3 pl-4 relative before:absolute before:left-[21px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                                                        {blockSchemes.map((scheme: any, sIdx: number) => (
                                                            <li key={sIdx} className="flex items-center gap-3 relative cursor-pointer hover:bg-slate-50 p-2 -ml-2 rounded-lg transition-colors" onClick={() => onNavigateToScheme && onNavigateToScheme(scheme.basic_info.name)}>
                                                                <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 z-10 border border-white ring-2 ring-blue-50"></div>
                                                                <span className="text-xs font-bold text-slate-700 hover:text-blue-600 truncate">{scheme.basic_info.name}</span>
                                                                {scheme.basic_info.status === 'ACTIVE' && (
                                                                    <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600">ACTIVE</span>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* TIER 3: JMR OPERATIONAL CORE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                            JMR & Work Status Tracking
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-1">Cross-referencing Physical Execution vs Approved JMRs</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                    {/* The 3 Cylinders / Donut Segment */}
                    <div className="lg:col-span-5 p-6 border-r border-slate-100 bg-slate-50/30 flex flex-col justify-center">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">OVERALL JMR COMPLETION</h4>
                        <div className="flex justify-around items-center">
                            {JMR_DONUTS.map((d) => (
                                <button
                                    key={d.id}
                                    onClick={() => setActiveJmrCategory(d.id as any)}
                                    className={`flex flex-col items-center gap-3 p-3 rounded-xl transition-all ${activeJmrCategory === d.id ? 'bg-white shadow-md ring-1 ring-slate-200 scale-105' : 'hover:bg-slate-100 opacity-60 hover:opacity-100'}`}
                                >
                                    <div className="w-20 h-20 relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[{ value: d.value }, { value: 100 - d.value }]}
                                                    cx="50%" cy="50%" innerRadius={28} outerRadius={38}
                                                    startAngle={90} endAngle={-270}
                                                    dataKey="value" stroke="none"
                                                >
                                                    <Cell fill={d.color} />
                                                    <Cell fill="#f1f5f9" />
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-sm font-black text-slate-800" style={{ color: d.color }}>{d.value}%</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black tracking-widest text-slate-600">{d.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Missing JMR Scrolling List */}
                    <div className="lg:col-span-7 p-6 flex flex-col h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                Missing JMRs <span className="text-slate-400 font-medium ml-1">({activeJmrCategory.toUpperCase()})</span>
                            </h4>
                            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded">ACTION REQUIRED</span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border border-slate-100 rounded-xl bg-slate-50/50 p-2">
                            {MISSING_JMR_LIST[activeJmrCategory]?.map((missing, i) => (
                                <div key={i} className="flex justify-between items-center p-3 mb-2 bg-white border border-slate-100 rounded-lg hover:border-blue-200 transition-colors cursor-pointer group shadow-sm last:mb-0">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-rose-50 rounded text-rose-500 mt-0.5"><AlertCircle size={14} /></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{missing.scheme}</p>
                                            <p className="text-xs text-slate-500 font-medium">{missing.item}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-rose-500">{missing.delay} Overdue</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Work Done: {missing.date}</p>
                                    </div>
                                </div>
                            ))}
                            {MISSING_JMR_LIST[activeJmrCategory]?.length === 0 && (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                                    No missing JMRs in this category! 🎉
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* TIER 4: EXECUTION GANTT TIMELINE */}
            <div className="mt-8">
                <GanttChart />
            </div>

        </div>
    );
}
