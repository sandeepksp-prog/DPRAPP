"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
  Pure inline SVG India Map.  
  Simplified paths — no external TopoJSON, no react-simple-maps.
  UP & Kerala are interactive; all others show a toast.
*/

// Simplified SVG paths for key Indian states (viewBox 0 0 500 550)
// These are approximations for visual representation
const STATES: { id: string; name: string; d: string; active?: boolean }[] = [
    // Jammu & Kashmir
    { id: "jk", name: "Jammu & Kashmir", d: "M175,20 L210,15 L240,30 L250,55 L230,70 L200,65 L185,50 Z" },
    // Himachal Pradesh
    { id: "hp", name: "Himachal Pradesh", d: "M200,65 L230,70 L240,85 L220,95 L195,88 Z" },
    // Punjab
    { id: "pb", name: "Punjab", d: "M175,75 L195,88 L200,105 L180,110 L165,95 Z" },
    // Uttarakhand
    { id: "uk", name: "Uttarakhand", d: "M220,95 L240,85 L265,90 L260,110 L235,115 Z" },
    // Haryana
    { id: "hr", name: "Haryana", d: "M165,95 L180,110 L200,105 L210,120 L195,140 L170,135 L160,115 Z" },
    // Delhi
    { id: "dl", name: "Delhi", d: "M192,125 L200,122 L205,130 L197,133 Z" },
    // Rajasthan
    { id: "rj", name: "Rajasthan", d: "M100,130 L160,115 L170,135 L195,140 L190,180 L180,210 L140,230 L95,210 L80,170 Z" },
    // Uttar Pradesh (ACTIVE)  
    { id: "up", name: "Uttar Pradesh", d: "M195,140 L210,120 L235,115 L260,110 L290,120 L310,140 L320,165 L300,185 L270,195 L240,200 L210,195 L190,180 Z", active: true },
    // Bihar
    { id: "br", name: "Bihar", d: "M310,140 L340,135 L365,145 L360,170 L330,178 L320,165 Z" },
    // West Bengal
    { id: "wb", name: "West Bengal", d: "M340,135 L365,145 L375,130 L385,160 L380,200 L370,230 L355,240 L340,225 L330,195 L330,178 L360,170 Z" },
    // Jharkhand
    { id: "jh", name: "Jharkhand", d: "M320,165 L330,178 L340,225 L310,230 L295,210 L300,185 Z" },
    // Odisha
    { id: "od", name: "Odisha", d: "M295,210 L310,230 L340,225 L355,240 L350,270 L325,290 L290,280 L275,250 L280,225 Z" },
    // Chhattisgarh
    { id: "cg", name: "Chhattisgarh", d: "M250,210 L270,195 L295,210 L280,225 L275,250 L290,280 L265,290 L240,270 L235,240 Z" },
    // Madhya Pradesh
    { id: "mp", name: "Madhya Pradesh", d: "M140,180 L190,180 L210,195 L240,200 L270,195 L250,210 L235,240 L240,270 L210,280 L175,270 L140,250 L120,220 Z" },
    // Gujarat
    { id: "gj", name: "Gujarat", d: "M50,190 L80,170 L95,210 L140,230 L140,250 L120,270 L100,290 L70,280 L50,260 L30,230 L40,210 Z" },
    // Maharashtra
    { id: "mh", name: "Maharashtra", d: "M120,270 L140,250 L175,270 L210,280 L240,270 L265,290 L260,320 L240,340 L200,350 L160,340 L130,315 L110,290 Z" },
    // Telangana
    { id: "ts", name: "Telangana", d: "M210,280 L240,270 L265,290 L290,280 L310,300 L295,330 L260,320 Z" },
    // Andhra Pradesh
    { id: "ap", name: "Andhra Pradesh", d: "M240,340 L260,320 L295,330 L310,300 L325,290 L340,310 L350,340 L330,370 L305,390 L275,380 L255,365 Z" },
    // Karnataka
    { id: "ka", name: "Karnataka", d: "M160,340 L200,350 L240,340 L255,365 L275,380 L260,410 L240,430 L200,435 L170,420 L150,390 L145,360 Z" },
    // Goa
    { id: "ga", name: "Goa", d: "M145,360 L150,355 L155,365 L150,370 Z" },
    // Kerala (ACTIVE)
    { id: "kl", name: "Kerala", d: "M200,435 L215,425 L230,440 L240,460 L235,485 L225,500 L210,510 L195,495 L190,470 L195,450 Z", active: true },
    // Tamil Nadu
    { id: "tn", name: "Tamil Nadu", d: "M230,440 L260,410 L275,380 L305,390 L330,370 L340,390 L330,420 L310,440 L280,455 L255,470 L240,460 Z" },
    // Northeast (simplified as one block)
    { id: "ne", name: "Northeast", d: "M375,130 L395,110 L430,100 L450,115 L445,140 L430,155 L410,165 L395,155 L385,160 Z" },
    // Sikkim
    { id: "sk", name: "Sikkim", d: "M365,118 L375,110 L380,120 L372,125 Z" },
];

interface IndiaMapProps {
    onStateClick: (stateName: string) => void;
    activeState: string | null;
}

const IndiaMap: React.FC<IndiaMapProps> = ({ onStateClick, activeState }) => {
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const handleClick = (state: typeof STATES[0]) => {
        if (state.active) {
            onStateClick(state.name);
        } else {
            setToast(`Sorry, we don't have a project in ${state.name} yet.`);
            setTimeout(() => setToast(null), 2500);
        }
    };

    // Zoom transform based on active state
    const getTransform = () => {
        if (activeState === "Uttar Pradesh") return { scale: 2.5, x: -250, y: -150 };
        if (activeState === "Kerala") return { scale: 3, x: -200, y: -750 };
        return { scale: 1, x: 0, y: 0 };
    };

    const transform = getTransform();

    return (
        <div className="w-full h-full relative overflow-hidden">
            <motion.svg
                viewBox="0 0 500 550"
                className="w-full h-full drop-shadow-2xl"
                animate={{
                    scale: transform.scale,
                    x: transform.x,
                    y: transform.y,
                }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <defs>
                    {/* SATELLITE GRID PATTERN */}
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.05)" strokeWidth="0.5" />
                    </pattern>

                    {/* NEON GLOW FILTERS */}
                    <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(14,165,233,0.2)" />
                        <stop offset="50%" stopColor="rgba(14,165,233,0.05)" />
                        <stop offset="100%" stopColor="rgba(14,165,233,0.0)" />
                    </linearGradient>

                    <linearGradient id="landGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                </defs>

                {/* BACKGROUND GRID */}
                <rect width="100%" height="100%" fill="url(#grid)" className="pointer-events-none" />

                {/* All States */}
                {STATES.map((state) => {
                    const isHovered = hoveredState === state.id;
                    const isActive = state.active;
                    const isSelected = activeState === state.name;

                    return (
                        <motion.path
                            key={state.id}
                            d={state.d}
                            fill={
                                isSelected
                                    ? "rgba(14,165,233,0.25)"
                                    : isActive
                                        ? isHovered
                                            ? "rgba(14,165,233,0.15)"
                                            : "url(#activeGrad)"
                                        : isHovered
                                            ? "rgba(100,116,139,0.4)"
                                            : "rgba(30,41,59,0.6)"
                            }
                            stroke={
                                isSelected
                                    ? "#38BDF8"
                                    : isActive
                                        ? "#0EA5E9"
                                        : isHovered
                                            ? "#64748B"
                                            : "#334155"
                            }
                            strokeWidth={isActive || isSelected ? 1.5 : 0.5}
                            filter={isSelected ? "url(#glow-up)" : isActive && isHovered ? "url(#glow-blue)" : undefined}
                            className="cursor-pointer transition-all duration-300"
                            onMouseEnter={() => setHoveredState(state.id)}
                            onMouseLeave={() => setHoveredState(null)}
                            onClick={() => handleClick(state)}
                            whileHover={{ scale: 1.01 }}
                        />
                    );
                })}

                {/* KSPPL Diamond Markers on Active States */}
                {STATES.filter((s) => s.active).map((state) => {
                    // Diamond center for UP and Kerala
                    const cx = state.id === "up" ? 255 : 215;
                    const cy = state.id === "up" ? 155 : 470;
                    return (
                        <g key={`marker-${state.id}`}>
                            <motion.g
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {/* Diamond shape */}
                                <polygon
                                    points={`${cx},${cy - 10} ${cx + 7},${cy} ${cx},${cy + 10} ${cx - 7},${cy}`}
                                    fill="rgba(14,165,233,0.3)"
                                    stroke="#38BDF8"
                                    strokeWidth="1"
                                    filter="url(#glow-blue)"
                                />
                                {/* Label */}
                                <text
                                    x={cx}
                                    y={cy - 16}
                                    textAnchor="middle"
                                    fill="#94A3B8"
                                    fontSize="8"
                                    fontWeight="bold"
                                    letterSpacing="1"
                                >
                                    {state.id === "up" ? "UP Project" : "Kerala Project"}
                                </text>
                            </motion.g>
                        </g>
                    );
                })}
            </motion.svg>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 
              bg-slate-800/90 backdrop-blur border border-slate-600 
              px-6 py-3 rounded-lg text-sm text-slate-300 font-medium
              shadow-xl z-50"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IndiaMap;
