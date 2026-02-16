'use client';

import React from 'react';
import BillingStats from '@/components/admin/BillingStats';
import { IndianRupee, TrendingDown, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';

const burnData = [
    { day: 'Mon', revenue: 40000, cost: 24000 },
    { day: 'Tue', revenue: 30000, cost: 13980 },
    { day: 'Wed', revenue: 20000, cost: 38000 }, // High burn
    { day: 'Thu', revenue: 27800, cost: 20000 },
    { day: 'Fri', revenue: 18900, cost: 15000 },
    { day: 'Sat', revenue: 23900, cost: 20000 },
    { day: 'Sun', revenue: 34900, cost: 13000 },
];

export default function FinanceView() {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[400px]">
                <BillingStats />

                {/* Expenditure Burn Chart */}
                <div className="card-uplift p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <TrendingDown size={20} className="text-amber-400" />
                                Expenditure Burn
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Revenue vs Operational Cost (Week)</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-[10px] uppercase text-slate-400 font-bold">Net Margin</p>
                                <p className="text-sm font-bold text-emerald-600">+12%</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={burnData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="cost"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCost)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Pending POs', val: '4', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Unpaid Invoices', val: '₹12.5L', color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'Cash in Hand', val: '₹5.2L', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Est. Revenue', val: '₹45L', color: 'text-blue-500', bg: 'bg-blue-50' },
                ].map((s, i) => (
                    <div key={i} className="card-uplift p-4 flex items-center justify-between group hover:border-blue-200">
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">{s.label}</p>
                            <p className={`text-xl font-extrabold ${s.color} mt-1`}>{s.val}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform`}>
                            $
                        </div>
                    </div>
                ))}
            </div>
            {/* ROW 3: PAYABLES & BOQ (METRIC 5 & 6) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PAYABLES CARD */}
                <div className="card-uplift p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
                                <IndianRupee size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Payables</h3>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Outstanding Dues</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-slate-900">₹1.00<span className="text-lg text-slate-400 font-medium">Cr</span></p>
                            <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1 border border-emerald-100">Safe Limit</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-xs font-bold text-slate-500">Recorded Payables</span>
                            <span className="text-sm font-black text-slate-800">₹2.02 Cr</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-xs font-bold text-slate-500">Amount Paid</span>
                            <span className="text-sm font-black text-emerald-600">- ₹1.02 Cr</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-rose-500 uppercase">Overdue (&gt;30 Days)</span>
                                <span className="text-lg font-black text-rose-500">₹7,00,240</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOQ SUMMARY CARD */}
                <div className="card-uplift p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm">
                                <IndianRupee size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">BOQ Status</h3>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Bill of Quantities</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-slate-900">₹6.80<span className="text-lg text-slate-400 font-medium">Cr</span></p>
                            <p className="text-[10px] font-bold text-slate-400">Total Contract Value</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                <span>Financial Progress</span>
                                <span>37%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                <div className="h-full bg-blue-500 w-[37%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[10px] font-bold text-slate-400">Achieved: ₹25.44L</span>
                                <span className="text-[10px] font-bold text-slate-400">Target: ₹6.80Cr</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Budget Utilized</p>
                                <p className="text-lg font-black text-slate-800">₹25.43 L</p>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                                <p className="text-[10px] uppercase font-bold text-emerald-600">Savings</p>
                                <p className="text-lg font-black text-emerald-600">₹1,298</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
