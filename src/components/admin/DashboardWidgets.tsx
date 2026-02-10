'use client';

import React from 'react';
import { ProjectAnalytics } from '@/lib/analytics';
import { ArrowUpRight, ArrowDownRight, IndianRupee, PieChart, TrendingUp, AlertTriangle, Package2 } from 'lucide-react';

// --- Components ---

function PremiumCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`first-letter:bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)] ${className} overflow-hidden hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.04)] transition-shadow duration-300`}>
            {children}
        </div>
    );
}

export function FinancialCard({ amount }: { amount: number }) {
    const amountInLakhs = (amount / 100000).toFixed(2);
    // Simulated percentage
    const percentUsed = 68;

    return (
        <PremiumCard className="p-8 relative group">
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <IndianRupee size={24} strokeWidth={2} />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                    <TrendingUp size={12} />
                    +12.5%
                </span>
            </div>

            <div className="mb-6">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Fund Utilization</p>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight dark:text-white">
                    ₹{amountInLakhs}<span className="text-xl text-slate-400 ml-1">L</span>
                </h3>
            </div>

            {/* Progress Bar with "Spark" effect */}
            <div className="relative pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                    <span>Used</span>
                    <span>{percentUsed}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full relative overflow-hidden"
                        style={{ width: `${percentUsed}%` }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] skew-x-12 translate-x-[-150%] group-hover:animate-[shimmer_2s_infinite]" />
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 font-medium">
                    Budget Limit: ₹50.00L • <span className="text-slate-500">Safe Zone</span>
                </p>
            </div>
        </PremiumCard>
    );
}

export function MaterialHealthCard({ items }: { items: ProjectAnalytics['materialHealth'] }) {
    return (
        <PremiumCard className="h-full flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Package2 size={20} className="text-purple-500" />
                        Material Inventory
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Stock levels vs Consumption</p>
                </div>
                <button className="text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors">
                    View Full Report
                </button>
            </div>

            <div className="p-8 space-y-8 flex-1">
                {items.length === 0 && <p className="text-slate-400 text-sm">No material data available.</p>}

                {items.map((item, idx) => (
                    <div key={idx} className="group">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h4 className="font-bold text-slate-700 text-sm">{item.description}</h4>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">CODE: {item.itemCode || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${item.status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                    }`}>
                                    {item.balance} Left
                                </span>
                            </div>
                        </div>

                        {/* Visual Bar Chart Row */}
                        <div className="flex gap-1 h-3 mt-2">
                            {/* Consumed Part */}
                            <div
                                className="bg-slate-200 rounded-l-md relative group-hover:bg-slate-300 transition-colors"
                                style={{ width: `${(item.consumed / item.stock) * 100}%` }}
                                title={`Consumed: ${item.consumed}`}
                            />
                            {/* Balance Part */}
                            <div
                                className={`rounded-r-md transition-colors relative ${item.status === 'Critical' ? 'bg-red-500 shadow-red-200' :
                                        item.status === 'Medium' ? 'bg-amber-400' :
                                            'bg-emerald-500'
                                    }`}
                                style={{ width: `${(item.balance / item.stock) * 100}%` }}
                                title={`Balance: ${item.balance}`}
                            >
                                {item.status === 'Critical' && (
                                    <div className="absolute right-0 -top-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PremiumCard>
    );
}
