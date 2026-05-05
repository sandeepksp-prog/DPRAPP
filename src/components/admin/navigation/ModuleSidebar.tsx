import React from 'react';
import {
    LayoutDashboard, PieChart, Box, Settings,
    FileText, Users, AlertTriangle, Layers,
    Home, CheckSquare, Target, Clock, Receipt, Banknote, Briefcase,
    MapPin, Building, Landmark, Factory, Shield, Navigation, Mountain, Database
} from 'lucide-react';

// Sub-menu configurations for each module with mapped icons
export const MODULE_SUB_MENUS: Record<string, { label: string, icon: React.ElementType }[]> = {
    summary: [
        { label: "Execution Summary", icon: LayoutDashboard },
        { label: "Financial Summary", icon: PieChart },
        { label: "Store Summary", icon: Box }
    ],
    scheme: [
        { label: "Sakit", icon: MapPin },
        { label: "Shitalpur", icon: Building },
        { label: "Jaithra", icon: Landmark },
        { label: "Aliganj", icon: Factory },
        { label: "Nidhauli Kalan", icon: Shield },
        { label: "Awagarh", icon: Navigation },
        { label: "Jalesar", icon: Mountain },
        { label: "Marehra", icon: Layers }
    ],
    store: [
        { label: "Inward", icon: Box },
        { label: "Outward", icon: Layers },
        { label: "Inventory", icon: FileText }
    ],
    billing: [
        { label: "Master Database Setup", icon: Database },
        { label: "Client Billing", icon: Receipt },
        { label: "Contractor Billing", icon: Briefcase },
        { label: "Departmental", icon: Banknote },
        { label: "Bill Discounting", icon: FileText }
    ],
    dpr: [
        { label: "Today's Report", icon: Clock },
        { label: "DPR Summary", icon: FileText },
        { label: "Issue Reports", icon: AlertTriangle }
    ],
    employee: [
        { label: "Employee Details", icon: Users },
        { label: "Salary Details", icon: Banknote },
        { label: "Payslips", icon: Receipt }
    ],
    issues: [
        { label: "Target Details", icon: Target },
        { label: "Achieved Status", icon: CheckSquare },
        { label: "Recurring Issues", icon: AlertTriangle }
    ]
};

interface ModuleSidebarProps {
    activeTab: string;
    activeSubMenu: number;
    setActiveSubMenu: (index: number) => void;
}

export default function ModuleSidebar({ activeTab, activeSubMenu, setActiveSubMenu }: ModuleSidebarProps) {
    const subItems = MODULE_SUB_MENUS[activeTab] || [];

    return (
        <div className="w-[260px] ml-6 mb-6 mt-4 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden hidden md:flex flex-col h-[calc(100vh-200px)]">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-[12px] font-black text-slate-600 uppercase tracking-widest pl-1">
                    {activeTab.replace('_', ' ')} MENU
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {subItems.map((item, idx) => {
                    const isActive = activeSubMenu === idx;
                    const Icon = item.icon;
                    return (
                        <button
                            key={idx}
                            onClick={() => setActiveSubMenu(idx)}
                            className={`w-full text-left flex items-center gap-3 px-4 py-3.5 text-sm rounded-xl transition-all duration-300 relative overflow-hidden group cursor-pointer
                                ${isActive
                                    ? "bg-gradient-to-r from-blue-50 to-transparent text-slate-800 font-bold"
                                    : "text-slate-500 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent hover:text-slate-800 font-medium"}
                            `}
                        >
                            {/* Deep left colored line */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                            )}

                            {/* Hover effect for inactive items */}
                            {!isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            )}

                            <Icon size={18} className={`flex-shrink-0 transition-colors duration-300 ${isActive ? "text-[#2563EB]" : "text-slate-400 group-hover:text-slate-600"}`} />
                            <span className="truncate uppercase text-[11px] font-extrabold tracking-wider">{item.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}
