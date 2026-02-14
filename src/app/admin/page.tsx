'use client';

import React, { useState, useEffect } from 'react';
import { PowerCard, PowerStat, PowerTab, PowerTable, PowerButton, StatusBadge, ProgressBar, colors } from '@/components/powerplay-clone';
import { dataProvider } from '@/lib/data-provider';
import { Plus, Download, Filter, TrendingUp, IndianRupee, Users, AlertTriangle, FileText } from 'lucide-react';

// S-Curve mock data
const sCurveData = [
    { month: 'Apr', planned: 5, actual: 3 },
    { month: 'May', planned: 12, actual: 8 },
    { month: 'Jun', planned: 22, actual: 18 },
    { month: 'Jul', planned: 35, actual: 28 },
    { month: 'Aug', planned: 48, actual: 42 },
    { month: 'Sep', planned: 60, actual: 55 },
    { month: 'Oct', planned: 72, actual: 63 },
    { month: 'Nov', planned: 82, actual: 70 },
    { month: 'Dec', planned: 90, actual: 78 },
    { month: 'Jan', planned: 95, actual: 85 },
    { month: 'Feb', planned: 98, actual: 88 },
];

// Indent mock data
const recentIndents = [
    { id: 'IND-001', material: '200mm DI Pipe', qty: '450m', requestedBy: 'Rajesh K.', date: '14 Feb', status: 'inProgress' as const },
    { id: 'IND-002', material: 'Socket Tee 150mm', qty: '25 pcs', requestedBy: 'Suresh M.', date: '13 Feb', status: 'todo' as const },
    { id: 'IND-003', material: 'CI Sluice Valve 200mm', qty: '8 nos', requestedBy: 'Amit R.', date: '12 Feb', status: 'completed' as const },
    { id: 'IND-004', material: 'Cement OPC 43', qty: '200 bags', requestedBy: 'Vikram S.', date: '11 Feb', status: 'overdue' as const },
    { id: 'IND-005', material: 'Sand (Fine)', qty: '15 brass', requestedBy: 'Mukesh P.', date: '10 Feb', status: 'completed' as const },
];

// BOQ Table mock data
const boqData = [
    { item: 'Pipeline Laying (200mm DI)', unit: 'Rm', estimated: 12500, actual: 8750, rate: 2840, status: 'inProgress' },
    { item: 'Pipeline Laying (150mm DI)', unit: 'Rm', estimated: 8000, actual: 5200, rate: 2100, status: 'inProgress' },
    { item: 'Valve Chamber Construction', unit: 'Nos', estimated: 45, actual: 32, rate: 85000, status: 'inProgress' },
    { item: 'Road Restoration (BT)', unit: 'Sqm', estimated: 6000, actual: 3800, rate: 950, status: 'todo' },
    { item: 'House Connection', unit: 'Nos', estimated: 3500, actual: 1200, rate: 4500, status: 'todo' },
    { item: 'Overhead Tank (100KL)', unit: 'Nos', estimated: 2, actual: 1, rate: 2500000, status: 'completed' },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [recentReports, setRecentReports] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const reports = await dataProvider.getRecentReports();
            setRecentReports(reports.slice(0, 8));
        }
        load();
    }, []);

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'boq', label: 'BOQ Tracker', count: 6 },
        { id: 'indents', label: 'Indents', count: 5 },
        { id: 'reports', label: 'Daily Reports', count: recentReports.length },
    ];

    const boqColumns = [
        { key: 'item', label: 'Description', width: '280px' },
        { key: 'unit', label: 'Unit', width: '60px', align: 'center' as const },
        {
            key: 'estimated', label: 'Estimated', width: '100px', align: 'right' as const,
            render: (v: number) => <span className="tabular-nums">{v.toLocaleString()}</span>,
        },
        {
            key: 'actual', label: 'Actual', width: '100px', align: 'right' as const,
            render: (v: number) => <span className="tabular-nums font-semibold">{v.toLocaleString()}</span>,
        },
        {
            key: 'progress', label: 'Progress', width: '140px',
            render: (_: any, row: any) => <ProgressBar value={row.actual} max={row.estimated} />,
        },
        {
            key: 'rate', label: 'Rate (₹)', width: '100px', align: 'right' as const,
            render: (v: number) => <span className="tabular-nums">₹{v.toLocaleString()}</span>,
        },
        {
            key: 'status', label: 'Status', width: '110px', align: 'center' as const,
            render: (v: string) => <StatusBadge status={v as any} />,
        },
    ];

    const indentColumns = [
        { key: 'id', label: 'Indent #', width: '90px', render: (v: string) => <span className="font-mono text-xs font-semibold" style={{ color: colors.primary.blue }}>{v}</span> },
        { key: 'material', label: 'Material', width: '200px' },
        { key: 'qty', label: 'Qty', width: '80px' },
        { key: 'requestedBy', label: 'Requested By', width: '120px' },
        { key: 'date', label: 'Date', width: '80px' },
        { key: 'status', label: 'Status', width: '110px', align: 'center' as const, render: (v: string) => <StatusBadge status={v as any} /> },
    ];

    return (
        <div className="space-y-5">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold" style={{ fontSize: '18px', color: colors.neutral.gray800 }}>
                        PROJECT DASHBOARD
                    </h1>
                    <p style={{ fontSize: '12px', color: colors.neutral.gray400 }}>
                        Babarpur Water Supply Scheme — Zone 1
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <PowerButton variant="ghost" size="sm">
                        <Filter size={14} className="mr-1" /> Filters
                    </PowerButton>
                    <PowerButton variant="ghost" size="sm">
                        <Download size={14} className="mr-1" /> Export
                    </PowerButton>
                    <PowerButton variant="primary" size="sm">
                        <Plus size={14} className="mr-1" /> New Report
                    </PowerButton>
                </div>
            </div>

            {/* KPI Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <PowerStat
                    label="Budget Sanctioned"
                    value="₹24.8"
                    unit="Cr"
                    color={colors.primary.blue}
                    trend="flat"
                />
                <PowerStat
                    label="Expenditure"
                    value="₹16.2"
                    unit="Cr"
                    color={colors.accent.orange}
                    trend="up"
                    trendValue="+2.4 Cr this month"
                />
                <PowerStat
                    label="Physical Progress"
                    value="72"
                    unit="%"
                    color={colors.accent.green}
                    trend="up"
                    trendValue="+4.2% vs last week"
                />
                <PowerStat
                    label="Active Manpower"
                    value="186"
                    color={colors.primary.navy}
                    trend="down"
                    trendValue="-12 from yesterday"
                />
            </div>

            {/* Tabbed Content */}
            <PowerCard noPadding>
                <PowerTab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="p-4">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* S-Curve Chart Area */}
                            <div className="lg:col-span-2">
                                <PowerCard title="Financial S-Curve" subtitle="Planned vs Actual Progress (%)">
                                    <div className="h-[300px] flex flex-col justify-between">
                                        {/* SVG S-Curve */}
                                        <svg viewBox="0 0 440 200" className="w-full h-[230px]">
                                            {/* Grid lines */}
                                            {[0, 25, 50, 75, 100].map((v) => (
                                                <g key={v}>
                                                    <line
                                                        x1="40" y1={180 - v * 1.6} x2="420" y2={180 - v * 1.6}
                                                        stroke={colors.neutral.gray200} strokeWidth="0.5" strokeDasharray="3,3"
                                                    />
                                                    <text x="35" y={184 - v * 1.6} textAnchor="end" fontSize="8" fill={colors.neutral.gray400}>
                                                        {v}%
                                                    </text>
                                                </g>
                                            ))}

                                            {/* X-axis labels */}
                                            {sCurveData.map((d, i) => (
                                                <text
                                                    key={d.month}
                                                    x={50 + i * 36}
                                                    y="198"
                                                    textAnchor="middle"
                                                    fontSize="8"
                                                    fill={colors.neutral.gray400}
                                                >
                                                    {d.month}
                                                </text>
                                            ))}

                                            {/* Planned Line – Blue */}
                                            <polyline
                                                fill="none"
                                                stroke={colors.primary.blue}
                                                strokeWidth="2"
                                                strokeDasharray="4,2"
                                                points={sCurveData.map((d, i) => `${50 + i * 36},${180 - d.planned * 1.6}`).join(' ')}
                                            />

                                            {/* Actual Line – Orange */}
                                            <polyline
                                                fill="none"
                                                stroke={colors.accent.orange}
                                                strokeWidth="2.5"
                                                points={sCurveData.map((d, i) => `${50 + i * 36},${180 - d.actual * 1.6}`).join(' ')}
                                            />

                                            {/* Actual dots */}
                                            {sCurveData.map((d, i) => (
                                                <circle
                                                    key={i}
                                                    cx={50 + i * 36}
                                                    cy={180 - d.actual * 1.6}
                                                    r="3"
                                                    fill={colors.accent.orange}
                                                />
                                            ))}
                                        </svg>

                                        {/* Legend */}
                                        <div className="flex items-center gap-6 mt-2 px-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-[2px]" style={{ backgroundColor: colors.primary.blue, borderStyle: 'dashed' }} />
                                                <span style={{ fontSize: '10px', color: colors.neutral.gray500 }}>Planned</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-[2.5px] rounded" style={{ backgroundColor: colors.accent.orange }} />
                                                <span style={{ fontSize: '10px', color: colors.neutral.gray500 }}>Actual</span>
                                            </div>
                                        </div>
                                    </div>
                                </PowerCard>
                            </div>

                            {/* Activity Feed */}
                            <div>
                                <PowerCard title="Site Activity" subtitle="Latest field updates" noPadding>
                                    <div className="max-h-[320px] overflow-y-auto">
                                        {recentReports.map((report, idx) => (
                                            <div
                                                key={report.id || idx}
                                                className="flex items-start gap-3 px-4 py-3 border-b hover:bg-gray-50 transition-colors"
                                                style={{ borderColor: colors.neutral.gray100 }}
                                            >
                                                <div
                                                    className="w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5"
                                                    style={{ backgroundColor: colors.neutral.gray100 }}
                                                >
                                                    <FileText size={13} style={{ color: colors.neutral.gray500 }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate" style={{ fontSize: '12px', color: colors.neutral.gray700 }}>
                                                        {report.projects?.name || 'Site Report'}
                                                    </p>
                                                    <p className="truncate mt-0.5" style={{ fontSize: '11px', color: colors.neutral.gray400 }}>
                                                        {report.work_summary_text || 'No summary'}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 tabular-nums" style={{ fontSize: '10px', color: colors.neutral.gray400 }}>
                                                    {new Date(report.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        ))}
                                        {recentReports.length === 0 && (
                                            <p className="text-center py-12" style={{ fontSize: '12px', color: colors.neutral.gray400 }}>
                                                No recent activity
                                            </p>
                                        )}
                                    </div>
                                </PowerCard>
                            </div>
                        </div>
                    )}

                    {/* BOQ TRACKER TAB */}
                    {activeTab === 'boq' && (
                        <PowerTable columns={boqColumns} data={boqData} />
                    )}

                    {/* INDENTS TAB */}
                    {activeTab === 'indents' && (
                        <PowerTable columns={indentColumns} data={recentIndents} />
                    )}

                    {/* DAILY REPORTS TAB */}
                    {activeTab === 'reports' && (
                        <div className="space-y-3">
                            {recentReports.map((report, idx) => (
                                <div
                                    key={report.id || idx}
                                    className="flex items-center gap-4   border-b py-3"
                                    style={{ borderColor: colors.neutral.gray100 }}
                                >
                                    <div
                                        className="w-9 h-9 rounded flex items-center justify-center shrink-0 text-xs font-bold text-white"
                                        style={{ backgroundColor: colors.primary.blue }}
                                    >
                                        {(report.projects?.name || 'P')[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate" style={{ fontSize: '13px', color: colors.neutral.gray800 }}>
                                            {report.projects?.name}
                                        </p>
                                        <p className="truncate" style={{ fontSize: '11px', color: colors.neutral.gray500 }}>
                                            {report.work_summary_text}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <span className="px-2 py-0.5 rounded-sm text-xs font-medium" style={{
                                            backgroundColor: colors.neutral.gray100, color: colors.neutral.gray600, fontSize: '10px',
                                        }}>
                                            {report.discipline || 'General'}
                                        </span>
                                        <p className="mt-1 tabular-nums" style={{ fontSize: '10px', color: colors.neutral.gray400 }}>
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PowerCard>
        </div>
    );
}
