'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutGrid,
    Map,
    Package,
    ClipboardList,
    Settings,
    LogOut,
    Search,
    Bell,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navigation = [
        { name: 'Overview', href: '/admin', icon: LayoutGrid },
        { name: 'Projects', href: '/admin/projects', icon: Map },
        { name: 'Inventory', href: '/admin/inventory', icon: Package },
        { name: 'Reports', href: '/admin/reports', icon: ClipboardList },
    ];

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Sidebar - Floating Style */}
            <aside className="hidden md:flex flex-col w-72 p-4">
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] flex flex-col border border-slate-100 dark:border-slate-800 overflow-hidden">

                    {/* Brand */}
                    <div className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                                <span className="font-bold text-lg">IO</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Infra-OS</h1>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Admin Console</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-4 space-y-1 mt-6">
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Main Menu</p>
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <Icon size={20} className={cn(
                                        "transition-colors",
                                        isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"
                                    )} strokeWidth={1.5} />
                                    <span>{item.name}</span>
                                    {isActive && (
                                        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                                    )}
                                </Link>
                            );
                        })}

                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-8 ml-2">System</p>
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                        >
                            <Settings size={20} className="text-slate-400" strokeWidth={1.5} />
                            <span>Settings</span>
                        </Link>
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 mt-auto">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 p-0.5 shadow-sm">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full rounded-full" />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Admin User</p>
                                    <p className="text-xs text-slate-500">Super Admin</p>
                                </div>
                            </div>
                            <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* Top Header - Glassmorphism */}
                <header className="h-20 px-8 flex items-center justify-between shrink-0 z-20">
                    <div className="flex items-center gap-4 text-slate-400">
                        {/* Breadcrumbs or Date could go here */}
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-medium text-slate-600 dark:text-slate-300">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span>System Operational</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm placeholder:text-slate-400"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
                            <Bell size={20} strokeWidth={1.5} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto px-8 pb-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {children}
                </div>
            </main>
        </div>
    );
}
