'use client';

import React from 'react';
import LabourStats from '@/components/admin/LabourStats';
import { Users, UserCheck, UserX, ShieldAlert } from 'lucide-react';

export default function ResourceView() {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[500px]">
                {/* Enhanced Labour Stats */}
                <div className="lg:col-span-1 h-full">
                    <LabourStats />
                </div>

                {/* Sub-Contractor Grid */}
                <div className="lg:col-span-2 card-depth p-0 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Users size={20} className="text-[#663399]" />
                            Sub-Contractor Overview
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                                Total: 4 Agencies
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                    <th className="pb-3 pl-2">Agency Name</th>
                                    <th className="pb-3">Work Order</th>
                                    <th className="pb-3">Manpower</th>
                                    <th className="pb-3 text-right">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-slate-600">
                                {[
                                    { name: 'Roba Construction', wo: 'WO-2023-001', manpower: 12, perf: 92 },
                                    { name: 'BuildWell Infra', wo: 'WO-2023-005', manpower: 8, perf: 78 },
                                    { name: 'City Power & Co', wo: 'WO-2023-012', manpower: 5, perf: 85 },
                                    { name: 'Metro Civil', wo: 'WO-2023-015', manpower: 15, perf: 65 },
                                ].map((agency, i) => (
                                    <tr key={i} className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                    {agency.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-700">{agency.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-500 font-mono text-xs">{agency.wo}</td>
                                        <td className="py-4">
                                            <div className="flex -space-x-2">
                                                {[...Array(Math.min(4, Math.ceil(agency.manpower / 3)))].map((_, idx) => (
                                                    <div key={idx} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                                                ))}
                                                <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold">
                                                    +{agency.manpower}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${agency.perf > 90 ? 'bg-[#f0fdf4] text-[#15803d]' :
                                                    agency.perf > 75 ? 'bg-[#f0f9ff] text-[#0369a1]' :
                                                        'bg-[#fffbef] text-[#b45309]'
                                                }`}>
                                                {agency.perf}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Key Resource Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-depth p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-[#f0fdf4] rounded-full flex items-center justify-center text-[#15803d] mb-3">
                        <UserCheck size={24} />
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-800">94%</h3>
                    <p className="text-xs text-slate-500 uppercase font-bold mt-1">Attendance Rate</p>
                </div>
                <div className="card-depth p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-[#fffbef] rounded-full flex items-center justify-center text-[#b45309] mb-3">
                        <ShieldAlert size={24} />
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-800">1</h3>
                    <p className="text-xs text-slate-500 uppercase font-bold mt-1">Safety Incident</p>
                </div>
                <div className="card-depth p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-[#faf5ff] rounded-full flex items-center justify-center text-[#6b21a8] mb-3">
                        <UserX size={24} />
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-800">3</h3>
                    <p className="text-xs text-slate-500 uppercase font-bold mt-1">Absent Today</p>
                </div>
            </div>
        </div>
    );
}
