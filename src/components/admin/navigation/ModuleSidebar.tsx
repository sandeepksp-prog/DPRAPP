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
        <div className="w-[260px] ml-6 my-6 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hidden md:flex flex-col h-[calc(100vh-252px)]">
            <div className="px-5 py-5 border-b border-slate-50/50 bg-slate-50/30">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {activeTab.replace('_', ' ')} MENU
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {subItems.map((item, idx) => {
                    const isActive = activeSubMenu === idx;
                    return (
                        <button
                            key={idx}
                            onClick={() => setActiveSubMenu(idx)}
                            className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all duration-200
                                ${isActive
                                    ? "bg-blue-50 text-blue-700 font-bold shadow-sm ring-1 ring-blue-100"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium"}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>}
                                {!isActive && <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>}
                                {item}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}
