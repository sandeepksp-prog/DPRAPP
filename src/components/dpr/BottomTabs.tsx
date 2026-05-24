"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileEdit, Clock, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', path: '/dpr', icon: Home },
    { name: 'Reports', path: '/dpr/reports', icon: FileEdit },
    { name: 'History', path: '/dpr/history', icon: Clock },
    { name: 'Settings', path: '/dpr/settings', icon: Settings },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t-[1.5px] border-slate-900 z-50 md:rounded-b-[28px] pb-safe px-4 pt-3 pb-6 flex justify-around items-center">
      {tabs.map((tab) => {
        const isActive = tab.path === '/dpr' ? pathname === '/dpr' : pathname.startsWith(tab.path);
        const Icon = tab.icon;

        return (
          <Link key={tab.name} href={tab.path} className="relative flex items-center justify-center tap-highlight-transparent group">
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${isActive ? 'bg-[#1a80e5] text-white border-[1.5px] border-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
              <Icon size={22} className="relative z-10" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
