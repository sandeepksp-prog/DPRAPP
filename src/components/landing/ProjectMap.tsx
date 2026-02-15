"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Dynamically import MapView to disable SSR
const MapView = dynamic(() => import("./MapView").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#0F172A] flex items-center justify-center font-mono text-xs text-emerald-500 animate-pulse">ESTABLISHING UPLINK...</div>
});

interface ProjectMapProps {
    viewState: "INDIA" | "UP" | "ETAH";
    onStateClick: (state: string) => void;
    onBlockClick: (blockId: string) => void;
}

const ProjectMap = ({ viewState, onStateClick, onBlockClick }: ProjectMapProps) => {
    // CONFIGURATION BASED ON VIEW STATE
    const config = useMemo(() => {
        switch (viewState) {
            case "ETAH":
                return {
                    center: [27.5583, 78.6667] as [number, number],
                    zoom: 11,
                    markers: [
                        { id: "jalesar", lat: 27.48, lng: 78.32, title: "Jalesar Section", onClick: () => onBlockClick("jalesar") },
                        { id: "awagarh", lat: 27.45, lng: 78.48, title: "Awagarh Section", onClick: () => onBlockClick("awagarh") },
                        { id: "nidhauli", lat: 27.58, lng: 78.52, title: "Nidhauli Kalan", onClick: () => onBlockClick("nidhauli") },
                        { id: "marehra", lat: 27.72, lng: 78.58, title: "Marehra Section", onClick: () => onBlockClick("marehra") },
                        { id: "shitalpur", lat: 27.55, lng: 78.66, title: "Shitalpur HQ", onClick: () => onBlockClick("shitalpur") },
                        { id: "sakit", lat: 27.45, lng: 78.75, title: "Sakit Section", onClick: () => onBlockClick("sakit") },
                        { id: "jaithara", lat: 27.52, lng: 79.05, title: "Jaithara Section", onClick: () => onBlockClick("jaithara") },
                        { id: "aliganj", lat: 27.48, lng: 79.18, title: "Aliganj Section", onClick: () => onBlockClick("aliganj") },
                    ]
                };
            case "UP":
                return {
                    center: [27.1, 79.5] as [number, number],
                    zoom: 8,
                    markers: [
                        { id: "etah", lat: 27.5583, lng: 78.6667, title: "Etah Project Zone (Active)", onClick: () => onStateClick("ETAH_TRIGGER") }
                    ]
                };
            case "INDIA":
            default:
                return {
                    center: [22.5937, 78.9629] as [number, number],
                    zoom: 5,
                    markers: [
                        { id: "up", lat: 26.8467, lng: 80.9462, title: "Uttar Pradesh (JJM)", onClick: () => onStateClick("Uttar Pradesh") },
                        { id: "kl", lat: 10.8505, lng: 76.2711, title: "Kerala (JJM)", onClick: () => onStateClick("Kerala") },
                    ]
                };
        }
    }, [viewState, onStateClick, onBlockClick]);

    return (
        <div className="w-full h-full relative">
            <MapView
                center={config.center}
                zoom={config.zoom}
                markers={config.markers}
            />

            {/* Cinematic Vignette Overlay to darken edges */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,#0F172A_100%)] z-[400]" />

            {/* High-Tech Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[400]" />
        </div>
    );
};

export default ProjectMap;
