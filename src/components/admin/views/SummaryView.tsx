"use client";

import React, { useState } from 'react';
import { SmoothAreaChart, ResourceRadarChart, MiniBarChart, StatsRow } from '../charts/VectorDashboards';

export default function SummaryView() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1400px]">
            {/* ROW 1: VECTOR AREA CHART & RADAR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SmoothAreaChart title="Financial Progress Flow" subtitle="Revenue vs Expense Velocity" />
                <ResourceRadarChart />
            </div>

            {/* ROW 2: KPI STATS & HORIZONTAL BARS */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <StatsRow />
                <div className="md:col-span-1">
                    <MiniBarChart />
                </div>
            </div>

            {/* ROW 3: OPERATIONAL METRICS (TASKS, ISSUES, INDENTS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 3.1 TASKS OVERVIEW */}
                <div className="card-uplift p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
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
                <div className="card-uplift p-6">
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
                <div className="card-uplift p-6">
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
                            <div className="h-full bg-[var(--secondary)] w-1/2"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
