'use client';

import React from 'react';
import { LayoutDashboard, Package2, IndianRupee, Users } from 'lucide-react';

export type TabType = 'work' | 'material' | 'billing' | 'resources';

interface AdminTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
    const tabs = [
        { id: 'work', label: 'Work Progress', icon: LayoutDashboard },
        { id: 'material', label: 'Material Hub', icon: Package2 },
        { id: 'billing', label: 'Finance Console', icon: IndianRupee },
        { id: 'resources', label: 'Resource Center', icon: Users },
    ] as const;

    return (
        <div className="flex space-x-1 bg-slate-100/50 p-1.5 rounded-2xl mb-8 border border-slate-200 w-fit mx-auto md:mx-0">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as TabType)}
                        className={`
                            flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                            ${isActive
                                ? 'bg-white text-[#0066CC] shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-[#663399] hover:bg-white/50'
                            }
                        `}
                    >
                        <Icon size={18} className={isActive ? 'text-[#0066CC]' : 'text-slate-400 group-hover:text-[#663399]'} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
