"use client";

import React from 'react';
import { SmoothAreaChart, ResourceRadarChart, MiniBarChart, KPICard, StatusDonutChart } from '../charts/VectorDashboards';

export default function SummaryView() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1400px] mb-12">

            {/* TIER 1: KPI SNAPSHOT (4 Cards - col-span-3 each) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3">
                    <KPICard title="Total Budget" prefix="₹" value="48.2" suffix=" Cr" trend="+2.4%" trendLabel="vs last month" isPositive={true} />
                </div>
                <div className="lg:col-span-3">
                    <KPICard title="Capital Spent" prefix="₹" value="16.4" suffix=" Cr" trend="+8.1%" trendLabel="run rate increase" isPositive={true} />
                </div>
                <div className="lg:col-span-3">
                    <KPICard title="Active Schemes" value="38" trend="+3" trendLabel="mobilized this week" isPositive={true} />
                </div>
                <div className="lg:col-span-3">
                    <KPICard title="Critical Issues" value="11" trend="+2" trendLabel="flagged recently" isPositive={false} />
                </div>
            </div>

            {/* TIER 2: VELOCITY & DISTRIBUTION (Flow & Donut) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <SmoothAreaChart title="Execution Velocity vs Target" subtitle="Monthly Physical Progress Run Rate" />
                </div>
                <div className="lg:col-span-4">
                    <StatusDonutChart />
                </div>
            </div>

            {/* TIER 3: THE DRILL-DOWN (Details & Resource Variance) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                    <ResourceRadarChart />
                </div>
                <div className="lg:col-span-6">
                    <MiniBarChart title="Top Performing Blocks" />
                </div>
            </div>

        </div>
    );
}
