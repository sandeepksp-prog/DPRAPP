'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Droplets, Activity } from 'lucide-react';
import { FinancialCard } from '@/components/admin/DashboardWidgets';

// Dynamically import Map components with SSR disabled
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const VisionPipeLayer = dynamic(
    () => import('@/components/map/VisionPipeLayer'),
    { ssr: false }
);

import 'leaflet/dist/leaflet.css';

// Re-using the Mock Data / Types for now, would likely accept props in real impl
export default function WorkProgressView({ stats, recentReports }: { stats: any, recentReports: any[] }) {

    // Quick KPI Card Internal Component (can be extracted if needed globally)
    const KpiCard = ({ title, value, unit, icon, trend, type }: any) => (
        <div className="card-uplift p-6 flex flex-col justify-between h-56 relative overflow-hidden group">
            {/* Icon Blob */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500 ${type === 'primary' ? 'bg-blue-600' : type === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />

            <div className="relative z-10 flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${type === 'primary' ? 'bg-blue-50 text-blue-600' : type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {icon}
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter">
                    {value}<span className="text-lg text-slate-400 font-medium ml-1">{unit}</span>
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{title}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Top Row: KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Active Sites"
                    value={stats.activeSites?.toString() || '0'}
                    icon={<MapPin size={24} />}
                    type="primary"
                />
                <KpiCard
                    title="Pipe Laid Today"
                    value={stats.pipeLaid?.toString() || '0'}
                    unit="m"
                    icon={<Droplets size={24} />}
                    type="success"
                />
                <div className="md:col-span-2">
                    <FinancialCard amount={stats.totalBilling || 0} />
                </div>
            </div>

            {/* Middle Row: Map & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Section */}
                <div className="lg:col-span-2 card-uplift p-1 h-[500px] relative overflow-hidden">
                    <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800">Live Network Status</h4>
                        <p className="text-[10px] text-slate-500">Babarpur Zone-1</p>
                    </div>
                    <MapContainer center={[27.5530, 78.6730]} zoom={15} style={{ height: '100%', width: '100%', borderRadius: '1.2rem' }}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <VisionPipeLayer />
                    </MapContainer>
                </div>

                {/* Activity Feed */}
                <div className="card-uplift p-6 h-[500px] overflow-y-auto hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-slate-50">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Activity size={20} className="text-blue-500" />
                            Site Updates
                        </h3>
                    </div>
                    <div className="space-y-6">

                        {recentReports.map((report) => (
                            <div key={report.id} className="relative pl-6 group">
                                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-slate-200 border-2 border-white group-hover:bg-[#0066CC] transition-colors" />
                                <div className="border-l border-slate-100 pl-6 pb-6 -ml-1.5 last:border-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold text-slate-700">{report.projects?.name}</p>
                                        <span className="text-[10px] text-slate-400">
                                            {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{report.work_summary_text}</p>
                                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md">
                                        {report.discipline}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* BOTTOM ROW: SCHEME LIST TABLE */}
            <div className="card-uplift p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Activity size={20} className="text-blue-600" />
                        Scheme Progress
                    </h3>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All Schemes</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Scheme Name</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Block</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Progress</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[
                                { id: 'S001', name: 'Nagla Bhajua Water Supply', block: 'Shitalpur', status: 'In Progress', progress: 65, type: 'Retrofitting' },
                                { id: 'S002', name: 'Sarai Aghat Pipe Network', block: 'Sakit', status: 'Completed', progress: 100, type: 'New Scheme' },
                                { id: 'S003', name: 'Nidhauli Kalan OHT', block: 'Nidhauli Kalan', status: 'In Progress', progress: 42, type: 'OHT' },
                                { id: 'S004', name: 'Awagarh FHTC', block: 'Awagarh', status: 'Not Started', progress: 0, type: 'FHTC' },
                                { id: 'S005', name: 'Jalesar Intake Well', block: 'Jalesar', status: 'In Progress', progress: 88, type: 'Intake' },
                            ].map((scheme) => (
                                <tr key={scheme.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4">
                                        <p className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">{scheme.name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{scheme.id}</p>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 font-medium">{scheme.block}</td>
                                    <td className="p-4 text-xs text-slate-500 font-bold uppercase">{scheme.type}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <span className="text-xs font-bold text-slate-600">{scheme.progress}%</span>
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${scheme.progress === 100 ? 'bg-emerald-500' : scheme.progress > 0 ? 'bg-blue-500' : 'bg-slate-300'}`}
                                                    style={{ width: `${scheme.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${scheme.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                            scheme.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                                'bg-slate-100 text-slate-500'
                                            }`}>
                                            {scheme.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
