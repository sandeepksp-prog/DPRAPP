"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Filter } from 'lucide-react';
import type { LocationPoint } from './LeafletMap';

// Dynamically import LeafletMap with no SSR to prevent "window is not defined" error
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <div className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

export default function MapBanner() {
  const [filter, setFilter] = useState<'Current Week' | 'Prev Week' | 'Prev Month'>('Current Week');
  const [showFilters, setShowFilters] = useState(false);
  
  const [locations, setLocations] = useState<LocationPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [syncing, setSyncing] = useState(true);

  // Load locations from local storage and start geolocation tracking
  useEffect(() => {
    // 1. Load history
    const saved = localStorage.getItem('dpr_user_locations');
    let history: LocationPoint[] = [];
    if (saved) {
      try { history = JSON.parse(saved); } catch (e) {}
    }
    
    // Filter logic based on the user's dropdown choice
    const now = new Date();
    const filteredHistory = history.filter(loc => {
      const locDate = new Date(loc.timestamp);
      const diffTime = Math.abs(now.getTime() - locDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (filter === 'Current Week') return diffDays <= 7;
      if (filter === 'Prev Week') return diffDays > 7 && diffDays <= 14;
      if (filter === 'Prev Month') return diffDays <= 30;
      return true;
    });

    setLocations(filteredHistory);

    // 2. Track current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc: LocationPoint = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString()
          };
          
          setCurrentLocation([newLoc.lat, newLoc.lng]);
          setSyncing(false);

          // Avoid pushing duplicate locations rapidly (check last entry)
          const isDuplicate = history.length > 0 && 
            Math.abs(history[history.length - 1].lat - newLoc.lat) < 0.0001 &&
            Math.abs(history[history.length - 1].lng - newLoc.lng) < 0.0001 &&
            (new Date().getTime() - new Date(history[history.length-1].timestamp).getTime() < 3600000); // within 1 hour

          if (!isDuplicate && filter === 'Current Week') {
            const updatedHistory = [...history, newLoc];
            localStorage.setItem('dpr_user_locations', JSON.stringify(updatedHistory));
            setLocations(prev => [...prev, newLoc]);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setSyncing(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    } else {
      setSyncing(false);
    }
  }, [filter]);

  return (
    <div className="relative w-full h-[130px] md:h-[150px] bg-slate-100 border-[1.5px] border-slate-900 rounded-[24px] overflow-hidden shadow-[0_4px_0_rgba(15,23,42,1)] group">
      
      {/* Dynamic Map Component */}
      <div className="absolute inset-0 z-0">
        <LeafletMap locations={locations} currentLocation={currentLocation} />
      </div>

      {/* Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
        <div>
          <h3 className="font-black text-slate-900 text-lg leading-none drop-shadow-md">Map Session</h3>
        </div>

        {/* Filter Dropdown */}
        <div className="relative pointer-events-auto">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 bg-white border-[1.5px] border-slate-900 rounded-full px-3 py-1.5 text-xs font-bold text-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5 transition-all"
          >
            {filter} <Filter size={12} strokeWidth={3} />
          </button>
          
          {showFilters && (
            <div className="absolute top-full right-0 mt-2 w-36 bg-white border-[1.5px] border-slate-900 rounded-[16px] shadow-[0_4px_0_rgba(15,23,42,1)] overflow-hidden z-20">
              {['Current Week', 'Prev Week', 'Prev Month'].map(f => (
                <button 
                  key={f}
                  onClick={() => { setFilter(f as any); setShowFilters(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-slate-100 transition-colors ${filter === f ? 'text-sky-600 bg-sky-50' : 'text-slate-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating GPS Status */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-white/90 backdrop-blur-sm border-2 border-slate-900 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-[0_2px_0_rgba(15,23,42,1)]">
        <div className={`w-2 h-2 rounded-full ${syncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">
          {syncing ? 'Syncing Coordinates...' : 'GPS Active'}
        </span>
      </div>
    </div>
  );
}
