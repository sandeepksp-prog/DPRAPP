"use client";

import React from 'react';
import { Activity, FileText } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export const BILLING_TABS = [
    { id: "progress", label: "Work Progress (View)", icon: Activity, path: "/billing" },
    { id: "ra-entry", label: "Client Bill Progress (RA Entry)", icon: FileText, path: "/billing/ra-entry" },
];

export default function BillingNavigation() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="flex border-b border-slate-200 bg-white">
            {BILLING_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.path;
                return (
                    <button
                        key={tab.id}
                        onClick={() => router.push(tab.path)}
                        className={`flex-1 py-4 flex flex-row items-center justify-center gap-2 border-r border-slate-100 relative transition-all group px-3
                            ${isActive ? "bg-gradient-to-t from-blue-500/10 to-transparent text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
                        `}
                    >
                        <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-500"} />
                        <span className="text-sm font-bold uppercase tracking-wider text-center whitespace-nowrap">{tab.label}</span>
                        {isActive && <div className="absolute bottom-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                    </button>
                )
            })}
        </div>
    );
}
