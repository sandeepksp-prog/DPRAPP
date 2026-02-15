"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Dynamically import MapView to disable SSR
const MapView = dynamic(() => import("./MapView").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#0F172A] flex items-center justify-center font-mono text-xs text-emerald-500 animate-pulse">ACQUIRING TARGET...</div>
});

interface EtahMapProps {
    onBlockClick: (blockId: string) => void;
}

const EtahMap = ({ onBlockClick }: EtahMapProps) => {
    // Center roughly on Etah district
    const etahCenter: [number, number] = [27.5583, 78.6667];
    const zoomLevel = 10;

    const markers = useMemo(() => [
        { id: "jalesar", lat: 27.48, lng: 78.32, title: "Jalesar Block", onClick: () => onBlockClick("jalesar") },
        { id: "awagarh", lat: 27.45, lng: 78.48, title: "Awagarh Block", onClick: () => onBlockClick("awagarh") },
        { id: "nidhauli", lat: 27.58, lng: 78.52, title: "Nidhauli Kalan", onClick: () => onBlockClick("nidhauli") },
        { id: "marehra", lat: 27.72, lng: 78.58, title: "Marehra Block", onClick: () => onBlockClick("marehra") },
        { id: "shitalpur", lat: 27.55, lng: 78.66, title: "Shitalpur (HQ)", onClick: () => onBlockClick("shitalpur") },
        { id: "sakit", lat: 27.45, lng: 78.75, title: "Sakit Block", onClick: () => onBlockClick("sakit") },
        { id: "jaithara", lat: 27.52, lng: 79.05, title: "Jaithara Block", onClick: () => onBlockClick("jaithara") },
        { id: "aliganj", lat: 27.48, lng: 79.18, title: "Aliganj Block", onClick: () => onBlockClick("aliganj") },
    ], [onBlockClick]);

    return (
        <div className="w-full h-full relative">
            <MapView center={etahCenter} zoom={zoomLevel} markers={markers} />

            {/* Overlay Hints */}
            <div className="absolute top-4 left-4 z-[400] bg-slate-900/80 backdrop-blur p-2 rounded border border-slate-700">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Live Feed: Etah Sector</p>
            </div>
        </div>
    );
};

export default EtahMap;
