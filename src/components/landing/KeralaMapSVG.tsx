"use client";

import { motion } from "framer-motion";

export default function KeralaMapSVG() {
    return (
        <div className="w-full h-full flex items-center justify-center relative group p-0 overflow-hidden rounded-xl bg-white">
            {/* USER PROVIDED KERALA MAP IMAGE - VERSION 2 */}
            <div className="relative w-full h-full">
                <img
                    src="/assets/kerala_final_map_transparent.png"
                    alt="Kerala District Map - Alappuzha"
                    className="w-full h-full object-contain object-center transition-transform duration-700 hover:scale-105"
                />
            </div>
        </div>
    );
}
