"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
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
            // Kerala view not implemented yet — just highlight
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
        <div className="h-screen w-screen bg-[#0F172A] overflow-hidden flex flex-col relative text-white font-sans">

            {/* HEADER OVERLAY */}
            <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <h1 className="text-4xl font-black tracking-tighter mb-1">KSPPL<span className="text-sky-500">.</span></h1>
                    <p className="text-xs tracking-[0.3em] text-slate-400 font-bold uppercase">Infra-OS v2.0</p>
                </div>

                <div className="flex gap-4 pointer-events-auto">
                    <Link href="/field" className="px-4 py-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded text-xs font-bold hover:bg-emerald-600 hover:border-emerald-500 transition-all uppercase tracking-wider flex items-center gap-2">
                        Field Ops (Employee)
                    </Link>
                    <Link href="/admin" className="px-4 py-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded text-xs font-bold hover:bg-sky-600 hover:border-sky-500 transition-all uppercase tracking-wider flex items-center gap-2">
                        Central Command (Admin)
                    </Link>
                </div>
            </div>

            {/* BACK BUTTON */}
            {viewState !== "INDIA" && (
                <button
                    onClick={handleBack}
                    className="absolute top-20 left-6 z-50 flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-wider font-bold bg-slate-800/50 backdrop-blur border border-slate-700 rounded px-3 py-2"
                >
                    <ArrowLeft size={14} /> Back
                </button>
            )}

            {/* MAP CONTAINER */}
            <motion.div
                className="w-full relative shrink-0"
                initial={{ height: "100%" }}
                animate={{ height: viewState === "ETAH" ? "45%" : "100%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
                {/* Vignette Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_#0F172A_100%)] z-10" />

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
                            className="w-full h-full"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <EtahMap onBlockClick={(id) => console.log("Block clicked:", id)} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* UP Specific Interaction Hint */}
                {viewState === "UP" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                    >
                        <button
                            onClick={handleEtahClick}
                            className="flex items-center gap-3 px-6 py-3 bg-sky-600/20 hover:bg-sky-600/40 backdrop-blur border border-sky-500/50 rounded-lg text-sm font-bold text-sky-300 hover:text-white transition-all uppercase tracking-wider group"
                        >
                            <MapPin size={16} className="group-hover:animate-bounce" />
                            Enter Etah District
                            <ArrowLeft size={14} className="rotate-180" />
                        </button>
                    </motion.div>
                )}

                {/* Bottom Label */}
                {viewState === "INDIA" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-8 right-8 z-20 text-right"
                    >
                        <p className="text-xs text-slate-500 tracking-[0.2em] uppercase font-bold">Select a Region to Begin</p>
                        <p className="text-[10px] text-slate-600 mt-1">JJM Projects • Krishnasree Projects Pvt. Ltd.</p>
                    </motion.div>
                )}
            </motion.div>

            {/* DASHBOARD GRID — Slides up when ETAH is active */}
            <AnimatePresence>
                {viewState === "ETAH" && (
                    <motion.div
                        className="flex-1 overflow-hidden"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <DashboardGrid />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
