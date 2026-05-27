"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Droplets, HardHat, ShieldAlert, Zap, 
  Settings, BrickWall, Wrench, FileCheck, ChevronRight, Building2
} from "lucide-react";
import { SCHEME_MAP } from "@/lib/scheme-data";

export default function CommandCenterCore() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const schemeId = searchParams.get("schemeId");
  const [schemeName, setSchemeName] = useState<string>("Loading...");
  
  // Step 1: Select Update Type, Step 2: Select Discipline
  const [step, setStep] = useState<number>(1);
  const [updateType, setUpdateType] = useState<string | null>(null);

  useEffect(() => {
    if (schemeId && SCHEME_MAP[schemeId]) {
      setSchemeName(SCHEME_MAP[schemeId].name);
    } else {
      setSchemeName("Unknown Scheme");
    }
  }, [schemeId]);

  const handleUpdateTypeSelect = (type: string) => {
    setUpdateType(type);
    if (type === "Work Progress Update") {
      setStep(2); 
    } else if (type === "TPI Inspection Update") {
      router.push(`/dpr/forms/tpi?schemeId=${schemeId}`);
    }
  };

  const handleDisciplineSelect = (discipline: string) => {
    router.push(`/dpr/forms/discipline?type=${encodeURIComponent(discipline)}&schemeId=${schemeId}`);
  };

  return (
    <div className="bg-slate-900 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-[#F2F5F8] min-h-screen relative flex flex-col pb-24 shadow-2xl overflow-x-hidden">
        
        {/* NEO-BRUTALIST HEADER */}
        <div className="px-6 pt-10 pb-6 border-b-[1.5px] border-slate-900 bg-white shadow-sm z-10 sticky top-0">
          <div className="flex items-start gap-4">
            <button 
              onClick={() => step === 2 ? setStep(1) : router.push("/dpr/form")}
              className="w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center shrink-0 text-slate-900 transition-none"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div className="flex-1 mt-1">
              <p className="text-slate-900 bg-[#bde0fe] border-[1.5px] border-slate-900 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                Command Center
              </p>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-tight uppercase mb-1">
                {schemeName}
              </h1>
              <p className="text-slate-600 text-xs font-bold bg-[#F2F5F8] px-2 py-0.5 rounded-md border-[1.5px] border-slate-900 inline-block">
                ID: {schemeId}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT WIZARD */}
        <div className="px-5 pt-6 relative z-0 flex-1">
          <AnimatePresence mode="wait">
            {/* STEP 1: SEGREGATION (Type of Update) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="bg-white rounded-[24px] shadow-[0_4px_0_rgba(15,23,42,1)] border-[1.5px] border-slate-900 p-5">
                  <h2 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
                    <FileCheck className="text-slate-900" size={20} strokeWidth={2.5} />
                    TYPE OF UPDATE
                  </h2>

                  <div className="space-y-4">
                    <button 
                      onClick={() => handleUpdateTypeSelect("Work Progress Update")}
                      className="w-full flex items-center justify-between p-4 rounded-[16px] border-[1.5px] border-slate-900 bg-white hover:bg-[#bde0fe] active:bg-[#bde0fe] active:translate-y-1 active:shadow-none shadow-[0_3px_0_rgba(15,23,42,1)] transition-none group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#bde0fe] border-[1.5px] border-slate-900 text-slate-900 flex items-center justify-center group-hover:bg-white">
                          <HardHat size={22} strokeWidth={2.5} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-black text-slate-900 text-[15px]">Work Progress</h3>
                          <p className="text-xs text-slate-600 font-bold mt-0.5">Log daily execution metrics</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white">
                        <ChevronRight size={16} strokeWidth={3} />
                      </div>
                    </button>

                    <button 
                      onClick={() => handleUpdateTypeSelect("TPI Inspection Update")}
                      className="w-full flex items-center justify-between p-4 rounded-[16px] border-[1.5px] border-slate-900 bg-white hover:bg-[#ffc8dd] active:bg-[#ffc8dd] active:translate-y-1 active:shadow-none shadow-[0_3px_0_rgba(15,23,42,1)] transition-none group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#ffc8dd] border-[1.5px] border-slate-900 text-slate-900 flex items-center justify-center group-hover:bg-white">
                          <ShieldAlert size={22} strokeWidth={2.5} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-black text-slate-900 text-[15px]">TPI Inspection</h3>
                          <p className="text-xs text-slate-600 font-bold mt-0.5">Third-party verification logs</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white">
                        <ChevronRight size={16} strokeWidth={3} />
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DISCIPLINE OF WORK */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="bg-white rounded-[24px] shadow-[0_4px_0_rgba(15,23,42,1)] border-[1.5px] border-slate-900 p-5">
                  <h2 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
                    <Wrench className="text-slate-900" size={20} strokeWidth={2.5} />
                    DISCIPLINE OF WORK
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "CIVIL", icon: <Building2 size={22} strokeWidth={2.5} /> },
                      { name: "E&M", icon: <Zap size={22} strokeWidth={2.5} /> },
                      { name: "PIPELINE", icon: <Droplets size={22} strokeWidth={2.5} /> }
                    ].map(disc => (
                      <button
                        key={disc.name}
                        onClick={() => handleDisciplineSelect(disc.name)}
                        className="flex flex-col items-center justify-center gap-3 p-4 rounded-[16px] border-[1.5px] border-slate-900 bg-white hover:bg-[#bde0fe] active:bg-[#bde0fe] shadow-[0_3px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-none group"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F2F5F8] border-[1.5px] border-slate-900 text-slate-900 group-hover:bg-white group-hover:scale-105 transition-transform">
                          {disc.icon}
                        </div>
                        <span className="text-[11px] font-black text-slate-900 text-center uppercase tracking-wide leading-tight">
                          {disc.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
