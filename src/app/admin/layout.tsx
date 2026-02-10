'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Map,
    PackageSearch,
    FileText,
    Settings,
    Menu,
    ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a utility function for classes, like cn

// Utility for class name merging (recreate here simple if not imported)
function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Projects', href: '/admin/projects', icon: Map },
        { name: 'Inventory (BOQ)', href: '/admin/inventory', icon: PackageSearch },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside
                className={classNames(
                    "bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col z-20",
                    sidebarOpen ? "w-64" : "w-20"
                )}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
                    {sidebarOpen ? (
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Infra-OS
                        </h1>
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto" />
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
                    >
                        {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative",
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon size={20} className={classNames(
                                    "shrink-0",
                                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                                )} />

                                {sidebarOpen && (
                                    <span className="ml-3 truncate">{item.name}</span>
                                )}

                                {!sidebarOpen && (
                                    <div className="absolute left-14 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile (Bottom) */}
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium text-xs">
                            AD
                        </div>
                        {sidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-900">Admin User</span>
                                <span className="text-xs text-slate-500">Super Admin</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center text-sm text-slate-500">
                        <span className="font-medium text-slate-900">Dashboard</span>
                        <span className="mx-2">/</span>
                        <span>Overview</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Add Notifications / Theme Toggle here */}
                        <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
                            Logout
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
}
