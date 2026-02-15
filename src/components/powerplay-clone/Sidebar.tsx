'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, FileText, ListTodo, AlertTriangle, Banknote,
    Tag, Cloud, Settings, FolderOpen, Table2, HardHat, X,
    ClipboardList, ShoppingCart, Home
} from 'lucide-react';
import { colors, shadows } from './theme';

/* ═══════════════════════════════════════════════════════════════════
   POWERPLAY SIDEBAR — 64px Icon Bar + Dark Flyout
   Cloned from: portal.getpowerplay.in
   ═══════════════════════════════════════════════════════════════════ */

const SIDEBAR_WIDTH = '64px';
const FLYOUT_WIDTH = '200px';

interface NavItem {
    id: string;
    label: string;
    icon: any;
    href?: string;
    children?: { label: string; href: string; icon?: any }[];
}

const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'projects', label: 'Projects', icon: LayoutDashboard, href: '/admin' },
    {
        id: 'tasks', label: 'Tasks', icon: ListTodo,
        children: [
            { label: 'Plan View', href: '/admin/tasks' },
            { label: 'Open Issues', href: '/admin/issues' },
            { label: 'List View', href: '/admin/tasks?view=list' },
        ],
    },
    { id: 'issues', label: 'Issues', icon: AlertTriangle, href: '/admin/issues' },
    {
        id: 'commercial', label: 'Commercial', icon: Banknote,
        children: [
            { label: 'Indents', href: '/admin/indents', icon: ClipboardList },
            { label: 'Purchase Orders', href: '/admin/purchase-orders', icon: ShoppingCart },
        ],
    },
    { id: 'tags', label: 'Tags', icon: Tag, href: '/admin/tags' },
    { id: 'storage', label: 'Storage', icon: Cloud, href: '/admin/storage' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
    { id: 'documents', label: 'Documents', icon: FolderOpen, href: '/admin/documents' },
    { id: 'boq', label: 'BOQ', icon: Table2, href: '/admin/boq' },
];

export default function Sidebar() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const pathname = usePathname();

    const handleIconClick = (item: NavItem) => {
        if (item.children) {
            setActiveId(activeId === item.id ? null : item.id);
        } else {
            setActiveId(null);
        }
    };

    const activeFlyoutItem = navItems.find((n) => n.id === activeId);

    return (
        <>
            {/* 64px Icon Sidebar */}
            <aside
                className="fixed left-0 top-0 h-screen flex flex-col items-center z-50"
                style={{
                    width: SIDEBAR_WIDTH,
                    backgroundColor: '#1B2A4A',
                    paddingTop: '8px',
                }}
            >
                {/* Logo */}
                <Link href="/admin" className="mb-4 flex items-center justify-center w-10 h-10">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary.blue }}>
                        <HardHat size={20} className="text-white" />
                    </div>
                </Link>

                {/* Nav Icons */}
                <nav className="flex-1 flex flex-col items-center gap-0.5 w-full px-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href && item.href !== '/admin' && pathname?.startsWith(item.href)) ||
                            activeId === item.id;

                        return (
                            <React.Fragment key={item.id}>
                                {item.href && !item.children ? (
                                    <Link
                                        href={item.href}
                                        className="w-10 h-10 rounded flex items-center justify-center transition-all duration-150 relative group"
                                        style={{
                                            backgroundColor: isActive ? 'rgba(37,99,235,0.25)' : 'transparent',
                                            color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                                        }}
                                        title={item.label}
                                        onClick={() => setActiveId(null)}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r" style={{ backgroundColor: colors.primary.blue }} />
                                        )}
                                        <Icon size={20} />
                                    </Link>
                                ) : (
                                    <button
                                        className="w-10 h-10 rounded flex items-center justify-center transition-all duration-150 relative group"
                                        style={{
                                            backgroundColor: activeId === item.id ? 'rgba(37,99,235,0.25)' : 'transparent',
                                            color: activeId === item.id ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                                        }}
                                        title={item.label}
                                        onClick={() => handleIconClick(item)}
                                    >
                                        <Icon size={20} />
                                    </button>
                                )}

                                {/* Separator dots between groups */}
                                {(item.id === 'commercial' || item.id === 'storage') && (
                                    <div className="flex gap-0.5 my-1">
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>

                {/* Version tag */}
                <div className="pb-2 text-center">
                    <span className="text-[8px] text-white/20 font-mono">v2.0</span>
                </div>
            </aside>

            {/* Dark Flyout Panel */}
            {activeFlyoutItem && activeFlyoutItem.children && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveId(null)}
                        style={{ backgroundColor: 'transparent' }}
                    />

                    {/* Flyout */}
                    <div
                        className="fixed top-0 h-screen z-45 flex flex-col shadow-2xl transition-all duration-300 ease-out"
                        style={{
                            left: SIDEBAR_WIDTH,
                            width: FLYOUT_WIDTH,
                            backgroundColor: '#1B2A4A',
                            borderLeft: '1px solid rgba(255,255,255,0.08)',
                            opacity: 1,
                            transform: 'translateX(0)',
                        }}
                    >
                        {/* Flyout Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <span className="text-xs font-semibold uppercase tracking-wider text-white/60 animate-in fade-in duration-300">
                                {activeFlyoutItem.label}
                            </span>
                            <button
                                onClick={() => setActiveId(null)}
                                className="w-6 h-6 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Flyout Nav Links */}
                        <nav className="flex-1 py-2 px-2 space-y-1">
                            {activeFlyoutItem.children.map((child, idx) => {
                                const isChildActive = pathname === child.href;
                                const ChildIcon = child.icon;
                                return (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        onClick={() => setActiveId(null)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-200 hover:bg-white/5 hover:translate-x-1"
                                        style={{
                                            backgroundColor: isChildActive ? 'rgba(37,99,235,0.2)' : 'transparent',
                                            color: isChildActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                                            animationDelay: `${idx * 50}ms`,
                                        }}
                                    >
                                        {ChildIcon && <ChildIcon size={15} className="transition-transform group-hover:scale-110" />}
                                        {!ChildIcon && <div className="w-1.5 h-1.5 rounded-full transition-all duration-300" style={{ backgroundColor: isChildActive ? colors.primary.blue : 'rgba(255,255,255,0.3)', transform: isChildActive ? 'scale(1.2)' : 'scale(1)' }} />}
                                        <span className="text-[13px] font-medium">{child.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </>
            )}
        </>
    );
}

// ─── ACTION HEADER ───────────────────────────────────────────────
// Top bar: Project Name + SYNC + Notifications + Avatar
export function ActionHeader({ projectName, subtitle }: { projectName?: string; subtitle?: string }) {
    return (
        <header
            className="sticky top-0 z-30 flex items-center justify-between px-6 border-b"
            style={{
                height: '48px',
                backgroundColor: colors.neutral.white,
                borderColor: colors.neutral.gray200,
                boxShadow: shadows.header,
            }}
        >
            <div className="flex items-center gap-3">
                <h1 className="font-bold" style={{ fontSize: '14px', color: colors.neutral.gray800 }}>
                    {projectName || 'INFRA-OS'}
                </h1>
                {subtitle && (
                    <>
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#DBEAFE', color: colors.primary.blue, fontWeight: 500 }}>
                            SYNC
                        </span>
                        <span className="text-xs" style={{ color: colors.neutral.gray400 }}>
                            {subtitle}
                        </span>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                {/* Notification bell */}
                <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 transition-colors relative">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.neutral.gray500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white" />
                </button>
                {/* Avatar */}
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: colors.primary.blue }}
                >
                    SK
                </div>
            </div>
        </header>
    );
}
