"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ArrowRight, Loader2, Image as ImageIcon, Check } from 'lucide-react';

export default function OnboardingScreen() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Smooth splash screen timing
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    branch: 'Head Office',
    age: '',
    gender: 'male',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.employeeId)) {
      setError('Please fill out all fields.');
      return;
    }
    if (step === 2 && (!formData.age)) {
      setError('Please provide your age.');
      return;
    }
    setError('');
    setStep(s => s + 1);
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        const maxSize = 500;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(compressedBase64);
        }
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    }
  };

  const finalizeOnboarding = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    setError('');

    try {
      const userProfile = {
        ...formData,
        avatar: imagePreview
      };

      localStorage.setItem('dpr_user_profile', JSON.stringify(userProfile));
      localStorage.setItem('dpr_pin_code', '1234'); 
      
      router.push('/dpr');
    } catch (err: any) {
      console.error(err);
      setError('Failed to save profile. Please try again.');
      setIsLoading(false);
    }
  };

  // SPLASH SCREEN: Clean, smooth, no grid, white background
  if (showSplash) {
    return (
      <div className="bg-slate-900 min-h-screen flex justify-center">
        <div className="w-full max-w-md bg-white min-h-screen flex flex-col items-center justify-center relative px-6">
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="flex flex-col items-center relative z-10 w-full"
            >
              
              <div className="mb-2 flex items-center justify-center">
                <img 
                  src="/assets/logo.png" 
                  alt="KSPPL Company Logo" 
                  className="w-48 object-contain" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement('h1');
                      fallback.className = "text-5xl font-black tracking-tighter text-slate-900";
                      fallback.textContent = "KSPPL";
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-slate-500 font-semibold text-[11px] tracking-[0.3em] uppercase mb-12 text-center"
              >
                Building Dreams, Creating Futures
              </motion.p>
              
              <div className="text-center relative">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 font-black text-[28px] tracking-tight uppercase leading-tight"
                >
                  Digital Progress<br/>Reporting
                </motion.h2>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // NEO-BRUTALIST INPUT CLASSES (Matches Home Design Theme)
  const inputClasses = "w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[16px] px-4 py-4 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:outline-none focus:shadow-[0_4px_0_rgba(15,23,42,1)] shadow-[0_2px_0_rgba(15,23,42,1)] transition-all appearance-none";
  const labelClasses = "text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2 block flex items-center gap-2";

  return (
    <div className="bg-slate-900 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-[#F2F5F8] h-[100dvh] relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
        
        {/* Header Appears when Form Appears */}
        <div className="shrink-0 mb-8 z-10 relative">
           <div className="bg-white border-[1.5px] border-slate-900 rounded-[20px] px-6 py-3 shadow-[0_4px_0_rgba(15,23,42,1)] flex items-center gap-3">
              <img src="/assets/logo.png" alt="KSPPL Logo" className="h-8 object-contain" />
              <div className="w-[1.5px] h-6 bg-slate-900"></div>
              <span className="font-black text-slate-900 text-[10px] tracking-widest uppercase">DPR APP</span>
           </div>
        </div>

        {/* Centered Form Card with Neo-Brutalist styling */}
        <div className="w-full relative z-20 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="bg-white w-full rounded-[32px] shadow-[0_8px_0_rgba(15,23,42,1)] border-[1.5px] border-slate-900 p-8 flex flex-col"
            >
              
              {/* Step Progress Dots */}
              <div className="flex gap-2 justify-center mb-8">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className={`h-2.5 rounded-full border-[1px] border-slate-900 transition-all duration-300 flex-1 ${step >= i ? 'bg-[#bde0fe]' : 'bg-[#F2F5F8]'}`} 
                  />
                ))}
              </div>

              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-tight uppercase">Employee<br/>Details</h2>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <div>
                      <label className={labelClasses}>Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className={inputClasses}
                        placeholder="e.g. Rajiv Sharma"
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Employee ID</label>
                      <input 
                        type="text" 
                        value={formData.employeeId}
                        onChange={e => setFormData({...formData, employeeId: e.target.value})}
                        className={inputClasses}
                        placeholder="e.g. KSPPL-4029"
                      />
                    </div>
                  </div>

                  {error && <p className="text-[11px] font-black uppercase text-rose-500 bg-rose-50 border-[1.5px] border-rose-500 p-2 rounded-xl text-center">{error}</p>}

                  <div className="pt-2">
                    <button 
                      onClick={handleNext}
                      className="w-full bg-[#bde0fe] hover:bg-[#a2d2ff] border-[1.5px] border-slate-900 text-slate-900 rounded-[20px] py-4 font-black flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                    >
                      CONTINUE <ArrowRight size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DEMOGRAPHICS */}
              {step === 2 && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-tight uppercase">Work<br/>Assignment</h2>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <div>
                      <label className={labelClasses}>Branch</label>
                      <div className="relative">
                        <select 
                          value={formData.branch}
                          onChange={e => setFormData({...formData, branch: e.target.value})}
                          className={inputClasses}
                        >
                          <option>Head Office</option>
                          <option>Hyd/Allepey</option>
                          <option>Kerela/Etah</option>
                          <option>UP</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <div className="w-3 h-3 border-b-2 border-r-2 border-slate-900 transform rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClasses}>Age</label>
                        <input 
                          type="number" 
                          value={formData.age}
                          onChange={e => setFormData({...formData, age: e.target.value})}
                          className={inputClasses}
                          placeholder="e.g. 34"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Gender</label>
                        <div className="relative">
                          <select 
                            value={formData.gender}
                            onChange={e => setFormData({...formData, gender: e.target.value})}
                            className={inputClasses}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="w-3 h-3 border-b-2 border-r-2 border-slate-900 transform rotate-45"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-[11px] font-black uppercase text-rose-500 bg-rose-50 border-[1.5px] border-rose-500 p-2 rounded-xl text-center">{error}</p>}

                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={() => setStep(1)}
                      className="w-16 bg-white border-[1.5px] border-slate-900 text-slate-900 rounded-[20px] py-4 font-black flex items-center justify-center transition-all shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none shrink-0"
                    >
                      <ArrowRight size={20} strokeWidth={3} className="rotate-180" />
                    </button>
                    <button 
                      onClick={handleNext}
                      className="flex-1 bg-[#ffc8dd] hover:bg-[#ffb5d0] border-[1.5px] border-slate-900 text-slate-900 rounded-[20px] py-4 font-black flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                    >
                      NEXT <ArrowRight size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SELFIE CAPTURE */}
              {step === 3 && (
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-tight uppercase">Profile<br/>Picture</h2>
                  </div>
                  
                  <div className="flex flex-col items-center gap-6">
                    {imagePreview ? (
                      <div className="w-40 h-40 rounded-full overflow-hidden border-[3px] border-slate-900 shadow-[0_6px_0_rgba(15,23,42,1)] relative bg-[#F2F5F8] group">
                        <img src={imagePreview} alt="Selfie" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setImagePreview(null)}
                          className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity font-black tracking-widest uppercase text-sm"
                        >
                          RETAKE
                        </button>
                        <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#cdb4db] border-[1.5px] border-slate-900 rounded-full flex items-center justify-center shadow-sm">
                           <Check size={16} strokeWidth={3} className="text-slate-900" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5 w-full">
                        <button 
                          onClick={() => cameraInputRef.current?.click()}
                          className="w-full aspect-[3/1] rounded-[20px] bg-[#bde0fe] border-[1.5px] border-slate-900 flex flex-col items-center justify-center gap-2 text-slate-900 transition-all shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                        >
                          <Camera size={28} strokeWidth={2.5} />
                          <span className="text-sm font-black uppercase tracking-wider">Open Camera</span>
                        </button>
                        
                        <div className="flex items-center gap-4 w-full px-4 py-2">
                           <div className="h-[1.5px] bg-slate-200 flex-1"></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
                           <div className="h-[1.5px] bg-slate-200 flex-1"></div>
                        </div>

                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-5 rounded-[20px] bg-[#F2F5F8] border-[1.5px] border-dashed border-slate-900 hover:bg-slate-100 flex items-center justify-center gap-3 text-slate-900 transition-all"
                        >
                          <Upload size={20} strokeWidth={2.5} />
                          <span className="text-xs font-black uppercase tracking-wider">Upload from Gallery</span>
                        </button>
                      </div>
                    )}

                    <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleImageCapture} />
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageCapture} />
                  </div>

                  {error && <p className="text-[11px] font-black uppercase text-rose-500 bg-rose-50 border-[1.5px] border-rose-500 p-2 rounded-xl text-center">{error}</p>}

                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={isLoading}
                      className="w-16 bg-white border-[1.5px] border-slate-900 text-slate-900 rounded-[20px] py-4 font-black flex items-center justify-center transition-all shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none shrink-0 disabled:opacity-50 disabled:shadow-none"
                    >
                      <ArrowRight size={20} strokeWidth={3} className="rotate-180" />
                    </button>
                    <button 
                      onClick={finalizeOnboarding}
                      disabled={!imagePreview || isLoading}
                      className="flex-1 bg-emerald-300 border-[1.5px] border-slate-900 text-slate-900 rounded-[20px] py-4 font-black flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:shadow-none disabled:bg-slate-200"
                    >
                      {isLoading ? (
                        <><Loader2 size={20} className="animate-spin" strokeWidth={3} /> SAVING...</>
                      ) : (
                        <>COMPLETE SETUP <ImageIcon size={20} strokeWidth={3} /></>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
