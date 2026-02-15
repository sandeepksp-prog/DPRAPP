"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Diamond Icon for KSPPL Projects
const createDiamondIcon = (theme: "light" | "dark") => {
    return L.divIcon({
        className: "custom-diamond-marker",
        html: `<div class="w-4 h-4 ${theme === 'light' ? 'bg-blue-500/20 border-blue-600 shadow-[0_0_10px_#2563EB]' : 'bg-sky-500/20 border-sky-400 shadow-[0_0_10px_#0EA5E9]'} border rotate-45 animate-pulse">
             <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 ${theme === 'light' ? 'bg-blue-600' : 'bg-white'} rounded-full"></div>
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
    theme?: "dark" | "light"; // Theme Prop
    interactive?: boolean;    // Interaction Prop
}

const MapView = ({ center, zoom, markers, onMapClick, theme = "dark", interactive = true }: MapViewProps) => {
    const tileUrl = theme === "light"
        ? "https://atlas.microsoft.com/map/tile?api-version=2.0&tilesetId=microsoft.base.road&zoom={z}&x={x}&y={y}&subscription-key=AQ.Ab8RN6IUcrKgPpzj4WpPX0HdXsaRc3ErWb3Wnw8B_ieqnwZBwA"
        : "https://atlas.microsoft.com/map/tile?api-version=2.0&tilesetId=microsoft.base.darkgrey&zoom={z}&x={x}&y={y}&subscription-key=AQ.Ab8RN6IUcrKgPpzj4WpPX0HdXsaRc3ErWb3Wnw8B_ieqnwZBwA";

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: "100%", width: "100%", background: theme === "light" ? "#f8fafc" : "#0F172A" }}
            zoomControl={false}
            attributionControl={false}
            dragging={interactive}
            scrollWheelZoom={interactive}
            doubleClickZoom={interactive}
            touchZoom={interactive}
            className={`z-0 ${!interactive ? 'pointer-events-none' : ''}`}
        >
            <TileLayer
                url={tileUrl}
                attribution='&copy; Microsoft Corporation'
                maxZoom={19}
            />

            <RecenterMap center={center} zoom={zoom} />

            {markers?.map((m) => (
                <Marker
                    key={m.id}
                    position={[m.lat, m.lng]}
                    icon={createDiamondIcon(theme)}
                    eventHandlers={{
                        click: () => m.onClick && m.onClick(),
                    }}
                >
                    {interactive && (
                        <Popup className="custom-popup">
                            <div className="text-xs font-bold uppercase text-blue-600">{m.title}</div>
                        </Popup>
                    )}
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;
