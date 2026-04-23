"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Save, Package, RefreshCw, Filter, CheckCircle2, X, Building, MapPin, Hash } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { ref, get, set, push } from 'firebase/database';
import { SCHEME_MAP } from '@/lib/scheme-data';

interface BillingEntryModalProps {
    onClose: () => void;
}

const ALL_SCHEMES = Object.keys(SCHEME_MAP).map(id => ({ id, name: SCHEME_MAP[id].name }));

export default function BillingEntryModal({ onClose }: BillingEntryModalProps) {
    const [items, setItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Context States
    const [selectedScheme, setSelectedScheme] = useState<string>('');
    const [division, setDivision] = useState<'E&M' | 'CIVIL' | ''>('');
    const [raNumber, setRaNumber] = useState<string>('');

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
                        .filter(item => !item.is_heading);
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
        if (!searchTerm) return items.slice(0, 50);
        const lower = searchTerm.toLowerCase();
        return items.filter(i => 
            String(i.item_no).toLowerCase().includes(lower) || 
            String(i.description).toLowerCase().includes(lower)
        ).slice(0, 50);
    }, [searchTerm, items]);

    const handleSelect = (item: any) => {
        setSelectedItem(item);
        setRate(item.rate || 0); // Will be overwritten if scheme-specific rate is found
        setBoq(0);
        setEq(0);
        setNonOperating(0);
        setVariation(0);
        setSearchTerm('');
        setIsSaved(false);
    };

    const handleSave = async () => {
        if (!selectedScheme || !division || !raNumber) {
            alert("Please select Scheme, Division, and RA Number before logging.");
            return;
        }

        try {
            const entryRef = push(ref(db, `billing/ra_records/${selectedScheme}/${division}/${raNumber}`));
            await set(entryRef, {
                item_no: selectedItem.item_no,
                item_key: selectedItem.key,
                rate,
                boq,
                eq,
                non_operating: nonOperating,
                variation,
                timestamp: Date.now(),
                logged_by: "KSPPL57"
            });

            setIsSaved(true);
            setTimeout(() => {
                setSelectedItem(null);
                setIsSaved(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to log entry", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-md bg-slate-900/40">
            {/* Cinematic Modal Container: 90vh max height, auto widths to leave letterbox padding */}
            <div className="w-[95vw] md:w-[90vw] lg:w-[85vw] max-w-7xl bg-white shadow-2xl rounded-2xl border border-slate-200 flex flex-col h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header & Global Context Selectors */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">Log RA Entry</h2>
                            <p className="text-xs font-bold text-slate-500 mt-0.5 uppercase tracking-wider">Master Item Matrix</p>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select 
                                value={selectedScheme}
                                onChange={(e) => setSelectedScheme(e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-800 font-bold rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                            >
                                <option value="">Select Scheme</option>
                                {ALL_SCHEMES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select 
                                value={division}
                                onChange={(e) => setDivision(e.target.value as 'E&M' | 'CIVIL')}
                                className="w-full bg-white border border-slate-200 text-slate-800 font-bold rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                            >
                                <option value="">Select Division</option>
                                <option value="E&M">E&M</option>
                                <option value="CIVIL">CIVIL</option>
                            </select>
                        </div>

                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text"
                                placeholder="RA Number (e.g. RA-01)"
                                value={raNumber}
                                onChange={(e) => setRaNumber(e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-800 font-bold rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase"
                            />
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden bg-white">
                    
                    {/* Left Sidebar: Search & List */}
                    <div className="lg:col-span-4 border-r border-slate-100 bg-slate-50/30 flex flex-col h-full">
                        <div className="p-4 border-b border-slate-100 bg-white">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by Item No or Desc..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
                                    <RefreshCw className="animate-spin" size={18} />
                                    <span className="text-xs font-semibold">Syncing Database...</span>
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 text-sm font-medium">No items found.</div>
                            ) : (
                                filteredItems.map((item) => (
                                    <div 
                                        key={item.key}
                                        onClick={() => handleSelect(item)}
                                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${selectedItem?.key === item.key ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className={`text-xs font-black tracking-wider ${selectedItem?.key === item.key ? 'text-blue-700' : 'text-slate-700'}`}>ITEM {item.item_no}</span>
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{item.unit}</span>
                                        </div>
                                        <p className={`text-xs leading-relaxed line-clamp-2 ${selectedItem?.key === item.key ? 'text-blue-900 font-semibold' : 'text-slate-500 font-medium'}`}>{item.description}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Entry Form */}
                    <div className="lg:col-span-8 bg-white relative flex flex-col h-full overflow-y-auto custom-scrollbar">
                        {selectedItem ? (
                            <div className="p-6 sm:p-10 flex flex-col h-full">
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-black tracking-widest px-2.5 py-1 rounded">ITEM {selectedItem.item_no}</span>
                                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">| {selectedItem.parent_heading || 'ROOT CATEGORY'}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 leading-snug">{selectedItem.description}</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                                    
                                    {/* Price Matrix */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Rate Matrix</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                                            <input
                                                type="number"
                                                value={rate}
                                                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                                                className="w-full bg-white border border-slate-300 text-slate-800 font-mono text-xl font-black rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold mt-2 flex items-center gap-1">
                                            <span className="text-slate-400">Master Data Rate:</span> ₹{selectedItem.rate} / {selectedItem.unit}
                                        </p>
                                    </div>

                                    {/* Quantities */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quantities ({selectedItem.unit})</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-[10px] text-slate-500 font-black mb-1.5 block">BOQ (Total)</span>
                                                <input
                                                    type="number"
                                                    value={boq}
                                                    onChange={(e) => setBoq(parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-white border border-slate-300 text-slate-800 font-bold rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-emerald-600 font-black mb-1.5 block">EQ (Executed)</span>
                                                <input
                                                    type="number"
                                                    value={eq}
                                                    onChange={(e) => setEq(parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Exceptions */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Filter size={14}/> Exceptions & Variations</label>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <span className="text-[10px] text-amber-600 font-black mb-1.5 block">Non-Operating Qty</span>
                                                <input
                                                    type="number"
                                                    value={nonOperating}
                                                    onChange={(e) => setNonOperating(parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-white border border-slate-300 text-slate-800 font-bold rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-rose-600 font-black mb-1.5 block">Variation +/-</span>
                                                <input
                                                    type="number"
                                                    value={variation}
                                                    onChange={(e) => setVariation(parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-white border border-slate-300 text-slate-800 font-bold rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
                                    <button 
                                        onClick={() => setSelectedItem(null)}
                                        className="px-6 py-2.5 rounded-xl text-slate-500 font-black tracking-wide hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 text-sm"
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={isSaved || !selectedScheme || !division || !raNumber}
                                        className={`px-8 py-2.5 rounded-xl font-black tracking-wide flex items-center gap-2 transition-all shadow-md text-sm ${
                                            isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                                            (!selectedScheme || !division || !raNumber) ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' :
                                            'bg-[var(--primary)] hover:bg-blue-700 text-white shadow-blue-600/20'
                                        }`}
                                    >
                                        {isSaved ? <><CheckCircle2 size={16}/> LOGGED SUCCESSFULLY</> : <><Save size={16}/> LOG ENTRY</>}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                                <Package size={56} strokeWidth={1} className="text-slate-300 mb-4" />
                                <p className="font-bold text-slate-500">Select an item to log quantities.</p>
                                <p className="text-xs text-slate-400 mt-2 max-w-xs text-center font-medium">Please ensure you have selected the Scheme, Division, and RA Number in the top header first.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
