"use client";

import { motion } from "framer-motion";

export default function UPMapSVG() {
    return (
        <div className="w-full h-full flex items-center justify-center relative group p-0 overflow-hidden rounded-xl bg-white">
            {/* USER PROVIDED FINAL MAP IMAGE */}
            <div className="relative w-full h-full">
                <img
                    src="/assets/up_final_map.jpg"
                    alt="Uttar Pradesh District Map"
                    className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                />
            </div>
        </div>
    );
}
