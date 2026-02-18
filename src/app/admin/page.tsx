"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, ChevronDown, Search, Bell, User, Settings, Download } from "lucide-react";
import UPMapSVG from "@/components/landing/UPMapSVG";
import KeralaMapSVG from "@/components/landing/KeralaMapSVG";

// Navigation Components
import AdminNavigation, { ERP_TABS } from "@/components/admin/navigation/AdminNavigation";
import ModuleSidebar, { MODULE_SUB_MENUS } from "@/components/admin/navigation/ModuleSidebar";

// Imported Views
import SummaryView from "@/components/admin/views/SummaryView";
import WorkProgressView from "@/components/admin/views/WorkProgressView";
import MaterialView from "@/components/admin/views/MaterialView";
import ResourceView from "@/components/admin/views/ResourceView";
import FinanceView from "@/components/admin/views/FinanceView";
import DPRView from "@/components/admin/views/DPRView";
import EmployeeView from "@/components/admin/views/EmployeeView";
import IssueView from "@/components/admin/views/IssueView";

// Dummy Data
import { BRIGADE_DATA } from "@/lib/dummy-data";

export default function AdminDashboard() {
    const [isGridExpanded, setIsGridExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState("summary");
    const [activeSubMenu, setActiveSubMenu] = useState(0);

    const toggleGrid = () => setIsGridExpanded(!isGridExpanded);

    const renderContent = () => {
        // 1. OVERALL SUMMARY
        if (activeTab === "summary") {
            if (activeSubMenu === 0) return <SummaryView />; // Execution Summary (Default)
            if (activeSubMenu === 1) return <FinanceView />; // Financial Summary
            if (activeSubMenu === 2) return <div className="space-y-8"><MaterialView materialHealth={BRIGADE_DATA.materialHealth || []} /><ResourceView /></div>; // Store Summary
            return <SummaryView />;
        }

        // 2. SCHEME DATA
        if (activeTab === "scheme") {
            const schemeName = MODULE_SUB_MENUS['scheme'][activeSubMenu];
            return <WorkProgressView stats={BRIGADE_DATA.financials.stats} recentReports={[]} schemeName={schemeName} />;
        }

        // 3. STORE DATA
        if (activeTab === "store") {
            const storePage = MODULE_SUB_MENUS['store'][activeSubMenu];
            // Reuse MaterialView for now, potentially filter by Inward/Outward later
            return (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-800">{storePage} Overview</h3>
                    </div>
                    <MaterialView materialHealth={BRIGADE_DATA.materialHealth || []} />
                    <ResourceView />
                </div>
            );
        }

        // 4. BILLING DATA
        if (activeTab === "billing") {
            // Reuse FinanceView
            return <FinanceView />;
        }

        // 5. DPR SUMMARY
        if (activeTab === "dpr") return <DPRView subMenu={MODULE_SUB_MENUS['dpr'][activeSubMenu]} />;

        // 6. EMPLOYEE DATA
        if (activeTab === "employee") return <EmployeeView subMenu={MODULE_SUB_MENUS['employee'][activeSubMenu]} />;

        // 7. ISSUE REPORT
        if (activeTab === "issues") return <IssueView subMenu={MODULE_SUB_MENUS['issues'][activeSubMenu]} />;

        return <div className="text-slate-500 p-10 text-center font-mono">Module Loading...</div>;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-100 flex flex-col">

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 text-white p-2 rounded-lg font-black text-lg tracking-tighter shadow-lg shadow-slate-900/20">
                        KSPPL<span className="text-blue-400">.</span>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Project Management System</h1>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                                </span>
                                SYNC
                            </span>
                            Last synced few seconds ago
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 ring-blue-500/10 transition-all">
                        <Search size={16} className="text-slate-400" />
                        <input type="text" placeholder="Search projects..." className="bg-transparent border-none outline-none text-sm ml-2 w-48 placeholder:text-slate-400 font-medium" />
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

                {/* TOP SECTION: SUMMARY & MAP CARDS */}
                <motion.div
                    className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
                    animate={{
                        height: isGridExpanded ? "0px" : "auto",
                        opacity: isGridExpanded ? 0 : 1,
                        marginBottom: isGridExpanded ? 0 : 24,
                        paddingTop: isGridExpanded ? 0 : 24,
                        paddingBottom: isGridExpanded ? 0 : 24
                    }}
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
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: MAP CARDS */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* UP CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-80 relative group hover:shadow-lg transition-all hover:border-blue-300">
                            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Uttar Pradesh (JJM)
                            </div>
                            <div className="flex-1 relative bg-slate-50 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 flex items-end justify-center">
                                    <UPMapSVG />
                                </div>
                            </div>
                            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center relative z-20">
                                <button onClick={() => { setIsGridExpanded(true); setActiveTab('scheme'); }} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/10">
                                    View Details
                                </button>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* KERALA CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-80 relative group hover:shadow-lg transition-all hover:border-blue-300">
                            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Kerala (JJM)
                            </div>
                            <div className="flex-1 relative bg-slate-50 flex items-center justify-center overflow-hidden">
                                <KeralaMapSVG />
                            </div>
                            <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center relative z-20">
                                <button onClick={() => { setIsGridExpanded(true); setActiveTab('scheme'); }} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/10">
                                    View Details
                                </button>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* BOTTOM SECTION: EXPANDABLE TOOL GRID */}
                <motion.div
                    className="flex-1 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 flex flex-col rounded-t-3xl mx-0 md:mx-6 overflow-hidden relative"
                    initial={{ flexGrow: 0 }}
                    animate={{ flexGrow: isGridExpanded ? 1 : 0, minHeight: isGridExpanded ? "80vh" : "0px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Toggle Handle */}
                    <div
                        onClick={toggleGrid}
                        className="w-full h-6 bg-slate-50 border-b border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors sticky top-0 z-40"
                    >
                        <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
                    </div>

                    {/* NEW HORIZONTAL NAVIGATION TABS */}
                    <AdminNavigation
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onTabChange={() => { setIsGridExpanded(true); setActiveSubMenu(0); }}
                    />

                    {/* Content Area (Split View) */}
                    <div className="flex flex-1 overflow-hidden relative">

                        {/* NEW VERTICAL MODULE SIDEBAR */}
                        <ModuleSidebar
                            activeTab={activeTab}
                            activeSubMenu={activeSubMenu}
                            setActiveSubMenu={setActiveSubMenu}
                        />

                        {/* Main Grid Content */}
                        <div className="flex-1 bg-slate-50/50 p-6 md:p-8 overflow-y-auto">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <span className="text-blue-500">/</span>
                                        {ERP_TABS.find(t => t.id === activeTab)?.label}
                                        <span className="text-slate-400 font-light">|</span>
                                        <span className="text-slate-500 text-sm font-medium">
                                            {MODULE_SUB_MENUS[activeTab]?.[activeSubMenu] || "Dashboard"}
                                        </span>
                                    </h3>

                                    {/* Action Buttons */}
                                    {activeTab === 'summary' && (
                                        <div className="flex gap-3">
                                            <button className="px-4 py-2 border border-slate-200 bg-white text-slate-600 text-xs font-bold rounded hover:bg-slate-50 shadow-sm flex items-center gap-2">
                                                <Settings size={14} /> CONFIGURE BOARD
                                            </button>
                                            <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800 shadow-lg shadow-slate-900/10 flex items-center gap-2">
                                                <Download size={14} /> EXPORT VIEW
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {renderContent()}
                            </div>
                        </div>
                    </div>

                </motion.div>
            </main>
        </div>
    );
}
