"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      // 1. Analyze Photo with Gemini Vision
      const res = await fetch('/api/avatar-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imagePreview })
      });

      if (!res.ok) throw new Error('Vision analysis failed');
      const avatarTraits = await res.json();

      // 2. Save complete profile to LocalStorage
      const userProfile = {
        ...formData,
        avatarTraits // { skinTone, hairStyle, hairColor, hasBeard, hasGlasses, gender }
      };

      localStorage.setItem('dpr_user_profile', JSON.stringify(userProfile));

      // 3. Set a dummy PIN to bypass future login screens if needed, or rely on profile existence
      localStorage.setItem('dpr_pin_code', '1234'); 
      
      router.push('/dpr');
    } catch (err: any) {
      console.error(err);
      setError('Failed to analyze photo. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-sm"
        >
          <div className="relative rounded-[32px] overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
            
            {/* Step Indicators */}
            <div className="flex gap-2 mb-8 justify-center">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors ${step >= i ? 'bg-[#bde0fe]' : 'bg-white/20'}`} />
              ))}
            </div>

            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-white text-center">Who are you?</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1 block">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-[#bde0fe]"
                      placeholder="e.g. Rajiv Sharma"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1 block">Employee ID</label>
                    <input 
                      type="text" 
                      value={formData.employeeId}
                      onChange={e => setFormData({...formData, employeeId: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-[#bde0fe]"
                      placeholder="e.g. KSPPL-4029"
                    />
                  </div>
                </div>

                {error && <p className="text-xs font-bold text-rose-400 text-center">{error}</p>}

                <button 
                  onClick={handleNext}
                  className="w-full bg-[#bde0fe] text-slate-900 rounded-xl py-4 font-black flex items-center justify-center gap-2 hover:bg-white transition-colors"
                >
                  Continue <ArrowRight size={16} strokeWidth={3} />
                </button>
              </div>
            )}

            {/* STEP 2: DEMOGRAPHICS */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-white text-center">Work Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1 block">Branch</label>
                    <select 
                      value={formData.branch}
                      onChange={e => setFormData({...formData, branch: e.target.value})}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#bde0fe] appearance-none"
                    >
                      <option>Head Office</option>
                      <option>Hyd/Allepey</option>
                      <option>Kerela/Etah</option>
                      <option>UP</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1 block">Age</label>
                      <input 
                        type="number" 
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#bde0fe]"
                        placeholder="e.g. 34"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1 block">Gender</label>
                      <select 
                        value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value})}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#bde0fe] appearance-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                {error && <p className="text-xs font-bold text-rose-400 text-center">{error}</p>}

                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white/10 text-white rounded-xl py-4 font-black hover:bg-white/20 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex-[2] bg-[#bde0fe] text-slate-900 rounded-xl py-4 font-black flex items-center justify-center gap-2 hover:bg-white transition-colors"
                  >
                    Next <ArrowRight size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SELFIE CAPTURE */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-white text-center leading-tight">Take a Selfie for your<br/>AI Avatar</h2>
                
                <div className="flex flex-col items-center gap-4">
                  {imagePreview ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#bde0fe] relative">
                      <img src={imagePreview} alt="Selfie" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setImagePreview(null)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity font-bold text-xs"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4 w-full">
                      <button 
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex-1 aspect-square rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center justify-center gap-2 text-white transition-colors"
                      >
                        <Camera size={24} />
                        <span className="text-xs font-bold">Camera</span>
                      </button>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 aspect-square rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 flex flex-col items-center justify-center gap-2 text-white transition-colors"
                      >
                        <Upload size={24} />
                        <span className="text-xs font-bold">Upload</span>
                      </button>
                    </div>
                  )}

                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="user"
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

                <div className="bg-[#fcf6bd]/20 border border-[#fcf6bd]/30 rounded-xl p-3 text-center">
                  <p className="text-[11px] font-bold text-[#fcf6bd]">
                    Our Vision AI will analyze your facial features to generate a custom vector avatar matching our theme!
                  </p>
                </div>

                {error && <p className="text-xs font-bold text-rose-400 text-center">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setStep(2)}
                    disabled={isLoading}
                    className="flex-1 bg-white/10 text-white rounded-xl py-4 font-black hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={finalizeOnboarding}
                    disabled={!imagePreview || isLoading}
                    className="flex-[2] bg-[#bde0fe] text-slate-900 rounded-xl py-4 font-black flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <><Loader2 size={16} className="animate-spin" /> Generating...</>
                    ) : (
                      <>Create Profile <ImageIcon size={16} strokeWidth={3} /></>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
