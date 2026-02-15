"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Activity } from "lucide-react";
import IndiaMap from "@/components/landing/IndiaMap";
import ProjectMap from "@/components/landing/ProjectMap";
import DashboardGrid from "@/components/landing/DashboardGrid";

type ViewState = "INDIA" | "UP" | "ETAH";

export default function LandingPage() {
    const [viewState, setViewState] = useState<ViewState>("INDIA");
    const [activeRegion, setActiveRegion] = useState<string | null>(null);

    const handleStateClick = (stateName: string) => {
        if (stateName === "Uttar Pradesh") {
            setViewState("UP");
            setActiveRegion("Uttar Pradesh");
        } else if (stateName === "Kerala") {
            setActiveRegion("Kerala");
        }
    };

    const handleEtahClick = () => {
        setViewState("ETAH");
    };

    const handleBack = () => {
        if (viewState === "ETAH") setViewState("UP");
        else if (viewState === "UP") {
            setViewState("INDIA");
            setActiveRegion(null);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#0F172A] overflow-hidden flex flex-col relative text-white font-sans selection:bg-sky-500/30">

            {/* HEADER OVERLAY (Logo, Nav) - Floating Glass */}
            <div className={`absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none transition-all duration-500`}>
                <div className="pointer-events-auto flex items-center gap-4 bg-slate-900/40 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-2xl">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter leading-none">KSPPL<span className="text-sky-500">.</span></h1>
                        <p className="text-[10px] tracking-[0.4em] text-slate-300 font-bold uppercase mt-1">Infra-OS Satellite</p>
                    </div>
                </div>

                <div className="flex gap-4 pointer-events-auto">
                    {/* Dynamic Context Headers based on View */}
                    <AnimatePresence mode="wait">
                        {viewState === "ETAH" && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="hidden md:flex items-center gap-6 mr-4 bg-slate-900/60 backdrop-blur-md px-6 py-2 rounded-xl border border-white/10"
                            >
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Active Zone</p>
                                    <p className="text-sm font-bold text-sky-400">Etah District, UP</p>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10"></div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">System Status</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10B981]" />
                                        <p className="text-sm font-bold text-emerald-400">Online</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Link href="/field" className="hidden sm:flex px-5 py-2.5 bg-slate-900/60 backdrop-blur border border-slate-700/50 hover:border-emerald-500/50 hover:bg-emerald-900/20 transition-all rounded-lg text-xs font-bold uppercase tracking-wider items-center gap-2 group shadow-xl">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:shadow-[0_0_8px_#10B981] transition-all" />
                        Field Ops
                    </Link>
                    <Link href="/admin" className="hidden sm:flex px-5 py-2.5 bg-slate-900/60 backdrop-blur border border-slate-700/50 hover:border-sky-500/50 hover:bg-sky-900/20 transition-all rounded-lg text-xs font-bold uppercase tracking-wider items-center gap-2 group shadow-xl">
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full group-hover:shadow-[0_0_8px_#0EA5E9] transition-all" />
                        Central Command
                    </Link>
                </div>
            </div>

            {/* BACK BUTTON - Floating */}
            <AnimatePresence>
                {viewState !== "INDIA" && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={handleBack}
                        className="absolute top-32 left-6 z-40 flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors uppercase tracking-wider font-bold bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3 hover:border-sky-500/50 pointer-events-auto shadow-2xl skew-x-[-10deg]"
                    >
                        <div className="skew-x-[10deg] flex items-center gap-2">
                            <ArrowLeft size={14} />
                            <span className="mt-0.5">Return to {viewState === "ETAH" ? "Uttar Pradesh" : "Global View"}</span>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* MAP CONTAINER - ALWAYS FULL SCREEN - UNIFIED */}
            <div className="absolute inset-0 z-0">
                <ProjectMap
                    viewState={viewState}
                    onStateClick={(state) => {
                        if (state === "ETAH_TRIGGER") handleEtahClick();
                        else handleStateClick(state);
                    }}
                    onBlockClick={(id) => console.log("Block:", id)}
                />
            </div>

            {/* UP SPECIFIC INTERACTION HINT - Floating */}
            <AnimatePresence>
                {viewState === "UP" && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30"
                    >
                        <button
                            onClick={handleEtahClick}
                            className="flex items-center gap-4 px-8 py-4 bg-sky-900/40 hover:bg-sky-600/30 backdrop-blur-xl border border-sky-500/50 rounded-2xl text-white transition-all group shadow-[0_0_40px_rgba(14,165,233,0.2)] hover:shadow-[0_0_60px_rgba(14,165,233,0.4)]"
                        >
                            <div className="relative">
                                <span className="absolute inset-0 bg-sky-400 rounded-full animate-ping opacity-75"></span>
                                <div className="bg-sky-500 p-2 rounded-full relative z-10">
                                    <MapPin size={20} className="text-white" />
                                </div>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-sky-300 uppercase font-bold tracking-wider">Target Acquired</p>
                                <p className="text-lg font-bold uppercase tracking-wide text-shadow-lg">Enter Etah Sector</p>
                            </div>
                            <ArrowLeft size={20} className="rotate-180 text-sky-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DASHBOARD GRID — FLOATING OVERLAY BOTTOM */}
            <motion.div
                className="absolute bottom-0 left-0 w-full z-20 overflow-hidden"
                initial={{ height: "0%" }}
                animate={{ height: viewState === "ETAH" ? "60%" : "0%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                {viewState === "ETAH" && (
                    <div className="h-full w-full max-w-[95%] mx-auto pb-6">
                        <DashboardGrid />
                    </div>
                )}
            </motion.div>
        </div>
    );
}
