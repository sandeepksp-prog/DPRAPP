"use client";

import React, { useState, useEffect } from 'react';
import BillingLogin from '@/components/billing/BillingLogin';
import BillingNavigation from '@/components/billing/BillingNavigation';
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
            <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow-md z-10 relative">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/40 rounded flex items-center justify-center text-blue-400 font-black">
                        KS
                    </div>
                    <span className="font-bold tracking-wide">PMS <span className="font-light text-slate-400">| Billing Terminal</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs font-mono bg-slate-800 px-3 py-1.5 rounded text-emerald-400 border border-slate-700">
                        ID: KSPPL57
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <BillingNavigation />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
