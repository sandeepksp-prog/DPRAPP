'use client';

import React, { useState, useEffect } from 'react';
import { SmoothAreaChart, PhaseCompletionTracker, MiniBarChart, KPICard, StatusDonutChart } from '../charts/VectorDashboards';
import { BLOCK_SCHEMES, SCHEME_MAP } from '@/lib/scheme-data';
import { db } from '@/lib/firebase/client';
import { ref, onValue } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';

// Module-level caches to maintain state across mounts & enable zero-lag scheme switching
const schemeCache: Record<number, any> = {};
const raRecordsCache: Record<number, any> = {};

export default function WorkProgressView({ stats, recentReports, schemeName, defaultSchemeId }: { stats?: any, recentReports?: any[], schemeName?: string, defaultSchemeId?: number | null }) {
    // In page.tsx, the sidebar passes the Block Name as 'schemeName' (e.g., "ALIGANJ")
    const blockName = schemeName?.toUpperCase() || "ALIGANJ";
    const availableSchemes = BLOCK_SCHEMES[blockName] || [];

    // O(1) active scheme local state
    const [activeSchemeId, setActiveSchemeId] = useState<number>(defaultSchemeId || availableSchemes[0]?.id || 0);
    const [schemeData, setSchemeData] = useState<any>(null);
    const [raRecords, setRaRecords] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Reset scheme selector when block changes OR external default changes
    useEffect(() => {
        if (defaultSchemeId) {
            // Prioritize explicitly requested scheme IDs via external clicks (like the Exec summary matrix)
            setActiveSchemeId(defaultSchemeId);
        } else if (availableSchemes.length > 0) {
            // Fall back to first scheme in the current active block when naturally navigating
            setActiveSchemeId(availableSchemes[0].id);
        }
    }, [blockName, defaultSchemeId, availableSchemes]);

    // Fetch scheme details and RA records in real-time
    useEffect(() => {
        if (!activeSchemeId) return;

        // Stale-While-Revalidate: load immediately from cache to guarantee zero-lag, then sync silently
        const hasCache = schemeCache[activeSchemeId] !== undefined;
        if (hasCache) {
            setSchemeData(schemeCache[activeSchemeId]);
            setRaRecords(raRecordsCache[activeSchemeId] || null);
            setIsUpdating(false);
        } else {
            setIsUpdating(true);
            setSchemeData(null);
            setRaRecords(null);
        }

        const schemeRef = ref(db, `schemes/${activeSchemeId}`);
        const unsubscribeScheme = onValue(schemeRef, (snapshot) => {
            if (snapshot.exists()) {
                const val = snapshot.val();
                schemeCache[activeSchemeId] = val;
                setSchemeData(val);
            } else {
                schemeCache[activeSchemeId] = null;
                setSchemeData(null);
            }
            setIsUpdating(false);
        }, (error) => {
            console.error("Failed to fetch scheme:", error);
            setIsUpdating(false);
        });

        const raRef = ref(db, `billing/ra_records/${activeSchemeId}`);
        const unsubscribeRa = onValue(raRef, (snapshot) => {
            if (snapshot.exists()) {
                const val = snapshot.val();
                raRecordsCache[activeSchemeId] = val;
                setRaRecords(val);
            } else {
                raRecordsCache[activeSchemeId] = null;
                setRaRecords(null);
            }
        }, (error) => {
            console.error("Failed to fetch RA records:", error);
        });

        return () => {
            unsubscribeScheme();
            unsubscribeRa();
        };
    }, [activeSchemeId]);

    const activeScheme = SCHEME_MAP[activeSchemeId] || { name: schemeData?.scheme_name || 'Scheme' };

    // Dynamic metrics calculation
    const metrics = React.useMemo(() => {
        let totalBOQValue = 0;
        let totalEQValue = 0;

        const itemMap: Record<string, {
            item_no: string;
            description: string;
            boqQty: number;
            boqAmount: number;
            rate: number;
            headingExecuted: number;
            raExecuted: number;
        }> = {};

        // 1. Process headings if they exist
        if (schemeData && schemeData.headings) {
            Object.values(schemeData.headings).forEach((heading: any) => {
                if (heading.items) {
                    Object.values(heading.items).forEach((item: any) => {
                        if (!item.item_no) return;
                        const qty = parseFloat(item.boq_qty) || 0;
                        const boqAmt = parseFloat(item.boq_amount) || (qty * (parseFloat(item.swsm_rate) || 0)) || 0;
                        const rate = parseFloat(item.swsm_rate) || (qty > 0 ? boqAmt / qty : 0) || 0;
                        const executedQty = parseFloat(item.executed_qty) || parseFloat(item.executedQty) || 0;
                        const headingExec = executedQty * rate;

                        itemMap[item.item_no] = {
                            item_no: item.item_no,
                            description: item.description || item.item_name || '',
                            boqQty: qty,
                            boqAmount: boqAmt,
                            rate: rate,
                            headingExecuted: headingExec,
                            raExecuted: 0
                        };
                    });
                }
            });
        }

        // 2. Process RA records if they exist
        if (raRecords) {
            Object.values(raRecords).forEach((divRecords: any) => {
                Object.values(divRecords).forEach((ra: any) => {
                    if (ra.status === 'SUBMITTED' || ra.status === 'APPROVED') {
                        if (ra.items) {
                            ra.items.forEach((raItem: any) => {
                                if (!raItem.item_no) return;
                                
                                const rate = parseFloat(raItem.rate) || parseFloat(raItem.swsm_rate) || 0;
                                let raExec = 0;
                                
                                if (raItem.breakup && Array.isArray(raItem.breakup)) {
                                    raItem.breakup.forEach((b: any) => {
                                        const bQty = parseFloat(b.thisQty) || parseFloat(b.qty) || 0;
                                        const pct = parseFloat(b.percentage) || 0;
                                        raExec += bQty * rate * (pct / 100);
                                    });
                                } else {
                                    const eqQty = parseFloat(raItem.thisQty) || parseFloat(raItem.eq) || parseFloat(raItem.executedQty) || 0;
                                    raExec = eqQty * rate;
                                }

                                if (itemMap[raItem.item_no]) {
                                    itemMap[raItem.item_no].raExecuted += raExec;
                                    if (itemMap[raItem.item_no].rate === 0 && rate > 0) {
                                        itemMap[raItem.item_no].rate = rate;
                                    }
                                } else {
                                    itemMap[raItem.item_no] = {
                                        item_no: raItem.item_no,
                                        description: raItem.description || raItem.item_name || '',
                                        boqQty: parseFloat(raItem.boq_qty) || 0,
                                        boqAmount: parseFloat(raItem.boq_amount) || 0,
                                        rate: rate,
                                        headingExecuted: 0,
                                        raExecuted: raExec
                                    };
                                }
                            });
                        }
                    }
                });
            });
        }

        // 3. Sum everything up
        Object.values(itemMap).forEach((item) => {
            totalBOQValue += item.boqAmount;
            totalEQValue += Math.max(item.headingExecuted, item.raExecuted);
        });

        // Fallbacks
        if (totalBOQValue === 0 && schemeData) {
            totalBOQValue = parseFloat(schemeData.total_amount) || parseFloat(schemeData.basic_info?.total_amount) || 0;
        }
        
        // If still 0, provide mock fallback matching original look & feel
        if (totalBOQValue === 0) {
            totalBOQValue = 12000000; // 1.2 Cr default
            totalEQValue = 5040000;   // 0.504 Cr default (42%)
        }

        const boqCr = (totalBOQValue / 10000000).toFixed(2);
        const eqCr = (totalEQValue / 10000000).toFixed(2);
        const progressPercent = totalBOQValue > 0 ? Math.min(100, Math.round((totalEQValue / totalBOQValue) * 100)) : 0;

        return {
            boqCr,
            eqCr,
            progressPercent
        };
    }, [schemeData, raRecords]);

    return (
        <div className="relative space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1400px] mb-12">
            {/* Smooth transition glassmorphic blur premium custom animated loader overlay */}
            <AnimatePresence>
                {isUpdating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/15 backdrop-blur-[1.5px] z-50 flex items-center justify-center rounded-2xl"
                    >
                        <div className="flex flex-col items-center gap-5 bg-white/80 dark:bg-slate-950/85 px-8 py-7 rounded-2xl shadow-2xl border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-md max-w-[280px]">
                            {/* Animated Custom Isometric Logo Loader */}
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                {/* Outer Rotating Isometric Hexagon Frame */}
                                <motion.svg
                                    className="absolute inset-0 w-full h-full"
                                    viewBox="0 0 100 100"
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                >
                                    <defs>
                                        <linearGradient id="infraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#0ea5e9" />
                                            <stop offset="100%" stopColor="#024f7b" />
                                        </linearGradient>
                                    </defs>
                                    <motion.polygon
                                        points="50,5 90,28 90,72 50,95 10,72 10,28"
                                        fill="none"
                                        stroke="url(#infraGradient)"
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        strokeDasharray="20 10 40 10"
                                        animate={{ strokeDashoffset: [0, 120] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    />
                                </motion.svg>

                                {/* Inner Reverse-Rotating Circle Grid */}
                                <motion.svg
                                    className="absolute w-10 h-10"
                                    viewBox="0 0 100 100"
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="35"
                                        fill="none"
                                        stroke="#0ea5e9"
                                        strokeWidth="2.5"
                                        strokeDasharray="15 15"
                                        className="opacity-70"
                                    />
                                </motion.svg>

                                {/* Glowing Pulsing Core */}
                                <motion.div
                                    className="absolute w-4 h-4 bg-gradient-to-tr from-sky-500 to-blue-700 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.8)]"
                                    animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.6, 1, 0.6] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                />
                            </div>

                            {/* Brand & Status Text */}
                            <div className="text-center space-y-1.5">
                                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-[0.25em] uppercase">INFRA OS</h3>
                                <div className="flex items-center justify-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
                                    <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 tracking-wider">Syncing Live Engine...</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                animate={{ opacity: isUpdating ? 0.6 : 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
            >
                {/* SCHEME SELECTOR HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{blockName} BLOCK</p>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Scheme Data Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className="text-xs font-bold text-slate-500">Select Scheme:</span>
                        <select
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-64 p-2.5 outline-none transition-colors"
                            value={activeSchemeId}
                            onChange={(e) => setActiveSchemeId(Number(e.target.value))}
                        >
                            {availableSchemes.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* TIER 1: KPI SNAPSHOT (4 Cards - col-span-3 each) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-3">
                        <KPICard 
                            title="BOQ Value" 
                            prefix="₹" 
                            value={metrics.boqCr} 
                            suffix=" Cr" 
                            trend="+0.0%" 
                            trendLabel="baseline" 
                            isPositive={true} 
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <KPICard 
                            title="EQ Value" 
                            prefix="₹" 
                            value={metrics.eqCr} 
                            suffix=" Cr" 
                            trend="+12%" 
                            trendLabel="billing pace" 
                            isPositive={true} 
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <KPICard 
                            title="Physical Progress" 
                            value={metrics.progressPercent.toString()} 
                            suffix="%" 
                            trend="+8%" 
                            trendLabel="this month" 
                            isPositive={true} 
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <KPICard 
                            title="Timeline Status" 
                            value="On Track" 
                            trend="0" 
                            trendLabel="delay days" 
                            isPositive={true} 
                        />
                    </div>
                </div>

                {/* TIER 2: VELOCITY & DISTRIBUTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                        <SmoothAreaChart 
                            title="Scheme Financial Velocity vs Target" 
                            subtitle={`${activeScheme?.name || 'Local'} Physical Progress Run Rate`} 
                        />
                    </div>
                    <div className="lg:col-span-4">
                        <StatusDonutChart />
                    </div>
                </div>

                {/* TIER 3: THE DRILL-DOWN */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-6">
                        <PhaseCompletionTracker />
                    </div>
                    <div className="lg:col-span-6">
                        <MiniBarChart title="Task Task Completion Pipeline" />
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
