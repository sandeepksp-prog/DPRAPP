import React from 'react';
import { AlertTriangle, Target, History } from 'lucide-react';

export default function IssueView({ subMenu }: { subMenu: string }) {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center py-20">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{subMenu} Module</h2>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    This module is under construction. It will track site issues, recurring blockers, and target vs achieved analysis.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <span className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold border border-slate-200">
                        Active Tickets
                    </span>
                    <span className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold border border-slate-200">
                        Resolution Rate
                    </span>
                </div>
            </div>
        </div>
    );
}
