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

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <BarChart2 size={18} className="text-blue-500" />
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Priority Execution Timeline</h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 shadow-sm shadow-emerald-500/30"></span> Completed</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400 shadow-sm shadow-amber-400/30"></span> WIP</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-200 border border-slate-300"></span> Planned</div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[350px] custom-scrollbar relative bg-white border-t border-slate-200">
                <div className="min-w-[1200px]">
                    {/* Header Timeline - STICKY to top so rows scroll under it */}
                    <div className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-30 shadow-sm">
                        <div className="w-[300px] shrink-0 p-4 border-r border-slate-200 flex items-center gap-2 text-slate-500 bg-slate-50 sticky left-0 z-40">
                            <Calendar size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">30 Priority Schemes</span>
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
                        <div className="absolute inset-0 flex left-[300px] pointer-events-none z-0">
                            {months.map((m, i) => (
                                <div key={i} className="flex-1 border-r border-slate-100/50 bg-stripe-pattern last:border-0 relative h-full"></div>
                            ))}
                        </div>

                        {/* Gantt Rows */}
                        <div className="relative z-10">
                            {GANTT_PRIORITY_SCHEMES.map((scheme, idx) => {
                                const left = getLeftPercentage(scheme.start);
                                const width = getWidthPercentage(scheme.start, scheme.end);
                                const isCompleted = scheme.status === 'Completed';

                                return (
                                    <div key={scheme.id} className="flex border-b border-slate-100/50 hover:bg-slate-50/50 group transition-colors">
                                        {/* Row Header - sticky to left */}
                                        <div className="w-[300px] shrink-0 py-3 px-4 border-r border-slate-200 bg-white group-hover:bg-slate-50/80 transition-colors flex items-center justify-between sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-slate-400 w-4 text-right">#{scheme.priority}</span>
                                                <span className="text-xs font-bold text-slate-700 truncate w-48">{scheme.name}</span>
                                            </div>
                                            {isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                                            {!isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                                        </div>
                                        <div className="flex-1 relative py-2">
                                            <div
                                                className={`absolute top-2.5 bottom-2.5 rounded-sm shadow-sm transition-all duration-300 group-hover:shadow-md cursor-pointer flex items-center px-2 overflow-hidden
                                                    ${isCompleted ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-emerald-900 border border-emerald-600/20' : 'bg-gradient-to-r from-amber-300 to-amber-400 text-amber-900 border border-amber-500/20'}
                                                `}
                                                style={{ left: `${left}%`, width: `${width}%` }}
                                            >
                                                <span className="text-[9px] font-black truncate w-full tracking-wider opacity-80 mix-blend-color-burn">
                                                    {isCompleted ? '100% DONE' : 'IN PROGRESS'}
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

            <style jsx>{`
                .bg-stripe-pattern {
                    background-image: linear-gradient(90deg, transparent 50%, rgba(241, 245, 249, 0.4) 50%);
                    background-size: 8% 100%;
                }
            `}</style>
        </div >
    );
}
