"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Save, Package, Filter, X, FileDown, Eye, Calculator, Percent, Plus, Trash2, Database } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { ref, get, set, update } from 'firebase/database';
import { SCHEME_MAP } from '@/lib/scheme-data';

interface RAEntryWorkspaceProps {
    onClose: () => void;
}

const ALL_SCHEMES = Object.keys(SCHEME_MAP).map(id => ({ id, name: SCHEME_MAP[id].name }));

export default function RAEntryWorkspace({ onClose }: RAEntryWorkspaceProps) {
    // --- DATABASE STATES ---
    const [masterItems, setMasterItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- CONTEXT STATES ---
    const [selectedScheme, setSelectedScheme] = useState<string>('');
    const [division, setDivision] = useState<'E&M' | 'CIVIL' | ''>('');
    const [raMode, setRaMode] = useState<'CREATE' | 'EDIT' | null>(null);
    const [raNumber, setRaNumber] = useState<string>('');

    // --- WORKSPACE STATES ---
    const [currentRaItems, setCurrentRaItems] = useState<any[]>([]); 
    const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null); 
    const [editorMode, setEditorMode] = useState<'QTY' | 'BREAKUP'>('QTY');
    const [schemeBoqs, setSchemeBoqs] = useState<Record<string, number>>({});

    // --- SEARCH DROPDOWN STATES ---
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Fetch master items
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
                    setMasterItems(itemsArray);
                }
            } catch (error) {
                console.error("Failed to fetch billing items:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();

        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch scheme specific BOQ when scheme is selected
    useEffect(() => {
        if (!selectedScheme) {
            setSchemeBoqs({});
            return;
        }
        const fetchSchemeBoq = async () => {
            try {
                const boqRef = ref(db, `billing/scheme_boq/${selectedScheme}`);
                const snapshot = await get(boqRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const boqMap: Record<string, number> = {};
                    Object.keys(data).forEach(key => {
                        boqMap[key] = data[key].boq || 0;
                    });
                    setSchemeBoqs(boqMap);

                    // Auto-update any already added items with their new BOQ
                    setCurrentRaItems(prev => prev.map(item => {
                        const newBoq = boqMap[item.key] || 0;
                        const eq = item.eq || 0;
                        return {
                            ...item,
                            boq: newBoq,
                            nonOperating: newBoq > eq ? newBoq - eq : 0,
                            variation: eq > newBoq ? eq - newBoq : 0
                        };
                    }));
                } else {
                    setSchemeBoqs({});
                }
            } catch (error) {
                console.error("Failed to fetch scheme BOQ:", error);
            }
        };
        fetchSchemeBoq();
    }, [selectedScheme]);

    // If division is selected, optionally filter master items. 
    // The user requested auto-filtering department wise items.
    const filteredMasterItems = useMemo(() => {
        if (!searchTerm) return [];
        const lower = searchTerm.toLowerCase();
        let list = masterItems;
        
        // Auto filter by department if set in master
        if (division) {
            list = list.filter(i => !i.department || i.department === division);
        }

        return list.filter(i => 
            String(i.item_no).toLowerCase().includes(lower) || 
            String(i.description).toLowerCase().includes(lower)
        ).slice(0, 15);
    }, [searchTerm, masterItems, division]);

    const handleAddItemToRA = (item: any) => {
        if (currentRaItems.find(i => i.key === item.key)) {
            setSelectedItemKey(item.key);
            setEditorMode('QTY');
        } else {
            const initialBoq = schemeBoqs[item.key] || 0;
            const newItem = {
                ...item,
                eq: 0,
                boq: initialBoq,
                nonOperating: initialBoq, // since eq is 0, nonOperating = boq
                variation: 0,
                rate: item.rate || 0,
                breakup: item.breakup || [], // Load existing breakup if exists
                department: item.department || '' 
            };
            setCurrentRaItems(prev => [...prev, newItem]);
            setSelectedItemKey(item.key);
            setEditorMode('QTY');
        }
        setSearchTerm('');
        setIsSearchOpen(false);
    };

    const handleUpdateQty = (key: string, field: 'boq' | 'eq', value: number) => {
        setCurrentRaItems(prev => prev.map(item => {
            if (item.key !== key) return item;
            const updated = { ...item, [field]: value };
            
            const boq = updated.boq || 0;
            const eq = updated.eq || 0;
            
            updated.nonOperating = boq > eq ? boq - eq : 0;
            updated.variation = eq > boq ? eq - boq : 0;
            
            return updated;
        }));
    };

    const handleUpdateRate = (key: string, value: number) => {
        setCurrentRaItems(prev => prev.map(item => 
            item.key === key ? { ...item, rate: value } : item
        ));
    };

    const handleUpdateDepartment = (key: string, dept: string) => {
        setCurrentRaItems(prev => prev.map(item => 
            item.key === key ? { ...item, department: dept } : item
        ));
    }

    // --- BREAKUP LOGIC ---
    const handleAddBreakupRow = (key: string) => {
        setCurrentRaItems(prev => prev.map(item => {
            if (item.key !== key) return item;
            const newRow = { id: Date.now().toString(), percentage: 0, description: '' };
            return { ...item, breakup: [...(item.breakup || []), newRow] };
        }));
    };

    const handleUpdateBreakupRow = (key: string, rowId: string, field: 'percentage' | 'description', value: any) => {
        setCurrentRaItems(prev => prev.map(item => {
            if (item.key !== key) return item;
            const updatedBreakup = item.breakup.map((row: any) => 
                row.id === rowId ? { ...row, [field]: value } : row
            );
            return { ...item, breakup: updatedBreakup };
        }));
    };

    const handleUpdateBreakupExecution = (key: string, rowId: string, field: 'prevQty' | 'thisQty', value: number) => {
        setCurrentRaItems(prev => prev.map(item => {
            if (item.key !== key) return item;
            const updatedBreakup = item.breakup.map((row: any) => 
                row.id === rowId ? { ...row, [field]: value } : row
            );
            return { ...item, breakup: updatedBreakup };
        }));
    };

    const handleRemoveBreakupRow = (key: string, rowId: string) => {
        setCurrentRaItems(prev => prev.map(item => {
            if (item.key !== key) return item;
            return { ...item, breakup: item.breakup.filter((row: any) => row.id !== rowId) };
        }));
    };

    const handleSaveMasterConfig = async (item: any) => {
        try {
            const itemRef = ref(db, `billing/master_items/${item.key}`);
            await update(itemRef, {
                breakup: item.breakup || [],
                department: item.department || ''
            });
            alert(`Master config for Item ${item.item_no} updated! Future additions will auto-load this setup.`);
        } catch (e) {
            console.error("Master update failed:", e);
            alert("Failed to update Master DB.");
        }
    };

    const handleRemoveItem = (key: string) => {
        setCurrentRaItems(prev => prev.filter(item => item.key !== key));
        if (selectedItemKey === key) setSelectedItemKey(null);
    };

    // --- BACKEND ACTIONS ---
    const handleSaveDraft = async () => {
        if (!selectedScheme || !division || !raNumber || currentRaItems.length === 0) return;
        try {
            const draftRef = ref(db, `billing/ra_drafts/${selectedScheme}/${division}/${raNumber}`);
            await set(draftRef, {
                items: currentRaItems,
                timestamp: Date.now(),
                status: 'DRAFT',
                logged_by: "KSPPL57"
            });
            alert("Draft Saved Successfully!");
        } catch (e) {
            console.error("Draft failed:", e);
        }
    };

    const handleSubmitRA = async () => {
        if (!selectedScheme || !division || !raNumber || currentRaItems.length === 0) return;
        try {
            const recordRef = ref(db, `billing/ra_records/${selectedScheme}/${division}/${raNumber}`);
            await set(recordRef, {
                items: currentRaItems,
                timestamp: Date.now(),
                status: 'SUBMITTED',
                logged_by: "KSPPL57"
            });
            alert(`RA ${raNumber} Submitted Successfully!`);
            setCurrentRaItems([]); 
            setSelectedItemKey(null);
            setRaNumber('');
            setRaMode(null);
        } catch (e) {
            console.error("Submit failed:", e);
        }
    };

    const handlePreview = () => alert("Preview rendering engine booting up... (WIP)");
    const handleGeneratePDF = () => alert("PDF Generation triggered. (WIP)");

    const activeItem = currentRaItems.find(i => i.key === selectedItemKey);
    const breakupTotal = activeItem?.breakup?.reduce((sum: number, row: any) => sum + Number(row.percentage || 0), 0) || 0;

    return (
        <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col shadow-sm overflow-hidden animate-in fade-in duration-300">
            
            {/* 1. TOP NAV: Context & Search */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between gap-4 shrink-0">
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mr-2">
                        <X size={20} />
                    </button>
                    
                    <select 
                        value={selectedScheme}
                        onChange={(e) => setSelectedScheme(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Select Scheme</option>
                        {ALL_SCHEMES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    <select 
                        value={division}
                        onChange={(e) => setDivision(e.target.value as 'E&M' | 'CIVIL')}
                        className="bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Select Department</option>
                        <option value="E&M">E&M</option>
                        <option value="CIVIL">CIVIL</option>
                    </select>

                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                        <button 
                            onClick={() => { setRaMode('CREATE'); setRaNumber('RA-02'); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${raMode === 'CREATE' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Create Next RA
                        </button>
                        <button 
                            onClick={() => { setRaMode('EDIT'); setRaNumber(''); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${raMode === 'EDIT' ? 'bg-white shadow text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Edit Previous RA
                        </button>
                    </div>

                    {raMode && (
                        <input 
                            type="text"
                            placeholder="RA No."
                            value={raNumber}
                            onChange={(e) => setRaNumber(e.target.value)}
                            className="bg-white border border-slate-200 text-slate-800 font-black rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:border-blue-500 uppercase"
                        />
                    )}
                </div>

                <div className="relative w-full md:w-80" ref={searchRef}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search to Add Items to RA..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsSearchOpen(true);
                            }}
                            onFocus={() => setIsSearchOpen(true)}
                            className="w-full bg-white border border-slate-300 text-slate-800 font-bold rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
                        />
                    </div>
                    {isSearchOpen && searchTerm && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                            {filteredMasterItems.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-500">No items found</div>
                            ) : (
                                filteredMasterItems.map(item => (
                                    <button
                                        key={item.key}
                                        onClick={() => handleAddItemToRA(item)}
                                        className="w-full text-left p-3 border-b border-slate-50 hover:bg-blue-50 transition-colors flex flex-col gap-1"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black text-blue-600 tracking-wider">ITEM {item.item_no}</span>
                                            {item.department && <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-100 px-1 rounded">{item.department}</span>}
                                        </div>
                                        <span className="text-xs text-slate-600 line-clamp-1">{item.description}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. MAIN SPLIT VIEW */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* LEFT: Current RA Items */}
                <div className="w-1/3 min-w-[300px] border-r border-slate-200 bg-slate-50/50 flex flex-col overflow-hidden">
                    <div className="p-4 bg-slate-100/50 border-b border-slate-200 flex justify-between items-center shrink-0">
                        <h3 className="text-xs font-black tracking-widest text-slate-500 uppercase">Current RA Items</h3>
                        <span className="bg-white text-xs font-bold px-2 py-0.5 rounded shadow-sm border border-slate-200 text-slate-600">{currentRaItems.length} Added</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {currentRaItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                                <Package size={40} className="mb-3 opacity-20" />
                                <p className="text-sm font-bold text-slate-500">RA is Empty</p>
                                <p className="text-xs mt-1">Use the search bar top right to add BOQ items to this bill.</p>
                            </div>
                        ) : (
                            currentRaItems.map(item => (
                                <div 
                                    key={item.key}
                                    onClick={() => setSelectedItemKey(item.key)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                        selectedItemKey === item.key 
                                        ? 'bg-blue-50 border-blue-300 shadow-sm ring-1 ring-blue-500/20' 
                                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-black tracking-wider ${selectedItemKey === item.key ? 'text-blue-700' : 'text-slate-700'}`}>ITEM {item.item_no}</span>
                                            {item.department && <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1 rounded">{item.department}</span>}
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">EQ: {item.eq}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-1 mb-2 font-medium">{item.description}</p>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100/50">
                                        <span className="text-[10px] text-slate-400 font-bold">Amt: ₹{
                                            (item.breakup?.length > 0 
                                                ? item.breakup.reduce((sum: number, b: any) => sum + ((b.thisQty || 0) * item.rate * (b.percentage / 100)), 0)
                                                : (item.rate * item.eq)
                                            ).toLocaleString(undefined, { maximumFractionDigits: 2 })
                                        }</span>
                                        {item.variation > 0 && <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1">Var: +{item.variation}</span>}
                                        {item.nonOperating > 0 && <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">Non-Op: {item.nonOperating}</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT: Item Editor */}
                <div className="flex-1 bg-white flex flex-col overflow-y-auto custom-scrollbar">
                    {activeItem ? (
                        <div className="p-8 pb-10 max-w-4xl mx-auto w-full flex flex-col">
                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-black tracking-widest px-2.5 py-1 rounded">ITEM {activeItem.item_no}</span>
                                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">| {activeItem.unit}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 leading-snug">{activeItem.description}</h3>
                                </div>
                                <button 
                                    onClick={() => handleRemoveItem(activeItem.key)}
                                    className="text-[10px] font-black tracking-widest text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-rose-200 transition-colors uppercase"
                                >
                                    Remove
                                </button>
                            </div>

                            {/* Mode Toggle */}
                            <div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-6">
                                <button 
                                    onClick={() => setEditorMode('QTY')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${editorMode === 'QTY' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Calculator size={14} /> Item Quantity Edit
                                </button>
                                <button 
                                    onClick={() => setEditorMode('BREAKUP')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${editorMode === 'BREAKUP' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Percent size={14} /> Percentage Breakup Config
                                </button>
                            </div>

                            {editorMode === 'QTY' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Rate (₹)</label>
                                        <input
                                            type="number"
                                            value={activeItem.rate}
                                            onChange={(e) => handleUpdateRate(activeItem.key, parseFloat(e.target.value) || 0)}
                                            className="w-full bg-white border border-slate-300 text-slate-800 font-mono text-xl font-black rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                        <p className="text-[10px] text-slate-500 font-bold mt-2">Master Rate: ₹{activeItem.rate} / {activeItem.unit}</p>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quantities</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-[10px] text-slate-500 font-black mb-1 block">BOQ (Total)</span>
                                                <input
                                                    type="number"
                                                    value={activeItem.boq}
                                                    onChange={(e) => handleUpdateQty(activeItem.key, 'boq', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-white border border-slate-300 text-slate-800 font-bold rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-emerald-600 font-black mb-1 block">EQ (Executed)</span>
                                                <input
                                                    type="number"
                                                    value={activeItem.eq}
                                                    onChange={(e) => handleUpdateQty(activeItem.key, 'eq', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-100/50 border border-slate-200 rounded-xl p-5 shadow-sm md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Filter size={14}/> Exceptions & Deductions (Auto-Calculated)</label>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <span className="text-[10px] text-amber-600 font-black mb-1 block">Non-Operating Qty (Saving)</span>
                                                <div className="w-full bg-slate-100 border border-slate-200 text-slate-500 font-bold rounded-lg px-3 py-2 text-sm flex justify-between items-center">
                                                    {activeItem.nonOperating}
                                                    <span className="text-[10px]">₹{(activeItem.nonOperating * activeItem.rate).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-rose-600 font-black mb-1 block">Variation (+/-)</span>
                                                <div className="w-full bg-slate-100 border border-slate-200 text-slate-500 font-bold rounded-lg px-3 py-2 text-sm flex justify-between items-center">
                                                    +{activeItem.variation}
                                                    <span className="text-[10px]">₹{(activeItem.variation * activeItem.rate).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {activeItem.breakup?.length > 0 && (
                                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm md:col-span-2 mt-2">
                                            <div className="p-4 bg-slate-50 border-b border-slate-200">
                                                <h4 className="text-xs font-black text-slate-600 uppercase tracking-widest">Stage-Wise Execution Details</h4>
                                                <p className="text-[10px] text-slate-500 font-bold mt-1">This item has percentage breakups defined. Enter executed quantities for each stage below.</p>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                                            <th className="p-3 text-[10px] font-black text-slate-400 uppercase min-w-[150px]">Stage</th>
                                                            <th className="p-3 text-[10px] font-black text-slate-400 uppercase w-28">Prev Billed</th>
                                                            <th className="p-3 text-[10px] font-black text-blue-600 uppercase w-28">This Bill</th>
                                                            <th className="p-3 text-[10px] font-black text-emerald-600 uppercase w-24">Cumulative</th>
                                                            <th className="p-3 text-[10px] font-black text-slate-600 uppercase text-right min-w-[100px]">Amount (₹)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {activeItem.breakup.map((row: any) => {
                                                            const prev = row.prevQty || 0;
                                                            const current = row.thisQty || 0;
                                                            const cum = prev + current;
                                                            const amt = current * activeItem.rate * (row.percentage / 100);
                                                            return (
                                                                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                                    <td className="p-3">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-xs font-black text-slate-700">{row.percentage}% <span className="font-medium text-slate-500 ml-1">{row.description}</span></span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-2">
                                                                        <input 
                                                                            type="number"
                                                                            value={row.prevQty === 0 ? '' : row.prevQty}
                                                                            onChange={(e) => handleUpdateBreakupExecution(activeItem.key, row.id, 'prevQty', parseFloat(e.target.value) || 0)}
                                                                            placeholder="0"
                                                                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs font-bold text-slate-500 focus:outline-none"
                                                                        />
                                                                    </td>
                                                                    <td className="p-2">
                                                                        <input 
                                                                            type="number"
                                                                            value={row.thisQty === 0 ? '' : row.thisQty}
                                                                            onChange={(e) => handleUpdateBreakupExecution(activeItem.key, row.id, 'thisQty', parseFloat(e.target.value) || 0)}
                                                                            placeholder="0"
                                                                            className="w-full bg-blue-50 border border-blue-200 rounded px-2 py-1.5 text-xs font-black text-blue-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                                        />
                                                                    </td>
                                                                    <td className="p-3 text-xs font-black text-emerald-600 bg-emerald-50/30">
                                                                        {cum}
                                                                    </td>
                                                                    <td className="p-3 text-xs font-black text-slate-700 text-right">
                                                                        {amt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-6 items-center">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total This Bill:</span>
                                                <span className="text-sm font-black text-blue-700">
                                                    ₹{activeItem.breakup.reduce((sum: number, b: any) => sum + ((b.thisQty || 0) * activeItem.rate * (b.percentage / 100)), 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                <div className="border border-purple-200 bg-purple-50/10 rounded-xl p-6 flex flex-col flex-1 animate-in fade-in">
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="text-purple-800 font-black flex items-center gap-2"><Database size={18}/> Master Config & Breakup</h4>
                                            <p className="text-purple-600/80 text-xs font-medium mt-1">Updates made here can be saved to the database to auto-populate next time.</p>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-purple-200">
                                                <span className="text-[10px] font-black text-slate-400 uppercase">Department:</span>
                                                <select 
                                                    value={activeItem.department}
                                                    onChange={(e) => handleUpdateDepartment(activeItem.key, e.target.value)}
                                                    className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
                                                >
                                                    <option value="">None</option>
                                                    <option value="E&M">E&M</option>
                                                    <option value="CIVIL">CIVIL</option>
                                                </select>
                                            </div>
                                            <button 
                                                onClick={() => handleSaveMasterConfig(activeItem)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-purple-600/20"
                                            >
                                                <Save size={14} /> Update Master DB
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-purple-100 rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-purple-50/50 border-b border-purple-100">
                                                    <th className="p-3 text-[10px] font-black text-purple-800 uppercase w-24">Stage %</th>
                                                    <th className="p-3 text-[10px] font-black text-purple-800 uppercase">Description</th>
                                                    <th className="p-3 text-[10px] font-black text-purple-800 uppercase w-16 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(!activeItem.breakup || activeItem.breakup.length === 0) ? (
                                                    <tr>
                                                        <td colSpan={3} className="p-6 text-center text-sm text-slate-400 italic">No breakups defined yet.</td>
                                                    </tr>
                                                ) : (
                                                    activeItem.breakup.map((row: any) => (
                                                        <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                            <td className="p-2">
                                                                <div className="flex items-center">
                                                                    <input 
                                                                        type="number" 
                                                                        value={row.percentage}
                                                                        onChange={(e) => handleUpdateBreakupRow(activeItem.key, row.id, 'percentage', parseFloat(e.target.value) || 0)}
                                                                        className="w-16 bg-white border border-slate-300 rounded px-2 py-1.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                                                    />
                                                                    <span className="text-slate-400 font-bold ml-1">%</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-2">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="e.g. Supply of Equipment"
                                                                    value={row.description}
                                                                    onChange={(e) => handleUpdateBreakupRow(activeItem.key, row.id, 'description', e.target.value)}
                                                                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                                                />
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <button 
                                                                    onClick={() => handleRemoveBreakupRow(activeItem.key, row.id)}
                                                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                        <div className="p-3 bg-slate-50/50 border-t border-purple-100 flex justify-between items-center">
                                            <button 
                                                onClick={() => handleAddBreakupRow(activeItem.key)}
                                                className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 bg-purple-100/50 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Plus size={14} /> Add Row
                                            </button>
                                            
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Sum:</span>
                                                <span className={`text-sm font-black px-2 py-1 rounded ${breakupTotal === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {breakupTotal}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {breakupTotal !== 100 && activeItem.breakup?.length > 0 && (
                                        <p className="text-[10px] font-bold text-rose-500 mt-2 text-right">
                                            Warning: Percentages must equal 100% before updating Master DB.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/10">
                            <Package size={56} strokeWidth={1} className="text-slate-200 mb-4" />
                            <p className="font-bold text-slate-500">No Item Selected</p>
                            <p className="text-xs text-slate-400 mt-2 max-w-xs text-center font-medium">Select an item from the left panel to edit its quantities and rates.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. BOTTOM NAV: Actions & PDF Export */}
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
                <div className="flex gap-3">
                    <button onClick={handleGeneratePDF} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                        <FileDown size={16} /> Generate PDF
                    </button>
                    <button onClick={handlePreview} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
                        <Eye size={16} /> Preview RA
                    </button>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleSaveDraft}
                        disabled={currentRaItems.length === 0}
                        className="px-6 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition-colors text-sm disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button 
                        onClick={handleSubmitRA}
                        disabled={currentRaItems.length === 0 || !selectedScheme || !division || !raNumber}
                        className={`px-8 py-2 rounded-lg font-black text-sm flex items-center gap-2 transition-all shadow-md ${
                            currentRaItems.length > 0 && selectedScheme && division && raNumber
                            ? 'bg-[var(--primary)] hover:bg-blue-700 text-white shadow-blue-600/20' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        <Save size={16} /> Submit RA Log
                    </button>
                </div>
            </div>

        </div>
    );
}
