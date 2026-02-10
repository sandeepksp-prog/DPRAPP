'use client';

import { useEffect, useState } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

interface Segment {
    start: [number, number]; // [x, y]
    end: [number, number];   // [x, y]
    type: 'MAIN' | 'DISTRIBUTION';
}

interface VisionData {
    segments: Segment[];
}

export default function VisionPipeLayer({ mapImageBounds }: { mapImageBounds?: L.LatLngBoundsExpression }) {
    const [segments, setSegments] = useState<Segment[]>([]);
    const map = useMap();

    useEffect(() => {
        fetch('/maps/vision_data.json')
            .then(res => res.json())
            .then((data: VisionData) => {
                if (data.segments) {
                    setSegments(data.segments);
                }
            })
            .catch(err => console.error("Failed to load vision data", err));
    }, []);

    const project = (x: number, y: number): [number, number] | null => {
        if (!mapImageBounds) return null;

        // Cast to any to handle type mismatch with strict null checks or TS
        const bounds = L.latLngBounds(mapImageBounds as any);
        const southWest = bounds.getSouthWest();
        const northEast = bounds.getNorthEast();

        // Project 0-1000 grid to LatLng bounds
        // x: 0 -> 1000 (West -> East)
        // y: 0 -> 1000 (North -> South typically in image coordinates, but let's assume standard grid)
        // Adjust based on prompt instructions (1000x1000 grid)

        const lat = northEast.lat - ((y / 1000) * (northEast.lat - southWest.lat));
        const lng = southWest.lng + ((x / 1000) * (northEast.lng - southWest.lng));

        return [lat, lng];
    }

    if (!mapImageBounds) return null;

    return (
        <>
            {segments.map((seg, idx) => {
                const start = project(seg.start[0], seg.start[1]);
                const end = project(seg.end[0], seg.end[1]);

                if (!start || !end) return null;

                const isMain = seg.type === 'MAIN';

                return (
                    <div key={idx}>
                        {/* Layer 1: Border (Casing) */}
                        <Polyline
                            positions={[start, end]}
                            pathOptions={{
                                color: 'black',
                                weight: isMain ? 16 : 9,
                                lineCap: 'butt', // Clean joins
                                lineJoin: 'round',
                                opacity: 0.8
                            }}
                        />
                        {/* Layer 2: Fill (Core) */}
                        <Polyline
                            positions={[start, end]}
                            pathOptions={{
                                color: isMain ? '#1e3a8a' : '#06b6d4', // Deep Blue vs Cyan
                                weight: isMain ? 12 : 6,
                                lineCap: 'round',
                                lineJoin: 'round',
                                opacity: 1
                            }}
                        />
                    </div>
                );
            })}
        </>
    );
}
