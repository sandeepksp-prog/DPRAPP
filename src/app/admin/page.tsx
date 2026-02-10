'use client';

import React, { useState, useEffect } from 'react';
import { dataProvider } from '@/lib/data-provider';
import { ProjectAnalytics } from '@/lib/analytics';
import {
    MapPin,
    Droplets,
    Activity,
    Construction
} from 'lucide-react';
import BOQTracker from '@/components/admin/BOQTracker';
import { FinancialCard, MaterialHealthCard } from '@/components/admin/DashboardWidgets';

function getKpiCard(title: string, value: string, icon: React.ReactNode, type: 'primary' | 'success' | 'warning' | 'danger' = 'primary') {
    return (
        <div className="p-6 rounded-2xl border bg-white shadow-sm flex items-center justify-between border-slate-100">
            <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${type === 'primary' ? 'bg-blue-50 text-blue-700' :
                type === 'success' ? 'bg-emerald-50 text-emerald-700' :
                    type === 'warning' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                }`}>
                {icon}
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
    const [loading, setLoading] = useState(true);
    const [recentReports, setRecentReports] = useState<any[]>([]);

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);

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
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1 text-sm">Real-time construction metrics (Infra-OS 2.0).</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getKpiCard(
                    "Active Sites Today",
                    stats.activeSites.toString(),
                    <MapPin size={20} />,
                    'primary'
                )}
                {getKpiCard(
                    "Pipe Laid (Today)",
                    `${stats.pipeLaid}m`,
                    <Droplets size={20} />,
                    'success'
                )}
                {/* Financial Widget replaces simple card */}
                <FinancialCard amount={stats.totalBilling} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content: BOQ & Analytics */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Material Health Widget replaces table */}
                    <div className="h-auto">
                        <MaterialHealthCard items={materialHealth} />
                    </div>

                    <BOQTracker />
                </div>

                {/* Sidebar: Recent Activity */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                                <Activity size={16} className="text-blue-600" />
                                Live Feed
                            </h3>
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">LIVE</span>
                        </div>

                        <div className="space-y-6 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-3.5 top-2 bottom-2 w-px bg-slate-100" />

                            {recentReports.map((report) => (
                                <div key={report.id} className="relative pl-10">
                                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-slate-50 border-2 border-white shadow-sm flex items-center justify-center z-10">
                                        <Construction size={14} className="text-slate-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-slate-800">
                                                {report.projects?.name || 'Unknown Project'}
                                            </p>
                                            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">
                                                {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            {report.work_summary_text}
                                        </p>
                                        <span className="flex items-center gap-1 text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
                                            {report.discipline}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {recentReports.length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-4">No activity yet today.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
