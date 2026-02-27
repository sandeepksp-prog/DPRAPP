"use client";

import React, { useState } from 'react';
import { GANTT_PRIORITY_SCHEMES } from '@/lib/gantt-data';
import { Calendar, BarChart2 } from 'lucide-react';

export default function GanttChart() {
    // Gantt boundaries: Sep 1, 2025 to May 31, 2026
    const startDate = new Date('2025-09-01').getTime();
    const endDate = new Date('2026-06-01').getTime();
    const totalDuration = endDate - startDate;

    const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

    const months = [
        { name: "Sep '25", days: 30 },
        { name: "Oct '25", days: 31 },
        { name: "Nov '25", days: 30 },
        { name: "Dec '25", days: 31 },
        { name: "Jan '26", days: 31 },
        { name: "Feb '26", days: 28 },
        { name: "Mar '26", days: 31 },
        { name: "Apr '26", days: 30 },
        { name: "May '26", days: 31 }
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
                <div className="min-w-[1500px]">
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
                                <div
                                    key={i}
                                    onMouseEnter={() => setHoveredMonth(i)}
                                    onMouseLeave={() => setHoveredMonth(null)}
                                    className={`flex-1 border-r border-slate-200 last:border-0 relative cursor-pointer transition-all duration-200 active:scale-95 ${hoveredMonth === i ? 'bg-slate-200 shadow-inner' : 'bg-slate-50'}`}
                                >
                                    <div className="p-4 text-center font-bold text-xs text-slate-600 uppercase tracking-widest">{m.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Grid Background */}
                    <div className="relative">
                        <div className="absolute inset-0 flex left-[420px] pointer-events-none z-0">
                            {months.map((m, i) => (
                                <div key={i} className={`flex-1 border-r border-slate-200 last:border-0 relative h-full flex transition-colors duration-300 ${hoveredMonth === i ? 'bg-blue-300/10' : ''}`}>
                                    {/* 4 trace columns per month to simulate weeks */}
                                    <div className="flex-1 border-r border-slate-200/60 border-dashed"></div>
                                    <div className="flex-1 border-r border-slate-200/60 border-dashed"></div>
                                    <div className="flex-1 border-r border-slate-200/60 border-dashed"></div>
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
                                        <div className="flex-1 relative py-1.5 h-10 group/row">
                                            {/* Main Bar */}
                                            <div
                                                className={`absolute top-1.5 bottom-1.5 rounded-md transition-all duration-300 cursor-pointer flex items-center justify-center px-2 overflow-hidden z-10
                                                    ${isCompleted ? 'bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 shadow-sm' : 'bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100'}
                                                `}
                                                style={{ left: `${left}%`, width: `${width}%` }}
                                            >
                                                <span className={`text-[10px] truncate text-center w-full opacity-90 ${isCompleted ? 'font-black tracking-wide' : 'font-bold tracking-wide'}`}>
                                                    {isCompleted ? 'SCHEME COMPLETED' : 'IN PROGRESS'}
                                                </span>
                                            </div>

                                            {/* External Label */}
                                            <div
                                                className="absolute top-1.5 bottom-1.5 flex items-center gap-1.5 pointer-events-none pl-1 transition-opacity opacity-70 group-hover/row:opacity-100 z-0"
                                                style={{ left: `calc(${left}% + ${width}%)` }}
                                            >
                                                {isCompleted ? (
                                                    <>
                                                        <div className="w-4 border-t border-dashed border-teal-500 relative">
                                                            <div className="w-1.5 h-1.5 border-t border-r border-teal-500 rotate-45 absolute -right-0.5 -top-[3.5px]"></div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-teal-700 whitespace-nowrap bg-white/80 px-1 rounded">
                                                            O&M STARTED
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-4 border-t border-dashed border-blue-400 relative">
                                                            <div className="w-1.5 h-1.5 border-t border-r border-blue-400 rotate-45 absolute -right-0.5 -top-[3.5px]"></div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-blue-700 whitespace-nowrap bg-white/80 px-1 rounded">
                                                            {(scheme.priority === 23 || scheme.priority === 24) ? 'ZINC ERECTION PENDING' : scheme.priority === 30 ? 'NETWORK & ZINC ERECTION PENDING' : 'NETWORK PENDING'}
                                                        </span>
                                                    </>
                                                )}
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
