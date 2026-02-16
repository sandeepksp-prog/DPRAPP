'use client';

import React from 'react';
import Sidebar, { ActionHeader } from '@/components/powerplay-clone/Sidebar';
import { colors } from '@/components/powerplay-clone/theme';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {children}
        </div>
    );
}
