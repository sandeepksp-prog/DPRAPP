"use client";

import { motion } from "framer-motion";

export default function UPMapSVG() {
    return (
        <div className="w-full h-full flex items-end justify-center relative group p-0 overflow-hidden rounded-xl bg-white pointer-events-auto">
            {/* USER PROVIDED FINAL MAP IMAGE */}
            <div className="relative w-full h-full flex items-end">
                <img
                    src="/assets/up_final_map.jpg"
                    alt="Uttar Pradesh District Map"
                    className="w-full h-full object-contain object-bottom transition-transform duration-700 hover:scale-[1.20]"
                />
            </div>
        </div>
    );
}
