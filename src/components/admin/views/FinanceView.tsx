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
                <div className="card-depth p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <TrendingDown size={20} className="text-[#FFD700]" />
                                Expenditure Burn
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Revenue vs Operational Cost (Week)</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-[10px] uppercase text-slate-400 font-bold">Net Margin</p>
                                <p className="text-sm font-bold text-[#15803d]">+12%</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={burnData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0066CC" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0066CC" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFD700" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
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
                                    stroke="#0066CC"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="cost"
                                    stroke="#FFD700"
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
                    { label: 'Pending POs', val: '4', color: 'text-orange-500', bg: 'bg-orange-50' },
                    { label: 'Unpaid Invoices', val: '₹12.5L', color: 'text-red-500', bg: 'bg-red-50' },
                    { label: 'Cash in Hand', val: '₹5.2L', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Est. Revenue', val: '₹45L', color: 'text-blue-500', bg: 'bg-blue-50' },
                ].map((s, i) => (
                    <div key={i} className="card-depth p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">{s.label}</p>
                            <p className={`text-xl font-extrabold ${s.color} mt-1`}>{s.val}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full ${s.bg} ${s.color} flex items-center justify-center font-bold`}>
                            $
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
