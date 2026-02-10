'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { bulkInsertBOQ, BOQItemInput } from '@/lib/boq-actions';
import { UploadCloud, AlertTriangle, CheckCircle, Table } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BOQUploader() {
    const [csvText, setCsvText] = useState('');
    const [projectId, setProjectId] = useState<string>(''); // Ideally fetch/select active project
    const [parsedItems, setParsedItems] = useState<BOQItemInput[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // Fetch projects (Assume we might need a project selector if user needs to pick one)
    const [projects, setProjects] = useState<{ id: string, name: string }[]>([]);

    React.useEffect(() => {
        async function fetchProjects() {
            const { data } = await supabase.from('projects').select('id, name');
            if (data) {
                setProjects(data);
                if (data.length > 0) setProjectId(data[0].id); // Default to first project
            }
        }
        fetchProjects();
    }, []);

    const handleParse = () => {
        try {
            if (!csvText.trim()) return;

            const lines = csvText.split('\n').filter(l => l.trim());
            const items: BOQItemInput[] = [];

            // Loop through lines (skip header if detected)
            // Simple heuristic: if first line has "Code" or "Description", skip it
            let startIdx = 0;
            if (lines[0].toLowerCase().includes('code') || lines[0].toLowerCase().includes('description')) {
                startIdx = 1;
            }

            for (let i = startIdx; i < lines.length; i++) {
                const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, '')); // Basic CSV split

                // Expected Format: Item Code, Description, Unit, Quantity, Rate
                if (cols.length >= 5) {
                    items.push({
                        item_code: cols[0],
                        description: cols[1],
                        unit: cols[2],
                        total_quantity: parseFloat(cols[3]) || 0,
                        rate: parseFloat(cols[4]) || 0
                    });
                }
            }

            setParsedItems(items);
            setPreviewOpen(true);
            setMessage(`Parsed ${items.length} items successfully.`);
        } catch (e) {
            console.error(e);
            setMessage("Failed to parse CSV. Ensure format: Code, Description, Unit, Qty, Rate");
        }
    };

    const handleUpload = async () => {
        if (!projectId) {
            setMessage("Please select a project.");
            return;
        }

        setUploadStatus('uploading');
        try {
            const result = await bulkInsertBOQ(projectId, parsedItems);
            if (result.success) {
                setUploadStatus('success');
                setMessage(`Successfully uploaded ${result.count} items!`);
                setParsedItems([]);
                setCsvText('');
            } else {
                throw new Error("Upload failed partially or completely.");
            }
        } catch (e: any) {
            setUploadStatus('error');
            setMessage(e.message || "Upload failed.");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <UploadCloud className="text-blue-500" size={20} />
                    Bulk Upload BOQ Items
                </h3>
            </div>

            <div className="p-6 space-y-6">

                {/* Project Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Select Project</label>
                    <select
                        className="w-full md:w-1/2 p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    >
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                        {projects.length === 0 && <option value="">Loading projects...</option>}
                    </select>
                </div>

                {/* CSV Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">
                        Paste CSV Data
                        <span className="text-xs font-normal text-slate-500 ml-2">
                            (Format: Item Code, Description, Unit, Quantity, Rate)
                        </span>
                    </label>
                    <textarea
                        className="w-full h-48 p-4 font-mono text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`1.01, Site Clearance, Sqm, 5000, 15.50\n1.02, Excavation in Soil, cum, 1200, 120.00`}
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleParse}
                        disabled={!csvText}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        Parse & Preview
                    </button>

                    {parsedItems.length > 0 && (
                        <button
                            onClick={handleUpload}
                            disabled={uploadStatus === 'uploading'}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload to Database'}
                            {uploadStatus === 'success' && <CheckCircle size={16} />}
                        </button>
                    )}
                </div>

                {/* Feedback Message */}
                {message && (
                    <div className={cn(
                        "p-3 rounded-lg text-sm flex items-center gap-2",
                        uploadStatus === 'error' ? "bg-red-50 text-red-600" :
                            uploadStatus === 'success' ? "bg-emerald-50 text-emerald-600" :
                                "bg-blue-50 text-blue-600"
                    )}>
                        {uploadStatus === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                        {message}
                    </div>
                )}

                {/* Preview Table */}
                {previewOpen && parsedItems.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Table size={14} />
                            Previewing {parsedItems.length} Items
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-2">Code</th>
                                        <th className="px-4 py-2">Description</th>
                                        <th className="px-4 py-2">Unit</th>
                                        <th className="px-4 py-2 text-right">Qty</th>
                                        <th className="px-4 py-2 text-right">Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedItems.slice(0, 5).map((item, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                            <td className="px-4 py-2 font-mono text-xs">{item.item_code}</td>
                                            <td className="px-4 py-2 truncate max-w-xs" title={item.description}>{item.description}</td>
                                            <td className="px-4 py-2">{item.unit}</td>
                                            <td className="px-4 py-2 text-right">{item.total_quantity}</td>
                                            <td className="px-4 py-2 text-right">{item.rate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {parsedItems.length > 5 && (
                                <div className="px-4 py-2 text-xs text-center text-slate-400 bg-slate-50/50">
                                    ...and {parsedItems.length - 5} more rows
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
