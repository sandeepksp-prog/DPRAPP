"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ChevronDown, UploadCloud, Camera, Plus, Trash2, PartyPopper, Users, ArrowRight } from "lucide-react";
import { FormField, getManpowerSchema } from "@/lib/form-schemas";
import { motion, AnimatePresence } from "framer-motion";

interface DynamicDisciplineFormProps {
  title: string;
  schemeId: string | null;
  fields: FormField[];
  onBack: () => void;
}

export default function DynamicDisciplineForm({ title, schemeId, fields, onBack }: DynamicDisciplineFormProps) {
  const router = useRouter();
  
  // Step State: 1 = Work Progress, 2 = Manpower, 3 = Celebration
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileName, setProfileName] = useState("Rajiv Sharma");

  React.useEffect(() => {
    const saved = localStorage.getItem("dpr_user_profile");
    if (saved) {
      setProfileName(JSON.parse(saved).name);
    }
  }, []);

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleMultipleChoice = (id: string, option: string) => {
    setFormData(prev => {
      const current = prev[id] || [];
      if (current.includes(option)) {
        return { ...prev, [id]: current.filter((o: string) => o !== option) };
      }
      return { ...prev, [id]: [...current, option] };
    });
  };

  const handleNodeEntryAdd = (id: string) => {
    setFormData(prev => {
      const current = prev[id] || [];
      return { ...prev, [id]: [...current, { from: '', to: '' }] };
    });
  };

  const handleNodeEntryChange = (id: string, index: number, field: 'from' | 'to', value: string) => {
    setFormData(prev => {
      const current = [...(prev[id] || [])];
      current[index] = { ...current[index], [field]: value };
      return { ...prev, [id]: current };
    });
  };

  const handleNodeEntryRemove = (id: string, index: number) => {
    setFormData(prev => {
      const current = [...(prev[id] || [])];
      current.splice(index, 1);
      return { ...prev, [id]: current };
    });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate Step 1
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API save
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3); // Celebration step
    }, 1200);
  };

  // ---------------------------------------------
  // STEP 3: CELEBRATION (Neo-Brutalist)
  // ---------------------------------------------
  if (step === 3) {
    return (
      <div className="bg-slate-900 min-h-screen flex justify-center">
        <div className="w-full max-w-md bg-[#F2F5F8] h-[100dvh] relative flex flex-col items-center justify-center px-6 overflow-hidden text-center shadow-2xl">
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative z-10 flex flex-col items-center w-full"
          >
            <div className="w-20 h-20 bg-[#ffc8dd] border-[1.5px] border-slate-900 shadow-[0_4px_0_rgba(15,23,42,1)] rounded-full flex items-center justify-center mb-5">
              <PartyPopper size={40} className="text-slate-900" strokeWidth={2.5} />
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase border-b-[3px] border-slate-900 pb-2">Report Logged!</h2>
            <p className="text-lg text-slate-700 font-black mb-8 uppercase tracking-wide">
              THANK YOU! {profileName}
            </p>
            
            <div className="flex flex-col w-full gap-4">
              <button 
                onClick={() => { setStep(1); setFormData({}); }} 
                className="w-full bg-[#bde0fe] hover:bg-[#a2d2ff] border-[1.5px] border-slate-900 text-slate-900 font-black py-4 rounded-2xl shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-all"
              >
                LOG ANOTHER UPDATE
              </button>
              <button 
                onClick={() => router.push("/dpr")} 
                className="w-full bg-white hover:bg-slate-50 border-[1.5px] border-slate-900 text-slate-900 font-black py-4 rounded-2xl shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none transition-all"
              >
                RETURN HOME
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------
  // CURRENT FIELDS TO RENDER
  // ---------------------------------------------
  const currentFields = step === 1 ? fields : getManpowerSchema(title);

  return (
    <div className="bg-slate-900 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-[#F2F5F8] min-h-screen relative pb-32 flex flex-col overflow-x-hidden shadow-2xl">
        
        {/* HEADER */}
        <div className="px-6 pt-10 pb-6 border-b-[1.5px] border-slate-900 bg-white shadow-sm z-10 sticky top-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <button 
                onClick={() => step === 2 ? setStep(1) : onBack()}
                className="w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center shrink-0 text-slate-900 transition-all"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>
              <div className="flex-1 mt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-[#ffc8dd] border-[1.5px] border-slate-900 px-2 py-0.5 rounded-full">
                    Step {step} of 2
                  </span>
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  {step === 1 ? title : "Manpower Details"}
                </h1>
                {schemeId && <p className="text-slate-600 text-xs font-bold mt-1">Scheme: {schemeId}</p>}
              </div>
            </div>

            {/* Neo-Brutalist Progress Bar */}
            <div className="w-full h-3 bg-white border-[1.5px] border-slate-900 rounded-full overflow-hidden shadow-[inset_0_2px_0_rgba(0,0,0,0.05)]">
               <div className="h-full bg-slate-900 transition-all duration-500 ease-out border-r-[1.5px] border-slate-900" style={{ width: step === 1 ? '50%' : '100%' }}></div>
            </div>
          </div>
        </div>

        {/* FORM BODY */}
        <div className="relative z-0 px-4 pt-6">
          {currentFields.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-bold">
              No fields defined for this section yet.
            </div>
          ) : (
            <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-6">
              <AnimatePresence mode="popLayout">
                {currentFields.map((field) => {
                  // ADVANCED LOGIC ENGINE
                  const isVisible = () => {
                    if (!field.showIf) return true;
                    
                    if (field.showIf.or) {
                      return field.showIf.or.some(cond => formData[cond.fieldId] === cond.equals);
                    }

                    const targetValue = formData[field.showIf.fieldId!];
                    
                    if (field.showIf.equals) {
                      return targetValue === field.showIf.equals;
                    }
                    if (field.showIf.in) {
                      return field.showIf.in.includes(targetValue);
                    }
                    if (field.showIf.includes) {
                      return Array.isArray(targetValue) && targetValue.includes(field.showIf.includes);
                    }
                    if (field.showIf.includesAny) {
                      return Array.isArray(targetValue) && field.showIf.includesAny.some(v => targetValue.includes(v));
                    }
                    if (field.showIf.isNotEmpty) {
                      return targetValue !== undefined && targetValue !== '' && (!Array.isArray(targetValue) || targetValue.length > 0);
                    }
                    return true;
                  };

                  if (!isVisible()) return null;

                  return (
                    <motion.div 
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white rounded-[20px] p-5 shadow-[0_4px_0_rgba(15,23,42,1)] border-[1.5px] border-slate-900"
                    >
                      <label className="block text-[15px] font-black text-slate-900 mb-3 leading-snug">
                        {field.question}
                        {field.required && <span className="text-rose-500 ml-1">*</span>}
                      </label>

                      {/* TEXT / NUMBER INPUT */}
                      {(field.type === 'ShortAnswer' || field.type === 'Number') && (
                        <input
                          type={field.type === 'Number' ? "number" : "text"}
                          required={field.required !== false}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[12px] px-4 py-3.5 text-sm font-black text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all placeholder:font-bold placeholder:text-slate-400"
                          placeholder={field.type === 'Number' ? "e.g. 5" : "Type here..."}
                        />
                      )}

                      {/* DROPDOWN (Select) */}
                      {field.type === 'Dropdown' && (
                        <div className="relative">
                          <select
                            required={field.required !== false}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full appearance-none bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[12px] px-4 py-3.5 text-sm font-black text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 transition-all"
                          >
                            <option value="" disabled>Select an option</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none" size={20} strokeWidth={2.5} />
                        </div>
                      )}

                      {/* MULTIPLE CHOICE & MULTISELECT (Interactive Pills) */}
                      {(field.type === 'MultipleChoice' || field.type === 'MultiSelect') && (
                        <div className="flex flex-wrap gap-2.5">
                          {field.options?.map(opt => {
                            const isSelected = (formData[field.id] || []).includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleMultipleChoice(field.id, opt)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-transform active:translate-y-0.5 active:shadow-none border-[1.5px] border-slate-900 ${
                                  isSelected 
                                    ? 'bg-[#bde0fe] text-slate-900 shadow-[0_3px_0_rgba(15,23,42,1)]' 
                                    : 'bg-white text-slate-600 hover:bg-slate-50 shadow-[0_3px_0_rgba(15,23,42,1)]'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* NODE ENTRY (DYNAMIC BOXES) */}
                      {field.type === 'NodeEntry' && (
                        <div className="space-y-4">
                          {(formData[field.id] || []).map((node: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={node.from}
                                onChange={(e) => handleNodeEntryChange(field.id, idx, 'from', e.target.value)}
                                placeholder="From (J25)"
                                className="w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[12px] px-3 py-3 text-xs font-black text-slate-900 focus:outline-none focus:bg-white"
                              />
                              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-white">
                                <ArrowRight size={14} strokeWidth={2.5} />
                              </div>
                              <input
                                type="text"
                                value={node.to}
                                onChange={(e) => handleNodeEntryChange(field.id, idx, 'to', e.target.value)}
                                placeholder="To (J27)"
                                className="w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[12px] px-3 py-3 text-xs font-black text-slate-900 focus:outline-none focus:bg-white"
                              />
                              <button type="button" onClick={() => handleNodeEntryRemove(field.id, idx)} className="w-10 h-10 shrink-0 flex items-center justify-center bg-[#ffc8dd] text-slate-900 border-[1.5px] border-slate-900 rounded-xl shadow-[0_2px_0_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none transition-all">
                                <Trash2 size={16} strokeWidth={2.5} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleNodeEntryAdd(field.id)}
                            className="w-full py-3.5 border-[1.5px] border-dashed border-slate-900 bg-white rounded-xl text-sm font-black text-slate-900 hover:bg-slate-50 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                          >
                            <Plus size={18} strokeWidth={2.5} /> ADD NODE RANGE
                          </button>
                        </div>
                      )}

                      {/* FILE UPLOAD & IMAGE */}
                      {(field.type === 'FileUpload' || field.type === 'Image') && (
                        <div className="relative border-[1.5px] border-dashed border-slate-900 rounded-[20px] p-6 flex flex-col items-center justify-center text-center bg-[#F2F5F8] hover:bg-[#bde0fe]/30 transition-colors cursor-pointer group active:scale-[0.98]">
                          <input 
                            type="file" 
                            accept={field.type === 'Image' ? "image/*" : "*/*"} 
                            capture={field.type === 'Image' ? "environment" : undefined}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            title={field.type === 'Image' ? "Take a Photo" : "Upload Document"}
                          />
                          <div className="w-12 h-12 bg-white rounded-xl border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 mb-3 shadow-[0_2px_0_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[0_4px_0_rgba(15,23,42,1)] transition-all">
                            {field.type === 'Image' ? <Camera size={20} strokeWidth={2.5} /> : <UploadCloud size={20} strokeWidth={2.5} />}
                          </div>
                          <p className="text-sm font-black text-slate-900">
                            {field.type === 'Image' ? 'Tap to open Camera' : 'Tap to Upload Document'}
                          </p>
                          {field.id === 'mp_photo' ? (
                            <p className="text-[11px] text-slate-600 mt-2 font-semibold italic">That photo should consists of total manpower available in the site.</p>
                          ) : (
                            <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wider">JPEG, PNG, PDF &bull; Max 5MB</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* SUBMIT / NEXT BUTTON (Normal Flow) */}
              <div className="pt-8 pb-12 w-full">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#bde0fe] hover:bg-[#a2d2ff] disabled:bg-slate-300 disabled:shadow-none border-[1.5px] border-slate-900 text-slate-900 rounded-[20px] py-4 px-6 font-black shadow-[0_4px_0_rgba(15,23,42,1)] flex items-center justify-between transition-all active:translate-y-1 active:shadow-none"
                >
                  <div className="flex items-center gap-3">
                    {step === 1 ? <Users size={20} strokeWidth={2.5} /> : <Save size={20} strokeWidth={2.5} />}
                    <span className="text-[15px]">{step === 1 ? 'NEXT: MANPOWER DETAILS' : isSubmitting ? 'SAVING...' : 'SUBMIT FINAL REPORT'}</span>
                  </div>
                  {!isSubmitting && (
                    <div className="w-8 h-8 rounded-full bg-white border-[1.5px] border-slate-900 flex items-center justify-center">
                      <ArrowRight size={16} strokeWidth={3} />
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
