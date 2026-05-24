"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GPSCaptureProps {
  label: string;
  value: { lat: number; lng: number } | null;
  onChange: (val: { lat: number; lng: number } | null) => void;
  required?: boolean;
}

export const GPSCapture: React.FC<GPSCaptureProps> = ({ label, value, onChange, required }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureLocation = () => {
    setIsCapturing(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsCapturing(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsCapturing(false);
      },
      (err) => {
        setError("Unable to retrieve your location. Please check permissions.");
        setIsCapturing(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex flex-col gap-2 mb-6">
      <label className="text-sm font-bold text-slate-900 ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative rounded-[24px] bg-white border-[1.5px] border-slate-900 overflow-hidden p-6 flex flex-col items-center justify-center min-h-[160px] transition-all hover:shadow-[0_4px_0_rgba(15,23,42,1)] hover:translate-y-[-2px]">
        {!value && !isCapturing && (
          <button
            type="button"
            onClick={captureLocation}
            className="flex flex-col items-center gap-3 text-slate-900 hover:text-sky-600 transition-colors group"
          >
            <div className="w-16 h-16 rounded-full bg-[#bde0fe] flex items-center justify-center border-[1.5px] border-slate-900 shadow-[0_4px_0_rgba(15,23,42,1)] group-active:shadow-none group-active:translate-y-1 transition-all">
              <svg className="w-8 h-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-semibold text-sm">Tap to Capture GPS</span>
          </button>
        )}

        {isCapturing && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Pulsing Concentric SVG Map Radar */}
              <motion.div
                animate={{ scale: [1, 2, 2], opacity: [0.8, 0, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-8 h-8 rounded-full border-2 border-sky-400"
              />
              <motion.div
                animate={{ scale: [1, 2, 2], opacity: [0.8, 0, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                className="absolute w-8 h-8 rounded-full border-2 border-sky-400"
              />
              <motion.div
                animate={{ scale: [1, 2, 2], opacity: [0.8, 0, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 1 }}
                className="absolute w-8 h-8 rounded-full border-2 border-sky-400"
              />
              <div className="w-4 h-4 bg-sky-400 rounded-full z-10 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
            </div>
            <span className="text-sky-400 text-sm animate-pulse font-medium">Acquiring satellites...</span>
          </div>
        )}

        {value && !isCapturing && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center w-full"
          >
            <div className="w-16 h-16 rounded-full bg-[#d8f3dc] flex items-center justify-center border-[1.5px] border-slate-900 mb-3 shadow-[0_4px_0_rgba(15,23,42,1)]">
              <svg className="w-8 h-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-center w-full px-4">
              <p className="text-slate-900 font-black mb-2">Location Verified</p>
              <div className="bg-[#F2F5F8] rounded-[16px] p-3 flex justify-between items-center w-full border-[1.5px] border-slate-900 text-xs font-mono shadow-[0_2px_0_rgba(15,23,42,1)]">
                <div>
                  <span className="text-slate-500 font-bold mr-2">LAT</span>
                  <span className="text-slate-900 font-black">{value.lat.toFixed(6)}°</span>
                </div>
                <div className="h-4 w-[1.5px] bg-slate-900" />
                <div>
                  <span className="text-slate-500 font-bold mr-2">LNG</span>
                  <span className="text-slate-900 font-black">{value.lng.toFixed(6)}°</span>
                </div>
              </div>
            </div>
            <button
              onClick={captureLocation}
              className="mt-4 text-xs font-bold text-slate-900 bg-white border-[1.5px] border-slate-900 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors shadow-[0_2px_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5"
            >
              Recapture
            </button>
          </motion.div>
        )}

        {error && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-rose-50 border-t border-rose-100 text-rose-600 font-medium text-xs text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
