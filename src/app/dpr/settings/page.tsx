"use client";

import React, { useState, useEffect } from 'react';
import { User, Lock, LogOut, Info, ArrowLeft, X, Edit3, Save, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from '@/components/dpr/UserAvatar';

export default function DPRSettings() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [editProfile, setEditProfile] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<'NONE' | 'ACCOUNT' | 'PIN'>('NONE');
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [accountSuccess, setAccountSuccess] = useState(false);

  useEffect(() => {
    if (activeModal === 'ACCOUNT' && profile) {
      setEditProfile(profile);
    }
  }, [activeModal, profile]);

  useEffect(() => {
    const saved = localStorage.getItem('dpr_user_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('dpr_user_profile');
    localStorage.removeItem('dpr_pin_code');
    router.push('/dpr/login');
  };

  const handleUpdatePin = () => {
    if (newPin.length === 4) {
      localStorage.setItem('dpr_pin_code', newPin);
      setPinSuccess(true);
      setTimeout(() => {
        setPinSuccess(false);
        setActiveModal('NONE');
        setNewPin('');
      }, 1500);
    }
  };

  const handleUpdateAccount = () => {
    if (editProfile) {
      localStorage.setItem('dpr_user_profile', JSON.stringify(editProfile));
      setProfile(editProfile);
      setAccountSuccess(true);
      setTimeout(() => {
        setAccountSuccess(false);
        setActiveModal('NONE');
      }, 1500);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-[#F2F5F8] min-h-screen relative flex flex-col overflow-x-hidden shadow-2xl">
        
        {/* HEADER - NEO BRUTALIST */}
        <div className="px-6 pt-10 pb-6 border-b-[1.5px] border-slate-900 bg-white shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center shrink-0 text-slate-900 transition-all"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                Settings & Profile
              </h1>
              <p className="text-slate-500 text-[11px] font-bold tracking-widest uppercase mt-0.5">
                Manage your account
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6 relative z-0 pb-24">
          
          {/* Profile Card */}
          <div className="bg-white rounded-[20px] p-6 border-[1.5px] border-slate-900 shadow-[0_4px_0_rgba(15,23,42,1)] flex flex-col items-center text-center relative overflow-hidden">
             {/* Gradient Blending Banner */}
             <div className="w-full h-32 bg-gradient-to-b from-[#bde0fe] via-[#bde0fe]/60 to-transparent absolute top-0 left-0 right-0 z-0" />
             
             <div className="w-24 h-24 rounded-full bg-[#F2F5F8] flex items-center justify-center border-[1.5px] border-slate-900 shadow-[0_2px_0_rgba(15,23,42,1)] relative z-10 mt-6 overflow-hidden">
               {profile?.avatar ? (
                 <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <UserAvatar seed={profile?.name || "User"} gender={profile?.gender || "male"} size={96} className="w-full h-full" />
               )}
             </div>
             <h2 className="text-2xl font-black text-slate-900 mt-4 relative z-10 uppercase">{profile?.name || 'Loading...'}</h2>
             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest relative z-10">{profile?.branch || 'Branch'}</p>
             <p className="text-xs text-slate-900 bg-[#ffc8dd] px-3 py-1 rounded-full border-[1.5px] border-slate-900 font-bold mt-3 relative z-10 shadow-[0_2px_0_rgba(15,23,42,1)]">ID: {profile?.employeeId || '---'}</p>
          </div>

          {/* Options Menu */}
          <div className="bg-white rounded-[20px] border-[1.5px] border-slate-900 shadow-[0_4px_0_rgba(15,23,42,1)] overflow-hidden flex flex-col">
            <button 
              onClick={() => setActiveModal('ACCOUNT')}
              className="w-full px-6 py-5 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b-[1.5px] border-slate-900 text-left active:bg-slate-100"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#bde0fe] border-[1.5px] border-slate-900 text-slate-900 flex items-center justify-center shadow-[0_2px_0_rgba(15,23,42,1)] shrink-0">
                <User size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="font-black text-slate-900 text-sm uppercase tracking-wide">Account Details</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">View your stored identity</div>
              </div>
            </button>

            <button 
              onClick={() => setActiveModal('PIN')}
              className="w-full px-6 py-5 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b-[1.5px] border-slate-900 text-left active:bg-slate-100"
            >
              <div className="w-10 h-10 rounded-2xl bg-white border-[1.5px] border-slate-900 text-slate-900 flex items-center justify-center shadow-[0_2px_0_rgba(15,23,42,1)] shrink-0">
                <Lock size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="font-black text-slate-900 text-sm uppercase tracking-wide">Change PIN</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Update 4-digit access code</div>
              </div>
            </button>

            <div className="w-full px-6 py-5 flex items-center gap-4 text-left bg-slate-50">
              <div className="w-10 h-10 rounded-2xl bg-white border-[1.5px] border-slate-900 text-slate-400 flex items-center justify-center shadow-[0_2px_0_rgba(15,23,42,1)] shrink-0">
                <Info size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="font-black text-slate-900 text-sm uppercase tracking-wide">App Version</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">KSPPL 1.0</div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-[#ffadad] text-slate-900 border-[1.5px] border-slate-900 rounded-[20px] font-black tracking-wider uppercase flex justify-center items-center gap-2 hover:bg-[#ff9999] transition-all shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
          >
            <LogOut size={20} strokeWidth={2.5} />
            Sign Out
          </button>
        </div>

        {/* MODALS */}
        <AnimatePresence>
          {activeModal !== 'NONE' && (
            <div className="absolute inset-0 z-50 flex items-end justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto"
                onClick={() => setActiveModal('NONE')}
              />
              
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="bg-white w-full rounded-t-[32px] border-t-[1.5px] border-slate-900 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pt-8 relative z-10 pointer-events-auto flex flex-col max-h-[85vh]"
              >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full" />
                
                <button 
                  onClick={() => setActiveModal('NONE')}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <X size={18} strokeWidth={3} />
                </button>

                {activeModal === 'ACCOUNT' && (
                  <div className="flex flex-col flex-1 overflow-y-auto mt-4 pb-10">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">Account Details</h3>
                    <div className="space-y-4">
                      {editProfile ? (
                        <>
                          <div className="bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[16px] p-4 relative focus-within:bg-white focus-within:shadow-[0_4px_0_rgba(15,23,42,1)] transition-all">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Full Name</label>
                            <input 
                              type="text" 
                              value={editProfile.name} 
                              onChange={e => setEditProfile({...editProfile, name: e.target.value})}
                              className="w-full bg-transparent font-black text-slate-900 text-base focus:outline-none" 
                            />
                          </div>
                          <div className="bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[16px] p-4 relative focus-within:bg-white focus-within:shadow-[0_4px_0_rgba(15,23,42,1)] transition-all">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Employee ID</label>
                            <input 
                              type="text" 
                              value={editProfile.employeeId} 
                              onChange={e => setEditProfile({...editProfile, employeeId: e.target.value})}
                              className="w-full bg-transparent font-black text-slate-900 text-base focus:outline-none" 
                            />
                          </div>
                          <div className="bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[16px] p-4 relative focus-within:bg-white focus-within:shadow-[0_4px_0_rgba(15,23,42,1)] transition-all">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Branch</label>
                            <input 
                              type="text" 
                              value={editProfile.branch} 
                              onChange={e => setEditProfile({...editProfile, branch: e.target.value})}
                              className="w-full bg-transparent font-black text-slate-900 text-base focus:outline-none" 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[16px] p-4 relative focus-within:bg-white focus-within:shadow-[0_4px_0_rgba(15,23,42,1)] transition-all">
                              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Age</label>
                              <input 
                                type="number" 
                                value={editProfile.age} 
                                onChange={e => setEditProfile({...editProfile, age: e.target.value})}
                                className="w-full bg-transparent font-black text-slate-900 text-base focus:outline-none" 
                              />
                            </div>
                            <div className="bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[16px] p-4 relative focus-within:bg-white focus-within:shadow-[0_4px_0_rgba(15,23,42,1)] transition-all">
                              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Gender</label>
                              <select 
                                value={editProfile.gender} 
                                onChange={e => setEditProfile({...editProfile, gender: e.target.value})}
                                className="w-full bg-transparent font-black text-slate-900 text-base capitalize focus:outline-none appearance-none" 
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            <button
                              onClick={handleUpdateAccount}
                              disabled={accountSuccess}
                              className="w-full py-4 bg-[#bde0fe] hover:bg-[#a2d2ff] text-slate-900 border-[1.5px] border-slate-900 rounded-[20px] font-black tracking-wider uppercase flex justify-center items-center gap-2 transition-all shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none disabled:bg-slate-200 disabled:shadow-none mt-2"
                            >
                              {accountSuccess ? (
                                <><CheckCircle2 size={20} strokeWidth={3} /> SAVED</>
                              ) : (
                                <><Save size={20} strokeWidth={2.5} /> SAVE CHANGES</>
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                         <p className="text-center font-bold text-slate-500 py-10">No profile found.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeModal === 'PIN' && (
                  <div className="flex flex-col flex-1 mt-4 pb-10">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Change PIN</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Enter a new 4-digit security PIN</p>
                    
                    <div className="space-y-6">
                      <div>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full bg-[#F2F5F8] border-[1.5px] border-slate-900 rounded-[16px] px-4 py-4 text-center text-3xl tracking-[1em] font-black text-slate-900 focus:outline-none focus:bg-white focus:shadow-[0_4px_0_rgba(15,23,42,1)] transition-all"
                          placeholder="••••"
                        />
                      </div>
                      
                      <button
                        onClick={handleUpdatePin}
                        disabled={newPin.length !== 4 || pinSuccess}
                        className="w-full py-4 bg-[#bde0fe] hover:bg-[#a2d2ff] text-slate-900 border-[1.5px] border-slate-900 rounded-[20px] font-black tracking-wider uppercase flex justify-center items-center gap-2 transition-all shadow-[0_4px_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none disabled:bg-slate-200 disabled:shadow-none"
                      >
                        {pinSuccess ? (
                          <><CheckCircle2 size={20} strokeWidth={3} /> UPDATED</>
                        ) : (
                          <><Save size={20} strokeWidth={2.5} /> SAVE PIN</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
