'use client';

import React, { useState, useEffect } from 'react';
import { SmoothAreaChart, ResourceRadarChart, MiniBarChart, KPICard, StatusDonutChart } from '../charts/VectorDashboards';
import { BLOCK_SCHEMES, SCHEME_MAP } from '@/lib/scheme-data';

export default function WorkProgressView({ schemeName }: { stats?: any, recentReports?: any[], schemeName?: string }) {
    // In page.tsx, the sidebar passes the Block Name as 'schemeName' (e.g., "ALIGANJ")
    const blockName = schemeName?.toUpperCase() || "ALIGANJ";
    const availableSchemes = BLOCK_SCHEMES[blockName] || [];

    // O(1) active scheme local state
    const [activeSchemeId, setActiveSchemeId] = useState<number>(availableSchemes[0]?.id || 0);

    // Reset scheme selector when block changes
    useEffect(() => {
        if (availableSchemes.length > 0) {
            setActiveSchemeId(availableSchemes[0].id);
        }
    }, [blockName]);

    const activeScheme = SCHEME_MAP[activeSchemeId];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1400px] mb-12">

            {/* SCHEME SELECTOR HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 gap-4">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{blockName} BLOCK</p>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Scheme Data Dashboard</h2>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-xs font-bold text-slate-500">Select Scheme:</span>
                    <select
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-64 p-2.5 outline-none transition-colors"
                        value={activeSchemeId}
                        onChange={(e) => setActiveSchemeId(Number(e.target.value))}
                    >
                        {availableSchemes.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* TIER 1: KPI SNAPSHOT (4 Cards - col-span-3 each) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3">
                    <KPICard title="Scheme Value" prefix="₹" value="1.2" suffix=" Cr" trend="+0.0%" trendLabel="baseline" isPositive={true} />
                </div>
                <div className="lg:col-span-3">
                    <KPICard title="Spent to Date" prefix="₹" value="0.4" suffix=" Cr" trend="+12%" trendLabel="velocity" isPositive={true} />
                </div>
                <div className="lg:col-span-3">
                    <KPICard title="Physical Progress" value="42" suffix="%" trend="+8%" trendLabel="this month" isPositive={true} />
                </div>
                <div className="lg:col-span-3">
                    <KPICard title="Timeline Status" value="On Track" trend="0" trendLabel="delay days" isPositive={true} />
                </div>
            </div>

            {/* TIER 2: VELOCITY & DISTRIBUTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <SmoothAreaChart title="Scheme Financial Velocity vs Target" subtitle={`${activeScheme?.name || 'Local'} Physical Progress Run Rate`} />
                </div>
                <div className="lg:col-span-4">
                    <StatusDonutChart />
                </div>
            </div>

            {/* TIER 3: THE DRILL-DOWN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                    <ResourceRadarChart />
                </div>
                <div className="lg:col-span-6">
                    <MiniBarChart title="Task Completion Pipeline" />
                </div>
            </div>

        </div>
    );
}
