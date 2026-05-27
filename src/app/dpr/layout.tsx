import React from 'react';
import { Metadata } from 'next';
import BottomTabs from '@/components/dpr/BottomTabs';

import type { Viewport } from 'next';

export const metadata: Metadata = {
  title: 'KSPPL - DPR App',
  description: 'Mobile application for submitting daily project reports',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function DPRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-200 flex items-center justify-center font-sans">
      
      {/* Desktop Wrapper / Mobile Simulator */}
      <div className="relative w-full h-[100dvh] md:h-[844px] md:w-[390px] md:rounded-[40px] md:shadow-2xl bg-[#F2F5F8] overflow-hidden border-0 md:border-[12px] md:border-slate-800 flex flex-col mx-auto">
        
        {/* Simulated iOS StatusBar on Desktop */}
        <div className="hidden md:flex justify-between items-center px-6 py-3 text-slate-800 text-xs font-semibold z-50 bg-white/80 backdrop-blur-sm absolute top-0 w-full">
          <span>9:41</span>
          <div className="flex gap-2 items-center">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.35-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
            <div className="w-5 h-3 border border-slate-800 rounded-sm relative">
              <div className="absolute inset-0.5 bg-slate-800 rounded-sm" />
              <div className="absolute right-[-3px] top-1 h-1 w-0.5 bg-slate-800" />
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#F2F5F8] md:pt-14 pb-24 custom-scrollbar-hide">
          {/* KSPPL Watermark */}
          <div className="fixed inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <img src="/assets/logo.png" alt="KSPPL Watermark" className="w-[800px] md:w-[600px] object-contain rotate-[-15deg] mix-blend-multiply" />
          </div>

          <div className="relative z-10">
            {children}
          </div>
        </main>
        
        {/* Fixed Bottom Tabs */}
        <BottomTabs />
        
      </div>
    </div>
  );
}
