"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BarChart2, DollarSign, Package, PieChart, Activity, Droplets, Truck, Users } from "lucide-react";
import { LANDING_DATA } from "@/lib/landing-data";

// Types
type TabType = "SUMMARY" | "SCHEME" | "STORE" | "BILLING";

const TABS: { id: TabType; label: string; icon: any }[] = [
    { id: "SUMMARY", label: "OVERALL SUMMARY", icon: PieChart },
    { id: "SCHEME", label: "SCHEME WISE", icon: BarChart2 },
    { id: "STORE", label: "STORE DATA", icon: Package },
    { id: "BILLING", label: "BILLING DATA", icon: DollarSign },
];

const SUB_MENUS: Record<TabType, string[]> = {
    SUMMARY: ["Overview", "Financials", "Manpower", "Machinery"],
    SCHEME: ["Shitalpur", "Sakit", "Nidhauli Kalan", "Awagarh", "Jalesar", "Marehra", "Jaithara", "Aliganj"],
    STORE: ["Inventory", "Stock In", "Stock Out", "Requests"],
    BILLING: ["Invoices", "Payments", "Pending", "History"],
};

export default function DashboardGrid() {
    const [activeTab, setActiveTab] = useState<TabType>("SUMMARY");
    const [activeSubMenu, setActiveSubMenu] = useState(0);

    const renderContent = () => {
        switch (activeTab) {
            case "SUMMARY":
                return (
                    <>
                        {LANDING_DATA.stats.map((stat, i) => (
                            <div key={i} className="bg-slate-900 border border-slate-700 rounded-lg p-5 hover:border-sky-500/50 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-sky-500 font-bold group-hover:bg-sky-500/20 transition-colors">
                                        <Activity size={20} />
                                    </div>
                                    <span className={`text-xs font-mono font-bold ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-400 mb-1">{stat.label}</h3>
                                <p className="text-2xl font-black text-white">{stat.value}</p>
                            </div>
                        ))}
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-5 col-span-1 md:col-span-2">
                            <h3 className="text-sm font-bold text-slate-400 mb-4">Scheme Status Breakdown</h3>
                            <div className="flex gap-4 items-end h-32">
                                {['Completed', 'In Progress', 'Not Started'].map((status, i) => {
                                    const val = status === 'Completed' ? LANDING_DATA.overall.completed :
                                        status === 'In Progress' ? LANDING_DATA.overall.inProgress :
                                            LANDING_DATA.overall.notStarted;
                                    const total = LANDING_DATA.overall.totalSchemes;
                                    const height = (val / total) * 100;
                                    const color = status === 'Completed' ? 'bg-emerald-500' : status === 'In Progress' ? 'bg-sky-500' : 'bg-slate-600';

                                    return (
                                        <div key={status} className="flex-1 flex flex-col justify-end gap-2 group">
                                            <div className="text-xs text-center text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">{val}</div>
                                            <div className={`w-full rounded-t ${color} transition-all duration-500`} style={{ height: `${height}%` }} />
                                            <div className="text-[10px] text-center text-slate-500 uppercase font-bold tracking-wider">{status}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                );
            case "SCHEME":
                // Filter schemes based on selected block (sub-menu)
                const selectedBlock = SUB_MENUS.SCHEME[activeSubMenu];
                const filteredSchemes = LANDING_DATA.schemes.filter(s => s.block === selectedBlock || activeSubMenu === -1); // -1 for all if needed, currently filtering by sub-menu index
                // Wait, random data for blocks not in dummy data? 
                // I'll show dummy schemes if none found for specific block to keep it populated
                const schemesToShow = filteredSchemes.length > 0 ? filteredSchemes : LANDING_DATA.schemes;

                return (
                    <>
                        {schemesToShow.map((scheme, i) => (
                            <div key={scheme.id} className="bg-slate-900 border border-slate-700 rounded-lg p-5 hover:border-emerald-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{scheme.type}</div>
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${scheme.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                            scheme.status === 'In Progress' ? 'bg-sky-500/10 text-sky-400' : 'bg-slate-700 text-slate-400'
                                        }`}>{scheme.status}</div>
                                </div>
                                <h3 className="text-sm font-bold text-white mb-1">{scheme.name}</h3>
                                <p className="text-xs text-slate-500 mb-4">{scheme.block} Block</p>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Progress</span>
                                        <span>{scheme.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div className={`h-full ${scheme.progress === 100 ? 'bg-emerald-500' : 'bg-sky-500'} transition-all duration-1000`} style={{ width: `${scheme.progress}%` }} />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs">
                                    <span className="text-slate-500">Est. Cost</span>
                                    <span className="text-slate-200">₹{scheme.cost} Cr</span>
                                </div>
                            </div>
                        ))}
                    </>
                );
            case "STORE":
                return (
                    <>
                        {LANDING_DATA.store.inventory.map((item, i) => (
                            <div key={i} className="bg-slate-900 border border-slate-700 rounded-lg p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                    <Package size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-white">{item.item}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xl font-bold text-sky-400">{item.stock} <span className="text-xs text-slate-500">{item.unit}</span></span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${item.status === 'Critical' ? 'bg-rose-500/10 text-rose-400' :
                                                item.status === 'Low' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                                            }`}>{item.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                );
            case "BILLING":
                return (
                    <>
                        {LANDING_DATA.billing.invoices.map((inv, i) => (
                            <div key={inv.id} className="bg-slate-900 border border-slate-700 rounded-lg p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-emerald-500 font-bold">
                                        <DollarSign size={20} />
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">{inv.id}</span>
                                </div>
                                <h3 className="text-sm font-bold text-white mb-1">{inv.vendor}</h3>
                                <p className="text-xl font-bold text-emerald-400 mb-1">₹{inv.amount} L</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xs text-slate-500">{inv.date}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                                            inv.status === 'Processing' ? 'bg-sky-500/10 text-sky-400' : 'bg-emerald-500/10 text-emerald-400'
                                        }`}>{inv.status}</span>
                                </div>
                            </div>
                        ))}
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <div className="w-full h-full flex flex-col bg-slate-900/90 backdrop-blur-md border-t border-slate-700 text-slate-100 overflow-hidden">
            {/* HORIZONTAL TABS */}
            <div className="flex items-center justify-center border-b border-slate-700 bg-slate-900/50">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setActiveSubMenu(0);
                            }}
                            className={`flex-1 py-4 flex flex-col items-center gap-2 transition-all relative group ${isActive ? "text-sky-400" : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <Icon size={20} className={`transition-transform ${isActive ? "scale-110" : ""}`} />
                            <span className="text-xs font-bold tracking-widest">{tab.label}</span>

                            {/* Active Indicator Line */}
                            {isActive && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute bottom-0 w-full h-1 bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex flex-1 overflow-hidden">
                {/* LEFT: VERTICAL SUB-MENU */}
                <div className="w-64 border-r border-slate-700 bg-slate-900/30 flex flex-col pt-4">
                    <div className="px-6 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                        {activeTab === 'SCHEME' ? 'SELECT BLOCK' : 'MENU'}
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-0.5 px-2">
                        {SUB_MENUS[activeTab].map((item, idx) => {
                            const isActive = activeSubMenu === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveSubMenu(idx)}
                                    className={`w-full text-left px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${isActive
                                        ? "bg-sky-500/10 text-sky-400 border-l-2 border-sky-500"
                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border-l-2 border-transparent"
                                        }`}
                                >
                                    <span>{item}</span>
                                    {isActive && <ArrowRight size={12} />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: DATA GRID */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-950/50">
                    <motion.div
                        key={`${activeTab}-${activeSubMenu}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {renderContent()}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
