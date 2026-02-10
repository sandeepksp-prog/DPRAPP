'use client';

import { useEffect, useState } from 'react';
import { dataProvider } from '@/lib/data-provider';
import { PackageSearch, Filter, Download } from 'lucide-react';
import { ProjectAnalytics } from '@/lib/analytics';

export default function InventoryPage() {
    const [items, setItems] = useState<ProjectAnalytics['materialHealth']>([]);

    useEffect(() => {
        async function load() {
            // Load first project for demo
            const projects = await dataProvider.getProjects();
            if (projects.length > 0) {
                const analytics = await dataProvider.getBOQAnalytics(projects[0].id);
                setItems(analytics.materialHealth);
            }
        }
        load();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventory & BOQ</h1>
                    <p className="text-slate-500 text-sm">Material stock status across all sites</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold">Item Description</th>
                                <th className="px-6 py-4 font-bold">Code</th>
                                <th className="px-6 py-4 text-right font-bold">Total Stock</th>
                                <th className="px-6 py-4 text-right font-bold">Consumed</th>
                                <th className="px-6 py-4 text-right font-bold">Balance</th>
                                <th className="px-6 py-4 text-center font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                                                <PackageSearch size={16} />
                                            </div>
                                            {item.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.itemCode || '-'}</td>
                                    <td className="px-6 py-4 text-right text-slate-600 font-medium">{item.stock}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">{item.consumed}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">{item.balance}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${item.status === 'Critical' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                item.status === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                    'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Critical' ? 'bg-red-500' :
                                                    item.status === 'Medium' ? 'bg-amber-500' :
                                                        'bg-emerald-500'
                                                }`} />
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {items.length === 0 && (
                    <div className="p-12 text-center text-slate-400">Loading inventory data...</div>
                )}
            </div>
        </div>
    );
}
