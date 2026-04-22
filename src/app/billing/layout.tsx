"use client";

import React, { useState, useEffect } from 'react';
import BillingLogin from '@/components/billing/BillingLogin';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BillingLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const auth = localStorage.getItem('billingAuth');
        setIsAuthenticated(auth === 'true');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('billingAuth');
        setIsAuthenticated(false);
        router.push('/billing');
    };

    if (isAuthenticated === null) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">Verifying Access...</div>;
    }

    if (!isAuthenticated) {
        return <BillingLogin onSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Banner */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded flex items-center justify-center text-[var(--primary)] font-black">
                        KS
                    </div>
                    <span className="font-bold tracking-wide text-slate-800">PMS <span className="font-medium text-slate-400">| Billing Terminal</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded text-slate-600 border border-slate-200">
                        ID: KSPPL57
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-bold transition-colors"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
