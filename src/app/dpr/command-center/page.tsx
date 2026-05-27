"use client";

import React, { Suspense } from 'react';
import CommandCenterCore from '@/components/dpr/CommandCenterCore';

export default function CommandCenterPage() {
  return (
    <main className="w-full min-h-screen bg-slate-50">
      <Suspense fallback={<div className="flex items-center justify-center h-screen font-bold text-slate-400">Loading Command Center...</div>}>
        <CommandCenterCore />
      </Suspense>
    </main>
  );
}
