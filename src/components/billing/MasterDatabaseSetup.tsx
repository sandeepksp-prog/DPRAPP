'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Database, FileSignature, MapPin, Search, Calendar, Plus, HandCoins, History, Save, ChevronRight, Calculator, Check, X } from 'lucide-react';
import { ALL_SCHEMES } from '@/lib/scheme-data';
import { ref, get, set, update } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function MasterDatabaseSetup() {
    const [activeTab, setActiveTab] = useState<'SCHEME_SETUP' | 'HISTORICAL_RA'>('HISTORICAL_RA');
    const [selectedScheme, setSelectedScheme] = useState<string>('');
    const [raNumber, setRaNumber] = useState<string>('1');
    const [raDate, setRaDate] = useState<string>('');
    const [coverAgreement, setCoverAgreement] = useState('CA-7');
    const [poNumber, setPoNumber] = useState('');
    const [agreementDate, setAgreementDate] = useState('');

    // Firebase & Search States
    const [masterItems, setMasterItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    
    // Ingestion States
    const [historicalItems, setHistoricalItems] = useState<any[]>([]);
    const [withheldDeduction, setWithheldDeduction] = useState<number>(0);
    const [withheldRelease, setWithheldRelease] = useState<number>(0);

    useEffect(() => {
        const fetchMasterItems = async () => {
            const itemsRef = ref(db, 'billing/master_items');
            const snapshot = await get(itemsRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const itemsArray = Object.keys(data).map(key => ({
                    key,
                    ...data[key]
                })).sort((a, b) => parseFloat(a.item_no) - parseFloat(b.item_no));
                setMasterItems(itemsArray);
            }
        };
        fetchMasterItems();

        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredItems = masterItems.filter(item => 
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.item_no?.toString().includes(searchTerm)
    );

    const handleAddItem = (item: any) => {
        if (!historicalItems.find(i => i.key === item.key)) {
            setHistoricalItems(prev => [...prev, { ...item, executedQty: 0 }]);
        }
        setSearchTerm('');
        setIsSearchOpen(false);
    };

    const handleUpdateQty = (key: string, qty: number) => {
        setHistoricalItems(prev => prev.map(item => item.key === key ? { ...item, executedQty: qty } : item));
    };

    const handleRemoveItem = (key: string) => {
        setHistoricalItems(prev => prev.filter(item => item.key !== key));
    };

    const handleSaveSchemeConfig = async () => {
        if (!selectedScheme) return alert('Select a scheme first!');
        try {
            await set(ref(db, `billing/scheme_config/${selectedScheme}`), {
                coverAgreement,
                poNumber,
                agreementDate,
                updatedAt: new Date().toISOString()
            });
            alert('Scheme configuration saved securely!');
        } catch (e) {
            console.error(e);
            alert('Failed to save scheme config.');
        }
    };

    const handleSyncRA = async () => {
        if (!selectedScheme || !raNumber || !raDate) return alert('Fill Scheme, RA Number, and Date.');
        if (historicalItems.length === 0) return alert('Add at least one item.');
        
        try {
            const raData = {
                raNumber,
                raDate,
                items: historicalItems.reduce((acc, item) => {
                    acc[item.key] = { executedQty: item.executedQty, rate: item.rate };
                    return acc;
                }, {} as any),
                withheldDeduction,
                withheldRelease,
                timestamp: new Date().toISOString()
            };

            await set(ref(db, `billing/ra_records/${selectedScheme}/RA_${raNumber}`), raData);
            alert(`RA-${raNumber} for ${ALL_SCHEMES.find(s=>s.id===selectedScheme)?.name} pushed to master database!`);
            
            // Clear
            setHistoricalItems([]);
            setRaNumber((parseInt(raNumber) + 1).toString());
            setWithheldDeduction(0);
            setWithheldRelease(0);
        } catch(e) {
            console.error(e);
            alert('Failed to push RA data.');
        }
    };

    return (
        <div className="w-full min-h-[700px] flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 relative pb-12">
            
            {/* TOP HEADER SECTION */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Database size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Historical Billing Database Setup</h2>
                        <p className="text-xs font-bold text-slate-500 mt-1">Feed previous RA bills into the database to power automated Cumulative calculations.</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('SCHEME_SETUP')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'SCHEME_SETUP' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <MapPin size={16} /> Scheme Identity
                    </button>
                    <button 
                        onClick={() => setActiveTab('HISTORICAL_RA')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'HISTORICAL_RA' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <History size={16} /> Historical RA Ingestion
                    </button>
                </div>
            </div>

            {/* SCHEME SETUP TAB */}
            {activeTab === 'SCHEME_SETUP' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-4xl animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Scheme Master Configuration</h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Select Scheme</label>
                            <select 
                                value={selectedScheme}
                                onChange={(e) => setSelectedScheme(e.target.value)}
                                className="w-full mt-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-black text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select Scheme...</option>
                                {ALL_SCHEMES.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                            </select>
                        </div>
                        
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Cover Agreement (CA)</label>
                            <select 
                                value={coverAgreement}
                                onChange={(e) => setCoverAgreement(e.target.value)}
                                className="w-full mt-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-black text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="CA-4">CA-4</option>
                                <option value="CA-5">CA-5</option>
                                <option value="CA-7">CA-7</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Government PO Number</label>
                            <input type="text" value={poNumber} onChange={(e)=>setPoNumber(e.target.value)} placeholder="e.g., PO/2021/8992" className="w-full mt-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Agreement Date</label>
                            <input type="date" value={agreementDate} onChange={(e)=>setAgreementDate(e.target.value)} className="w-full mt-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
                        </div>

                        <div className="col-span-2 pt-4">
                            <button onClick={handleSaveSchemeConfig} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-md">
                                <Save size={16} /> Save Scheme Configuration
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HISTORICAL RA INGESTION TAB */}
            {activeTab === 'HISTORICAL_RA' && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
                    
                    {/* RA CONTEXT HEADER */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 mb-1"><MapPin size={12}/> Target Scheme</label>
                                <select 
                                    value={selectedScheme}
                                    onChange={(e) => setSelectedScheme(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-base font-black text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="">Select Scheme to Feed Data...</option>
                                    {ALL_SCHEMES.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">RA Number to Feed</label>
                                <div className="flex items-center gap-2">
                                    <span className="bg-emerald-100 text-emerald-800 font-black px-3 py-2.5 rounded-lg border border-emerald-200">RA-</span>
                                    <input 
                                        type="number" 
                                        value={raNumber}
                                        onChange={(e) => setRaNumber(e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-base font-black text-slate-800 focus:outline-none focus:border-emerald-500" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block flex items-center gap-2"><Calendar size={12}/> Bill Date</label>
                                <input 
                                    type="date" 
                                    value={raDate}
                                    onChange={(e) => setRaDate(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-emerald-500" 
                                />
                            </div>
                        </div>
                    </div>

                    {selectedScheme ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            {/* ITEM INGESTION LIST */}
                            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
                                <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center z-20">
                                    <h3 className="font-black text-slate-800 flex items-center gap-2"><Calculator size={18} className="text-blue-600"/> Feed Item Execution</h3>
                                    <div className="relative w-72" ref={searchRef}>
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            type="text" 
                                            value={searchTerm}
                                            onChange={(e) => { setSearchTerm(e.target.value); setIsSearchOpen(true); }}
                                            onFocus={() => setIsSearchOpen(true)}
                                            placeholder="Search Master Item to feed..." 
                                            className="w-full bg-white border border-slate-300 rounded-full pl-9 pr-4 py-1.5 text-xs font-bold focus:outline-none focus:border-blue-500" 
                                        />
                                        {isSearchOpen && searchTerm && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                                                {filteredItems.map(item => (
                                                    <div key={item.key} onClick={() => handleAddItem(item)} className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                                                        <span className="text-[10px] font-black text-blue-600">ITEM {item.item_no}</span>
                                                        <p className="text-xs font-bold text-slate-700 line-clamp-1">{item.description}</p>
                                                    </div>
                                                ))}
                                                {filteredItems.length === 0 && <div className="p-3 text-xs text-slate-500">No items found</div>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-0 flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-slate-50/30">
                                    {historicalItems.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                            <Search size={48} className="mb-4 text-slate-200" strokeWidth={1} />
                                            <p className="text-sm font-bold text-slate-500">No Items Added Yet</p>
                                            <p className="text-xs text-center mt-2 max-w-sm">Use the search bar above to pull master items. You will then enter the quantities executed specifically in RA-{raNumber}.</p>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-100 border-b border-slate-200 sticky top-0">
                                                <tr>
                                                    <th className="p-3 text-[10px] font-black text-slate-500 uppercase">Item No</th>
                                                    <th className="p-3 text-[10px] font-black text-slate-500 uppercase">Description</th>
                                                    <th className="p-3 text-[10px] font-black text-emerald-600 uppercase w-32">Executed Qty</th>
                                                    <th className="p-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {historicalItems.map(item => (
                                                    <tr key={item.key} className="border-b border-slate-100 hover:bg-white">
                                                        <td className="p-3 text-xs font-black text-slate-700 whitespace-nowrap">ITEM {item.item_no}</td>
                                                        <td className="p-3 text-xs font-bold text-slate-600 line-clamp-2 max-w-[200px]" title={item.description}>{item.description}</td>
                                                        <td className="p-3">
                                                            <input 
                                                                type="number"
                                                                value={item.executedQty === 0 ? '' : item.executedQty}
                                                                onChange={(e) => handleUpdateQty(item.key, parseFloat(e.target.value) || 0)}
                                                                className="w-full bg-white border border-emerald-300 rounded px-2 py-1.5 text-xs font-black text-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                        <td className="p-3 text-right">
                                                            <button onClick={() => handleRemoveItem(item.key)} className="text-rose-400 hover:text-rose-600"><X size={14} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>

                            {/* WITHHELD & SUMMARY */}
                            <div className="flex flex-col gap-6">
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                    <div className="bg-rose-50/50 p-4 border-b border-rose-100 flex items-center gap-2">
                                        <HandCoins size={18} className="text-rose-600" />
                                        <h4 className="font-black text-rose-800 text-sm">Withheld Logic (For this RA)</h4>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Add to Withheld (Deduction)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                                                <input type="number" value={withheldDeduction === 0 ? '' : withheldDeduction} onChange={(e)=>setWithheldDeduction(parseFloat(e.target.value)||0)} placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-sm font-black text-rose-700 focus:outline-none focus:border-rose-500 focus:bg-white" />
                                            </div>
                                            <p className="text-[9px] text-slate-400 font-bold mt-1">E.g., Retention Money or Labour Cess kept by Dept.</p>
                                        </div>
                                        <hr className="border-slate-100" />
                                        <div>
                                            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 block">Release Withheld (Addition)</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-black">₹</span>
                                                <input type="number" value={withheldRelease === 0 ? '' : withheldRelease} onChange={(e)=>setWithheldRelease(parseFloat(e.target.value)||0)} placeholder="0.00" className="w-full bg-emerald-50/50 border border-emerald-200 rounded-lg pl-8 pr-4 py-2.5 text-sm font-black text-emerald-700 focus:outline-none focus:border-emerald-500 focus:bg-white" />
                                            </div>
                                            <p className="text-[9px] text-emerald-600/70 font-bold mt-1">Amount released by Dept in this RA.</p>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleSyncRA} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest">
                                    <Database size={18} /> Sync RA-{raNumber} to Database
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400">
                            <p className="font-bold text-sm">Please select a Target Scheme above to begin historical data ingestion.</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
