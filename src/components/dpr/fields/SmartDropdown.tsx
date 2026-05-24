"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

export const SmartDropdown: React.FC<SmartDropdownProps> = ({ label, options, value, onChange, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 mb-6">
      <label className="text-sm font-bold text-slate-900 ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full text-left bg-white border-[1.5px] border-slate-900 rounded-[20px] p-4 flex justify-between items-center transition-all focus:outline-none focus:shadow-[0_4px_0_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[0_4px_0_rgba(15,23,42,1)]"
      >
        <span className={value ? 'text-slate-900 font-bold' : 'text-slate-400 font-bold'}>
          {value || 'Select an option...'}
        </span>
        <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-[#F2F5F8] border-t-[1.5px] border-slate-900 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] max-h-[85vh] flex flex-col pb-safe"
            >
              {/* Drag Handle */}
              <div className="w-full pt-4 pb-2 flex justify-center" onClick={() => setIsOpen(false)}>
                <div className="w-12 h-1.5 bg-slate-900 rounded-full" />
              </div>
              
              <div className="px-6 pb-4">
                <h3 className="text-lg font-black text-slate-900 mb-4">{label}</h3>
                
                {options.length > 10 && (
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white border-[1.5px] border-slate-900 rounded-[20px] py-3 pl-10 pr-4 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:shadow-[0_4px_0_rgba(15,23,42,1)] transition-shadow"
                    />
                    <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full text-left px-5 py-4 min-h-[54px] rounded-[20px] border-[1.5px] border-slate-900 flex items-center justify-between transition-all mb-3 ${
                        value === opt 
                          ? 'bg-[#bde0fe] shadow-[0_4px_0_rgba(15,23,42,1)] scale-[1.01]' 
                          : 'bg-white hover:shadow-[0_2px_0_rgba(15,23,42,1)] hover:translate-y-[-2px]'
                      }`}
                    >
                      <span className={`font-bold ${value === opt ? 'text-slate-900' : 'text-slate-700'}`}>{opt}</span>
                      {value === opt && (
                        <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center">
                           <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                           </svg>
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-8">No options found</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
