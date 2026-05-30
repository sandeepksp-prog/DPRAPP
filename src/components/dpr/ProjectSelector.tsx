"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, User, Search, ChevronRight, X, Building2, Target } from "lucide-react";
import Link from "next/link";

export default function ProjectSelector() {
  const [profile, setProfile] = useState<any>(null);
  const [location, setLocation] = useState<string>("Fetching GPS...");
  const [currentDate, setCurrentDate] = useState<string>("");

  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [blocks, setBlocks] = useState<string[]>([]);
  const [blockSchemes, setBlockSchemes] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("dpr_user_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      setProfile({ name: "Rajiv Sharma" });
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    setCurrentDate(formattedDate);

    setTimeout(() => {
      setLocation("Etah District");
    }, 1500);

    const fetchSchemes = async () => {
      try {
        const cached = localStorage.getItem('dpr_schemes_cache');
        if (cached) {
          const data = JSON.parse(cached);
          setBlocks(Object.keys(data.byBlock));
          setBlockSchemes(data.byBlock);
          setIsLoading(false);
        }

        const res = await fetch('/api/schemes');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setBlocks(Object.keys(json.data.byBlock));
            setBlockSchemes(json.data.byBlock);
            localStorage.setItem('dpr_schemes_cache', JSON.stringify(json.data));
          }
        }
      } catch (err) {
        console.error("Failed to fetch schemes", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchemes();
  }, []);

  const availableSchemes = selectedBlock ? (blockSchemes[selectedBlock] || []) : [];
  const filteredSchemes = availableSchemes.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    // STRICT MOBILE CONTAINER: max-w-md mx-auto, hidden overflow for desktop
    <div className="bg-slate-900 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-[#F2F5F8] min-h-screen relative overflow-x-hidden flex flex-col pb-24 shadow-2xl">
        
        {/* BACKGROUND DEPTH CONTAINER FOR BLOCK SEGMENT */}
        <motion.div 
          animate={{ 
            scale: selectedBlock ? 0.95 : 1, 
            y: selectedBlock ? -10 : 0,
            opacity: selectedBlock ? 0.7 : 1,
            filter: selectedBlock ? "brightness(0.8)" : "brightness(1)"
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="w-full h-full origin-top"
        >
          {/* NEO-BRUTALIST HEADER WITH LOGOS */}
          <div className="pt-8 pb-6 px-6 flex flex-col items-center text-center border-b-[1.5px] border-slate-900 bg-[#bde0fe]">
            
            <div className="flex items-center gap-6 mb-5 bg-white px-4 py-2 rounded-2xl border-[1.5px] border-slate-900 shadow-[0_4px_0_rgba(15,23,42,1)]">
              {/* KSPL Placeholder Logo */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs border-[1.5px] border-slate-900">
                  KSPL
                </div>
              </div>
              <div className="w-[1.5px] h-10 bg-slate-900"></div>
              {/* JJM Logo */}
              <img 
                src="https://jaljeevanmission.gov.in/sites/default/files/2022-01/jjm-logo.png" 
                alt="Jal Jeevan Mission" 
                className="w-12 h-auto object-contain"
                onError={(e) => {
                  // Fallback if URL fails
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<div class="font-black text-slate-900 text-xs">JJM</div>');
                }}
              />
            </div>
            
            <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none mb-1">
              DAILY PROJECT REPORT
            </h1>
            <p className="text-slate-800 text-xs font-bold tracking-widest uppercase">
              Jal Jeevan Mission, UP
            </p>

            {/* Info Badges (Neo-Brutalist) */}
            <div className="mt-6 w-full grid grid-cols-2 gap-3">
              <div className="bg-white border-[1.5px] border-slate-900 rounded-[16px] p-3 shadow-[0_2px_0_rgba(15,23,42,1)] flex flex-col text-left">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <User size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Report By</span>
                </div>
                <p className="font-black text-slate-900 text-sm truncate">{profile?.name || "Loading..."}</p>
              </div>
              
              <div className="bg-white border-[1.5px] border-slate-900 rounded-[16px] p-3 shadow-[0_2px_0_rgba(15,23,42,1)] flex flex-col text-left">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Calendar size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Date</span>
                </div>
                <p className="font-black text-slate-900 text-sm truncate">{currentDate || "Loading..."}</p>
              </div>
            </div>

            <div className="mt-3 w-full bg-white border-[1.5px] border-slate-900 rounded-[16px] p-3 shadow-[0_2px_0_rgba(15,23,42,1)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#ffc8dd] border-[1.5px] border-slate-900 flex items-center justify-center">
                    <MapPin size={12} strokeWidth={2.5} className="text-slate-900" />
                  </div>
                  <p className="font-black text-slate-900 text-sm">{location}</p>
                </div>
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-[1.5px] border-slate-900 mr-2"></div>
            </div>
          </div>

          {/* BLOCK SELECTION */}
          <div className="px-6 relative z-20 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Building2 size={14} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">Select Block</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {isLoading && blocks.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-slate-500 font-bold text-sm">
                  Loading available schemes...
                </div>
              ) : (
                blocks.map(block => (
                  <button
                    key={block}
                    onClick={() => setSelectedBlock(block)}
                    className={`p-4 rounded-[16px] border-[1.5px] border-slate-900 text-left transition-none active:bg-[#ffc8dd] active:translate-y-1 active:shadow-none ${
                      selectedBlock === block 
                      ? "bg-[#ffc8dd] shadow-[0_4px_0_rgba(15,23,42,1)]" 
                      : "bg-white shadow-[0_4px_0_rgba(15,23,42,1)]"
                    }`}
                  >
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">
                      {block}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <p className="text-[10px] text-slate-600 font-bold bg-white/50 px-2 py-0.5 rounded-full border border-slate-900">
                        {blockSchemes[block]?.length || 0} Schemes
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* SCHEME SELECTION BOTTOM SHEET (Neo-Brutalist 97% depth) */}
        <AnimatePresence>
          {selectedBlock && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 z-40"
                onClick={() => setSelectedBlock(null)}
              />

              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="absolute bottom-0 left-0 right-0 bg-[#F2F5F8] rounded-t-[32px] border-t-[1.5px] border-x-[1.5px] border-slate-900 z-50 p-6 flex flex-col overflow-hidden h-[97vh] shadow-[0_-10px_0_rgba(0,0,0,0.2)]"
              >
                <div className="w-16 h-1.5 bg-slate-300 rounded-full mx-auto mb-6"></div>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-none">Select Scheme</h2>
                    <p className="text-xs font-black bg-slate-900 text-white px-2 py-1 rounded-md inline-block mt-2 uppercase tracking-wide">{selectedBlock}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] flex items-center justify-center text-slate-900 active:translate-y-0.5 active:shadow-none"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="relative mb-5">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900" size={18} strokeWidth={2.5} />
                  <input 
                    type="text"
                    placeholder="Search scheme name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 transition-all"
                  />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3 pb-8">
                  {filteredSchemes.map(scheme => (
                    <Link href={`/dpr/command-center?schemeId=${scheme.id}`} key={scheme.id} className="block">
                      <div className="bg-white border-[1.5px] border-slate-900 shadow-[0_4px_0_rgba(15,23,42,1)] active:bg-[#bde0fe] active:shadow-none active:translate-y-1 rounded-2xl p-4 flex items-center justify-between group transition-none cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#bde0fe] border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900">
                            <Target size={20} strokeWidth={2.5} />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-900 text-sm leading-tight">
                              {scheme.name}
                            </h3>
                            <div className="mt-1">
                              <span className="text-[10px] bg-[#ffc8dd] text-slate-900 border border-slate-900 font-black px-2 py-0.5 rounded-full">ID: {scheme.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 bg-white group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                          <ChevronRight size={18} strokeWidth={2.5} />
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {filteredSchemes.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-white border-[1.5px] border-slate-900 shadow-[0_4px_0_rgba(15,23,42,1)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Target className="text-slate-900" size={32} />
                      </div>
                      <p className="text-slate-900 font-black text-sm">No schemes found</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
