import React from 'react';

export default function WorkProgressView() {
    return (
        <div className="p-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center max-w-2xl mx-auto mt-10">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-2">Work Progress Data</h2>
                <p className="text-slate-500 text-sm">
                    This module provides view-only access to physical execution data and JMR submissions. 
                    Please navigate to the <strong>Client Bill Progress (RA Entry)</strong> tab to feed billing data.
                </p>
            </div>
        </div>
    );
}
