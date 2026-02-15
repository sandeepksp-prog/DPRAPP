"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Activity } from "lucide-react";
import IndiaMap from "@/components/landing/IndiaMap";
import EtahMap from "@/components/landing/EtahMap";
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

            {/* HEADER OVERLAY (Logo, Nav) */}
            <div className={`absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none transition-all duration-500 ${viewState === 'ETAH' ? 'bg-[#0F172A] border-b border-slate-800 py-4' : ''}`}>
                <div className="pointer-events-auto flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter leading-none">KSPPL<span className="text-sky-500">.</span></h1>
                        <p className="text-[10px] tracking-[0.4em] text-slate-400 font-bold uppercase mt-1">Infra-OS Satellite</p>
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
                                className="hidden md:flex items-center gap-6 mr-12 border-r border-slate-700 pr-12"
                            >
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Active Zone</p>
                                    <p className="text-sm font-bold text-sky-400">Etah District, UP</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">System Status</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <p className="text-sm font-bold text-emerald-400">Online</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Link href="/field" className="hidden sm:flex px-5 py-2.5 bg-slate-900 border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all rounded text-xs font-bold uppercase tracking-wider items-center gap-2 group">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:shadow-[0_0_8px_#10B981] transition-all" />
                        Field Ops
                    </Link>
                    <Link href="/admin" className="hidden sm:flex px-5 py-2.5 bg-slate-900 border border-slate-700 hover:border-sky-500/50 hover:bg-sky-900/10 transition-all rounded text-xs font-bold uppercase tracking-wider items-center gap-2 group">
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full group-hover:shadow-[0_0_8px_#0EA5E9] transition-all" />
                        Central Command
                    </Link>
                </div>
            </div>

            {/* BACK BUTTON */}
            <AnimatePresence>
                {viewState !== "INDIA" && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={handleBack}
                        className="absolute top-24 left-6 z-40 flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-wider font-bold bg-slate-900/80 backdrop-blur border border-slate-700 rounded px-4 py-2 hover:border-slate-500 pointer-events-auto"
                    >
                        <ArrowLeft size={14} />
                        <span className="mt-0.5">Return to {viewState === "ETAH" ? "Uttar Pradesh" : "India View"}</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* MAP CONTAINER (Morphs height) */}
            <motion.div
                className="w-full relative shadow-2xl z-0"
                initial={{ height: "100%" }}
                animate={{ height: viewState === "ETAH" ? "45%" : "100%" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // smooth exponential
            >
                {/* Vignette Overlay (Only active in full map mode) */}
                <motion.div
                    animate={{ opacity: viewState === "ETAH" ? 0 : 1 }}
                    className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_#0F172A_100%)] z-10"
                />

                <AnimatePresence mode="wait">
                    {viewState !== "ETAH" ? (
                        <motion.div
                            key="india-map"
                            className="w-full h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <IndiaMap onStateClick={handleStateClick} activeState={activeRegion} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="etah-map"
                            className="w-full h-full bg-[#0B1120]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Etah Map gets a subtle BG change to distinguish it */}
                            <EtahMap onBlockClick={(id) => console.log("Block clicked:", id)} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* UP Specific Interaction Hint */}
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
                                className="flex items-center gap-4 px-8 py-4 bg-sky-600/10 hover:bg-sky-600/30 backdrop-blur-md border border-sky-500 rounded-lg text-white transition-all group shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.5)]"
                            >
                                <div className="relative">
                                    <span className="absolute inset-0 bg-sky-400 rounded-full animate-ping opacity-75"></span>
                                    <div className="bg-sky-500 p-2 rounded-full relative z-10">
                                        <MapPin size={20} className="text-white" />
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-sky-300 uppercase font-bold tracking-wider">Active Sector Found</p>
                                    <p className="text-lg font-bold uppercasetracking-wide">Enter Etah District</p>
                                </div>
                                <ArrowLeft size={20} className="rotate-180 text-sky-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* DASHBOARD GRID — Slides up below map */}
            <motion.div
                className="w-full bg-[#0F172A] relative z-20 flex-1 overflow-hidden"
                initial={{ y: "100%" }}
                animate={{ y: viewState === "ETAH" ? "0%" : "100%" }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
                {viewState === "ETAH" && <DashboardGrid />}
            </motion.div>
        </div>
    );
}
