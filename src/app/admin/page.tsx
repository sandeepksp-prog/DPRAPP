"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search, Bell, User, Settings, Download } from "lucide-react";
import UPMapSVG from "@/components/landing/UPMapSVG";
import KeralaMapSVG from "@/components/landing/KeralaMapSVG";
import CinematicBanner from "@/components/ui/CinematicBanner";

// Navigation Components
import AdminNavigation, { ERP_TABS } from "@/components/admin/navigation/AdminNavigation";
import ModuleSidebar, { MODULE_SUB_MENUS } from "@/components/admin/navigation/ModuleSidebar";

// Imported Views
import SummaryView from "@/components/admin/views/SummaryView";
import WorkProgressView from "@/components/admin/views/WorkProgressView";
import StoreView from "@/components/admin/views/StoreView";
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
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
        console.log("Admin Dashboard v2.2 - Controlled Scroll Active");
    }, []);

    const toggleGrid = () => setIsGridExpanded(!isGridExpanded);

    const renderContent = () => {
        // 1. OVERALL SUMMARY
        if (activeTab === "summary") {
            if (activeSubMenu === 0) return <SummaryView />; // Execution Summary (Default)
            if (activeSubMenu === 1) return <FinanceView />; // Financial Summary
            if (activeSubMenu === 2) return <StoreView />; // Store Summary
            return <SummaryView />;
        }

        // 2. SCHEME DATA
        if (activeTab === "scheme") {
            const schemeName = MODULE_SUB_MENUS['scheme'][activeSubMenu]?.label;
            return <WorkProgressView stats={BRIGADE_DATA.financials.stats} recentReports={[]} schemeName={schemeName} />;
        }

        // 3. STORE DATA
        if (activeTab === "store") {
            const storePage = MODULE_SUB_MENUS['store'][activeSubMenu]?.label;
            // Reuse MaterialView for now, potentially filter by Inward/Outward later
            return (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-800">{storePage} Overview</h3>
                    </div>
                    <StoreView />
                </div>
            );
        }

        // 4. BILLING DATA
        if (activeTab === "billing") {
            // Reuse FinanceView
            return <FinanceView />;
        }

        // 5. DPR SUMMARY
        if (activeTab === "dpr") return <DPRView subMenu={MODULE_SUB_MENUS['dpr'][activeSubMenu]?.label} />;

        // 6. EMPLOYEE DATA
        if (activeTab === "employee") return <EmployeeView subMenu={MODULE_SUB_MENUS['employee'][activeSubMenu]?.label} />;

        // 7. ISSUE REPORT
        if (activeTab === "issues") return <IssueView subMenu={MODULE_SUB_MENUS['issues'][activeSubMenu]?.label} />;

        return <div className="text-slate-500 p-10 text-center font-mono">Module Loading...</div>;
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800 selection:bg-blue-100 flex flex-col overflow-visible">

            {/* HEADER (Restored - Clean) */}
            {/* HEADER (New Age - Gradient) */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
                    {/* BRAND */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/logo.png"
                            alt="KSPPL Logo"
                            className="h-10 w-auto object-contain"
                        />
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight hidden md:block border-l-2 border-slate-200 pl-4">
                            Project Management System
                        </h1>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search modules..."
                                className="bg-slate-100 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/30 focus:bg-white focus:ring-2 focus:ring-blue-500/20 w-64 transition-all"
                            />
                        </div>
                        <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-bold text-slate-800 leading-none">Admin User</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:bg-white hover:text-blue-600 transition-colors cursor-pointer">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col z-20 overflow-visible">

                {/* TOP SECTION: HERO BACKGROUND & CARDS */}
                <motion.div
                    className="relative overflow-hidden border-b border-slate-900/10 shadow-lg bg-[#0f172a]"
                    animate={{
                        height: isGridExpanded ? "auto" : "0px",
                        opacity: isGridExpanded ? 1 : 0,
                        paddingTop: isGridExpanded ? 32 : 0,
                        paddingBottom: isGridExpanded ? 32 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <CinematicBanner>
                        <div className="w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* LEFT: TEXT CONTENT */}
                            <div className="lg:col-span-4 flex flex-col justify-center py-8">
                                <div className="pl-4 border-l-4 border-cyan-400">
                                    <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-2 tracking-tight">
                                        JAL JEEVAN MISSION
                                    </h2>
                                    <h3 className="text-xl lg:text-2xl font-bold text-slate-300 tracking-widest uppercase">
                                        COMPANY WORKING
                                    </h3>
                                    <div className="mt-6 flex items-center gap-4">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur rounded border border-white/20 text-xs text-white font-mono">
                                            STATUS: ACTIVE
                                        </div>
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur rounded border border-white/20 text-xs text-white font-mono">
                                            ZONES: 2
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: MAP CARDS */}
                            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* UP CARD */}
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden flex flex-col h-72 relative group transition-all hover:scale-[1.02] duration-300">
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
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden flex flex-col h-72 relative group transition-all hover:scale-[1.02] duration-300">
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
                        </div>
                    </CinematicBanner>
                </motion.div>

                {/* BOTTOM SECTION: STICKY TOOL GRID */}
                <div className="flex-1 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-30 flex flex-col mx-0 overflow-visible">

                    {/* UNIFIED STICKY SECONDARY HEADER: TOGGLE + TABS + BREADCRUMB */}
                    <div className="sticky top-16 z-40 bg-white w-full shadow-md border-b border-slate-200">
                        {/* 1. Toggle Handle (The "Scroll Button") */}
                        <div
                            onClick={toggleGrid}
                            className="w-full h-7 bg-slate-50 border-b border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors group"
                            title={isGridExpanded ? "Collapse Banner" : "Expand Banner"}
                        >
                            <div className={`w-14 h-1 rounded-full transition-all duration-300 ${isGridExpanded ? 'bg-blue-400 w-20' : 'bg-slate-400 group-hover:bg-blue-400'}`}></div>
                        </div>

                        {/* 2. Horizontal Navigation Tabs */}
                        <div className="bg-white">
                            <AdminNavigation
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                onTabChange={() => {
                                    setIsGridExpanded(false); // REQUIREMENT: Collapse banner on interaction
                                    setActiveSubMenu(0);
                                }}
                            />
                        </div>


                    </div>

                    {/* Content Area (Split View) */}
                    <div className="flex flex-1 min-h-screen">

                        {/* NEW VERTICAL MODULE SIDEBAR */}
                        {/* SIDEBAR: Sticky relative to the high-stacked header */}
                        <div className="sticky top-[144px] self-start h-[calc(100vh-144px)] overflow-y-auto">
                            <ModuleSidebar
                                activeTab={activeTab}
                                activeSubMenu={activeSubMenu}
                                setActiveSubMenu={setActiveSubMenu}
                            />
                        </div>

                        {/* Main Grid Content */}
                        <div className="flex-1 bg-slate-50/50 p-6 md:p-8">
                            <div className="max-w-7xl mx-auto">
                                {renderContent()}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
