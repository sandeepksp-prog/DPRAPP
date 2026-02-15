"use client";

import { motion } from "framer-motion";

// Placeholder Path - Users should replace this with the actual UP Map SVG path
const UP_PATH = "M150 20 L220 50 L250 120 L200 180 L120 220 L60 180 L40 100 L80 40 Z";

// Hypothetical Etah District Path (Roughly center-left in this placeholder)
const ETAH_PATH = "M135 105 L155 95 L165 115 L145 125 Z";

export default function UPMapSVG() {
    return (
        <div className="w-full h-full flex items-center justify-center p-6 relative group overflow-hidden bg-slate-50/50">
            {/* Use basic SVG for now to avoid complexity issues */}
            <svg
                viewBox="0 0 300 300"
                className="w-full h-full drop-shadow-xl overflow-visible transition-transform hover:scale-105 duration-500"
            >
                <defs>
                    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <marker id="dot" markerWidth="10" markerHeight="10" refX="5" refY="5">
                        <circle cx="5" cy="5" r="2" fill="#0f172a" />
                    </marker>
                </defs>

                {/* 1. Shadow Layer (Depth) */}
                <path
                    d={UP_PATH}
                    fill="#0c4a6e"
                    opacity="0.2"
                    transform="translate(8, 8)"
                />

                {/* 2. Middle Extrusion Layer */}
                <path
                    d={UP_PATH}
                    fill="#0284c7"
                    transform="translate(4, 4)"
                />

                {/* 3. Top Surface (Glossy) */}
                <path
                    d={UP_PATH}
                    fill="url(#skyGradient)"
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer hover:brightness-110 transition-all"
                />

                {/* 4. ETAH DISTRICT HIGHLIGHT - REQUESTED FEATURE */}
                {/* DARK COLOR - DARK BORDER */}
                <path
                    d={ETAH_PATH}
                    fill="#0F172A"
                    stroke="#1e293b"
                    strokeWidth="2"
                    className="cursor-pointer"
                >
                    <title>Etah District (Active)</title>
                </path>

                {/* 5. LABEL & LINE */}
                {/* Line from Text to District */}
                <motion.path
                    d="M240 40 L165 115" // Approx coordinates
                    stroke="#0F172A"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    markerEnd="url(#dot)"
                />

                {/* Text Label at Top Right Empty Space */}
                <text x="245" y="40" className="text-xs font-bold fill-slate-900 uppercase tracking-widest" style={{ fontSize: '10px', fontFamily: 'monospace' }}>
                    ETAH DISTRICT
                </text>
                <text x="245" y="52" className="text-[8px] font-medium fill-emerald-600 tracking-wide">
                    ● ACTIVE
                </text>

            </svg>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono opacity-50 pointer-events-none">
                3D SVG RENDERING
            </div>
        </div>
    );
}
