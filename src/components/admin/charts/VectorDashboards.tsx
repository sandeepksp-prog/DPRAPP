'use client';

import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// --- Theme Colors matching the "New Age" UI ---
const COLORS = ['#024F7B', '#0EA5E9', '#A78BFA', '#34D399'];

// --- Mock Data ---
const areaData = [
    { name: 'Mon', active: 4000, inactive: 2400 },
    { name: 'Tue', active: 3000, inactive: 1398 },
    { name: 'Wed', active: 2000, inactive: 9800 },
    { name: 'Thu', active: 2780, inactive: 3908 },
    { name: 'Fri', active: 1890, inactive: 4800 },
    { name: 'Sat', active: 2390, inactive: 3800 },
    { name: 'Sun', active: 3490, inactive: 4300 },
];

const barData = [
    { name: 'Week 1', progress: 40, target: 80 },
    { name: 'Week 2', progress: 60, target: 80 },
    { name: 'Week 3', progress: 75, target: 80 },
    { name: 'Week 4', progress: 90, target: 100 },
];

const radarData = [
    { subject: 'Material', A: 120, B: 110, fullMark: 150 },
    { subject: 'Labor', A: 98, B: 130, fullMark: 150 },
    { subject: 'Machinery', A: 86, B: 130, fullMark: 150 },
    { subject: 'Transport', A: 99, B: 100, fullMark: 150 },
    { subject: 'Misc', A: 85, B: 90, fullMark: 150 },
];

// --- Shared Tooltip Style ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-xl shadow-blue-900/10 border border-slate-100 text-xs">
                <p className="font-bold text-slate-800 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-500">{entry.name}:</span>
                        <span className="font-bold text-slate-800">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// 1. Smooth Area Chart (Financial/Progress Flow)
export function SmoothAreaChart({ title, subtitle }: { title: string, subtitle?: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full col-span-1 md:col-span-2">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{subtitle}</p>}
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
                </div>
                <div className="flex gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#024F7B]"></div> Active</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#0EA5E9]"></div> Inactive</div>
                </div>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#024F7B" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#024F7B" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorInactive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                        <Area type="monotone" dataKey="inactive" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorInactive)" />
                        <Area type="monotone" dataKey="active" stroke="#024F7B" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {/* Bottom KPI row */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-around">
                <div className="text-center">
                    <p className="text-2xl font-black text-slate-800">425</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Achieved</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-black text-[#0EA5E9]">365</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-black text-slate-800">268</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target</p>
                </div>
            </div>
        </div>
    );
}

// 2. Resource Radar Chart
export function ResourceRadarChart() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-[400px]">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-sm bg-[#34D399]"></div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Resource Allocation</h3>
                </div>
                <div className="flex gap-4">
                    <span className="text-3xl font-black text-slate-800">255</span>
                    <span className="text-3xl font-black text-[#34D399]">365</span>
                </div>
            </div>
            <div className="flex-1 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#E2E8F0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                        <Radar name="Allocated" dataKey="A" stroke="#024F7B" fill="#024F7B" fillOpacity={0.2} />
                        <Radar name="Utilized" dataKey="B" stroke="#34D399" fill="#34D399" fillOpacity={0.6} />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// 3. Compact Horizontal Bar (Scheme Progress style)
export function MiniBarChart() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-[400px] flex flex-col">
            <h3 className="text-sm font-black text-slate-800 tracking-tight mb-4 text-center">Top Performing Partners</h3>
            <div className="flex-1 flex flex-col justify-center space-y-4">
                {[
                    { name: 'Alpha Builders', val: 85, color: '#024F7B' },
                    { name: 'Beta Cements', val: 65, color: '#0EA5E9' },
                    { name: 'Gamma Steels', val: 40, color: '#A78BFA' },
                    { name: 'Delta Logistics', val: 90, color: '#34D399' },
                    { name: 'Epsilon Tech', val: 55, color: '#FCD34D' }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-500 w-24 truncate text-right">{item.name}</span>
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${item.val}%`, backgroundColor: item.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 4. Simple KPI Donut / Stats Row
export function StatsRow() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full flex items-center justify-between col-span-1 md:col-span-3">
            <div className="w-1/4 h-20">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData.slice(0, 3)} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                        <Bar dataKey="progress" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="target" fill="#024F7B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex-1 flex justify-around border-l border-slate-100 pl-6 ml-6">
                <div>
                    <p className="text-3xl font-black text-slate-800">957</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total Active</p>
                </div>
                <div>
                    <p className="text-3xl font-black text-slate-800">225</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Delayed</p>
                </div>
                <div>
                    <p className="text-3xl font-black text-slate-800">570</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Completed</p>
                </div>
            </div>
        </div>
    );
}
