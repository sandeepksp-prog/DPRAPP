'use client';

import React, { useState, useEffect } from 'react';
import { dataProvider } from '@/lib/data-provider';
import { ProjectAnalytics } from '@/lib/analytics';
import BOQTracker from '@/components/admin/BOQTracker';

import AdminTabs, { TabType } from '@/components/admin/AdminTabs';
import WorkProgressView from '@/components/admin/views/WorkProgressView';
import MaterialView from '@/components/admin/views/MaterialView';
import FinanceView from '@/components/admin/views/FinanceView';
import ResourceView from '@/components/admin/views/ResourceView';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>('work');

    // Data State (Centralized)
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
        <div className="pb-12 min-h-screen bg-[#f8fafc]">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Project Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Babarpur Water Supply Scheme (Phase-II)</p>
                </div>

                {/* Tab Navigation */}
                <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* View container */}
            <div className="min-h-[600px]">
                {activeTab === 'work' && (
                    <>
                        <WorkProgressView stats={stats} recentReports={recentReports} />
                        <div className="mt-8">
                            <BOQTracker />
                        </div>
                    </>
                )}

                {activeTab === 'material' && (
                    <MaterialView materialHealth={materialHealth} />
                )}

                {activeTab === 'billing' && (
                    <FinanceView />
                )}

                {activeTab === 'resources' && (
                    <ResourceView />
                )}
            </div>
        </div>
    );
}
