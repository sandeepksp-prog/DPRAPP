"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileEdit, Clock, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', path: '/dpr', icon: Home, activeColor: 'bg-[#bde0fe]' },
    { name: 'Forms', path: '/dpr/form', icon: FileEdit, activeColor: 'bg-[#ffc8dd]' },
    { name: 'History', path: '/dpr/history', icon: Clock, activeColor: 'bg-[#d8f3dc]' },
    { name: 'Settings', path: '/dpr/settings', icon: Settings, activeColor: 'bg-[#E5D4F5]' },
  ];

  return (
    <div className="absolute bottom-6 left-6 right-6 bg-white border-[1.5px] border-slate-900 rounded-full h-14 flex items-center justify-between px-2 shadow-[0_4px_0_rgba(15,23,42,1)] z-50">
      {tabs.map((tab) => {
        const isActive = tab.path === '/dpr' ? pathname === '/dpr' : pathname.startsWith(tab.path);
        const Icon = tab.icon;

        if (isActive) {
          return (
            <Link key={tab.name} href={tab.path} className="flex items-center justify-center tap-highlight-transparent">
              <div className={`${tab.activeColor} border-[1.5px] border-slate-900 rounded-full h-10 px-6 flex items-center justify-center text-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)]`}>
                <Icon size={20} strokeWidth={2.5} />
              </div>
            </Link>
          );
        }

        return (
          <Link key={tab.name} href={tab.path} className="flex items-center justify-center tap-highlight-transparent w-12 h-12 text-slate-500 hover:text-slate-900 transition-colors">
            <Icon size={22} strokeWidth={2.5} />
          </Link>
        );
      })}
    </div>
  );
}
