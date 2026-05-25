"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper to format date like "02nd", "23rd"
const getOrdinalNum = (n: number) => {
  return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
};

// Custom DivIcon for the map pin
const createCustomIcon = (dateStr: string) => {
  const date = new Date(dateStr);
  const dayNum = date.getDate();
  const formattedDay = getOrdinalNum(dayNum);

  return L.divIcon({
    className: 'custom-date-pin',
    html: `
      <div style="
        width: 32px; 
        height: 32px; 
        background-color: #fcf6bd; 
        border: 2px solid #0f172a; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        box-shadow: 0 3px 0 rgba(15,23,42,1);
        position: relative;
        z-index: 10;
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <span style="font-size: 11px; font-weight: 900; color: #0f172a; width: 100%; text-align: center;">
          ${formattedDay}
        </span>
        <div style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          background-color: #0f172a;
          z-index: -1;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 36],
    popupAnchor: [0, -36]
  });
};

// Component to handle auto-centering when location updates
function MapCenterer({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2) {
      map.flyTo(center, 14, { animate: true });
    }
  }, [center[0], center[1], map]);
  return null;
}

export interface LocationPoint {
  lat: number;
  lng: number;
  timestamp: string;
}

interface LeafletMapProps {
  locations: LocationPoint[];
  currentLocation: [number, number] | null;
}

export default function LeafletMap({ locations, currentLocation }: LeafletMapProps) {
  // Memoize center to prevent reference changes
  const [defaultCenter] = useState<[number, number]>([27.5650, 78.6475]);
  const center = currentLocation || defaultCenter;

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {currentLocation && <MapCenterer center={currentLocation} />}

        {locations.map((loc, idx) => (
          <Marker 
            key={idx} 
            position={[loc.lat, loc.lng]} 
            icon={createCustomIcon(loc.timestamp)}
          >
            <Popup>
              <div className="font-bold text-slate-900 text-xs text-center">
                Logged on {new Date(loc.timestamp).toLocaleDateString()}<br/>
                {new Date(loc.timestamp).toLocaleTimeString()}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
