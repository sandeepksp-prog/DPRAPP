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
        <div className="flex h-screen" style={{ backgroundColor: colors.neutral.gray50, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            {/* PowerPlay 64px Icon Sidebar + Flyout */}
            <Sidebar />

            {/* Main Content Area */}
            <main
                className="flex-1 flex flex-col h-full overflow-hidden"
                style={{ marginLeft: '64px' }}
            >
                {/* Action Header */}
                <ActionHeader
                    projectName="INFRA-OS"
                    subtitle="Last synced few seconds ago"
                />

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto scroll-smooth p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
