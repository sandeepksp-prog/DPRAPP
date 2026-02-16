'use client';

import React from 'react';
import { PowerCard, PowerButton, colors } from '@/components/powerplay-clone';
import { BRIGADE_DATA } from '@/lib/dummy-data';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    MoreHorizontal, ArrowUpRight, ArrowDownRight, Filter, Download,
    Settings, AlertTriangle, ChevronRight, Calendar, AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="space-y-6 font-sans text-slate-800">
            {/* HEADER */}
            <div className="flex flex-col gap-4">
                <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Hi, Akshay!</p>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        See what&apos;s happening at Brigade Group
                    </h1>
                </div>

                {/* CONTROLS */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white border border-slate-200 rounded px-3 py-1.5 text-sm font-medium shadow-sm hover:border-blue-300 cursor-pointer transition-colors">
                            <Filter size={14} className="mr-2 text-slate-400" />
                            <span>Projects</span>
                            <div className="w-4 h-4 bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center rounded-full ml-2">7</div>
                        </div>
                        {['Volvo Bhopal', 'Tata Laxmi Mahapower', 'Delhi Metro Station'].map((tag) => (
                            <div key={tag} className="flex items-center bg-blue-50 border border-blue-100 rounded px-3 py-1.5 text-sm font-medium text-blue-700">
                                {tag}
                                <button className="ml-2 hover:bg-blue-200 rounded-full p-0.5"><div className="w-3 h-3 text-current">×</div></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <PowerButton variant="secondary" size="sm">
                            <Settings size={14} className="mr-2" /> Configure Board
                        </PowerButton>
                        <PowerButton variant="primary" size="sm">
                            <Download size={14} className="mr-2" /> Export view
                        </PowerButton>
                    </div>
                </div>
            </div>

            {/* MASONRY GRID LAYOUT */}
            <div className="grid grid-cols-12 gap-6">

                {/* LEFT COLUMN (Financials) */}
                <div className="col-span-12 xl:col-span-4 space-y-6">

                    {/* Received vs Paid */}
                    <PowerCard className="h-[340px] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm">Received vs Paid</h3>
                            <select className="text-xs border rounded px-2 py-1 bg-slate-50"><option>FY 25</option></select>
                        </div>
                        <div className="flex items-center gap-6 mb-4">
                            <div>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Received</p>
                                <p className="text-xl font-bold text-slate-800">₹{BRIGADE_DATA.financials.receivedVsPaid.totalReceived.toFixed(2)} Cr</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Paid</p>
                                <p className="text-xl font-bold text-slate-800">₹{BRIGADE_DATA.financials.receivedVsPaid.totalPaid.toFixed(2)} Cr</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={BRIGADE_DATA.financials.receivedVsPaid.series}>
                                    <CartesianGrid vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        labelStyle={{ fontSize: 12, fontWeight: 600, color: '#1E293B' }}
                                    />
                                    <Line type="monotone" dataKey="received" stroke="#22C55E" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="paid" stroke="#EF4444" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </PowerCard>

                    {/* Financials Stacked Bar */}
                    <PowerCard className="h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <span className="w-1 h-4 bg-slate-800 rounded-sm" /> Financials
                            </h3>
                            <div className="flex gap-1">
                                <button className="p-1 hover:bg-slate-100 rounded"><div className="w-4 h-4 bg-slate-200 rounded-sm" /></button>
                                <button className="p-1 bg-slate-100 rounded text-blue-600"><div className="w-4 h-4 bg-current rounded-sm" /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                            <div>
                                <p className="text-[10px] text-slate-500 mb-1 flex items-center justify-center gap-1"><ArrowUpRight size={10} className="text-blue-500" /> BOQ achieved</p>
                                <p className="font-bold text-lg">₹{BRIGADE_DATA.financials.stats.boqAchieved}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 mb-1 flex items-center justify-center gap-1"><ArrowDownRight size={10} className="text-green-500" /> Total received</p>
                                <p className="font-bold text-lg">₹{BRIGADE_DATA.financials.stats.totalReceived}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 mb-1 flex items-center justify-center gap-1">Total Payable</p>
                                <p className="font-bold text-lg">₹{BRIGADE_DATA.financials.stats.totalPayable}</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={['Received amount', 'BOQ amount achieved', 'Budget amt achieved', 'Payable recorded', 'Paid amount'].map((label, idx) => ({
                                    name: label,
                                    ...BRIGADE_DATA.financials.stackedBar.reduce((acc, curr, i) => ({ ...acc, [curr.project]: i === 0 ? curr.boq : i === 1 ? curr.received : curr.payable }), {})
                                }))} barSize={20}>
                                    <CartesianGrid vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748B', width: 50 }} interval={0} />
                                    <Tooltip cursor={{ fill: '#F8FAFC' }} />
                                    <Bar dataKey="Volvo Bhopal" stackId="a" fill={colors.accent.chartYellow} radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="Blue Powerplant" stackId="a" fill={colors.accent.chartBlue} />
                                    <Bar dataKey="Delhi Metro Station" stackId="a" fill={colors.accent.chartPink} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-4">
                            {BRIGADE_DATA.financials.stackedBar.map(item => (
                                <div key={item.project} className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] text-slate-500 font-medium">{item.project}</span>
                                </div>
                            ))}
                        </div>
                    </PowerCard>

                    {/* Payables */}
                    <PowerCard className="py-4">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <h3 className="font-bold text-sm">Payables <span className="font-normal text-slate-400 text-xs ml-1">(3 Projects)</span></h3>
                            <select className="text-xs border-none bg-transparent font-medium text-slate-500"><option>Last 3 months</option></select>
                        </div>
                        <div className="px-4 flex gap-2 border-b border-slate-100 pb-3 mb-4">
                            {['All', 'Material', 'Manpower', 'Work Orders'].map((tab, i) => (
                                <button key={tab} className={`text-xs px-2 py-1 rounded ${i === 0 ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'}`}>{tab}</button>
                            ))}
                        </div>
                        <div className="px-4 grid grid-cols-2 gap-y-6">
                            <div>
                                <p className="text-[10px] text-slate-500 font-medium">Payables recorded</p>
                                <p className="text-xl font-bold text-slate-800">₹{BRIGADE_DATA.payables.recorded} Cr</p>
                                <p className="text-[10px] text-green-500 flex items-center mt-1"><ArrowUpRight size={10} /> {BRIGADE_DATA.payables.trend}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-medium">Amount paid for payables</p>
                                <p className="text-xl font-bold text-slate-800">₹{BRIGADE_DATA.payables.amountPaid} Cr</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-medium">Total Due</p>
                                <p className="text-xl font-bold text-slate-800">₹{BRIGADE_DATA.payables.totalDue.toFixed(2)} Cr</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-medium">Total Overdue</p>
                                <p className="text-xl font-bold text-red-500">₹{BRIGADE_DATA.payables.totalOverdue.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-50 text-center">
                            <button className="text-xs text-blue-600 font-semibold flex items-center justify-center gap-1 hover:underline">
                                View all payables <ChevronRight size={12} />
                            </button>
                        </div>
                    </PowerCard>

                </div>

                {/* MIDDLE COLUMN (Projects & Expenses) */}
                <div className="col-span-12 xl:col-span-4 space-y-6">

                    {/* All Projects */}
                    <PowerCard className="py-4">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <Settings size={14} className="text-slate-400" /> All Projects
                            </h3>
                            <span className="text-[10px] text-slate-400">Project progress last updated Today, 8 AM</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {BRIGADE_DATA.projects.map((proj, idx) => (
                                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded bg-slate-100 shrink-0" style={{ backgroundColor: `${proj.color}20` }} />
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1">
                                                    {proj.name}
                                                    {proj.alert && <span className="bg-red-50 text-red-500 text-[9px] px-1 py-0.5 rounded border border-red-100 flex items-center">
                                                        <AlertTriangle size={8} className="mr-0.5" /> {proj.alert}
                                                    </span>}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 mt-1">{proj.dates}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold">{proj.progress}%</span>
                                            <div className="flex items-center gap-1 text-[10px] text-red-500 font-medium justify-end mt-1">
                                                {proj.status.includes('Delayed') ? <><AlertCircle size={10} /> {proj.status}</> : <span className="text-slate-400 font-normal">{proj.status}</span>}
                                                <ChevronRight size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
                                        <div className="h-full rounded-full" style={{ width: `${proj.progress}%`, backgroundColor: proj.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 pt-2 text-center">
                            <button className="text-xs text-blue-600 font-semibold flex items-center justify-center gap-1 hover:underline">
                                View all Projects <ChevronRight size={12} />
                            </button>
                        </div>
                    </PowerCard>

                    {/* Expenses Donut */}
                    <PowerCard className="py-4">
                        <div className="flex items-center justify-between px-4 mb-2">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <Settings size={14} className="text-slate-400 transform rotate-45" /> Expenses
                            </h3>
                            <select className="text-xs border-none bg-transparent font-medium text-slate-500"><option>Last 3 months</option></select>
                        </div>

                        <div className="flex items-center p-4">
                            <div className="relative w-40 h-40 shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={BRIGADE_DATA.expenses.breakdown}
                                            innerRadius={60}
                                            outerRadius={75}
                                            paddingAngle={5}
                                            dataKey="amount"
                                        >
                                            {BRIGADE_DATA.expenses.breakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] text-slate-400 font-medium uppercase">Total Spend</span>
                                    <span className="text-lg font-bold text-slate-800">₹{BRIGADE_DATA.expenses.total} Cr</span>
                                </div>
                            </div>

                            <div className="flex-1 pl-6 space-y-3">
                                {BRIGADE_DATA.expenses.breakdown.map((item) => (
                                    <div key={item.category} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                                            <span className="text-slate-600">{item.category}</span>
                                        </div>
                                        <span className="font-bold text-slate-800">₹{item.amount} {item.unit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PowerCard>

                    {/* Indents Grid */}
                    <PowerCard className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm">Indents <span className="font-normal text-slate-400 text-xs">(3 Projects)</span></h3>
                            <select className="text-xs border-none bg-transparent font-medium text-slate-500"><option>This month</option></select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Indent created', val: BRIGADE_DATA.indents.created.count, sub: BRIGADE_DATA.indents.created.trend, color: 'text-slate-800' },
                                { label: 'Pending approval', val: BRIGADE_DATA.indents.pendingApproval.count, color: 'text-red-500' },
                                { label: 'Pending for PO', val: BRIGADE_DATA.indents.pendingPO.count, color: 'text-slate-800' },
                                { label: 'Delivery pending', val: BRIGADE_DATA.indents.deliveryPending.count, color: 'text-slate-800' },
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-50 rounded p-3 border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] text-slate-500 font-medium">{item.label}</span>
                                        {i === 0 && <ChevronRight size={12} className="text-slate-400" />}
                                    </div>
                                    <p className={`text-2xl font-bold ${item.color}`}>{item.val}</p>
                                    {item.sub && <p className="text-[9px] text-green-500 mt-1 flex items-center gap-0.5"><ArrowUpRight size={8} /> {item.sub}</p>}
                                </div>
                            ))}
                        </div>
                    </PowerCard>

                </div>

                {/* RIGHT COLUMN (Partners & PO) */}
                <div className="col-span-12 xl:col-span-4 space-y-6">

                    {/* Partners with due amounts */}
                    <PowerCard className="py-4">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-slate-200" /> Partners with most due amounts
                            </h3>
                        </div>
                        <div className="px-4 flex gap-4 text-xs font-bold text-slate-400 border-b border-slate-100 pb-2 mb-2">
                            <span className="text-blue-600 border-b-2 border-blue-600 pb-2 -mb-2.5">Vendors</span>
                            <span>Labours</span>
                        </div>

                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="text-[9px] uppercase text-slate-400 font-semibold px-4 pb-2">Vendors with most dues</th>
                                    <th className="text-[9px] uppercase text-slate-400 font-semibold px-4 pb-2 text-right">Advance Left</th>
                                    <th className="text-[9px] uppercase text-red-400 font-semibold px-4 pb-2 text-right">Total Due</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {BRIGADE_DATA.vendors.map((v, i) => (
                                    <tr key={i} className="group hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-bold text-slate-800">{v.name}</p>
                                            <p className="text-[10px] text-slate-400">{v.type}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs text-slate-600 font-medium">₹{v.advanceLeft}</td>
                                        <td className="px-4 py-3 text-right text-xs text-slate-800 font-bold">₹{v.totalDue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-2 pt-2 text-center border-t border-slate-50">
                            <button className="text-xs text-blue-600 font-semibold flex items-center justify-center gap-1 hover:underline">
                                View all Vendors <ChevronRight size={12} />
                            </button>
                        </div>
                    </PowerCard>

                    {/* Purchase Order */}
                    <PowerCard className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm">Purchase Order <span className="font-normal text-slate-400 text-xs">(3 Projects)</span></h3>
                            <select className="text-xs border-none bg-transparent font-medium text-slate-500"><option>This month</option></select>
                        </div>

                        <div className="flex justify-between mb-6 px-2">
                            <div>
                                <p className="text-[10px] text-slate-400 text-center mb-1">Approved amount</p>
                                <p className="font-bold text-lg">₹{BRIGADE_DATA.purchaseOrders.approvedAmount}</p>
                            </div>
                            <div className="w-px bg-slate-100 h-10" />
                            <div>
                                <p className="text-[10px] text-slate-400 text-center mb-1">Payable recorded</p>
                                <p className="font-bold text-lg">₹{BRIGADE_DATA.purchaseOrders.payableRecorded}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'PO Created', val: BRIGADE_DATA.purchaseOrders.created.count, sub: BRIGADE_DATA.purchaseOrders.created.trend, color: 'text-slate-800' },
                                { label: 'Pending Approval', val: BRIGADE_DATA.purchaseOrders.pendingApproval.count, color: 'text-red-500' },
                                { label: 'Delivery Pending', val: BRIGADE_DATA.purchaseOrders.deliveryPending.count, color: 'text-slate-800' },
                                { label: 'Pending for payable', val: BRIGADE_DATA.purchaseOrders.pendingPayable.count, color: 'text-slate-800' },
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-50 rounded p-3 border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] text-slate-500 font-medium">{item.label}</span>
                                        {i === 0 && <ChevronRight size={12} className="text-slate-400" />}
                                    </div>
                                    <p className={`text-2xl font-bold ${item.color}`}>{item.val}</p>
                                    {item.sub && <p className="text-[9px] text-green-500 mt-1 flex items-center gap-0.5"><ArrowUpRight size={8} /> {item.sub}</p>}
                                </div>
                            ))}
                        </div>
                    </PowerCard>

                    {/* Issues Raised */}
                    <PowerCard className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm flex items-center gap-2"><AlertTriangle size={14} /> Issues raised <span className="font-normal text-slate-400 text-xs">(3 Projects)</span></h3>
                            <select className="text-xs border-none bg-transparent font-medium text-slate-500"><option>This month</option></select>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 bg-slate-50 rounded p-3 border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] text-slate-500 font-medium">Total issue raised</span>
                                    <ChevronRight size={12} className="text-slate-400" />
                                </div>
                                <p className="text-2xl font-bold text-slate-800">{BRIGADE_DATA.issues.total.count}</p>
                                <p className="text-[9px] text-green-500 mt-1 flex items-center gap-0.5"><ArrowDownRight size={8} /> {BRIGADE_DATA.issues.total.trend}</p>
                            </div>

                            <div className="flex-1 bg-orange-50 rounded p-3 border border-orange-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] text-orange-700 font-medium">Open issues</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-800">{BRIGADE_DATA.issues.open.count}</p>
                                <span className="text-[9px] bg-orange-100 text-orange-700 px-1 py-0.5 rounded border border-orange-200">{BRIGADE_DATA.issues.open.alert}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-50 text-center">
                            <button className="text-xs text-blue-600 font-semibold flex items-center justify-center gap-1 hover:underline">
                                View all Issues <ChevronRight size={12} />
                            </button>
                        </div>
                    </PowerCard>

                </div>

            </div>
        </div>
    );
}
