'use client';

import React, { useState, useEffect } from 'react';
import { Package2, Users, AlertTriangle, Activity, CheckCircle2, Factory, TrendingDown, Clock, ShieldAlert } from 'lucide-react';

export default function StoreView() {
    const [materialData, setMaterialData] = useState<any[]>([]);
    const [subContractors, setSubContractors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://kspl-pmx-default-rtdb.firebaseio.com";
                const res = await fetch(`${dbUrl}/store.json`);
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        if (data.inventory) {
                            const invArray = Object.entries(data.inventory).map(([code, item]: any) => ({ code, ...item }));
                            setMaterialData(invArray);
                        }
                        if (data.subcontractors) {
                            const subArray = Object.entries(data.subcontractors).map(([wo, item]: any) => ({ wo, ...item }));
                            setSubContractors(subArray);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch store data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStoreData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[600px] w-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-sm font-bold text-slate-500 tracking-widest uppercase animate-pulse">Syncing Store Matrix...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mb-12">

            {/* TIER 1: STRATEGIC HERO HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Inventory Value */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Package2 size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">TOTAL INVENTORY VALUE</p>
                        <h2 className="text-3xl font-black text-slate-800">₹4.85<span className="text-lg text-slate-500 font-bold ml-1">Cr</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-2">Pipes, Fittings & Civil Mat.</p>
                    </div>
                </div>

                {/* Critical Shortages */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">CRITICAL SHORTAGES</p>
                        <h2 className="text-3xl font-black text-rose-600">12<span className="text-lg text-slate-500 font-bold ml-1">Items</span></h2>
                        <p className="text-xs font-bold text-rose-500 mt-2">Below Minimum Stock Level</p>
                    </div>
                </div>

                {/* Consumption Velocity */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                            <TrendingDown size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">CONSUMPTION VELOCITY</p>
                        <h2 className="text-3xl font-black text-slate-800">1.2<span className="text-lg text-slate-500 font-bold ml-1">km/day</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-2">Avg. HDPE Pipe Burn Rate</p>
                    </div>
                </div>

                {/* Peak Manpower */}
                <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded-2xl p-6 shadow-lg border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-slate-800/80 text-indigo-400 rounded-xl border border-slate-700">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">ACTIVE DEPLOYMENT</p>
                        <h2 className="text-3xl font-black text-white">424<span className="text-lg text-slate-400 font-bold ml-1">Personnel</span></h2>
                        <p className="text-xs font-bold text-emerald-400 mt-2">92% Daily Attendance</p>
                    </div>
                </div>
            </div>

            {/* TIER 2 & 3: MATERIAL MATRIX & SUB-CONTRACTOR FEED */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Material Status Matrix (8 cols) */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[550px]">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Package2 size={18} className="text-blue-600" />
                            Material Status Matrix
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">SCOPE VS STOCK</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                    <th className="py-3 px-4">Material Details</th>
                                    <th className="py-3 px-4">Total Scope</th>
                                    <th className="py-3 px-4">Consumption Burn</th>
                                    <th className="py-3 px-4 text-right">In Stock (Balance)</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-slate-700">
                                {materialData.map((mat, idx) => {
                                    const percentConsumed = Math.min(100, (mat.consumed / mat.required) * 100);

                                    return (
                                        <tr key={idx} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors group">
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-800">{mat.desc}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{mat.code}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-bold text-slate-600">{mat.required.toLocaleString()} {mat.unit}</span>
                                            </td>
                                            <td className="py-3 px-4 w-1/3">
                                                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                                    <span>{mat.consumed.toLocaleString()} {mat.unit}</span>
                                                    <span>{percentConsumed.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${percentConsumed}%` }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-black ${mat.status === 'Critical' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                                                        mat.status === 'Reorder' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                                            'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                    }`}>
                                                    {mat.stock.toLocaleString()} {mat.unit}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Sub-Contractor Deployment Feed (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[550px]">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Users size={18} className="text-indigo-600" />
                            Agency Deployment Feed
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20 custom-scrollbar">
                        <div className="space-y-3">
                            {subContractors.map((agency, idx) => {
                                const deploymentRate = (agency.deployed / agency.manpower) * 100;

                                return (
                                    <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-indigo-200 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase">{agency.name}</h4>
                                                <p className="text-xs font-bold text-slate-400 mt-0.5">{agency.wo} • {agency.role}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                                <span className="uppercase tracking-wider">Manpower Deployed</span>
                                                <span className="text-slate-700">{agency.deployed} / {agency.manpower}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${deploymentRate < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${deploymentRate}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded flex items-center gap-1 ${agency.safety >= 90 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                {agency.safety >= 90 ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                                                Safety Score: {agency.safety}/100
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
