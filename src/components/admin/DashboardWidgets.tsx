'use client';

import React from 'react';
import { IndianRupee, Activity, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardStats {
    totalBilling: number;
    activeSites: number;
    materialHealth: any[];
}

export function FinancialCard({ amount }: { amount: number }) {
    // Format to Lakhs
    const inLakhs = (amount / 100000).toFixed(2);

    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Fund Utilization</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-900">₹{inLakhs}</span>
                        <span className="text-sm font-medium text-slate-500">Lakhs</span>
                    </div>
                </div>
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <IndianRupee size={20} />
                </div>
            </div>
            <div className="mt-4">
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '45%' }} />
                </div>
                <p className="text-xs text-slate-400 mt-2">45% of Total Estimated Budget</p>
            </div>
        </div>
    );
}

export function MaterialHealthCard({ items }: { items: any[] }) {
    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pipe Consumption</h3>
                <Activity size={16} className="text-slate-400" />
            </div>

            <div className="space-y-4">
                {items.map((item, idx) => {
                    // Mock consumption visuals
                    const percentage = Math.min((item.consumed / item.stock) * 100, 100);
                    const isCritical = percentage > 90;

                    return (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium text-slate-700">{item.itemCode || item.description}</span>
                                <span className={isCritical ? "text-red-600 font-bold" : "text-slate-500"}>
                                    {item.consumed} / {item.stock} m
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full transition-all ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}

                {items.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                        No active material data.
                    </div>
                )}
            </div>
        </div>
    );
}
