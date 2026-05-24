"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SubmissionEnding() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // We could load a real canvas confetti here, but for simplicity
    // we'll trigger a state to show some CSS-based particles or just
    // rely on the framer-motion sequence.
    setTimeout(() => setShowConfetti(true), 300);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-32 h-32 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mb-8 relative shadow-[0_0_50px_rgba(16,185,129,0.2)]"
      >
        <motion.svg 
          className="w-16 h-16 text-emerald-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3} 
            d="M5 13l4 4L19 7" 
          />
        </motion.svg>
        
        {/* Pulsing rings */}
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-emerald-400"
        />
      </motion.div>

      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-extrabold text-white mb-3 tracking-tight"
      >
        Report Submitted
      </motion.h2>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-slate-400 mb-12 max-w-[280px]"
      >
        Thank you! Your daily project report has been successfully recorded. Have a productive day!
      </motion.p>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full flex flex-col gap-4 max-w-sm"
      >
        <button
          onClick={() => router.push('/dpr/form')}
          className="w-full bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.2)] active:scale-95"
        >
          Fill another for same Scheme
        </button>
        <button
          onClick={() => {
            // Logic to clear scheme from localStorage draft if needed
            router.push('/dpr/form');
          }}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-4 rounded-2xl transition-all border border-slate-700 active:scale-95"
        >
          Fill for a Different Scheme
        </button>
      </motion.div>
    </div>
  );
}
