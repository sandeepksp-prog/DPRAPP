"use client";

import { motion } from "framer-motion";

// Placeholder Path - Users should replace this with the actual Kerala Map SVG path
const KERALA_PATH = "M120 20 L150 50 L140 120 L160 200 L110 280 L80 220 L90 100 L120 20 Z";

export default function KeralaMapSVG() {
    return (
        <div className="w-full h-full flex items-center justify-center p-6 relative group overflow-hidden">
            {/* Use basic SVG for now to avoid complexity issues */}
            <svg
                viewBox="0 0 300 300"
                className="w-full h-full drop-shadow-xl overflow-visible transition-transform hover:scale-105 duration-500"
            >
                <defs>
                    <linearGradient id="keralaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                </defs>

                {/* 1. Shadow Layer (Depth) */}
                <path
                    d={KERALA_PATH}
                    fill="#0c4a6e"
                    opacity="0.2"
                    transform="translate(8, 8)"
                />

                {/* 2. Middle Extrusion Layer */}
                <path
                    d={KERALA_PATH}
                    fill="#0284c7"
                    transform="translate(4, 4)"
                />

                {/* 3. Top Surface (Glossy) */}
                <path
                    d={KERALA_PATH}
                    fill="url(#keralaGradient)"
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer hover:brightness-110 transition-all"
                />

                {/* District Marker (Kochi) */}
                <g transform="translate(100, 200)">
                    <title>Kochi District</title>
                    <circle r="6" fill="#3b82f6" stroke="white" strokeWidth="2" className="animate-pulse shadow-lg" />
                </g>

            </svg>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono opacity-50 pointer-events-none">
                3D SVG RENDERING
            </div>
        </div>
    );
}
