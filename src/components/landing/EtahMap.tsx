"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Schematic representation of Etah Blocks
// Using a 0-100 coordinate system for the SVG
const BLOCKS = [
    { id: "jalesar", name: "Jalesar", path: "M5,35 L25,30 L35,50 L15,60 Z", cx: 20, cy: 45 },
    { id: "awagarh", name: "Awagarh", path: "M25,30 L45,25 L50,45 L35,50 Z", cx: 38, cy: 38 },
    { id: "nidhauli", name: "Nidhauli Kalan", path: "M45,25 L65,20 L70,40 L50,45 Z", cx: 58, cy: 32 },
    { id: "marehra", name: "Marehra", path: "M65,20 L85,15 L90,35 L70,40 Z", cx: 78, cy: 28 },
    { id: "shitalpur", name: "Shitalpur", path: "M35,50 L50,45 L60,65 L40,70 Z", cx: 46, cy: 58 },
    { id: "sakit", name: "Sakit", path: "M50,45 L70,40 L75,60 L60,65 Z", cx: 64, cy: 52 },
    { id: "jaithara", name: "Jaithara", path: "M70,40 L90,35 L95,55 L75,60 Z", cx: 82, cy: 48 },
    { id: "aliganj", name: "Aliganj", path: "M75,60 L95,55 L90,80 L70,85 Z", cx: 82, cy: 70 },
];

// Realistic Village/Scheme Locations
// Status: active (green), planned (blue), alert (yellow)
const VILLAGES = [
    { id: 'v1', name: 'Nagla Bhajua', x: 44, y: 55, status: 'active' },
    { id: 'v2', name: 'Sarai Aghat', x: 62, y: 50, status: 'completed' },
    { id: 'v3', name: 'Nidhauli Town', x: 56, y: 30, status: 'active' },
    { id: 'v4', name: 'Awagarh Center', x: 36, y: 36, status: 'planned' },
    { id: 'v5', name: 'Jalesar Market', x: 18, y: 42, status: 'active' },
    { id: 'v6', name: 'Marehra Station', x: 76, y: 26, status: 'completed' },
    { id: 'v7', name: 'Aliganj Rural', x: 80, y: 68, status: 'alert' },
    { id: 'v8', name: 'Jaithara East', x: 84, y: 46, status: 'planned' },
    { id: 'v9', name: 'Sakit North', x: 64, y: 48, status: 'active' }
];

// Add some random filler dots for density
const FILLER_DOTS = Array.from({ length: 20 }).map((_, i) => ({
    id: `f${i}`,
    x: Math.random() * 80 + 10,
    y: Math.random() * 60 + 20,
    status: 'minor'
}));

interface EtahMapProps {
    onBlockClick: (blockId: string) => void;
}

const EtahMap: React.FC<EtahMapProps> = ({ onBlockClick }) => {
    const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
    const [hoveredVillage, setHoveredVillage] = useState<string | null>(null);

    return (
        <div className="w-full h-full relative bg-[#0F172A] flex items-center justify-center">
            {/* Title / Back hint */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-slate-500 text-xs tracking-[0.2em] uppercase font-bold">
                District View: Etah
            </div>

            <svg viewBox="0 0 100 100" className="w-full h-full max-w-4xl max-h-4xl drop-shadow-2xl">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Render Blocks */}
                {BLOCKS.map((block, i) => {
                    const isHovered = hoveredBlock === block.id;

                    return (
                        <motion.g
                            key={block.id}
                            initial={{ opacity: 0, scale: 0.8, translateY: 10 }}
                            animate={{ opacity: 1, scale: 1, translateY: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            onMouseEnter={() => setHoveredBlock(block.id)}
                            onMouseLeave={() => setHoveredBlock(null)}
                            onClick={() => onBlockClick(block.id)}
                            style={{ cursor: "pointer" }}
                        >
                            <path
                                d={block.path}
                                fill={isHovered ? "rgba(14, 165, 233, 0.1)" : "rgba(30, 41, 59, 0.4)"}
                                stroke={isHovered ? "#38BDF8" : "#475569"}
                                strokeWidth={isHovered ? 0.6 : 0.3}
                                filter={isHovered ? "url(#glow)" : undefined}
                                className="transition-all duration-300 ease-out"
                            />

                            {/* Block Label */}
                            <text
                                x={block.cx}
                                y={block.cy}
                                textAnchor="middle"
                                className="text-[2.5px] font-bold fill-slate-500 pointer-events-none uppercase tracking-wider"
                                style={{ fill: isHovered ? "#E2E8F0" : "#64748B", transition: "fill 0.3s" }}
                            >
                                {block.name}
                            </text>
                        </motion.g>
                    );
                })}

                {/* Filler Dots (Subtle) */}
                {FILLER_DOTS.map((dot, i) => (
                    <circle key={dot.id} cx={dot.x} cy={dot.y} r={0.2} fill="#334155" opacity={0.5} />
                ))}

                {/* Active Village/Scheme Dots */}
                {VILLAGES.map((v, i) => {
                    const color = v.status === 'active' ? '#10B981' : v.status === 'completed' ? '#3B82F6' : v.status === 'alert' ? '#F59E0B' : '#0EA5E9';
                    const isHovered = hoveredVillage === v.id;

                    return (
                        <g key={v.id} onMouseEnter={() => setHoveredVillage(v.id)} onMouseLeave={() => setHoveredVillage(null)}>
                            <motion.circle
                                cx={v.x}
                                cy={v.y}
                                r={isHovered ? 1 : 0.6}
                                fill={color}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1] }}
                                transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                            />
                            {/* Pulse Effect for Active Only */}
                            {v.status === 'active' && (
                                <motion.circle
                                    cx={v.x}
                                    cy={v.y}
                                    r={0.6}
                                    fill={color}
                                    initial={{ scale: 1, opacity: 0.5 }}
                                    animate={{ scale: 3, opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}

                            {/* Tooltip Label on Hover */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.g
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <rect x={v.x - 5} y={v.y - 4} width="10" height="3" rx="0.5" fill="rgba(0,0,0,0.8)" />
                                        <text x={v.x} y={v.y - 2} textAnchor="middle" fontSize="1.5" fill="white" fontWeight="bold">
                                            {v.name}
                                        </text>
                                    </motion.g>
                                )}
                            </AnimatePresence>
                        </g>
                    )
                })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-slate-900/80 p-3 rounded border border-slate-700 backdrop-blur text-xs">
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Scheme</div>
                <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Completed</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Alert/Issue</div>
            </div>
        </div>
    );
};

export default EtahMap;
