import React from 'react';

// Sub-menu configurations for each module
export const MODULE_SUB_MENUS: Record<string, string[]> = {
    summary: ["Execution Summary", "Financial Summary", "Store Summary"],
    scheme: ["Sakit", "Shitalpur", "Jaithra", "Aliganj", "Nidhauli Kalan", "Awagarh", "Jalesar", "Marehra"],
    store: ["Inward", "Outward", "Inventory"],
    billing: ["Client Billing", "Contractor Billing", "Departmental", "Bill Discounting"],
    dpr: ["Today's Report", "DPR Summary", "Issue Reports"],
    employee: ["Employee Details", "Salary Details", "Payslips"],
    issues: ["Target Details", "Achieved Status", "Recurring Issues"]
};

interface ModuleSidebarProps {
    activeTab: string;
    activeSubMenu: number;
    setActiveSubMenu: (index: number) => void;
}

export default function ModuleSidebar({ activeTab, activeSubMenu, setActiveSubMenu }: ModuleSidebarProps) {
    const subItems = MODULE_SUB_MENUS[activeTab] || [];

    return (
        <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto py-4 hidden md:block h-full">
            <div className="px-6 mb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                    {activeTab.replace('_', ' ')} MENU
                </h3>
            </div>
            <div className="space-y-1">
                {subItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveSubMenu(idx)}
                        className={`w-full text-left px-6 py-3 text-sm font-medium border-l-4 transition-all
                            ${activeSubMenu === idx
                                ? "border-blue-500 bg-white text-blue-700 shadow-sm"
                                : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700"}
                        `}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
}
