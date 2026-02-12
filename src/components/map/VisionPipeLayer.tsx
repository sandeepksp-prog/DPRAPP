'use client';

import { useEffect, useState } from 'react';
import { Polyline, Tooltip, Marker, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface PipeSegment {
    start: [number, number];
    end: [number, number];
    type: 'MAIN' | 'DISTRIBUTION';
    diameter?: number;
    material?: string;
}

// Custom DivIcon for Pulse Animation (defined in globals.css)
const pulseIcon = L.divIcon({
    className: 'map-marker-pulse',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// Area Covered Animation (Large radar circle)
function RadarEffect({ center }: { center: [number, number] }) {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* This would be overlaid via CSS if not using Leaflet Circle */}
            <Circle
                center={center}
                radius={300} // 300 meters coverage
                pathOptions={{
                    color: '#6366f1',
                    fillColor: '#6366f1',
                    fillOpacity: 0.1,
                    weight: 1,
                    dashArray: '5, 10'
                }}
            >
                <Tooltip permanent direction="top" className="bg-transparent border-none shadow-none text-indigo-600 font-bold">
                    Zone Coverage
                </Tooltip>
            </Circle>
        </div>
    )
}


export default function VisionPipeLayer() {
    const [segments, setSegments] = useState<PipeSegment[]>([]);
    const map = useMap();

    useEffect(() => {
        // Load data from public/maps/vision_data.json
        fetch('/maps/vision_data.json')
            .then(res => res.json())
            .then((data: PipeSegment[]) => {
                setSegments(data);
                if (data.length > 0) {
                    // Center map on the first segment
                    map.panTo(data[0].start);
                }
            })
            .catch(err => console.error("Failed to load vision pipe data:", err));
    }, [map]);

    // Calculate center of the network for the "Radar" effect
    const networkCenter = segments.length > 0 ? segments[0].start : null;

    return (
        <>
            {/* Draw Radar Effect at main node */}
            {networkCenter && (
                <Circle
                    center={networkCenter}
                    radius={300}
                    pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.05, weight: 1, dashArray: '4 4' }}
                />
            )}

            {segments.map((segment, index) => (
                <div key={index}>
                    {/* 1. Vector Casing (Outer Border) */}
                    <Polyline
                        positions={[segment.start, segment.end]}
                        pathOptions={{
                            color: '#1e293b', // Dark Slate Border
                            weight: segment.type === 'MAIN' ? 8 : 5,
                            opacity: 0.8,
                            lineCap: 'round'
                        }}
                    />

                    {/* 2. Vector Fill (Inner Color) */}
                    <Polyline
                        positions={[segment.start, segment.end]}
                        pathOptions={{
                            color: segment.type === 'MAIN' ? '#3b82f6' : '#0ea5e9', // Blue 500 / Sky 500
                            weight: segment.type === 'MAIN' ? 5 : 3,
                            opacity: 1,
                            lineCap: 'round'
                        }}
                    >
                        <Tooltip sticky className="font-sans text-xs font-bold text-slate-700">
                            {segment.type} PIPE <br />
                            <span className="text-xs font-normal text-slate-500">
                                {segment.diameter ? `${segment.diameter}mm` : 'Unknown Dia'}
                            </span>
                        </Tooltip>
                    </Polyline>

                    {/* 3. Pulse Markers at Nodes (Joints) */}
                    <Marker position={segment.start} icon={pulseIcon} />
                    <Marker position={segment.end} icon={pulseIcon} />
                </div>
            ))}
        </>
    );
}
