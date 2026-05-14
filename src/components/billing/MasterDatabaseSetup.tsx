'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Database, FileSignature, MapPin, Search, Calendar, Plus, HandCoins, History, Save, ChevronRight, Calculator, Check, X } from 'lucide-react';
import { ALL_SCHEMES } from '@/lib/scheme-data';
import { ref, get, set, update } from 'firebase/database';
import { db } from '@/lib/firebase/client';

export default function MasterDatabaseSetup() {
    const [activeTab, setActiveTab] = useState<'SCHEME_SETUP' | 'BOQ_SETUP' | 'HISTORICAL_RA'>('HISTORICAL_RA');
    const [selectedScheme, setSelectedScheme] = useState<string>('');
    const [firebaseSchemes, setFirebaseSchemes] = useState<any[]>(ALL_SCHEMES);
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

    // BOQ States
    const [boqItems, setBoqItems] = useState<any[]>([]);
    const [schemeBoqData, setSchemeBoqData] = useState<any>({});

    useEffect(() => {
        if (selectedScheme) {
            const fetchBoq = async () => {
                const snap = await get(ref(db, `schemes/${selectedScheme}/headings`));
                let flatData: any = {};
                if (snap.exists()) {
                    const headingsObj = snap.val();
                    Object.keys(headingsObj).forEach(headingId => {
                        const items = headingsObj[headingId].items;
                        if (items) {
                            Object.keys(items).forEach(key => {
                                const masterKey = key.startsWith('ITEM_') ? key : `ITEM_${key}`;
                                flatData[masterKey] = {
                                    ...items[key],
                                    original_key: key,
                                    headingId,
                                    parent_heading: headingsObj[headingId].original_heading
                                };
                            });
                        }
                    });
                }
                
                setSchemeBoqData(flatData);

                if (activeTab === 'BOQ_SETUP') {
                    if (Object.keys(flatData).length > 0) {
                        const loadedBoqItems = Object.keys(flatData).map(key => {
                            const dbItem = flatData[key];
                            const masterItem = masterItems.find(m => m.key === key);
                            return {
                                key,
                                original_key: dbItem.original_key || key.replace('ITEM_', ''),
                                headingId: dbItem.headingId,
                                item_no: dbItem.item_no || key.replace('ITEM_', '').replace(/_/g, '.'),
                                description: dbItem.description || masterItem?.description || 'Unknown Item',
                                unit: dbItem.uom || masterItem?.unit || '',
                                boqQty: dbItem.boq_qty || 0,
                                rate: dbItem.swsm_rate || dbItem.rate || masterItem?.rate || 0,
                                percentageBreakups: masterItem?.percentage_breakup || dbItem.percentage_breakup || [],
                                row_index: dbItem.row_index || masterItem?.row_index || 999999
                            };
                        });
                        loadedBoqItems.sort((a, b) => a.row_index - b.row_index);
                        setBoqItems(loadedBoqItems);
                    } else {
                        setBoqItems([]);
                    }
                }
            };
            fetchBoq();
        } else {
            setSchemeBoqData({});
            if (activeTab === 'BOQ_SETUP') setBoqItems([]);
        }
    }, [selectedScheme, activeTab, masterItems.length]);

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

        const fetchSchemes = async () => {
            const snap = await get(ref(db, 'schemes'));
            if (snap.exists()) {
                const data = snap.val();
                const list = Object.keys(data).map(id => ({
                    id,
                    name: data[id].scheme_name || id,
                    block: data[id].block_name
                }));
                setFirebaseSchemes(list);
            }
        };
        fetchSchemes();

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

    const handleRemoveItem = (key: string) => {
        if (activeTab === 'HISTORICAL_RA') {
            setHistoricalItems(prev => prev.filter(item => item.key !== key));
        } else if (activeTab === 'BOQ_SETUP') {
            setBoqItems(prev => prev.filter(item => item.key !== key));
            if (selectedScheme) update(ref(db, `schemes/${selectedScheme}/boq_items`), { [key]: null });
        }
    };

    const handleAddItem = (item: any) => {
        if (activeTab === 'HISTORICAL_RA') {
            if (!historicalItems.find(i => i.key === item.key)) {
                const boqItem = schemeBoqData[item.key];
                const breakups = boqItem?.percentage_breakup || [];
                setHistoricalItems(prev => [...prev, { 
                    ...item, 
                    executedQty: 0,
                    stageExecution: breakups.reduce((acc: any, b: any) => {
                        acc[b.stage] = 0;
                        return acc;
                    }, {})
                }]);
            }
        } else if (activeTab === 'BOQ_SETUP') {
            if (!boqItems.find(i => i.key === item.key)) {
                const existing = schemeBoqData[item.key];
                const newBoqItem = existing ? {
                    ...item,
                    headingId: existing.headingId,
                    original_key: existing.original_key || item.key.replace('ITEM_', ''),
                    boqQty: existing.boq_qty || existing.boq || 0,
                    rate: existing.swsm_rate || existing.rate || item.rate || 0,
                    percentageBreakups: existing.percentage_breakup || existing.breakup || []
                } : { 
                    ...item,
                    headingId: 'heading_manual',
                    original_key: item.key.replace('ITEM_', ''),
                    row_index: item.row_index || 999999,
                    boqQty: 0, 
                    rate: item.rate || 0,
                    percentageBreakups: [
                        { stage: 'Supply', percentage: 70 },
                        { stage: 'Laying', percentage: 20 },
                        { stage: 'Testing', percentage: 10 }
                    ]
                };
                
                setBoqItems(prev => [...prev, newBoqItem]);
                if (selectedScheme && newBoqItem.headingId) {
                    update(ref(db, `schemes/${selectedScheme}/headings/${newBoqItem.headingId}/items/${newBoqItem.original_key}`), {
                        boq_qty: newBoqItem.boqQty,
                        swsm_rate: newBoqItem.rate,
                        percentage_breakup: newBoqItem.percentageBreakups
                    });
                }
            }
        }
        setSearchTerm('');
        setIsSearchOpen(false);
    };

    const handleUpdateQty = (key: string, qty: number) => {
        setHistoricalItems(prev => prev.map(item => item.key === key ? { ...item, executedQty: qty } : item));
    };

    const handleUpdateStageQty = (key: string, stage: string, qty: number) => {
        setHistoricalItems(prev => prev.map(item => {
            if (item.key === key) {
                return { ...item, stageExecution: { ...item.stageExecution, [stage]: qty } };
            }
            return item;
        }));
    };

    const handleUpdateBoqQty = (key: string, qty: number) => {
        setBoqItems(prev => {
            const updated = prev.map(item => item.key === key ? { ...item, boqQty: qty } : item);
            const item = updated.find(i => i.key === key);
            if (selectedScheme && item && item.headingId) {
                update(ref(db, `schemes/${selectedScheme}/headings/${item.headingId}/items/${item.original_key || key.replace('ITEM_', '')}`), { boq_qty: qty });
            }
            return updated;
        });
    };

    const handleUpdateBoqRate = (key: string, rate: number) => {
        setBoqItems(prev => {
            const updated = prev.map(item => item.key === key ? { ...item, rate: rate } : item);
            const item = updated.find(i => i.key === key);
            if (selectedScheme && item && item.headingId) {
                update(ref(db, `schemes/${selectedScheme}/headings/${item.headingId}/items/${item.original_key || key.replace('ITEM_', '')}`), { swsm_rate: rate });
            }
            return updated;
        });
    };

    const handleApplyBreakupTemplate = (key: string, templateId: string) => {
        let newBreakups: any[] = [];
        if (templateId === 'borewell') {
            newBreakups = [
                { percentage: 55, stage: 'Transportaion & Delivery of Boring Machine' },
                { percentage: 20, stage: 'Borewell Drilling' },
                { percentage: 10, stage: 'Tubewell Lowering' },
                { percentage: 5, stage: 'Tubewell Development (Compressor & OP)' },
                { percentage: 5, stage: 'Testing' },
                { percentage: 5, stage: 'Commissioning' }
            ];
        } else if (templateId === 'supply') {
            newBreakups = [
                { percentage: 70, stage: 'Supply & Delivery of Material' },
                { percentage: 20, stage: 'Completion of Erection fixing & Jointing' },
                { percentage: 5, stage: 'Testing' },
                { percentage: 5, stage: 'Commissioning' }
            ];
        } else if (templateId === 'direct') {
            newBreakups = [
                { percentage: 100, stage: 'Completion of Work' }
            ];
        }

        setBoqItems(prev => {
            const newItems = prev.map(item => item.key === key ? { ...item, percentageBreakups: newBreakups } : item);
            update(ref(db, `billing/master_items/${key}`), { percentage_breakup: newBreakups });
            return newItems;
        });
    };

    const handleUpdateBoqBreakup = (key: string, index: number, field: 'stage' | 'percentage', value: string | number) => {
        setBoqItems(prev => {
            const newItems = prev.map(item => {
                if (item.key === key) {
                    const newBreakups = [...item.percentageBreakups];
                    newBreakups[index] = { ...newBreakups[index], [field]: value };
                    return { ...item, percentageBreakups: newBreakups };
                }
                return item;
            });
            const updatedItem = newItems.find(i => i.key === key);
            if (updatedItem) {
                update(ref(db, `billing/master_items/${key}`), { percentage_breakup: updatedItem.percentageBreakups });
            }
            return newItems;
        });
    };

    const handleAddBoqBreakup = (key: string) => {
        setBoqItems(prev => {
            const newItems = prev.map(item => {
                if (item.key === key) {
                    return { ...item, percentageBreakups: [...item.percentageBreakups, { stage: '', percentage: 0 }] };
                }
                return item;
            });
            const updatedItem = newItems.find(i => i.key === key);
            if (updatedItem) {
                update(ref(db, `billing/master_items/${key}`), { percentage_breakup: updatedItem.percentageBreakups });
            }
            return newItems;
        });
    };

    const handleRemoveBoqBreakup = (key: string, index: number) => {
        setBoqItems(prev => {
            const newItems = prev.map(item => {
                if (item.key === key) {
                    return { ...item, percentageBreakups: item.percentageBreakups.filter((_: any, i: number) => i !== index) };
                }
                return item;
            });
            const updatedItem = newItems.find(i => i.key === key);
            if (updatedItem) {
                update(ref(db, `billing/master_items/${key}`), { percentage_breakup: updatedItem.percentageBreakups });
            }
            return newItems;
        });
    };

    const handleSaveSchemeBoq = async () => {
        if (!selectedScheme) return alert('Select a scheme first!');
        if (boqItems.length === 0) return alert('Add at least one item to BOQ.');
        
        try {
            const boqData = boqItems.reduce((acc, item) => {
                acc[item.key] = {
                    boq_qty: item.boqQty,
                    percentage_breakup: item.percentageBreakups,
                    rate: item.rate || 0
                };
                return acc;
            }, {} as any);

            await set(ref(db, `schemes/${selectedScheme}/boq_items`), boqData);
            alert(`BOQ configuration saved for ${firebaseSchemes.find(s=>s.id===selectedScheme)?.name || selectedScheme}!`);
        } catch (e) {
            console.error(e);
            alert('Failed to save scheme BOQ.');
        }
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
                    acc[item.key] = { 
                        executedQty: item.executedQty, 
                        stageExecution: item.stageExecution,
                        rate: item.rate 
                    };
                    return acc;
                }, {} as any),
                withheldDeduction,
                withheldRelease,
                timestamp: new Date().toISOString()
            };

            await set(ref(db, `billing/ra_records/${selectedScheme}/RA_${raNumber}`), raData);
            alert(`RA-${raNumber} for ${firebaseSchemes.find(s=>s.id===selectedScheme)?.name || selectedScheme} pushed to master database!`);
            setHistoricalItems([]);
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
                        onClick={() => setActiveTab('BOQ_SETUP')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'BOQ_SETUP' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Calculator size={16} /> Scheme BOQ & Breakup
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
                                onChange={(e) => {
                                    setSelectedScheme(e.target.value);
                                    setHistoricalItems([]);
                                }}
                                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-purple-500 shadow-sm"
                            >
                                <option value="">-- Select Target Scheme --</option>
                                {firebaseSchemes.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
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

            {/* BOQ SETUP TAB */}
            {activeTab === 'BOQ_SETUP' && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 mb-1"><MapPin size={12}/> Target Scheme for BOQ Setup</label>
                                    <select 
                                        value={selectedScheme} 
                                        onChange={(e) => setSelectedScheme(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-purple-500 shadow-sm"
                                    >
                                        <option value="">-- Select Scheme --</option>
                                        {firebaseSchemes.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                                    </select>
                            </div>
                            <div className="text-right flex items-center justify-end gap-3">
                                <button onClick={() => { if(window.confirm('Are you sure you want to clear all BOQ items? You will have to add them manually from search.')) setBoqItems([]); }} className="bg-white border border-red-200 hover:bg-red-50 text-red-600 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
                                    Clear All
                                </button>
                                <button onClick={handleSaveSchemeBoq} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all">
                                    <Save size={16} /> Push BOQ to Database
                                </button>
                            </div>
                        </div>
                    </div>

                    {selectedScheme ? (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                            <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center z-20">
                                <div className="flex items-center gap-6">
                                    <h3 className="font-black text-slate-800 flex items-center gap-2"><Calculator size={18} className="text-purple-600"/> Setup BOQ Quantities & Breakups</h3>
                                    <div className="bg-white border border-slate-200 px-4 py-1.5 rounded-lg shadow-sm">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase">Overall Scheme BOQ Value</div>
                                        <div className="text-sm font-black text-emerald-600">
                                            ₹ {boqItems.reduce((acc, item) => acc + (item.boqQty * item.rate), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                                <div className="relative w-80" ref={searchRef}>
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text" 
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setIsSearchOpen(true); }}
                                        onFocus={() => setIsSearchOpen(true)}
                                        placeholder="Search Master Item to add to BOQ..." 
                                        className="w-full bg-white border border-slate-300 rounded-full pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-purple-500" 
                                    />
                                    {isSearchOpen && searchTerm && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                                            {filteredItems.map(item => (
                                                <div key={item.key} onClick={() => handleAddItem(item)} className="p-3 border-b border-slate-50 hover:bg-purple-50 cursor-pointer">
                                                    <span className="text-[10px] font-black text-purple-600">ITEM {item.item_no}</span>
                                                    <p className="text-xs font-bold text-slate-700 line-clamp-1">{item.description}</p>
                                                </div>
                                            ))}
                                            {filteredItems.length === 0 && <div className="p-3 text-xs text-slate-500">No items found</div>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-slate-50/30">
                                {boqItems.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                        <Calculator size={48} className="mb-4 text-slate-200" strokeWidth={1} />
                                        <p className="text-sm font-bold text-slate-500">No BOQ Items Added Yet</p>
                                        <p className="text-xs text-center mt-2 max-w-sm">Use the search bar above to pull master items and define their BOQ quantity and billing percentage breakups.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {boqItems.map(item => (
                                            <div key={item.key} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
                                                <button onClick={() => handleRemoveItem(item.key)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 p-2"><X size={16} /></button>

                                                <div className="mb-4 pr-8">
                                                    <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded">ITEM {item.item_no}</span>
                                                    <h4 className="font-bold text-slate-800 text-sm mt-2">{item.description}</h4>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                                    
                                                    {/* LEFT BOX */}
                                                    <div className="lg:col-span-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                                                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Base Configuration</h5>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="text-[10px] font-bold text-slate-500 block mb-1">BOQ Qty</label>
                                                                <input 
                                                                    type="number"
                                                                    value={item.boqQty === 0 ? '' : item.boqQty}
                                                                    onChange={(e) => handleUpdateBoqQty(item.key, parseFloat(e.target.value) || 0)}
                                                                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm font-black text-slate-800 focus:outline-none focus:border-purple-500"
                                                                    placeholder="0"
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Unit</label>
                                                                    <input 
                                                                        type="text"
                                                                        value={item.unit || ''}
                                                                        readOnly
                                                                        className="w-full bg-slate-100 border border-transparent rounded px-3 py-2 text-sm font-bold text-slate-500 focus:outline-none cursor-not-allowed"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Rate (₹)</label>
                                                                    <input 
                                                                        type="number"
                                                                        value={item.rate === 0 ? '' : item.rate}
                                                                        onChange={(e) => handleUpdateBoqRate(item.key, parseFloat(e.target.value) || 0)}
                                                                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm font-black text-slate-800 focus:outline-none focus:border-purple-500"
                                                                        placeholder="0.00"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* RIGHT BOX (Percentage Breakup) */}
                                                    <div className="lg:col-span-8 bg-slate-50/50 border border-slate-100 rounded-xl p-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex flex-col gap-2">
                                                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Percentage Breakups</h5>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <button onClick={() => handleApplyBreakupTemplate(item.key, 'supply')} className="text-[9px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-2 py-1 rounded shadow-sm transition-all">
                                                                        Supply (4 Stages)
                                                                    </button>
                                                                    <button onClick={() => handleApplyBreakupTemplate(item.key, 'borewell')} className="text-[9px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-2 py-1 rounded shadow-sm transition-all">
                                                                        Borewell (6 Stages)
                                                                    </button>
                                                                    <button onClick={() => handleApplyBreakupTemplate(item.key, 'direct')} className="text-[9px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-2 py-1 rounded shadow-sm transition-all">
                                                                        Direct (100%)
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleAddBoqBreakup(item.key)}
                                                                className="text-[10px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 border border-purple-200 bg-purple-50 px-2 py-1 rounded shrink-0 self-start mt-1"
                                                            >
                                                                <Plus size={12}/> Add Stage
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {item.percentageBreakups.map((breakup: any, idx: number) => (
                                                                <div key={idx} className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                                                                    <input 
                                                                        type="text" 
                                                                        value={breakup.stage}
                                                                        onChange={(e) => handleUpdateBoqBreakup(item.key, idx, 'stage', e.target.value)}
                                                                        placeholder="Stage (e.g. Supply)"
                                                                        className="w-full text-xs font-bold text-slate-700 focus:outline-none px-2"
                                                                    />
                                                                    <div className="flex items-center bg-slate-50 rounded px-2 py-1 border border-slate-100">
                                                                        <input 
                                                                            type="number" 
                                                                            value={breakup.percentage}
                                                                            onChange={(e) => handleUpdateBoqBreakup(item.key, idx, 'percentage', parseFloat(e.target.value) || 0)}
                                                                            className="w-12 text-right text-xs font-black text-slate-800 focus:outline-none bg-transparent"
                                                                        />
                                                                        <span className="text-[10px] font-bold text-slate-400 ml-1">%</span>
                                                                    </div>
                                                                    <button onClick={() => handleRemoveBoqBreakup(item.key, idx)} className="text-rose-400 hover:text-rose-600 ml-1 p-1"><X size={14}/></button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        
                                                        <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3">
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Total:</span>
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${item.percentageBreakups.reduce((sum: number, b: any) => sum + b.percentage, 0) === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                                {item.percentageBreakups.reduce((sum: number, b: any) => sum + b.percentage, 0)}%
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400">
                            <p className="font-bold text-sm">Please select a Target Scheme above to begin BOQ setup.</p>
                        </div>
                    )}
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
                                        <div className="p-4 space-y-4">
                                            {historicalItems.map(item => {
                                                const hasBreakups = schemeBoqData[item.key]?.percentage_breakup?.length > 0;
                                                return (
                                                    <div key={item.key} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">ITEM {item.item_no}</span>
                                                                <h4 className="font-bold text-slate-700 text-sm mt-1">{item.description}</h4>
                                                            </div>
                                                            <button onClick={() => handleRemoveItem(item.key)} className="text-rose-400 hover:text-rose-600 p-1"><X size={14} /></button>
                                                        </div>
                                                        
                                                        {hasBreakups ? (
                                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Stage-wise Execution (Qty)</label>
                                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                                                    {schemeBoqData[item.key].percentage_breakup.map((b: any, idx: number) => (
                                                                        <div key={idx}>
                                                                            <label className="text-[10px] font-bold text-slate-600 truncate block mb-1">{b.stage} ({b.percentage}%)</label>
                                                                            <input 
                                                                                type="number"
                                                                                value={item.stageExecution[b.stage] === 0 ? '' : item.stageExecution[b.stage]}
                                                                                onChange={(e) => handleUpdateStageQty(item.key, b.stage, parseFloat(e.target.value) || 0)}
                                                                                className="w-full bg-white border border-emerald-300 rounded px-2 py-1.5 text-xs font-black text-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                                                placeholder="0"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Executed Qty</label>
                                                                <input 
                                                                    type="number"
                                                                    value={item.executedQty === 0 ? '' : item.executedQty}
                                                                    onChange={(e) => handleUpdateQty(item.key, parseFloat(e.target.value) || 0)}
                                                                    className="w-32 bg-white border border-emerald-300 rounded px-2 py-1.5 text-xs font-black text-emerald-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                                    placeholder="0"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
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
