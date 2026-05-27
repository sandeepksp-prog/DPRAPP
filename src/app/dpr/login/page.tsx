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
    // Show splash for 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
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
      
      // Create an image element to resize the image
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        // Calculate new dimensions (max 500px)
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
        
        // Draw to canvas and get compressed base64
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.7 quality to keep payload small
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
      // Save complete profile to LocalStorage directly using the photo
      const userProfile = {
        ...formData,
        avatar: imagePreview // Save base64 photo directly
      };

      localStorage.setItem('dpr_user_profile', JSON.stringify(userProfile));

      // Set a dummy PIN to bypass future login screens
      localStorage.setItem('dpr_pin_code', '1234'); 
      
      router.push('/dpr');
    } catch (err: any) {
      console.error(err);
      setError('Failed to save profile. Please try again.');
      setIsLoading(false);
    }
  };

  if (showSplash) {
    return (
      <div className="bg-slate-900 min-h-screen flex justify-center">
        <div className="w-full max-w-md bg-[#bde0fe] min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="flex flex-col items-center relative z-10 bg-white p-8 rounded-[32px] border-[1.5px] border-slate-900 shadow-[0_8px_0_rgba(15,23,42,1)]"
          >
            {/* Actual Company Logo */}
            <div className="mb-6 flex items-center justify-center bg-[#F2F5F8] p-4 rounded-2xl border-[1.5px] border-slate-900 shadow-[0_4px_0_rgba(15,23,42,1)]">
              <img 
                src="/assets/logo.png" 
                alt="KSPPL Company Logo" 
                className="w-32 object-contain" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const fallback = document.createElement('h1');
                    fallback.className = "text-4xl font-black tracking-tighter text-slate-900";
                    fallback.textContent = "KSPPL";
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            
            <div className="text-center space-y-2 mt-2">
              <h2 className="text-slate-900 font-black text-2xl tracking-tight leading-none uppercase">Project Management<br/>System</h2>
              <p className="text-slate-600 font-bold text-xs tracking-widest uppercase mt-2 bg-[#ffc8dd] border-[1.5px] border-slate-900 rounded-full px-3 py-1 inline-block">Digital Progress Reporting</p>
            </div>
            
            <motion.div 
              className="mt-8 w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          {/* Background Decorative Elements for Neo-brutalist feel */}
          <div className="absolute top-10 right-[-10%] w-64 h-64 bg-[#cdb4db] rounded-full border-[1.5px] border-slate-900 opacity-20" />
          <div className="absolute bottom-10 left-[-10%] w-48 h-48 bg-[#ffc8dd] rounded-full border-[1.5px] border-slate-900 opacity-20" />
        </div>
      </div>
    );
  }

  const inputClasses = "w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[16px] px-4 py-4 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:outline-none focus:shadow-[0_4px_0_rgba(15,23,42,1)] shadow-[0_2px_0_rgba(15,23,42,1)] transition-all appearance-none";
  const labelClasses = "text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2 block flex items-center gap-2";

  return (
    <div className="bg-slate-900 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-[#F2F5F8] h-[100dvh] relative overflow-hidden flex flex-col items-center justify-center px-6 shadow-2xl">
        
        {/* Header Appears when Form Appears */}
        <div className="shrink-0 mb-8">
           <div className="bg-white border-[1.5px] border-slate-900 rounded-[20px] px-6 py-3 shadow-[0_4px_0_rgba(15,23,42,1)] flex items-center gap-3">
              <img src="/assets/logo.png" alt="KSPPL Logo" className="h-8 object-contain" />
              <div className="w-[1.5px] h-6 bg-slate-900"></div>
              <span className="font-black text-slate-900 text-sm tracking-widest uppercase">PMS</span>
           </div>
        </div>

        <div className="w-full relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-full"
            >
              <div className="bg-white rounded-[32px] shadow-[0_8px_0_rgba(15,23,42,1)] border-[1.5px] border-slate-900 p-8 flex flex-col w-full">
              
              {/* Step Indicators */}
              <div className="flex gap-2 mb-8 justify-center shrink-0">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-2.5 border-[1px] border-slate-900 rounded-full flex-1 transition-all duration-300 ${step >= i ? 'bg-[#bde0fe]' : 'bg-[#F2F5F8]'}`} />
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

                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      className="hidden" 
                      ref={cameraInputRef} 
                      onChange={handleImageCapture} 
                    />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageCapture} 
                    />
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

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
