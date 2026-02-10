'use client';

import { useEffect, useState } from 'react';
import { dataProvider } from '@/lib/data-provider';
import { FileText, Download, Calendar, Search } from 'lucide-react';

export default function ReportsPage() {
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const data = await dataProvider.getRecentReports();
            setReports(data);
        }
        load();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Daily Reports</h1>
                    <p className="text-slate-500 text-sm">Master log of all field submissions</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                        <input
                            placeholder="Search reports..."
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-64"
                        />
                    </div>
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-bold">Reported By</th>
                            <th className="px-6 py-4 font-bold">Project / Site</th>
                            <th className="px-6 py-4 font-bold">Discipline</th>
                            <th className="px-6 py-4 font-bold">Summary</th>
                            <th className="px-6 py-4 font-bold text-right">Date & Time</th>
                            <th className="px-6 py-4 text-center font-bold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reports.map((report) => (
                            <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            FE
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Field Engineer</p>
                                            <p className="text-xs text-slate-500">Mobile User</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">{report.projects?.name}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                        {report.discipline}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={report.work_summary_text}>
                                    {report.work_summary_text}
                                </td>
                                <td className="px-6 py-4 text-right text-slate-500 font-mono text-xs">
                                    {new Date(report.created_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100">
                                        Synced
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reports.length === 0 && (
                    <div className="p-12 text-center text-slate-400">No reports found.</div>
                )}
            </div>
        </div>
    );
}
