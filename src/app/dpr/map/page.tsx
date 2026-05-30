"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Filter, MapPin } from 'lucide-react';
import type { LocationPoint } from '@/components/dpr/LeafletMap';

const LeafletMap = dynamic(() => import('@/components/dpr/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <div className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

// Haversine formula
const R = 6371000; // Earth radius in meters
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface SchemeLocation {
  name: string;
  block: string;
  lat: number;
  lng: number;
}

const SCHEME_COORDINATES: SchemeLocation[] = [
  { name: "Sarnau WTP", block: "Sarnau Block", lat: 24.8800, lng: 74.0000 },
  { name: "Aliganj OHT", block: "Aliganj Block", lat: 24.8950, lng: 74.0120 },
  { name: "Motihari Pump House", block: "Motihari Block", lat: 24.8700, lng: 73.9800 },
];

function findClosestScheme(lat: number, lng: number) {
  let closest = SCHEME_COORDINATES[0];
  let minDist = Infinity;
  for (const scheme of SCHEME_COORDINATES) {
    const dist = haversineDistance(lat, lng, scheme.lat, scheme.lng);
    if (dist < minDist) {
      minDist = dist;
      closest = scheme;
    }
  }
  return { scheme: closest, distanceMeters: Math.round(minDist) };
}

export default function MapPage() {
  const [filter, setFilter] = useState<'Today' | 'This Week' | 'This Month'>('This Week');
  const [locations, setLocations] = useState<LocationPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [closestScheme, setClosestScheme] = useState<{ scheme: SchemeLocation; distanceMeters: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dpr_user_locations');
    let history: LocationPoint[] = [];
    if (saved) {
      try { history = JSON.parse(saved); } catch (e) {}
    }

    const now = new Date();
    const filtered = history.filter(loc => {
      const locDate = new Date(loc.timestamp);
      const diffDays = Math.ceil(Math.abs(now.getTime() - locDate.getTime()) / (1000 * 60 * 60 * 24));
      if (filter === 'Today') return diffDays <= 1;
      if (filter === 'This Week') return diffDays <= 7;
      return diffDays <= 30;
    });
    setLocations(filtered);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentLocation([lat, lng]);
          setClosestScheme(findClosestScheme(lat, lng));
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
  }, [filter]);

  return (
    <div className="flex flex-col min-h-full bg-[#F2F5F8] text-slate-900 pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 md:pt-10 flex items-center gap-4 bg-white border-b-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] sticky top-0 z-20">
        <Link href="/dpr">
          <div className="w-10 h-10 rounded-full bg-slate-100 border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 active:translate-y-0.5 transition-transform">
            <ArrowLeft size={18} strokeWidth={2.5} />
          </div>
        </Link>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location Tracking</p>
          <h1 className="text-lg font-black text-slate-900 leading-tight">Map Session</h1>
        </div>
      </div>

      {/* Full Map */}
      <div className="w-full h-[50vh] relative">
        <LeafletMap locations={locations} currentLocation={currentLocation} />
      </div>

      {/* Filter Tabs */}
      <div className="px-6 mt-4">
        <div className="flex bg-white border-[1.5px] border-slate-900 rounded-[20px] p-1 shadow-[0_4px_0_rgba(15,23,42,1)]">
          {(['Today', 'This Week', 'This Month'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 flex justify-center items-center gap-1 rounded-[16px] text-xs font-black transition-all ${filter === f ? 'bg-[#bde0fe] border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)]' : 'text-slate-500'}`}
            >
              <Filter size={12} /> {f}
            </button>
          ))}
        </div>
      </div>

      {/* Closest Scheme Card */}
      <div className="px-6 mt-4 space-y-4">
        {closestScheme && (
          <div className="bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#d8f3dc] border border-slate-900 flex items-center justify-center">
                <MapPin size={14} className="text-slate-900" strokeWidth={2.5} />
              </div>
              <span className="text-[12px] font-black text-slate-900 uppercase tracking-wide">Nearest Scheme</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Scheme Name</span>
                <span className="text-sm font-black text-slate-900">{closestScheme.scheme.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Block</span>
                <span className="text-sm font-black text-slate-900">{closestScheme.scheme.block}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Distance</span>
                <span className="text-sm font-black text-emerald-700">
                  {closestScheme.distanceMeters > 1000
                    ? `${(closestScheme.distanceMeters / 1000).toFixed(1)} km`
                    : `${closestScheme.distanceMeters} meters`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Location Log */}
        <div className="bg-white border-[1.5px] border-slate-900 rounded-[24px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)]">
          <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-wide mb-3">Location Log ({locations.length} points)</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {locations.length === 0 && (
              <p className="text-xs font-bold text-slate-400 text-center py-4">No location data for this period</p>
            )}
            {locations.slice().reverse().slice(0, 20).map((loc, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-xs font-black text-slate-900">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</p>
                  <p className="text-[10px] font-bold text-slate-500">{new Date(loc.timestamp).toLocaleDateString()}</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{new Date(loc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
