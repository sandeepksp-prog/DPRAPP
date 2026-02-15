"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Dynamically import MapView to disable SSR
const MapView = dynamic(() => import("./MapView").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#0F172A] flex items-center justify-center font-mono text-xs text-sky-500 animate-pulse">INIT SATELLITE FEED...</div>
});

interface IndiaMapProps {
    onStateClick: (stateName: string) => void;
    activeState: string | null;
}

const IndiaMap = ({ onStateClick, activeState }: IndiaMapProps) => {
    // Center: India (default), UP (26.8, 80.9), Kerala (10.8, 76.2)
    const mapCenter: [number, number] = activeState === "Uttar Pradesh"
        ? [27.5583, 78.6667] // Etah Center
        : activeState === "Kerala"
            ? [10.8505, 76.2711] // Kerala Center
            : [22.5937, 78.9629]; // India Center

    const zoomLevel = activeState === "Uttar Pradesh" ? 8 : activeState === "Kerala" ? 7 : 5;

    const markers = useMemo(() => [
        { id: "up", lat: 27.5583, lng: 78.6667, title: "UP Project (Etah)", onClick: () => onStateClick("Uttar Pradesh") },
        { id: "kl", lat: 10.8505, lng: 76.2711, title: "Kerala Project (Kochi)", onClick: () => onStateClick("Kerala") },
    ], []);

    return (
        <div className="w-full h-full relative">
            <MapView center={mapCenter} zoom={zoomLevel} markers={markers} />

            {/* Cinematic Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,#0F172A_100%)] z-[400]" />

            {/* Grid Overlay for High-Tech Feel */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[400]" />
        </div>
    );
};

export default IndiaMap;
