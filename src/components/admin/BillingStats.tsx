'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileCheck, FileClock, IndianRupee } from 'lucide-react';

// Mock Data for JMR (Joint Measurement Record)
const jmrData = [
    { name: 'Jan', submitted: 40, approved: 24 },
    { name: 'Feb', submitted: 30, approved: 13 },
    { name: 'Mar', submitted: 20, approved: 18 },
    { name: 'Apr', submitted: 27, approved: 20 },
    { name: 'May', submitted: 18, approved: 15 },
];

export default function BillingStats() {
    return (
        <div className="card-depth p-8 h-full flex flex-col relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <IndianRupee size={20} className="text-[#0066CC]" />
                        Billing & JMR
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Submitted vs Approved (Lakhs)</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-[#A7D3E0]" /> Submitted
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-[#0066CC]" /> Approved
                    </span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jmrData} barGap={4}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar
                            dataKey="submitted"
                            fill="#A7D3E0"
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                        <Bar
                            dataKey="approved"
                            fill="#0066CC"
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[#f0f9ff] rounded-2xl p-4 flex items-center gap-3 border border-[#A7D3E0]">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                        <FileClock size={20} className="text-[#0066CC]" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Pending</p>
                        <p className="text-lg font-bold text-slate-800">₹45.2L</p>
                    </div>
                </div>
                <div className="bg-[#f0fdf4] rounded-2xl p-4 flex items-center gap-3 border border-[#90EE90]">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                        <FileCheck size={20} className="text-[#15803d]" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Cleared</p>
                        <p className="text-lg font-bold text-slate-800">₹128.5L</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
