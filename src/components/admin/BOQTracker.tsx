'use client';

import React, { useState, useEffect } from 'react';
import { dataProvider } from '@/lib/data-provider';
import {
    ChevronRight,
    AlertTriangle,
    Info
} from 'lucide-react';

interface BOQItem {
    id: string;
    item_code: string;
    description: string;
    unit: string;
    total_quantity: number;
    rate: number;
    // Derived
    actual_qty?: number;
    total_value: number;
    percentage: number;
}

export default function BOQTracker() {
    const [items, setItems] = useState<BOQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                // Fetch Projects to get the first one for context (or pass prop)
                // For now, assuming first project context like Dashboard
                const projects = await dataProvider.getProjects();

                if (projects.length === 0) {
                    setItems([]);
                    return;
                }

                const projectId = projects[0].id; // Default to first

                // Use Analytics for the heavy lifting (Actuals, % etc)
                const analytics = await dataProvider.getBOQAnalytics(projectId);

                // Map Analytics Material Health back to BOQItem structure for this grid
                // (Note: Analytics returns 'materialHealth' which is a summary. 
                // BOQ Tracker needs 'boq_items' + 'actuals'. 
                // dataProvider.getBOQAnalytics computes this. Let's use it.)

                const gridData = analytics.materialHealth.map(m => ({
                    id: m.itemCode,
                    item_code: m.itemCode,
                    description: m.description,
                    unit: 'Unit',
                    total_quantity: m.stock,
                    rate: 0,
                    actual_qty: m.consumed,
                    total_value: 0,
                    percentage: (m.consumed / m.stock) * 100
                }));

                // BETTER APPROACH: 
                // 1. Get BOQ Items (Source of Truth for meta)
                const boqItems = await dataProvider.getBOQItems(projectId);

                // 2. Get Analytics (Source of Truth for Actuals)
                const { materialHealth } = analytics;
                const consumptionMap = new Map(materialHealth.map(m => [m.itemCode, m.consumed]));

                const merged = boqItems.map((item: any) => {
                    const actual = consumptionMap.get(item.item_code) || 0;
                    return {
                        ...item,
                        actual_qty: actual,
                        total_value: (item.rate || 0) * (item.total_quantity || 0),
                        percentage: Math.min((actual / (item.total_quantity || 1)) * 100, 100)
                    }
                });

                setItems(merged);

            } catch (err: any) {
                console.error("Error fetching BOQ data:", err);
                setError("Failed to load BOQ data.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 text-slate-400 animate-pulse">
                Loading BOQ data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertTriangle size={18} />
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-semibold text-slate-900">Inventory & BOQ Tracking</h3>
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {items.length} Items Live
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Item Code</th>
                            <th className="px-6 py-3 font-medium w-1/3">Description</th>
                            <th className="px-6 py-3 font-medium text-center">Unit</th>
                            <th className="px-6 py-3 font-medium">Progress</th>
                            <th className="px-6 py-3 font-medium text-right">Est. Qty</th>
                            <th className="px-6 py-3 font-medium text-right">Actual Qty</th>
                            <th className="px-6 py-3 font-medium text-right">% Done</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item) => {
                            const isOverrun = item.actual_qty! > item.total_quantity;

                            return (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {item.item_code}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {item.description}
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-500">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">
                                            {item.unit}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 w-48">
                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${isOverrun ? "bg-red-500" : "bg-emerald-500"
                                                    }`}
                                                style={{ width: `${Math.min((item.actual_qty! / item.total_quantity) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600 font-mono">
                                        {item.total_quantity.toLocaleString()}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-mono font-bold ${isOverrun ? "text-red-600" : "text-emerald-600"
                                        }`}>
                                        {item.actual_qty?.toLocaleString() || 0}
                                        {isOverrun && (
                                            <span className="block text-[10px] uppercase tracking-wide text-red-500 font-bold mt-1">Overrun</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOverrun ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                                            }`}>
                                            {((item.actual_qty! / item.total_quantity) * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}

                        {items.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Info size={24} className="text-slate-300" />
                                        <p>No BOQ items found. Please populate the database.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
