"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'google' | 'pin-setup' | 'pin-verify'>('google');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check if PIN already exists in localStorage to bypass Google Auth
  useEffect(() => {
    const savedPin = localStorage.getItem('dpr_pin_code');
    if (savedPin) {
      setStep('pin-verify');
    }
    setIsLoading(false);
  }, []);

  const handleGoogleLogin = () => {
    // Simulate Google Login success
    setStep('pin-setup');
  };

  const handlePinSubmit = () => {
    if (pin.length === 4) {
      if (step === 'pin-setup') {
        localStorage.setItem('dpr_pin_code', pin);
        router.push('/dpr/form');
      } else if (step === 'pin-verify') {
        const savedPin = localStorage.getItem('dpr_pin_code');
        if (pin === savedPin) {
          router.push('/dpr/form');
        } else {
          // Trigger shake animation for error
          const el = document.getElementById('pin-dots');
          if (el) {
            el.classList.add('shake-error');
            setTimeout(() => el.classList.remove('shake-error'), 400);
          }
          setPin('');
        }
      }
    }
  };

  const handleKeyPress = (num: number) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === 4) {
      setTimeout(handlePinSubmit, 200);
    }
  }, [pin]);

  if (isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <AnimatePresence mode="wait">
        {step === 'google' && (
          <motion.div
            key="google-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-sm"
          >
            <div className="relative rounded-[32px] overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-sky-400/20 shadow-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-slate-400 text-sm mb-8">Authorize with your corporate Google account to continue.</p>
              
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-semibold py-4 px-6 rounded-2xl transition-all shadow-md active:scale-95"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Continue with Google
              </button>
            </div>
          </motion.div>
        )}

        {(step === 'pin-setup' || step === 'pin-verify') && (
          <motion.div
            key="pin-step"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm"
          >
            <div className="relative rounded-[32px] overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-sky-400/20 shadow-2xl p-8 text-center flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {step === 'pin-setup' ? 'Set Offline PIN' : 'Enter PIN'}
              </h2>
              <p className="text-slate-400 text-sm mb-8">
                {step === 'pin-setup' ? 'Create a 4-digit PIN for quick field access.' : 'Welcome back. Enter your 4-digit PIN.'}
              </p>

              {/* PIN Dots */}
              <div id="pin-dots" className="flex justify-center gap-4 mb-10">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      i < pin.length 
                        ? 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] scale-110' 
                        : 'bg-slate-700/50 border border-slate-600'
                    }`}
                  />
                ))}
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-[240px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num)}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium text-white bg-white/5 hover:bg-white/10 active:bg-sky-500/20 transition-colors mx-auto active:scale-90"
                  >
                    {num}
                  </button>
                ))}
                <div className="w-16 h-16"></div> {/* Empty spot */}
                <button
                  onClick={() => handleKeyPress(0)}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium text-white bg-white/5 hover:bg-white/10 active:bg-sky-500/20 transition-colors mx-auto active:scale-90"
                >
                  0
                </button>
                <button
                  onClick={handleDelete}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-slate-300 bg-white/5 hover:bg-white/10 active:bg-red-500/20 transition-colors mx-auto active:scale-90"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                  </svg>
                </button>
              </div>

              {/* Custom CSS for Shake Error */}
              <style jsx>{`
                .shake-error {
                  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                  transform: translate3d(0, 0, 0);
                }
                @keyframes shake {
                  10%, 90% { transform: translate3d(-2px, 0, 0); }
                  20%, 80% { transform: translate3d(4px, 0, 0); }
                  30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
                  40%, 60% { transform: translate3d(8px, 0, 0); }
                }
              `}</style>
            </div>
            
            {step === 'pin-verify' && (
               <button 
                onClick={() => {
                  localStorage.removeItem('dpr_pin_code');
                  setStep('google');
                  setPin('');
                }}
                className="mt-6 w-full text-center text-sm text-slate-400 hover:text-sky-400 transition-colors"
               >
                 Sign in with a different account
               </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
