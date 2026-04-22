"use client";

import React, { useState } from 'react';
import { PlusCircle, FileText, TrendingUp, CheckCircle2 } from 'lucide-react';
import BillingEntryModal from '@/components/billing/BillingEntryModal';

export default function WorkProgressView() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Billing Dashboard</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage Work Progress and log new Running Account (RA) Bills.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[var(--primary)] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                >
                    <PlusCircle size={18} />
                    New RA Bill Entry
                </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <FileText size={16} className="text-blue-500" /> Total RA Bills
                    </div>
                    <div className="text-3xl font-black text-slate-800">14</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <CheckCircle2 size={16} className="text-emerald-500" /> Items Logged
                    </div>
                    <div className="text-3xl font-black text-slate-800">892</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <TrendingUp size={16} className="text-amber-500" /> Pending Review
                    </div>
                    <div className="text-3xl font-black text-slate-800">3</div>
                </div>
            </div>

            {/* Empty State for Table / Content */}
            <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
                    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Recent RA Logs will appear here</h3>
                <p className="text-slate-500 text-sm max-w-md">Click the "New RA Bill Entry" button above to open the billing terminal and start logging executed quantities.</p>
            </div>

            {/* The Modal Overlay */}
            {isModalOpen && <BillingEntryModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
