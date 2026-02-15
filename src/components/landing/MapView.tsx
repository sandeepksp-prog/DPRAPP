"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Diamond Icon for KSPPL Projects
const createDiamondIcon = () => {
    return L.divIcon({
        className: "custom-diamond-marker",
        html: `<div class="w-4 h-4 bg-sky-500/20 border border-sky-400 rotate-45 shadow-[0_0_10px_#0EA5E9] animate-pulse">
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
           </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
};

const RecenterMap = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { duration: 2 });
    }, [center, zoom, map]);
    return null;
};

interface MapViewProps {
    center: [number, number];
    zoom: number;
    markers?: { id: string; lat: number; lng: number; title: string; onClick?: () => void }[];
    onMapClick?: () => void;
}

const MapView = ({ center, zoom, markers, onMapClick }: MapViewProps) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: "100%", width: "100%", background: "#0F172A" }}
            zoomControl={false}
            attributionControl={false}
            className="z-0"
        >
            {/* Azure Maps Dark Grey Tile Layer - Using User Provided Key */}
            <TileLayer
                url="https://atlas.microsoft.com/map/tile?api-version=2.0&tilesetId=microsoft.base.darkgrey&zoom={z}&x={x}&y={y}&subscription-key=AQ.Ab8RN6IUcrKgPpzj4WpPX0HdXsaRc3ErWb3Wnw8B_ieqnwZBwA"
                attribution='&copy; Microsoft Corporation'
                maxZoom={19}
            />

            <RecenterMap center={center} zoom={zoom} />

            {markers?.map((m) => (
                <Marker
                    key={m.id}
                    position={[m.lat, m.lng]}
                    icon={createDiamondIcon()}
                    eventHandlers={{
                        click: () => m.onClick && m.onClick(),
                    }}
                >
                    <Popup className="custom-popup bg-slate-900 text-white border-slate-700">
                        <div className="text-xs font-bold uppercase text-sky-400">{m.title}</div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;
