'use client';

import React from 'react';
import {
    Users, UserCheck, Banknote, Ticket,
    TrendingUp, PieChart, FileText, AlertTriangle,
    ShieldAlert, MapPin, Briefcase, CalendarClock
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
    Line, ComposedChart
} from 'recharts';

// --- MOCK DATA FOR EMPLOYEE DASHBOARD ---
const PAYROLL_TRENDS = [
    { month: 'Sep', budget: 12.5, actual: 12.1 },
    { month: 'Oct', budget: 12.5, actual: 12.4 },
    { month: 'Nov', budget: 13.0, actual: 12.8 },
    { month: 'Dec', budget: 13.0, actual: 13.2 }, // Bonus/Overtime spike
    { month: 'Jan', budget: 13.5, actual: 13.4 },
    { month: 'Feb', budget: 13.5, actual: 13.1 },
];

const WORKFORCE_DISTRIBUTION = [
    { category: 'Engineering', count: 85, fullMark: 100 },
    { category: 'Skilled Labor', count: 65, fullMark: 100 },
    { category: 'Unskilled', count: 95, fullMark: 100 },
    { category: 'Admin/Ops', count: 45, fullMark: 100 },
    { category: 'Management', count: 25, fullMark: 100 },
];

const EMPLOYEE_DIRECTORY = [
    { id: 'EMP-1042', name: 'Rajendra Singh', role: 'Site Engineer', location: 'Aliganj Zone A', status: 'Active', attendance: '98%' },
    { id: 'EMP-1185', name: 'Anil Kumar', role: 'Welding Foreman', location: 'Shitalpur Block', status: 'On Leave', attendance: '85%' },
    { id: 'EMP-0934', name: 'Vivek Sharma', role: 'Project Manager', location: 'HQ / Awagarh', status: 'Active', attendance: '100%' },
    { id: 'EMP-1822', name: 'Mohd. Tariq', role: 'Excavator Operator', location: 'Jalesar Phase 1', status: 'Active', attendance: '92%' },
    { id: 'EMP-2041', name: 'Sunita Devi', role: 'Admin QA/QC', location: 'Sakit Outer', status: 'Active', attendance: '96%' },
];

const EXCEPTION_FEED = [
    { title: 'Unplanned Absence (3 Days)', employee: 'Suresh Kumar - Plumber', severity: 'Critical', age: '4 Hours' },
    { title: 'Medical Leave Request', employee: 'Anil Kumar - Welding Foreman', severity: 'Medium', age: '1 Day' },
    { title: 'Overtime Grievance (Jan)', employee: 'Roba Const. Labor Uni.', severity: 'High', age: '2 Days' },
    { title: 'Pending Onboarding Docs', employee: 'Rahul Verma - Jr. Eng', severity: 'Low', age: '5 Days' },
];

export default function EmployeeView({ subMenu }: { subMenu?: string }) {

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1600px] mb-12">

            {/* TIER 1: STRATEGIC HERO HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Personnel */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">TOTAL ACTIVE PERSONNEL</p>
                        <h2 className="text-3xl font-black text-slate-800">2,845<span className="text-lg text-slate-400 font-bold ml-1">Heads</span></h2>
                        <p className="text-xs font-bold text-emerald-500 mt-2">+12 Onboarded This Week</p>
                    </div>
                </div>

                {/* Today's Attendance */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <UserCheck size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">TODAY'S ATTENDANCE</p>
                        <h2 className="text-3xl font-black text-emerald-600">94<span className="text-lg text-slate-500 font-bold ml-1">%</span></h2>
                        <p className="text-xs font-bold text-slate-500 mt-2">2,674 Present vs 2,845 Roster</p>
                    </div>
                </div>

                {/* Payroll Status */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
                            <Banknote size={20} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">CURRENT PAYROLL RUN</p>
                        <h2 className="text-3xl font-black text-slate-800">Processing</h2>
                        <p className="text-xs font-bold text-violet-600 mt-2">Feb 2026 Batch • 85% Audited</p>
                    </div>
                </div>

                {/* Open HR Tickets */}
                <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded-2xl p-6 shadow-lg border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-2.5 bg-slate-800/80 text-amber-400 rounded-xl border border-slate-700">
                            <Ticket size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">OPEN HR TICKETS</p>
                        <h2 className="text-3xl font-black text-white">14<span className="text-lg text-slate-400 font-bold ml-1">Issues</span></h2>
                        <p className="text-xs font-bold text-amber-400 mt-2">3 Critical Grievances</p>
                    </div>
                </div>
            </div>

            {/* TIER 2: TRENDS & BREAKDOWN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Payroll Expenditure Bar Chart */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <TrendingUp size={18} className="text-violet-600" />
                                Payroll Expenditure vs Budget (₹ Cr)
                            </h3>
                            <p className="text-xs font-bold text-slate-500 mt-1">6-Month trailing labor cost analysis</p>
                        </div>
                        <div className="flex gap-4 text-[10px] font-black tracking-wider uppercase">
                            <div className="flex items-center gap-1.5 object-contain">
                                <div className="w-2.5 h-2.5 rounded-sm bg-violet-500"></div>
                                <span className="text-slate-600">Actual Outflow</span>
                            </div>
                            <div className="flex items-center gap-1.5 line-through decoration-slate-400">
                                <div className="w-2.5 h-0.5 rounded-sm bg-slate-400"></div>
                                <span className="text-slate-600">Budgeted Baseline</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[280px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={PAYROLL_TRENDS} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dx={-10} domain={['dataMin - 1', 'dataMax + 1']} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}
                                />
                                <Bar dataKey="actual" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} barSize={40} />
                                <Line type="monotone" dataKey="budget" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#94a3b8', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Workforce Distribution Radar */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden flex flex-col">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2 mb-2">
                        <PieChart size={18} className="text-blue-600" />
                        Workforce Skill Distribution
                    </h3>
                    <p className="text-xs font-bold text-slate-500">Relative density of personnel categories</p>

                    <div className="flex-1 min-h-[250px] relative mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={WORKFORCE_DISTRIBUTION}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="category" tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Personnel Density"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="#3b82f6"
                                    fillOpacity={0.3}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* TIER 3: DATA GRIDS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Employee Directory Table */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Briefcase size={18} className="text-indigo-600" />
                            Core Team Directory
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">SEARCHING ACTIVE</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                                    <th className="py-3 px-4">Employee Details</th>
                                    <th className="py-3 px-4">Role & Location</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-right">Attendance TTM</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-slate-700">
                                {EMPLOYEE_DIRECTORY.map((emp, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-3 px-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{emp.name}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{emp.id}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm text-slate-700 font-bold">{emp.role}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{emp.location}</div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                                'bg-amber-50 text-amber-600 border border-amber-200'
                                                }`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right font-black text-indigo-600">
                                            {emp.attendance}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Leave & Exception Feed */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                    <div className="p-5 border-b border-slate-100 bg-amber-50/30">
                        <h3 className="text-lg font-black text-amber-800 tracking-tight flex items-center gap-2">
                            <CalendarClock size={18} className="text-amber-600" />
                            Leave & Exceptions Feed
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20 custom-scrollbar space-y-3">
                        {EXCEPTION_FEED.map((issue, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-amber-200 transition-colors group relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${issue.severity === 'Critical' ? 'bg-rose-500' :
                                    issue.severity === 'High' ? 'bg-orange-500' :
                                        issue.severity === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                                    }`}></div>

                                <div className="flex justify-between items-start mb-1 pl-2">
                                    <h4 className="text-sm font-black text-slate-800 group-hover:text-amber-600 transition-colors leading-tight">{issue.title}</h4>
                                </div>

                                <div className="pl-2 mt-2 flex justify-between items-end">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <UserCheck size={12} />
                                        <span className="text-[11px] font-bold uppercase truncate max-w-[120px]">{issue.employee}</span>
                                    </div>
                                    <div className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                        Logged: {issue.age}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
