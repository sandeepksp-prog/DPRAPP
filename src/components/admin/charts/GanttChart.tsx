"use client";

import React from 'react';
import { GANTT_PRIORITY_SCHEMES } from '@/lib/gantt-data';
import { Calendar, BarChart2 } from 'lucide-react';

export default function GanttChart() {
    // Gantt boundaries: Sep 1, 2025 to Mar 31, 2026
    const startDate = new Date('2025-09-01').getTime();
    const endDate = new Date('2026-04-01').getTime();
    const totalDuration = endDate - startDate;

    const months = [
        { name: "Sep '25", days: 30 },
        { name: "Oct '25", days: 31 },
        { name: "Nov '25", days: 30 },
        { name: "Dec '25", days: 31 },
        { name: "Jan '26", days: 31 },
        { name: "Feb '26", days: 28 },
        { name: "Mar '26", days: 31 }
    ];

    const getLeftPercentage = (startString: string) => {
        const start = new Date(startString).getTime();
        return Math.max(0, ((start - startDate) / totalDuration) * 100);
    };

    const getWidthPercentage = (startString: string, endString: string) => {
        const start = new Date(startString).getTime();
        const end = new Date(endString).getTime();
        return Math.min(100, ((end - start) / totalDuration) * 100);
    };

    const formatShortDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    const getDays = (startString: string, endString: string) => {
        const start = new Date(startString).getTime();
        const end = new Date(endString).getTime();
        return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    };

    // Simulated Today marker for the demo (Feb 27 2026)
    const todayNum = new Date('2026-02-27').getTime();
    const todayPerc = Math.max(0, Math.min(100, ((todayNum - startDate) / totalDuration) * 100));

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col font-sans">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2">
                    <BarChart2 size={18} className="text-slate-700" />
                    <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">Priority Execution Timeline</h3>
                </div>
                <div className="flex items-center gap-5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-teal-100 border border-teal-300"></span> O&M Started</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></span> WIP</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></span> Planned</div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[400px] custom-scrollbar relative bg-white border-t border-slate-100">
                <div className="min-w-[1300px]">
                    {/* Header Timeline - STICKY to top */}
                    <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-30 shadow-sm">
                        <div className="w-[420px] shrink-0 p-3 border-r border-slate-200 flex items-center bg-slate-50 sticky left-0 z-40">
                            <div className="flex-1 flex items-center gap-2 text-slate-500 pr-2">
                                <Calendar size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">30 Priority Schemes</span>
                            </div>
                            <div className="w-16 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start</div>
                            <div className="w-16 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">End</div>
                            <div className="w-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Days</div>
                        </div>
                        <div className="flex-1 flex relative">
                            {months.map((m, i) => (
                                <div key={i} className="flex-1 border-r border-slate-200 last:border-0 relative bg-slate-50">
                                    <div className="p-4 text-center font-bold text-xs text-slate-600 uppercase tracking-widest">{m.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Grid Background */}
                    <div className="relative">
                        <div className="absolute inset-0 flex left-[420px] pointer-events-none z-0">
                            {months.map((m, i) => (
                                <div key={i} className="flex-1 border-r border-slate-200 last:border-0 relative h-full flex">
                                    {/* 4 trace columns per month to simulate weeks */}
                                    <div className="flex-1 border-r border-slate-100 border-dashed"></div>
                                    <div className="flex-1 border-r border-slate-100 border-dashed"></div>
                                    <div className="flex-1 border-r border-slate-100 border-dashed"></div>
                                    <div className="flex-1"></div>
                                </div>
                            ))}
                        </div>

                        {/* Today Line Marker */}
                        <div
                            className="absolute top-0 bottom-0 w-[2px] bg-indigo-400 z-20 pointer-events-none"
                            style={{ left: `calc(420px + (100% - 420px) * ${todayPerc / 100})` }}
                        >
                            <div className="absolute -top-[1px] -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                                TODAY
                            </div>
                        </div>

                        {/* Gantt Rows */}
                        <div className="relative z-10 pt-4 pb-4">
                            {GANTT_PRIORITY_SCHEMES.map((scheme) => {
                                const left = getLeftPercentage(scheme.start);
                                const width = getWidthPercentage(scheme.start, scheme.end);
                                const isCompleted = scheme.status === 'O&M Started';

                                return (
                                    <div key={scheme.id} className="flex border-b border-slate-100 hover:bg-slate-50/50 group transition-colors">
                                        {/* Row Header - sticky to left */}
                                        <div className="w-[420px] shrink-0 py-2.5 px-3 border-r border-slate-200 bg-white group-hover:bg-slate-50/80 transition-colors flex items-center sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.02)]">
                                            <div className="flex-1 flex items-center gap-3 pr-2">
                                                <span className="text-[10px] font-bold text-slate-400 w-4 text-right">#{scheme.priority}</span>
                                                <span className="text-[12px] font-semibold text-slate-700 truncate">{scheme.name}</span>
                                            </div>
                                            <div className="w-16 text-center text-[10px] font-medium text-slate-500 bg-slate-50 py-0.5 rounded border border-slate-100">{formatShortDate(scheme.start)}</div>
                                            <div className="w-16 text-center text-[10px] font-medium text-slate-500 bg-slate-50 py-0.5 rounded border border-slate-100 ml-1">{formatShortDate(scheme.end)}</div>
                                            <div className="w-12 text-center text-[10px] font-bold text-slate-400 ml-1">{getDays(scheme.start, scheme.end)}</div>
                                        </div>
                                        <div className="flex-1 relative py-1.5 h-10">
                                            <div
                                                className={`absolute top-1.5 bottom-1.5 rounded-md transition-all duration-300 cursor-pointer flex items-center px-2 overflow-hidden
                                                    ${isCompleted ? 'bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100' : 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'}
                                                `}
                                                style={{ left: `${left}%`, width: `${width}%` }}
                                            >
                                                <span className="text-[10px] font-semibold truncate w-full opacity-90">
                                                    {isCompleted ? 'O&M Started' : 'In Progress'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>


        </div >
    );
}
