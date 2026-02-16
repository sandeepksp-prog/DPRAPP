"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ArrowUpRight, TrendingUp, AlertCircle, ChevronRight, Download, Settings, ChevronDown } from 'lucide-react';

const COLORS = ['#F59E0B', '#8B5CF6', '#EF4444']; // Expenses Chart Colors

export default function SummaryView() {

    // 1. RECEIVED VS PAID DATA
    const financialStats = {
        received: 13.80,
        paid: 12.20,
        unit: 'Cr'
    };

    // 2. PROJECT LIST DATA
    const projects = [
        { id: 1, name: 'Volvo Bhopal', progress: 66, start: '12 Jan 2024', end: '1 Jul 2024', daysLeft: 17, delayedTasks: 14, color: 'bg-amber-100 text-amber-600', barColor: 'bg-amber-500' },
        { id: 2, name: 'Delhi Metro Station', progress: 7, start: '1 Aug 2023', end: '1 Mar 2025', daysLeft: '3 months', delayedTasks: 0, color: 'bg-rose-100 text-rose-600', barColor: 'bg-rose-500' },
        { id: 3, name: 'Blue Powerplant', progress: 79, start: '21 Sep 2023', end: '31 Dec 2023', daysLeft: 0, delayedTasks: 12, color: 'bg-blue-100 text-blue-600', barColor: 'bg-blue-500' },
    ];

    // 3. PARTNERS DATA (Vendors)
    const partners = [
        { name: 'HVAC Contractor', type: 'Subcontractor', advance: 320000, due: 180000 },
        { name: 'Shah Hardware', type: 'Material', advance: 320000, due: 120000 },
        { name: 'Ramesh Contractors', type: 'Labour • Subcontractor', advance: 320000, due: 80000 },
    ];

    // 4. EXPENSES DATA
    const expensesData = [
        { name: 'Material', value: 47.8, unit: 'L' },
        { name: 'Sub-Contractor', value: 26, unit: 'L' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* ROW 1: RECEIVED vs PAID + PROJECT LIST + PARTNERS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1.1 RECEIVED VS PAID */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-slate-800">Received vs Paid</h3>
                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">FY 25</span>
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Received</p>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                                    ₹{financialStats.received} <span className="text-lg text-slate-400">{financialStats.unit}</span>
                                </h2>
                            </div>
                            <div className="w-[1px] bg-slate-100"></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Paid</p>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                                    ₹{financialStats.paid} <span className="text-lg text-slate-400">{financialStats.unit}</span>
                                </h2>
                            </div>
                        </div>

                        {/* Visual Bar */}
                        <div className="mt-6 flex h-3 w-full rounded-full overflow-hidden bg-slate-100">
                            <div className="h-full bg-emerald-500 w-[55%]"></div>
                            <div className="h-full bg-blue-500 w-[45%]"></div>
                        </div>
                    </div>

                    {/* 1.4 FINANCIALS MINI-WIDGET */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 border-l-4 border-slate-800 pl-3">
                                <h3 className="text-lg font-bold text-slate-800">Financials</h3>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold mb-1">BOQ Achieved</p>
                                <p className="text-xl font-bold text-slate-800">₹6.54</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold mb-1">Total Received</p>
                                <p className="text-xl font-bold text-slate-800">₹6.29</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold mb-1">Total Payable</p>
                                <p className="text-xl font-bold text-slate-800">₹6.44</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1.2 ALL PROJECTS LIST */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Settings size={14} className="text-slate-400 animate-spin-slow" />
                            <h3 className="text-sm font-bold text-slate-800">All Projects</h3>
                        </div>
                        <p className="text-[10px] text-slate-400">Last updated Today, 8 AM</p>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {projects.map((project) => (
                            <div key={project.id} className="group cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-3">
                                        <div className={`w-10 h-10 rounded-lg ${project.color} flex-shrink-0`} />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{project.name}</h4>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{project.start} - {project.end}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-slate-800">{project.progress}%</p>
                                        {project.delayedTasks > 0 ? (
                                            <p className="text-[10px] font-bold text-rose-500 flex items-center justify-end gap-1">
                                                <AlertCircle size={10} /> {project.delayedTasks} Delayed
                                            </p>
                                        ) : (
                                            <p className="text-[10px] text-slate-400">No delay tracking</p>
                                        )}
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${project.barColor} rounded-full`} style={{ width: `${project.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="text-xs font-bold text-blue-600 mt-4 hover:underline text-left">View all Projects &gt;</button>
                </div>

                {/* 1.3 PARTNERS WITH MOST DUE */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                        <h3 className="text-sm font-bold text-slate-800">Partners with most due amounts</h3>
                    </div>

                    <div className="flex gap-4 border-b border-slate-100 mb-4">
                        <button className="text-xs font-bold text-blue-600 border-b-2 border-blue-600 pb-2">Vendors</button>
                        <button className="text-xs font-bold text-slate-400 pb-2 hover:text-slate-600">Labours</button>
                    </div>

                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <span>Vendor With Most Dues</span>
                        <div className="flex gap-8">
                            <span>Advance Left</span>
                            <span>Total Due</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto">
                        {partners.map((partner, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors">
                                <div>
                                    <p className="text-xs font-bold text-slate-800">{partner.name}</p>
                                    <p className="text-[10px] text-slate-400">{partner.type}</p>
                                </div>
                                <div className="flex gap-8 text-right min-w-[140px] justify-end">
                                    <p className="text-xs font-medium text-slate-500">₹{(partner.advance).toLocaleString()}</p>
                                    <p className="text-xs font-bold text-slate-800">₹{(partner.due).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="text-xs font-bold text-blue-600 mt-4 hover:underline text-left">View all Vendors &gt;</button>
                </div>
            </div>

            {/* ROW 2: EXPENSES & PURCHASE ORDERS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 2.1 EXPENSES CHART */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Settings size={14} className="animate-spin-slow" />
                            <h3 className="text-sm font-bold text-slate-800">Expenses</h3>
                        </div>
                        <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none">
                            <option>Last 3 months</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <div className="h-48 w-48 relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expensesData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expensesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Spend</span>
                                <span className="text-lg font-black text-slate-800">₹73.8L</span>
                            </div>
                        </div>

                        <div className="flex-1 pl-8 space-y-4">
                            {expensesData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                        <span className="text-xs font-bold text-slate-600">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-800">₹{item.value}{item.unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2.2 PURCHASE ORDER STATS */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-bold text-slate-800">Purchase Order <span className="text-slate-400 font-normal">(3 Projects)</span></h3>
                        <button className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1">
                            This month <ChevronDown size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Approved Amount</p>
                            <p className="text-2xl font-black text-slate-800">₹51,91,000</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Payable Recorded</p>
                            <p className="text-2xl font-black text-slate-800">₹52,91,000</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                        <div className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <p className="text-xs text-slate-500 font-bold">PO Created</p>
                                <p className="text-3xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">38</p>
                            </div>
                            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="flex justify-between items-center group cursor-pointer">
                            <div>
                                <p className="text-xs text-slate-500 font-bold">Pending Approval</p>
                                <p className="text-3xl font-black text-rose-500">5</p>
                            </div>
                            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
            {/* ROW 3: OPERATIONAL METRICS (TASKS, ISSUES, INDENTS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 3.1 TASKS OVERVIEW */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <h3 className="text-sm font-bold text-slate-800">Tasks Snapshot</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Not Started</p>
                            <p className="text-xl font-black text-slate-800">755</p>
                            <p className="text-[10px] text-rose-500 font-bold">31 Delayed</p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <p className="text-[10px] uppercase font-bold text-amber-600">In Progress</p>
                            <p className="text-xl font-black text-amber-700">122</p>
                            <p className="text-[10px] text-amber-600 font-bold">11 Delayed</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Completed</p>
                            <p className="text-xl font-black text-emerald-600">332</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Total Delayed</p>
                            <p className="text-xl font-black text-rose-600">54</p>
                        </div>
                    </div>
                </div>

                {/* 3.2 INDENTS & MATERIAL REQUESTS */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Indents</h3>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+5 this month</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-xs font-bold text-slate-500">Created</span>
                            <span className="text-lg font-black text-slate-800">29</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-xs font-bold text-slate-500">Pending Approval</span>
                            <span className="text-lg font-black text-rose-500">5</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-xs font-bold text-slate-500">Delivery Pending</span>
                            <span className="text-lg font-black text-orange-500">4</span>
                        </div>
                    </div>
                </div>

                {/* 3.3 ISSUES & TEAM */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Site Issues</h3>
                    </div>
                    <div className="flex items-center gap-6 mb-6">
                        <div>
                            <p className="text-3xl font-black text-slate-800">32</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Total Issues</p>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100"></div>
                        <div>
                            <p className="text-3xl font-black text-rose-500">11</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Open Alerts</p>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-slate-800 mb-2">Team Availability</h4>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">Active on Site</span>
                            <span className="text-sm font-bold text-slate-800">4 / 8 Engineers</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-blue-500 w-1/2"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
