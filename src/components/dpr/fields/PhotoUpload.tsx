"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploadProps {
  label: string;
  value: string[]; // URLs of uploaded photos
  onChange: (urls: string[]) => void;
  required?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ label, value = [], onChange, required }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<{ id: string; file?: File; preview: string; progress: number; url?: string }[]>(
    value.map((url, i) => ({ id: `existing-${i}`, preview: url, progress: 100, url }))
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = 5 - uploads.length;
      const filesToProcess = newFiles.slice(0, remainingSlots);

      const newUploads = filesToProcess.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        progress: 0
      }));

      setUploads(prev => [...prev, ...newUploads]);
      
      // Simulate upload process for now (Integration with firebase-dpr.ts uploadPhoto happens in parent or here)
      // For this UI component, we'll simulate the progress visually
      newUploads.forEach(upload => simulateUpload(upload.id));
    }
  };

  const simulateUpload = (id: string) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        // Pretend we got a URL back
        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress: 100, url: u.preview } : u));
        // We should really call onChange with actual URLs from Firebase here
      } else {
        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress: currentProgress } : u));
      }
    }, 200);
  };

  const removePhoto = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
    // Ideally update `value` via onChange here too
  };

  // Sync to parent when uploads complete (simplified)
  React.useEffect(() => {
    const completedUrls = uploads.filter(u => u.progress === 100 && u.url).map(u => u.url!);
    // Only fire onChange if there's a difference to avoid loop
    if (completedUrls.length !== value.length) {
      onChange(completedUrls);
    }
  }, [uploads, onChange, value.length]);

  return (
    <div className="flex flex-col gap-2 mb-6">
      <label className="text-sm font-bold text-slate-900 ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Upload Area */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
        />
        <div className="rounded-[24px] bg-[#ffc8dd] border-[1.5px] border-slate-900 p-6 flex flex-col items-center justify-center transition-all hover:shadow-[0_4px_0_rgba(15,23,42,1)] hover:translate-y-[-2px]">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] text-slate-900">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm font-black text-slate-900 mb-1">Tap to capture</p>
          <p className="text-xs font-bold text-slate-800">JPG, PNG format only</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <AnimatePresence>
          {uploads.map((upload) => (
            <motion.div
              key={upload.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="relative aspect-square rounded-[20px] bg-white overflow-hidden border-[1.5px] border-slate-900 group shadow-[0_2px_0_rgba(15,23,42,1)]"
            >
              <img src={upload.preview} alt="Upload preview" className="w-full h-full object-cover" />
              
              {/* Progress Overlay */}
              {upload.progress < 100 && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-slate-900 transition-all duration-200 ease-out"
                        strokeDasharray={`${upload.progress}, 100`}
                        strokeWidth="4"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-black text-slate-900">{Math.round(upload.progress)}%</span>
                  </div>
                </div>
              )}

              {/* Delete Button */}
              {upload.progress === 100 && (
                <button
                  type="button"
                  onClick={() => removePhoto(upload.id)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#ffc8dd] border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
};
