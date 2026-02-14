'use client';

import React, { useState } from 'react';
import { PowerCard, PowerButton, colors } from '@/components/powerplay-clone';
import { BRIGADE_DATA } from '@/lib/dummy-data';
import {
    ChevronRight, ChevronDown, Info, ExternalLink, Plus, MoreVertical, LayoutPanelLeft, ArrowDown, ArrowUpRight
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function BOQPage() {
    const [showFinancials, setShowFinancials] = useState(true);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({ 'A': true, '1': true });
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-6 font-sans text-slate-800">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">BOQ</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Show financial summary</span>
                        <button
                            onClick={() => setShowFinancials(!showFinancials)}
                            className={`w-9 h-5 rounded-full relative transition-colors ${showFinancials ? 'bg-blue-600' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showFinancials ? 'left-4.5 translate-x-4' : 'left-0.5'}`} />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAnalysisModal(true)}
                        className="text-blue-600 text-sm font-medium hover:underline"
                    >
                        Budget Analysis
                    </button>
                    <PowerButton variant="primary">Record Payment Received</PowerButton>
                    <button className="p-2 border rounded hover:bg-slate-50"><MoreVertical size={16} /></button>
                </div>
            </div>

            {/* FINANCIAL SUMMARY CARDS */}
            {showFinancials && (
                <div className="grid grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-300">
                    <PowerCard className="p-5 border-l-4 border-l-green-500">
                        <div className="flex items-center gap-2 mb-4 text-green-700 font-semibold" >
                            <div className="p-1 rounded-full border border-green-200"><ArrowDown className="text-green-600 w-3 h-3" /></div> Received Amount
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-slate-500 text-sm">Payment received till date</span>
                            <span className="text-xl font-bold">₹8,85,10,000.00</span>
                        </div>
                        <div className="mt-4">
                            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">View history <ChevronRight size={14} /></button>
                        </div>
                    </PowerCard>

                    <PowerCard className="p-5 border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold" >
                            <div className="p-1 rounded-full border border-slate-200 text-slate-500 text-xs">₹</div> BOQ amounts <Info size={14} className="text-slate-400" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-500 text-sm">Amount as per achieved qty</span>
                                <span className="text-lg font-bold">₹25,44,346.00</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-slate-500 text-sm">Total amount</span>
                                <span className="text-lg font-bold text-slate-800">₹6,80,90,945.00</span>
                            </div>
                        </div>
                    </PowerCard>

                    <PowerCard className="p-5 border-l-4 border-l-orange-500">
                        <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold" >
                            <div className="p-1 rounded-full border border-slate-200 text-slate-500 text-xs"><ArrowUpRight className="w-3 h-3" /></div> Budget amounts <Info size={14} className="text-slate-400" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-500 text-sm">Amount as per achieved qty</span>
                                <span className="text-lg font-bold">₹25,43,048.23</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-slate-500 text-sm">Total amount</span>
                                <span className="text-lg font-bold text-slate-800">₹6,80,83,213.94</span>
                            </div>
                        </div>
                    </PowerCard>
                </div>
            )}

            {/* BOQ TABLE */}
            <PowerCard className="pb-4">
                <div className="p-4 border-b flex justify-between">
                    <div className="relative w-64">
                        <input placeholder="Search" className="w-full pl-8 pr-3 py-2 border rounded text-sm" />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border rounded text-sm font-medium hover:bg-slate-50">
                        <LayoutPanelLeft size={14} /> Manage columns
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="px-6 py-3 w-20">Item Code</th>
                                <th className="px-6 py-3 w-1/3">Description</th>
                                <th className="px-4 py-3 text-right">Total Quantity</th>
                                <th className="px-4 py-3 text-right">Achieved Quantity</th>
                                <th className="px-4 py-3 text-right">Budget Amount<br /><span className="normal-case font-normal text-[10px]">(Achieved Qty)</span></th>
                                <th className="px-4 py-3 text-right">BoQ Amount<br /><span className="normal-case font-normal text-[10px]">(Achieved Qty)</span></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {/* Recursive rendering would go here, simplified for specific dummy data */}
                            {/* Row A */}
                            <tr className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => toggleRow('A')}>
                                <td className="px-6 py-4 font-medium">A</td>
                                <td className="px-6 py-4 font-medium flex items-center gap-2">
                                    {expandedRows['A'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />} Civil & Interior
                                </td>
                                <td className="px-4 py-4 text-right">-</td>
                                <td className="px-4 py-4 text-right">-</td>
                                <td className="px-4 py-4 text-right">-</td>
                                <td className="px-4 py-4 text-right">-</td>
                            </tr>

                            {expandedRows['A'] && (
                                <>
                                    {/* Row 1 */}
                                    <tr className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => toggleRow('1')}>
                                        <td className="px-6 py-4 pl-10 text-slate-600">1</td>
                                        <td className="px-6 py-4 pl-10 flex items-center gap-2 font-medium text-slate-700">
                                            {expandedRows['1'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />} FINISHING WORK
                                        </td>
                                        <td className="px-4 py-4 text-right">-</td>
                                        <td className="px-4 py-4 text-right">-</td>
                                        <td className="px-4 py-4 text-right">-</td>
                                        <td className="px-4 py-4 text-right">-</td>
                                    </tr>

                                    {/* Children of 1 */}
                                    {expandedRows['1'] && BRIGADE_DATA.boq.items[0].children[0].children.map((item) => (
                                        <tr key={item.code} className="border-b hover:bg-slate-50 group">
                                            <td className="px-6 py-4 pl-14 text-slate-500 text-xs">{item.code}</td>
                                            <td className="px-6 py-4 pl-14">
                                                <div className="font-medium text-slate-800">{item.description.split(':-')[0]}</div>
                                                <div className="text-slate-500 text-xs truncate max-w-md">{item.description.split(':-')[1] || item.description}</div>
                                            </td>
                                            <td className="px-4 py-4 text-right">{item.totalQty}</td>
                                            <td className="px-4 py-4 text-right flex items-center justify-end gap-2">
                                                {item.achievedQty}
                                                {item.hasAddButton && <button className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={12} /></button>}
                                            </td>
                                            <td className="px-4 py-4 text-right">{item.budgetAmount}</td>
                                            <td className="px-4 py-4 text-right">{item.boqAmount}</td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </PowerCard>

            {/* ANALYSIS MODAL */}
            {showAnalysisModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-2xl w-[800px] overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-bold">Budget Analysis</h2>
                            <button onClick={() => setShowAnalysisModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>

                        <div className="p-6">
                            <h3 className="font-semibold mb-6">Budget vs Actual Amounts</h3>

                            <div className="flex justify-between mb-8 px-12">
                                <div className="text-center">
                                    <div className="flex items-center gap-2 justify-center text-green-600 mb-1"><ArrowDown size={14} /> Amount received</div>
                                    <div className="text-2xl font-bold">₹8.85 Cr</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-2 justify-center text-slate-600 mb-1">BOQ achieved</div>
                                    <div className="text-xl font-bold">₹25.44 Lac <span className="text-sm font-normal text-slate-400">/ Total ₹6.81 Cr</span></div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-2 justify-center text-slate-600 mb-1">Budget achieved</div>
                                    <div className="text-xl font-bold">₹25.43 Lac <span className="text-sm font-normal text-slate-400">/ Total ₹6.81 Cr</span></div>
                                </div>
                            </div>

                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { name: 'Amount Received', val: 8.85, full: 8.85 },
                                        { name: 'BOQ Amount (Achieved Qty)', val: 0.25, full: 6.81 },
                                        { name: 'Budget Amount (Achieved Qty)', val: 0.25, full: 6.81 },
                                    ]} barSize={40}>
                                        <CartesianGrid vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <Tooltip cursor={{ fill: '#F8FAFC' }} />
                                        {/* Background bars for total */}
                                        <Bar dataKey="full" fill="#F1F5F9" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                                        {/* Foreground bars for actual */}
                                        <Bar dataKey="val" fill="#6366F1" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Local Arrow components removed in favor of lucide-react imports
