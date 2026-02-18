'use client';

import React from 'react';
import { Package2, ArrowRight } from 'lucide-react';
import { MaterialHealthCard } from '@/components/admin/DashboardWidgets';

export default function MaterialView({ materialHealth }: { materialHealth: any[] }) {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Header / Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-uplift p-6 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total Inventory Value</p>
                    <h2 className="text-3xl font-extrabold mt-2">₹1.24 Cr</h2>
                    <div className="mt-4 flex gap-2">
                        <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium backdrop-blur border border-white/10">
                            Pipe: ₹85L
                        </span>
                        <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium backdrop-blur border border-white/10">
                            Fittings: ₹39L
                        </span>
                    </div>
                </div>

                <div className="card-uplift p-6">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Stock Alerts</p>
                    <h2 className="text-3xl font-extrabold text-slate-800 mt-2">3 Items</h2>
                    <p className="text-sm text-red-500 font-medium mt-1">Below Critical Level</p>
                </div>

                <div className="card-uplift p-6">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Daily Consumption</p>
                    <h2 className="text-3xl font-extrabold text-slate-800 mt-2">1,200 m</h2>
                    <p className="text-sm text-emerald-600 font-medium mt-1">HDPE Pipes</p>
                </div>
            </div>

            {/* Main Flow Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                {/* Left: Material Health List */}
                <div className="lg:col-span-2 h-full">
                    <MaterialHealthCard items={materialHealth} />
                </div>

                {/* Right: Store Link & Actions */}
                <div className="space-y-6">
                    <div className="card-uplift p-8 bg-[var(--primary)] text-white relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform blur-xl" />

                        <Package2 size={32} className="text-blue-200 mb-4" />
                        <h3 className="text-xl font-bold">Store Data Sheet</h3>
                        <p className="text-blue-100 text-sm mt-2 mb-6">
                            Access master store records, inbound challans, and gate passes.
                        </p>

                        <button className="w-full py-3 bg-white text-[var(--primary)] hover:bg-blue-50 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg">
                            Open Store Ledger <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="card-uplift p-6">
                        <h4 className="font-bold text-slate-700 mb-4">Quick Indent</h4>
                        <div className="space-y-3">
                            {['63mm HDPE Pipe', '110mm HDPE Pipe', 'Sluice Valve 100mm'].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-[var(--secondary)] transition-colors cursor-pointer group">
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-[var(--primary)]">{item}</span>
                                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[var(--primary)] shadow-sm group-hover:scale-110 transition-transform">
                                        +
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
