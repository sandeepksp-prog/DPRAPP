"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IndiaMap from "@/components/landing/IndiaMap";
import EtahMap from "@/components/landing/EtahMap";
import DashboardGrid from "@/components/landing/DashboardGrid";
import { ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";

type ViewState = "INDIA" | "UP" | "ETAH";

export default function LandingPage() {
    const [viewState, setViewState] = useState<ViewState>("INDIA");
    const [activeRegion, setActiveRegion] = useState<string | null>(null);

    const handleStateClick = (stateName: string) => {
        if (stateName === "Uttar Pradesh") {
            setViewState("UP");
            setActiveRegion("Uttar Pradesh");
        } else if (stateName === "Kerala") {
            // Kerala logic (placeholder for now)
            console.log("Kerala clicked");
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

            {/* MAP CONTAINER */}
            {/* Animated height adjustment: Full screen for India/UP, 40% for Etah view */}
            <motion.div
                className="w-full relative shrink-0"
                initial={{ height: "100%" }}
                animate={{ height: viewState === "ETAH" ? "45%" : "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                <AnimatePresence mode="wait">
                    {viewState === "INDIA" || viewState === "UP" ? (
                        <motion.div
                            key="india-map"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_#0F172A_100%)] z-10" />
                            <IndiaMap onStateClick={handleStateClick} activeState={activeRegion} />

                            {/* UP Specific Interaction Hint */}
                            {viewState === "UP" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                                >
                                    <button
                                        onClick={handleEtahClick}
                                        className="bg-sky-500/10 backdrop-blur-md border border-sky-500 text-sky-400 px-6 py-3 rounded-full font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
                                    >
                                        <MapPin size={16} /> Enter Etah District
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ETAH-map"
                            initial={{ opacity: 0, scale: 1.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="w-full h-full"
                        >
                            <EtahMap onBlockClick={(id) => console.log("Block clicked:", id)} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back Button */}
                {viewState !== "INDIA" && (
                    <button
                        onClick={handleBack}
                        className="absolute bottom-6 left-6 z-30 flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest bg-black/20 p-2 rounded backdrop-blur"
                    >
                        <ChevronLeft size={16} /> Back to {viewState === "ETAH" ? "Uttar Pradesh" : "India"}
                    </button>
                )}
            </motion.div>

            {/* DASHBOARD GRID (Only visible in ETAH view) */}
            <AnimatePresence>
                {viewState === "ETAH" && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "circOut" }}
                        className="flex-1 w-full bg-slate-900 border-t border-slate-700 relative z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                    >
                        <DashboardGrid />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
