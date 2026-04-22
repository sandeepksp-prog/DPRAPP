"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Save, Package, RefreshCw, Filter, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { ref, get } from 'firebase/database';

export default function BillingEntryPortal() {
    const [items, setItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [rate, setRate] = useState<number>(0);
    const [boq, setBoq] = useState<number>(0);
    const [eq, setEq] = useState<number>(0);
    const [nonOperating, setNonOperating] = useState<number>(0);
    const [variation, setVariation] = useState<number>(0);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const itemsRef = ref(db, 'billing/master_items');
                const snapshot = await get(itemsRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const itemsArray = Object.keys(data)
                        .map(key => ({ key, ...data[key] }))
                        .filter(item => !item.is_heading); // Only show billable items
                    setItems(itemsArray);
                }
            } catch (error) {
                console.error("Failed to fetch billing items:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, []);

    const filteredItems = useMemo(() => {
        if (!searchTerm) return items.slice(0, 50); // Show top 50 by default
        const lower = searchTerm.toLowerCase();
        return items.filter(i => 
            String(i.item_no).toLowerCase().includes(lower) || 
            String(i.description).toLowerCase().includes(lower)
        ).slice(0, 50);
    }, [searchTerm, items]);

    const handleSelect = (item: any) => {
        setSelectedItem(item);
        setRate(item.rate || 0);
        setBoq(0);
        setEq(0);
        setNonOperating(0);
        setVariation(0);
        setSearchTerm('');
        setIsSaved(false);
    };

    const handleSave = () => {
        // In a real scenario, this pushes to billing/ra_records/...
        setIsSaved(true);
        setTimeout(() => {
            setSelectedItem(null);
            setIsSaved(false);
        }, 2000);
    };

    return (
        <div className="relative min-h-[calc(100vh-140px)] w-full overflow-hidden bg-slate-900 p-4 md:p-8 flex items-start justify-center">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="w-full max-w-5xl relative z-10 flex flex-col gap-6">
                
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">RA Bill Entry Terminal</h2>
                        <p className="text-slate-400 text-sm mt-1">Select an item from the master BOQ database to log quantities.</p>
                    </div>
                </div>

                {/* Main Interactive Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
                    
                    {/* Search & Listing Sidebar */}
                    <div className="lg:col-span-4 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col h-[600px] shadow-2xl">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Item No or Desc..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                                    <RefreshCw className="animate-spin" size={20} />
                                    <span className="text-sm font-medium">Syncing Data...</span>
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="text-center py-10 text-slate-500 text-sm">No items found.</div>
                            ) : (
                                filteredItems.map((item) => (
                                    <div 
                                        key={item.key}
                                        onClick={() => handleSelect(item)}
                                        className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedItem?.key === item.key ? 'bg-blue-600/20 border-blue-500 shadow-inner' : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-black text-blue-400 uppercase tracking-wider">ITEM {item.item_no}</span>
                                            <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">{item.unit}</span>
                                        </div>
                                        <p className="text-sm text-slate-200 line-clamp-2">{item.description}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Entry Form Area */}
                    <div className="lg:col-span-8 relative">
                        {/* Glass mirror blur effect container */}
                        <div className={`absolute inset-0 bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl transition-all duration-500 flex flex-col p-6 ${selectedItem ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                            
                            {selectedItem && (
                                <>
                                    <div className="flex justify-between items-start border-b border-white/10 pb-5 mb-5">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-black px-2 py-1 rounded">ITEM {selectedItem.item_no}</span>
                                                <span className="text-slate-400 text-xs font-medium">| {selectedItem.parent_heading || 'ROOT'}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white leading-tight">{selectedItem.description}</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
                                        
                                        {/* Rate Matrix */}
                                        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Price Matrix</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                                <input
                                                    type="number"
                                                    value={rate}
                                                    onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-slate-800 border border-slate-600 text-white font-mono text-lg rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-2">Base Rate: ₹{selectedItem.rate} / {selectedItem.unit}</p>
                                        </div>

                                        {/* BOQ / EQ Matrix */}
                                        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quantities ({selectedItem.unit})</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <span className="text-[10px] text-slate-500 font-bold">BOQ (Total)</span>
                                                    <input
                                                        type="number"
                                                        value={boq}
                                                        onChange={(e) => setBoq(parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-500 font-bold">EQ (Executed)</span>
                                                    <input
                                                        type="number"
                                                        value={eq}
                                                        onChange={(e) => setEq(parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-slate-800 border border-slate-600 text-emerald-400 font-bold rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Exceptions Matrix */}
                                        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Filter size={14}/> Exceptions & Variations</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-[10px] text-slate-500 font-bold">Non-Operating Qty</span>
                                                    <input
                                                        type="number"
                                                        value={nonOperating}
                                                        onChange={(e) => setNonOperating(parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-slate-800 border border-slate-600 text-amber-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-500 font-bold">Variation +/-</span>
                                                    <input
                                                        type="number"
                                                        value={variation}
                                                        onChange={(e) => setVariation(parseFloat(e.target.value) || 0)}
                                                        className="w-full bg-slate-800 border border-slate-600 text-rose-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 mt-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button 
                                            onClick={() => setSelectedItem(null)}
                                            className="px-5 py-2.5 rounded-xl text-slate-300 font-bold hover:bg-slate-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            disabled={isSaved}
                                            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'}`}
                                        >
                                            {isSaved ? <><CheckCircle2 size={18}/> Saved</> : <><Save size={18}/> Log RA Entry</>}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Empty State */}
                        {!selectedItem && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700/50 rounded-2xl">
                                <Package size={48} className="text-slate-700 mb-4 opacity-50" />
                                <p className="font-medium text-slate-400">Select an item from the left panel to begin.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
