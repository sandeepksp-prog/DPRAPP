'use client';

import React, { useState, useEffect } from 'react';
import { dataProvider } from '@/lib/data-provider';
import { ProjectAnalytics } from '@/lib/analytics';
import {
    MapPin,
    Droplets,
    Activity,
    MoreHorizontal
} from 'lucide-react';
import BOQTracker from '@/components/admin/BOQTracker';
import { FinancialCard, MaterialHealthCard } from '@/components/admin/DashboardWidgets';

// Simple "Sparkline" SVG Component for the KPI cards
const Sparkline = ({ type }: { type: 'up' | 'down' | 'neutral' }) => {
    const color = type === 'up' ? '#10b981' : type === 'down' ? '#ef4444' : '#3b82f6';
    return (
        <svg width="100" height="40" viewBox="0 0 100 40" fill="none" className="opacity-80">
            <path
                d={type === 'up'
                    ? "M0 35 C20 35, 40 10, 60 25 S 80 5, 100 0"
                    : "M0 20 C30 20, 50 35, 70 25 S 90 30, 100 35"}
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d={type === 'up'
                    ? "M0 35 C20 35, 40 10, 60 25 S 80 5, 100 0 V 40 H 0 Z"
                    : "M0 20 C30 20, 50 35, 70 25 S 90 30, 100 35 V 40 H 0 Z"}
                fill={`url(#gradient-${type})`}
                opacity="0.2"
            />
            <defs>
                <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
            </defs>
        </svg>
    )
}

function KpiCard({ title, value, unit, icon, trend, type }: { title: string, value: string, unit?: string, icon: React.ReactNode, trend: 'up' | 'down', type: 'primary' | 'success' | 'warning' }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-56 relative overflow-hidden group hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.04)] transition-shadow">
            {/* Icon Blob */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500 ${type === 'primary' ? 'bg-blue-500' : type === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />

            <div className="relative z-10 flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${type === 'primary' ? 'bg-blue-50 text-blue-600' : type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {icon}
                </div>
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="relative z-10 mt-auto">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tighter dark:text-white">
                    {value}<span className="text-lg text-slate-400 font-medium ml-1">{unit}</span>
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{title}</p>
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-4 right-4">
                <Sparkline type={trend} />
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        activeSites: 0,
        pipeLaid: 0,
        totalBilling: 0,
    });

    const [materialHealth, setMaterialHealth] = useState<ProjectAnalytics['materialHealth']>([]);
    const [recentReports, setRecentReports] = useState<any[]>([]);

    useEffect(() => {
        async function fetchStats() {
            try {
                // 1. Get Recent Reports (Use Provider)
                const reports = await dataProvider.getRecentReports();
                setRecentReports(reports);

                // 2. Get Active Sites & Stats
                const projects = await dataProvider.getProjects();

                let totalBillable = 0;
                let totalPipe = 0;
                let activeSites = 0;

                if (projects.length > 0) {
                    const analytics = await dataProvider.getBOQAnalytics(projects[0].id);
                    totalBillable = analytics.totalBillable;
                    setMaterialHealth(analytics.materialHealth.slice(0, 5));

                    const pipeReports = reports.filter((r: any) => r.discipline === 'Pipeline');
                    pipeReports.forEach((r: any) => {
                        r.report_entries?.forEach((e: any) => {
                            totalPipe += Number(e.quantity);
                        })
                    });

                    const uniqueSites = new Set(reports.map((r: any) => r.project_id));
                    activeSites = uniqueSites.size;
                }

                setStats({
                    activeSites,
                    pipeLaid: totalPipe,
                    totalBilling: totalBillable
                });
            } catch (err) {
                console.error(err);
            }
        }

        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">

            {/* KPI Grid - Large & Spacious */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Active Sites"
                    value={stats.activeSites.toString()}
                    icon={<MapPin size={24} />}
                    trend="up"
                    type="primary"
                />
                <KpiCard
                    title="Pipe Laid Today"
                    value={stats.pipeLaid.toString()}
                    unit="m"
                    icon={<Droplets size={24} />}
                    trend="up"
                    type="success"
                />
                <div className="md:col-span-2">
                    <FinancialCard amount={stats.totalBilling} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Material & Activity */}
                <div className="lg:col-span-2 space-y-8">
                    <MaterialHealthCard items={materialHealth} />
                    <BOQTracker />
                </div>

                {/* Sidebar: Activity Feed with Timeline Style */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)] h-full">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 dark:text-white">
                                <Activity size={20} className="text-rose-500" />
                                Real-Time Feed
                            </h3>
                            <button className="text-xs font-bold bg-slate-50 text-slate-600 px-3 py-1 rounded-full hover:bg-slate-100 transition-colors">
                                View All
                            </button>
                        </div>

                        <div className="relative pl-2">
                            {/* Vertical Line */}
                            <div className="absolute left-2 top-2 bottom-6 w-[2px] bg-slate-100 dark:bg-slate-800" />

                            <div className="space-y-8">
                                {recentReports.map((report) => (
                                    <div key={report.id} className="relative pl-8 group">
                                        {/* Timeline Dot */}
                                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-[3px] border-slate-200 dark:border-slate-700 group-hover:border-blue-500 group-hover:scale-110 transition-all z-10" />

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {report.projects?.name || 'Project'}
                                                </p>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed group-hover:shadow-sm transition-shadow">
                                                {report.work_summary_text}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wide">
                                                    {report.discipline}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {recentReports.length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4">No activity streams available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
