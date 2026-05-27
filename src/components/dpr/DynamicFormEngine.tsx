"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DPR_FORM_SCHEMA, FormField, FormSection, Rule } from '@/config/dpr-schema';
import { saveDraftData, getDraftData, submitDPR } from '@/lib/firebase-dpr';
import { mockDb } from '@/lib/mock-db';

import { SmartDropdown } from './fields/SmartDropdown';
import { GPSCapture } from './fields/GPSCapture';
import { PhotoUpload } from './fields/PhotoUpload';
import SubmissionEnding from './SubmissionEnding';

export const DynamicFormEngine = () => {
  const [schema, setSchema] = useState<FormSection[]>(DPR_FORM_SCHEMA);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Inject BOQ Options from extracted/collective data dynamically
    const loadDynamicData = async () => {
      // In a real app, projectId would come from a prior selection or user profile
      const boqItems = await mockDb.getBOQItems('proj_babarpur_001');
      
      const pipelineOptions = boqItems
        .filter(item => item.category === 'Pipeline')
        .map(item => `[${item.item_code}] ${item.description}`);
      
      const civilOptions = boqItems
        .filter(item => item.category === 'Civil')
        .map(item => `[${item.item_code}] ${item.description}`);

      setSchema(prevSchema => {
        return prevSchema.map(section => ({
          ...section,
          fields: section.fields.map(field => {
            if (field.id === 'pipelineBoqItem') return { ...field, options: pipelineOptions };
            if (field.id === 'civilBoqItem') return { ...field, options: civilOptions };
            // Populate Block Name & Scheme Name as well based on available projects
            if (field.id === 'scheme') return { ...field, options: ['Babarpur Village Scheme', 'Awagarh Feeder Main'] };
            if (field.id === 'block') return { ...field, options: ['Awagarh', 'Jalesar', 'Nidhauli Kalan'] };
            return field;
          })
        }));
      });
    };
    loadDynamicData();

    const draft = getDraftData();
    if (draft) {
      setFormData(draft);
    }
  }, []);

  useEffect(() => {
    // Throttle or debounce save draft if needed, here we just save on every change
    if (Object.keys(formData).length > 0) {
      saveDraftData(formData);
    }
  }, [formData]);

  const evaluateRule = (rule: Rule): boolean => {
    const val = formData[rule.field];
    if (val === undefined || val === null) return false;

    switch (rule.operator) {
      case 'equals':
        return val === rule.value;
      case 'contains':
        if (Array.isArray(val)) {
          return val.includes(rule.value);
        }
        return false;
      case 'in':
        if (Array.isArray(rule.value)) {
          return rule.value.includes(val);
        }
        return false;
      default:
        return false;
    }
  };

  const isVisible = (showIf?: Rule[]): boolean => {
    if (!showIf || showIf.length === 0) return true;
    // AND logic for multiple rules
    return showIf.every(evaluateRule);
  };

  const visibleSections = schema.filter(section => isVisible(section.showIf));
  const currentSection = visibleSections[currentSectionIndex];

  // If section index goes out of bounds due to logic changes
  useEffect(() => {
    if (currentSectionIndex >= visibleSections.length) {
      setCurrentSectionIndex(Math.max(0, visibleSections.length - 1));
    }
  }, [visibleSections.length, currentSectionIndex]);

  const handleFieldChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => prev.filter(errId => errId !== id)); // Clear error on change
  };

  const validateCurrentSection = (): boolean => {
    if (!currentSection) return false;
    const newErrors: string[] = [];
    const visibleFields = currentSection.fields.filter(f => isVisible(f.showIf));

    visibleFields.forEach(field => {
      if (field.required) {
        const val = formData[field.id];
        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
          newErrors.push(field.id);
        }
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      // Trigger CSS shake on these specific fields
      newErrors.forEach(id => {
        const el = document.getElementById(`field-${id}`);
        if (el) {
          el.classList.add('shake-error');
          setTimeout(() => el.classList.remove('shake-error'), 500);
        }
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      if (currentSectionIndex < visibleSections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      window.scrollTo(0, 0);
      setErrors([]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitDPR(formData);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsSubmitted(true);
      setFormData({});
    } else {
      alert("Failed to submit. Please try again or check connection.");
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];
    const hasError = errors.includes(field.id);

    const errorClass = hasError ? "ring-2 ring-red-400 ring-offset-2 ring-offset-slate-900 border-red-400" : "";

    let fieldContent = null;

    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        fieldContent = (
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-semibold text-slate-300 ml-1">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              className={`w-full bg-slate-800/50 border border-slate-600 rounded-2xl p-4 text-white focus:outline-none focus:border-sky-400 focus:shadow-[0_0_15px_rgba(14,165,233,0.15)] focus:scale-[1.01] transition-all ${errorClass}`}
            />
          </div>
        );
        break;
      case 'dropdown':
        fieldContent = (
          <div className={errorClass + " rounded-2xl"}>
            <SmartDropdown 
              label={field.label} 
              options={field.options || []} 
              value={value || ''} 
              onChange={(val) => handleFieldChange(field.id, val)}
              required={field.required}
            />
          </div>
        );
        break;
      case 'radio':
        fieldContent = (
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-semibold text-slate-300 ml-1">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <div className={`grid gap-3 ${errorClass} rounded-2xl p-1`}>
              {field.options?.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleFieldChange(field.id, opt)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    value === opt 
                      ? 'bg-sky-500/10 border-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.1)] scale-[1.02]' 
                      : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <span className={value === opt ? 'text-sky-400 font-bold' : 'text-slate-300'}>{opt}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    value === opt ? 'border-sky-400' : 'border-slate-500'
                  }`}>
                    {value === opt && <div className="w-2.5 h-2.5 bg-sky-400 rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
        break;
      case 'multicheck':
        fieldContent = (
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-semibold text-slate-300 ml-1">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <div className={`flex flex-wrap gap-2 ${errorClass} rounded-2xl p-1`}>
              {field.options?.map(opt => {
                const isSelected = Array.isArray(value) && value.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      let arr = Array.isArray(value) ? [...value] : [];
                      if (isSelected) arr = arr.filter(v => v !== opt);
                      else arr.push(opt);
                      handleFieldChange(field.id, arr);
                    }}
                    className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                      isSelected 
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.15)]' 
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        );
        break;
      case 'gps':
        fieldContent = (
          <div className={errorClass + " rounded-2xl"}>
            <GPSCapture label={field.label} value={value} onChange={(val) => handleFieldChange(field.id, val)} required={field.required} />
          </div>
        );
        break;
      case 'file':
        fieldContent = (
          <div className={errorClass + " rounded-2xl"}>
            <PhotoUpload label={field.label} value={value || []} onChange={(val) => handleFieldChange(field.id, val)} required={field.required} />
          </div>
        );
        break;
      case 'grid':
        // Simplified grid for manpower
        fieldContent = (
           <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-semibold text-slate-300 ml-1">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <div className={`bg-slate-800/40 border border-slate-700 rounded-2xl p-4 flex gap-4 justify-between items-center ${errorClass}`}>
                <div className="flex flex-col">
                  <span className="text-white font-medium">Workers</span>
                  <span className="text-slate-500 text-xs">Total headcount</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleFieldChange(field.id, Math.max(0, (value || 0) - 1))}
                    className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold active:scale-90 transition-transform"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xl font-bold text-sky-400">{value || 0}</span>
                  <button 
                    onClick={() => handleFieldChange(field.id, (value || 0) + 1)}
                    className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
            </div>
           </div>
        );
        break;
      default:
        fieldContent = <div className="text-red-500 mb-6">Unknown field type: {field.type}</div>;
    }

    return (
      <div key={field.id} id={`field-${field.id}`}>
        {fieldContent}
      </div>
    );
  };

  if (isSubmitted) {
    return <SubmissionEnding />;
  }

  if (!currentSection) return <div className="p-8 text-center text-white">Loading schema...</div>;

  const progressPercent = ((currentSectionIndex + 1) / visibleSections.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 pb-24">
      {/* Fixed Header & Progress */}
      <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 pt-safe">
        <div className="px-6 py-4 flex items-center justify-between">
          <button 
            onClick={handleBack} 
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentSectionIndex > 0 ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'opacity-0 pointer-events-none'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Step {currentSectionIndex + 1} of {visibleSections.length}</h2>
            <p className="text-xs text-slate-400">{currentSection.title}</p>
          </div>
          
          <div className="w-10 h-10 flex items-center justify-center">
             {/* Small indicator for draft saving */}
             <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" title="Draft Saved Offline" />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-800 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Form Content area */}
      <div className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, x: 50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-white mb-2">{currentSection.title}</h1>
              <div className="h-1 w-12 bg-sky-500 rounded-full" />
            </div>

            {currentSection.fields.filter(f => isVisible(f.showIf)).map(renderField)}
            
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent z-20 pointer-events-none flex justify-center">
        <div className="w-full max-w-md pointer-events-auto">
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`w-full relative overflow-hidden rounded-2xl font-bold text-lg py-4 transition-all shadow-[0_0_20px_rgba(14,165,233,0.2)] flex justify-center items-center gap-2 ${
              isSubmitting ? 'bg-slate-700 text-slate-400' : 'bg-sky-500 hover:bg-sky-400 text-slate-900 hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Submitting...</span>
            ) : (
              <>
                {currentSectionIndex === visibleSections.length - 1 ? 'Submit Report' : 'Next Step'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom Shake animation CSS injected */}
      <style jsx global>{`
        .shake-error {
          animation: horizontal-shaking 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes horizontal-shaking {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        .pt-safe { padding-top: env(safe-area-inset-top); }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
};
