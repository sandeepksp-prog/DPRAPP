"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, PieChart, BarChart2, Package, DollarSign, Activity } from "lucide-react";
import { LANDING_DATA } from "@/lib/landing-data";

// Type definitions
type TabType = "SUMMARY" | "SCHEME" | "STORE" | "BILLING";

const TABS: { id: TabType; label: string; icon: any }[] = [
    { id: "SUMMARY", label: "OVERALL SUMMARY", icon: PieChart },
    { id: "SCHEME", label: "SCHEME WISE", icon: BarChart2 },
    { id: "STORE", label: "STORE DATA", icon: Package },
    { id: "BILLING", label: "BILLING DATA", icon: DollarSign },
];

const SUB_MENUS: Record<TabType, string[]> = {
    SUMMARY: ["Dashboard 1", "Dashboard 2", "Dashboard 3"],
    SCHEME: ["Block 1 (Shitalpur)", "Block 2 (Sakit)", "Block 3 (Nidhauli)", "Block 4 (Awagarh)"],
    STORE: ["Inventory", "Requests", "Returns"],
    BILLING: ["Invoices", "Payments", "Pending"],
};

export default function DashboardGrid() {
    const [activeTab, setActiveTab] = useState<TabType>("SUMMARY");
    const [activeSubMenu, setActiveSubMenu] = useState(0);

    // Dummy content renderer based on active tab
    const renderContent = () => {
        // ... (Keep existing logic but adapted for generic sub-menus if needed)
        // For now, mapping real data to these generic "Dashboard 1" labels

        if (activeTab === "SUMMARY") {
            return (
                <>
                    {LANDING_DATA.stats.map((stat, i) => (
                        <div key={i} className="bg-slate-900/80 border border-slate-700/50 p-5 rounded-sm hover:border-sky-500/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rounded-bl-full pointer-events-none" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-sky-500 font-bold group-hover:text-sky-400 transition-colors">
                                    <Activity size={18} />
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</h3>
                            <p className="text-2xl font-black text-white font-mono">{stat.value}</p>
                        </div>
                    ))}
                </>
            );
        }

        if (activeTab === "SCHEME") {
            return LANDING_DATA.schemes.map((scheme) => (
                <div key={scheme.id} className="bg-slate-900/80 border border-slate-700/50 p-5 rounded-sm hover:border-emerald-500/50 transition-colors">
                    <div className="flex justify-between mb-2">
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-bold">{scheme.id}</span>
                        <span className={`text-[10px] font-bold uppercase ${scheme.status === 'Completed' ? 'text-emerald-400' : 'text-sky-400'}`}>{scheme.status}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{scheme.name}</h3>
                    <div className="w-full bg-slate-800 h-1 mt-2">
                        <div className="bg-sky-500 h-1 transition-all duration-1000" style={{ width: `${scheme.progress}%` }} />
                    </div>
                </div>
            ));
        }

        return <div className="text-slate-500 p-10 text-center font-mono">Data Module Loading...</div>;
    }

    return (
        <div className="w-full h-full flex flex-col bg-[#0F172A] border-t border-slate-800 text-slate-100 relative z-40">
            {/* TOP: HORIZONTAL EQUIDISTANT TABS */}
            <div className="flex items-center border-b border-slate-800 bg-[#0F172A] relative">
                {TABS.map((tab, index) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setActiveSubMenu(0); }}
                            className={`flex-1 py-5 flex items-center justify-center gap-2 transition-all relative group
                                ${isActive ? "bg-slate-900" : "hover:bg-slate-900/50"}
                            `}
                        >
                            <Icon size={16} className={isActive ? "text-sky-500" : "text-slate-600"} />
                            <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? "text-white" : "text-slate-500"}`}>
                                {tab.label}
                            </span>

                            {/* The "Reflection" Line Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-tab-indicator"
                                    className="absolute bottom-0 w-full h-[2px] bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.8)]"
                                />
                            )}

                            {/* Vertical Connector (The "Line" logic) */}
                            {isActive && (
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-20px] w-[1px] h-[20px] bg-sky-500/50 z-50"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* MAIN SPLIT VIEW */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Visual Connector Line from Top to Side */}
                <div className="absolute top-0 left-[25%] bottom-0 w-[1px] bg-slate-800 z-0"></div>

                {/* LEFT: VERTICAL SUB-MENU */}
                <div className="w-1/4 bg-[#0F172A] flex flex-col py-6 relative z-10">
                    {/* The "Vertical Line Reflection" effect */}
                    <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-[1px] h-6 bg-gradient-to-b from-sky-500 to-transparent opacity-50"></div>

                    <div className="flex-1 space-y-1">
                        {SUB_MENUS[activeTab].map((item, idx) => {
                            const isActive = activeSubMenu === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveSubMenu(idx)}
                                    className={`w-full text-right pr-8 py-4 text-xs font-bold uppercase tracking-wider transition-all relative
                                        ${isActive ? "text-sky-400" : "text-slate-500 hover:text-slate-300"}
                                    `}
                                >
                                    {item}
                                    {/* Active Sidebar Indicator dot */}
                                    {isActive && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-500 rounded-l-md shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: CONTENT GRID */}
                <div className="flex-1 bg-slate-900/30 p-8 overflow-y-auto">
                    <motion.div
                        key={`${activeTab}-${activeSubMenu}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {renderContent()}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
