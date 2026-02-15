"use client";

import { motion } from "framer-motion";

export default function UPMapSVG() {
    return (
        <div className="w-full h-full flex items-center justify-center relative group p-0 overflow-hidden rounded-xl">
            {/* USER PROVIDED DARK MAP IMAGE (EXACT) */}
            <div className="relative w-full h-full bg-slate-900">
                <img
                    src="/assets/up_dark_map.png"
                    alt="Uttar Pradesh Dark Satellite Map"
                    className="w-full h-full object-cover filter brightness-110 contrast-125 transition-transform duration-700 hover:scale-105"
                />
            </div>
        </div>
    );
}
