'use client';

import React, { useState } from 'react';
import { Database, Building, FileSignature, MapPin, Calculator, Settings2, Upload, Box, HandCoins, AlertCircle, Save } from 'lucide-react';

export default function MasterDatabaseSetup() {
    const [activeTab, setActiveTab] = useState<'COMPANY' | 'AGREEMENTS' | 'SCHEMES' | 'WITHHELD' | 'PO_MAPPING'>('COMPANY');

    return (
        <div className="w-full min-h-[700px] flex gap-6 animate-in fade-in zoom-in-95 duration-300">
            
            {/* LEFT SIDEBAR NAVIGATION */}
            <div className="w-72 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm shrink-0 flex flex-col">
                <div className="mb-6 px-2">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><Database className="text-blue-600" size={20} /> Master Database</h2>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">Centralized Configuration Hub for Billing Engine</p>
                </div>
                
                <div className="space-y-1 flex-1">
                    <button 
                        onClick={() => setActiveTab('COMPANY')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'COMPANY' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        <Building size={16} /> Company & Project
                    </button>
                    <button 
                        onClick={() => setActiveTab('AGREEMENTS')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'AGREEMENTS' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        <FileSignature size={16} /> Cover Agreements
                    </button>
                    <button 
                        onClick={() => setActiveTab('SCHEMES')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'SCHEMES' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        <MapPin size={16} /> Schemes & Regions
                    </button>
                    <button 
                        onClick={() => setActiveTab('WITHHELD')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'WITHHELD' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        <HandCoins size={16} /> Withhelds & Releases
                    </button>
                    <button 
                        onClick={() => setActiveTab('PO_MAPPING')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'PO_MAPPING' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        <Box size={16} /> PO & Govt Matching
                    </button>
                </div>
                
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200/50">
                    <p className="text-[10px] font-bold text-amber-700 flex items-start gap-2">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        Updates made here dynamically alter the behavior of the RA Billing Engine.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
                
                {/* DYNAMIC TABS */}
                {activeTab === 'COMPANY' && (
                    <div className="p-8 overflow-y-auto flex-1 custom-scrollbar animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Company & Project Identity</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1">Global settings applied across all generated RAs and PDFs.</p>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-md shadow-blue-500/20">
                                <Save size={16} /> Save Globally
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 max-w-3xl">
                            <div className="col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contractor Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Company Name</label>
                                        <input type="text" defaultValue="KSPL Infrastructure" className="w-full mt-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-black text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">GSTIN</label>
                                        <input type="text" defaultValue="09AAACK1234A1Z5" className="w-full mt-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">PAN</label>
                                        <input type="text" defaultValue="AAACK1234A" className="w-full mt-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Project Core Timeline</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Master Agreement Date</label>
                                        <input type="date" defaultValue="2021-08-15" className="w-full mt-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Project Start Date (LOA)</label>
                                        <input type="date" defaultValue="2021-09-01" className="w-full mt-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'AGREEMENTS' && (
                    <div className="p-8 overflow-y-auto flex-1 custom-scrollbar animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Cover Agreements (CA)</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1">Manage multiple Cover Agreements like CA-4, CA-5, CA-7 mapped to Govt POs.</p>
                            </div>
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-md">
                                + Add Cover Agreement
                            </button>
                        </div>
                        
                        <div className="space-y-4 max-w-4xl">
                            {['CA-7', 'CA-5', 'CA-4'].map((ca) => (
                                <div key={ca} className="border border-slate-200 bg-slate-50 p-5 rounded-xl flex items-center justify-between hover:border-slate-300 transition-all">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-black text-slate-800">{ca}</h4>
                                            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-emerald-200">Active</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 mt-1">Mapped to 14 Schemes (e.g., Dadupur Khurd)</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Total PO Value</p>
                                            <p className="text-sm font-black text-slate-700">₹45.20 Cr</p>
                                        </div>
                                        <button className="px-4 py-1.5 bg-white border border-slate-300 text-xs font-bold rounded-lg hover:bg-slate-50">Edit Schemes</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'WITHHELD' && (
                    <div className="p-8 overflow-y-auto flex-1 custom-scrollbar animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Withhelds & Deductions Policy</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1">Configure automated retention logic and manual releases across RA bills.</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 max-w-5xl">
                            <div className="bg-white border border-rose-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-rose-50/50 p-4 border-b border-rose-100 flex justify-between items-center">
                                    <h4 className="font-black text-rose-800 text-sm">Global Withheld Logic</h4>
                                    <span className="bg-rose-100 text-rose-700 text-[10px] font-black uppercase px-2 py-1 rounded">Auto-Applied</span>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                                            <span>Retention Money (Security Deposit)</span>
                                            <span className="text-rose-600">5.0%</span>
                                        </label>
                                        <input type="range" min="0" max="10" step="0.5" defaultValue="5" className="w-full mt-2 accent-rose-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                                            <span>Labour Cess</span>
                                            <span className="text-rose-600">1.0%</span>
                                        </label>
                                        <input type="range" min="0" max="5" step="0.5" defaultValue="1" className="w-full mt-2 accent-rose-500" />
                                    </div>
                                    <hr className="border-slate-100" />
                                    <p className="text-[10px] font-bold text-slate-400">These percentages are automatically deduced from the Gross Work Done in every new RA.</p>
                                </div>
                            </div>

                            <div className="bg-white border border-emerald-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-emerald-50/50 p-4 border-b border-emerald-100 flex justify-between items-center">
                                    <h4 className="font-black text-emerald-800 text-sm">Withheld Release Workflow</h4>
                                </div>
                                <div className="p-5">
                                    <p className="text-xs text-slate-600 font-medium mb-4 leading-relaxed">
                                        When creating a new RA, the engine automatically calculates Cumulative Withheld amounts. To release funds:
                                    </p>
                                    <div className="space-y-3">
                                        <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex gap-3 items-center">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-xs">1</div>
                                            <p className="text-xs font-bold text-slate-700">Select "Release Mode" in RA Entry Workspace.</p>
                                        </div>
                                        <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex gap-3 items-center">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-xs">2</div>
                                            <p className="text-xs font-bold text-slate-700">Enter the authorized release amount directly into the "Withheld Released" footer row.</p>
                                        </div>
                                        <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex gap-3 items-center">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-xs">3</div>
                                            <p className="text-xs font-bold text-slate-700">Engine updates the net payable and adjusts Cumulative Withheld logic for next RA.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PLACEHOLDER TABS */}
                {['SCHEMES', 'PO_MAPPING'].includes(activeTab) && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                        <Settings2 size={48} className="mb-4 text-slate-300" strokeWidth={1} />
                        <h3 className="text-lg font-black text-slate-700 mb-1">{activeTab} Setup</h3>
                        <p className="text-xs font-medium max-w-md text-center">This section will contain massive grid-editors allowing you to map POs from the Govt portal directly against Scheme Codes.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
