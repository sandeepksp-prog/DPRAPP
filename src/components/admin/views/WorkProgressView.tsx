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
        <div className="card-depth p-6 flex flex-col justify-between h-56 relative overflow-hidden group">
            {/* Icon Blob */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500 ${type === 'primary' ? 'bg-[#0066CC]' : type === 'success' ? 'bg-[#90EE90]' : 'bg-[#FFD700]'
                }`} />

            <div className="relative z-10 flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${type === 'primary' ? 'bg-indigo-50 text-[#0066CC]' : type === 'success' ? 'bg-[#f0fdf4] text-[#15803d]' : 'bg-[#fffbef] text-[#b45309]'
                    }`}>
                    {icon}
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tighter">
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
                <div className="lg:col-span-2 card-depth p-1 h-[500px] relative overflow-hidden">
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
                <div className="card-depth p-6 h-[500px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-slate-50">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Activity size={20} className="text-[#663399]" />
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
        </div>
    );
}
