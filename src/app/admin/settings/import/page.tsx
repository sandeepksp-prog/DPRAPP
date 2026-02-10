'use client';

import BOQUploader from '@/components/admin/BOQUploader';

export default function ImportPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Data Import</h1>
                <p className="text-slate-500 mt-1">
                    Upload bulk data for BOQ Items. Use this to populate the project inventory.
                </p>
            </div>

            <BOQUploader />
        </div>
    );
}
