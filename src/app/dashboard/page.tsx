"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, FileText, Database, Receipt, ChevronDown, ChevronUp, Search, Bell, Menu, User } from "lucide-react";
import ProjectMap from "@/components/landing/ProjectMap";
import DashboardGrid from "@/components/landing/DashboardGrid"; // Resusing logic, but might need styling tweaks

// Redefining Dashboard Grid Logic locally to fit the new Light Theme & Layout
// or better, wrapping DashboardGrid in a light theme container?
// DashboardGrid has hardcoded styles. I should probably clone/modify it for the Light Theme or make it accept a theme prop.
// For now, I'll build a custom Light Grid here to match the specific requirement.

const TABS = [
    { id: "summary", label: "Overall Summary", icon: LayoutGrid },
    { id: "scheme", label: "Scheme Wise", icon: FileText },
    { id: "store", label: "Store Data", icon: Database },
    { id: "billing", label: "Billing Data", icon: Receipt },
];

const SUB_MENUS = {
    summary: ["Dashboard 1", "Dashboard 2", "Dashboard 3", "Dashboard 4"],
    scheme: ["Block 1", "Block 2", "Block 3", "Block 4"],
    store: ["Inventory", "Inwards", "Outwards", "Stock"],
    billing: ["Pending", "Approved", "Paid", "Disputed"]
} as any;

export default function DashboardPage() {
    const [isGridExpanded, setIsGridExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState("summary");
    const [activeSubMenu, setActiveSubMenu] = useState(0);

    const toggleGrid = () => setIsGridExpanded(!isGridExpanded);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-100 flex flex-col">

            {/* HEADER - CLEAN & PROFESSIONAL */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 text-white p-2 rounded-lg font-black text-lg tracking-tighter shadow-lg shadow-slate-900/20">
                        KSPPL<span className="text-blue-400">.</span>
                    </div>
                    <h1 className="text-lg font-bold text-slate-700 hidden sm:block">Project Management System</h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 ring-blue-500/10 transition-all">
                        <Search size={16} className="text-slate-400" />
                        <input type="text" placeholder="Search projects..." className="bg-transparent border-none outline-none text-sm ml-2 w-48 placeholder:text-slate-400" />
                    </div>
                    <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-700">Admin User</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Central Command</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 border border-slate-300">
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative overflow-hidden flex flex-col">

                {/* TOP SECTION: SUMMARY & MAP CARDS (Collapses when Grid Expands) */}
                <motion.div
                    className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
                    animate={{ height: isGridExpanded ? "0px" : "auto", opacity: isGridExpanded ? 0 : 1, marginBottom: isGridExpanded ? 0 : 24 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ overflow: 'hidden' }}
                >
                    {/* LEFT: WORK SUMMARY */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <LayoutGrid size={20} className="text-blue-500" />
                                Work Summary
                            </h2>
                            <div className="space-y-3">
                                <details className="group border border-slate-100 rounded-lg open:bg-slate-50 open:border-blue-100 transition-colors" open>
                                    <summary className="flex items-center justify-between p-3 cursor-pointer font-bold text-sm text-slate-600 group-open:text-blue-600 select-none">
                                        Active Sites
                                        <ChevronDown size={16} className="group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-3 pb-3 text-xs text-slate-500 leading-relaxed">
                                        Currently operating 8 blocks in Etah district and 1 major zone in Kochi.
                                        <div className="mt-2 flex gap-2">
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">85% On Track</span>
                                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">2 Alerts</span>
                                        </div>
                                    </div>
                                </details>
                                <details className="group border border-slate-100 rounded-lg open:bg-slate-50 open:border-blue-100 transition-colors">
                                    <summary className="flex items-center justify-between p-3 cursor-pointer font-bold text-sm text-slate-600 group-open:text-blue-600 select-none">
                                        Financial Overview
                                        <ChevronDown size={16} className="group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-3 pb-3 text-xs text-slate-500 leading-relaxed">
                                        Detailed billing breakdown available in the Billing Data tab.
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: MAP CARDS */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* UP CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-80 relative group hover:shadow-lg transition-all hover:border-blue-300">
                            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
                                Uttar Pradesh (JJM)
                            </div>
                            <div className="flex-1 relative bg-slate-100">
                                <ProjectMap viewState="UP" theme="light" interactive={false} />
                            </div>
                            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                                    <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active Execution
                                    </p>
                                </div>
                                <button onClick={() => { setIsGridExpanded(true); setActiveTab('scheme'); }} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* KERALA CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-80 relative group hover:shadow-lg transition-all hover:border-blue-300">
                            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
                                Kerala (JJM)
                            </div>
                            <div className="flex-1 relative bg-slate-100">
                                <ProjectMap viewState="KERALA" theme="light" interactive={false} />
                            </div>
                            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                                    <p className="text-sm font-bold text-blue-600 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Planning Phase
                                    </p>
                                </div>
                                <button onClick={() => { setIsGridExpanded(true); setActiveTab('scheme'); }} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>


                {/* BOTTOM SECTION: EXPANDABLE TOOL GRID */}
                <motion.div
                    className="flex-1 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 flex flex-col rounded-t-3xl mx-2 md:mx-6 overflow-hidden relative"
                    initial={{ flexGrow: 0 }}
                    animate={{ flexGrow: isGridExpanded ? 1 : 0, minHeight: isGridExpanded ? "80vh" : "300px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Toggle Handle */}
                    <div
                        onClick={toggleGrid}
                        className="w-full h-6 bg-slate-50 border-b border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                        <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
                    </div>

                    {/* Horizontal Tabs */}
                    <div className="flex border-b border-slate-200 overflow-x-auto bg-white sticky top-0 z-30">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setIsGridExpanded(true); }}
                                    className={`flex-1 min-w-[150px] py-4 flex flex-col items-center justify-center gap-2 border-r border-slate-100 relative transition-all
                                        ${isActive ? "bg-slate-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
                                    `}
                                >
                                    <Icon size={20} className={isActive ? "text-blue-600" : "text-slate-400"} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{tab.label}</span>
                                    {isActive && <div className="absolute bottom-0 w-full h-1 bg-blue-600"></div>}
                                </button>
                            )
                        })}
                    </div>

                    {/* Content Area (Split View) */}
                    <div className="flex flex-1 overflow-hidden relative">
                        {/* Sidebar */}
                        <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto py-4">
                            {SUB_MENUS[activeTab].map((item: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveSubMenu(idx)}
                                    className={`w-full text-left px-6 py-3 text-sm font-medium border-l-4 transition-all
                                        ${activeSubMenu === idx
                                            ? "border-blue-500 bg-white text-blue-700 shadow-sm"
                                            : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700"}
                                    `}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        {/* Main Grid Content */}
                        <div className="flex-1 bg-slate-50/50 p-8 overflow-y-auto">
                            <div className="max-w-6xl mx-auto">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="text-blue-500">/</span> {activeTab === 'summary' ? "Dashboard Overview" : SUB_MENUS[activeTab][activeSubMenu]}
                                </h3>

                                {/* Placeholder Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <Database size={20} />
                                                </div>
                                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">Normal</span>
                                            </div>
                                            <p className="text-slate-500 text-xs uppercase font-bold mb-1">Metric {i}</p>
                                            <p className="text-2xl font-black text-slate-800">2,45{i}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </motion.div>

            </main>
        </div>
    );
}
