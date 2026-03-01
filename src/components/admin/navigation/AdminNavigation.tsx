import React from 'react';
import { PieChart, BarChart2, Package, Receipt, ClipboardList, Users, AlertTriangle } from 'lucide-react';

export const ERP_TABS = [
    { id: "summary", label: "Overall Summary", icon: PieChart },
    { id: "scheme", label: "Scheme Data", icon: BarChart2 },
    { id: "store", label: "Store Data", icon: Package },
    { id: "billing", label: "Billing Data", icon: Receipt },
    { id: "dpr", label: "DPR Summary", icon: ClipboardList },
    { id: "employee", label: "Employee Data", icon: Users },
    { id: "issues", label: "Issue Report", icon: AlertTriangle },
];

interface AdminNavigationProps {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    onTabChange?: () => void;
}

export default function AdminNavigation({ activeTab, setActiveTab, onTabChange }: AdminNavigationProps) {
    return (
        <div className="flex border-b border-slate-200 overflow-x-auto">
            {ERP_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            if (onTabChange) onTabChange();
                        }}
                        className={`flex-1 py-3.5 flex flex-row items-center justify-center gap-2 border-r border-slate-100 relative transition-all group px-3
                            ${isActive ? "bg-gradient-to-t from-sky-500/15 to-transparent text-[var(--primary)]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
                        `}
                    >
                        <Icon size={16} className={isActive ? "text-[var(--primary)]" : "text-slate-400 group-hover:text-slate-500"} />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center whitespace-nowrap">{tab.label}</span>
                        {isActive && <div className="absolute bottom-0 w-full h-1 bg-[var(--primary)] rounded-t-full"></div>}
                    </button>
                )
            })}
        </div>
    );
}
