'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, History, ChevronRight, Construction, CheckCircle2, Clock } from 'lucide-react';
import { dataProvider } from '@/lib/data-provider';

export default function FieldDashboard() {
  const [recentUploads, setRecentUploads] = useState<any[]>([]);

  useEffect(() => {
    // Mock recent uploads for the field engineer
    // In real apps, filtered by current user
    async function load() {
      const data = await dataProvider.getRecentReports();
      setRecentUploads(data.slice(0, 3)); // Just show top 3
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Construction size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">Field Engineer</p>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">Ready to update progress?</p>
        </div>
      </header>

      <div className="px-6 -mt-8 relative z-20 space-y-6">

        {/* Primary Action Card */}
        <Link href="/report/new" className="block group">
          <div className="bg-blue-600 rounded-2xl p-6 shadow-lg shadow-blue-900/20 flex items-center justify-between text-white transform transition-all group-active:scale-95 duration-200">
            <div>
              <h2 className="text-lg font-bold">Start New Report</h2>
              <p className="text-blue-100 text-xs mt-1">Log today's site activity</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Plus size={24} />
            </div>
          </div>
        </Link>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 size={16} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">12</h3>
            <p className="text-xs text-slate-500 font-medium">Reports Sent</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
              <Clock size={16} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">2</h3>
            <p className="text-xs text-slate-500 font-medium">Pending Sync</p>
          </div>
        </div>

        {/* Recent History */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-slate-800">Recent Uploads</h3>
            <Link href="#" className="text-xs text-blue-600 font-bold">View All</Link>
          </div>

          <div className="space-y-3 pb-8">
            {recentUploads.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-8 bg-white rounded-xl border border-dashed border-slate-200">
                No recent activity found.
              </p>
            )}

            {recentUploads.map((report) => (
              <div key={report.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                  {(report.projects?.name || 'P')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{report.projects?.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{report.work_summary_text}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                    {new Date(report.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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
