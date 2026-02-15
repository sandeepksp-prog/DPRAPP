"use client";

import { motion } from "framer-motion";

export default function UPMapSVG() {
    return (
        <div className="w-full h-full flex items-center justify-center relative group p-2">
            {/* USER PROVIDED HIGH QUALITY IMAGE */}
            <div className="relative w-full h-full">
                <img
                    src="/assets/up_district_map.png"
                    alt="Uttar Pradesh 3D Map with Etah Highlight"
                    className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                />

                {/* Overlay Label & Line (To ensure sharpness on top of image) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <defs>
                        <marker id="dot-overlay" markerWidth="10" markerHeight="10" refX="5" refY="5">
                            <circle cx="5" cy="5" r="2" fill="#0f172a" />
                        </marker>
                    </defs>

                    {/* Line from Label to Approx Map Location (Adjust coordinates if needed) */}
                    {/* Assuming image is centered, Etah is roughly at 35% Left, 45% Top */}
                    <motion.path
                        d="M220 50 L120 130"
                        stroke="#0F172A"
                        strokeWidth="2"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        markerEnd="url(#dot-overlay)"
                    />

                    {/* Text Label */}
                    <text x="225" y="45" className="text-sm font-bold fill-slate-900 uppercase tracking-widest" style={{ fontFamily: 'monospace' }}>
                        ETAH DISTRICT
                    </text>
                </svg>
            </div>
        </div>
    );
}
