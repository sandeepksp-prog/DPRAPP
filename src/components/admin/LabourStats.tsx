'use client';

import React from 'react';
import { Users, HardHat, Hammer } from 'lucide-react';

const gangs = [
    { name: 'Gang A (Deepak)', fitters: 2, helpers: 4, progress: 120, target: 150 },
    { name: 'Gang B (Ramesh)', fitters: 1, helpers: 3, progress: 85, target: 100 },
    { name: 'Gang C (Suresh)', fitters: 2, helpers: 5, progress: 140, target: 140 },
];

export default function LabourStats() {
    return (
        <div className="card-premium p-8 h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Users size={20} className="text-orange-500" />
                        Labour Efficiency
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Gang-wise Performance (Today)</p>
                </div>
                <span className="badge-warning">
                    <HardHat size={12} className="inline mr-1" />
                    32 On Site
                </span>
            </div>

            <div className="space-y-6">
                {gangs.map((gang, idx) => (
                    <div key={idx} className="group">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-white shadow-sm">
                                    {gang.name.charAt(5)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">{gang.name}</p>
                                    <p className="text-[10px] text-slate-400 flex items-center gap-2">
                                        <span>{gang.fitters} Fitters</span> • <span>{gang.helpers} Helpers</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-800">{gang.progress}m</p>
                                <p className="text-[10px] text-slate-400">Target: {gang.target}m</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${gang.progress >= gang.target ? 'bg-emerald-500' : 'bg-orange-500'
                                    }`}
                                style={{ width: `${(gang.progress / gang.target) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Avg Efficiency</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">45m <span className="text-xs text-slate-400 font-medium">/ fitter</span></p>
                </div>
                <div className="h-8 w-[1px] bg-slate-100" />
                <div className="text-center">
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Total Strength</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">17</p>
                </div>
            </div>
        </div>
    );
}
