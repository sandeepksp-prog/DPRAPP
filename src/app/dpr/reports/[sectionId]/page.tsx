"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import { DPR_FORM_SCHEMA } from '@/config/dpr-schema';

// We import the same components but we'll apply the light theme styling dynamically or update them
import { SmartDropdown } from '@/components/dpr/fields/SmartDropdown';
import { GPSCapture } from '@/components/dpr/fields/GPSCapture';
import { PhotoUpload } from '@/components/dpr/fields/PhotoUpload';

// We will map the sectionId to the actual schema sections
const sectionMapping: Record<string, string[]> = {
  header: ['header'],
  civil: ['civil_selection', 'oht_details', 'pump_house_details'],
  pipeline: ['pipeline_details'],
  em: ['em_details'],
  tpi: ['tpi_details'],
  contractor: ['contractor_labor'],
  issue: ['issue_report']
};

export default function SectionPage({ params }: { params: { sectionId: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const targetSchemaIds = sectionMapping[params.sectionId];
  const sections = DPR_FORM_SCHEMA.filter(s => targetSchemaIds?.includes(s.id));

  if (!sections || sections.length === 0) {
    return <div className="p-8 text-center text-slate-500">Section not found.</div>;
  }

  const handleFieldChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Quick light-themed renderer for simple fields
  const renderLightField = (field: any) => {
    const value = formData[field.id];
    
    // For specific custom fields, we can wrap them in a light container or update the components directly later
    if (field.type === 'dropdown') {
      return (
        <div key={field.id} className="mb-6">
          <SmartDropdown label={field.label} options={field.options || []} value={value || ''} onChange={(val) => handleFieldChange(field.id, val)} required={field.required} />
        </div>
      );
    }
    
    if (field.type === 'gps') {
      return (
        <div key={field.id} className="mb-6">
           <GPSCapture label={field.label} value={value} onChange={(val) => handleFieldChange(field.id, val)} required={field.required} />
        </div>
      );
    }
    
    if (field.type === 'file') {
      return (
        <div key={field.id} className="mb-6">
           <PhotoUpload label={field.label} value={value || []} onChange={(val) => handleFieldChange(field.id, val)} required={field.required} />
        </div>
      );
    }

    if (field.type === 'radio' || field.type === 'multicheck') {
       return (
         <div key={field.id} className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-bold text-slate-900 ml-1">
              {field.label} {field.required && <span className="text-rose-500">*</span>}
            </label>
            <div className={`grid gap-3 p-1`}>
              {field.options?.map((opt: string) => {
                const isSelected = field.type === 'radio' ? value === opt : Array.isArray(value) && value.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      if (field.type === 'radio') {
                         handleFieldChange(field.id, opt);
                      } else {
                         let arr = Array.isArray(value) ? [...value] : [];
                         if (isSelected) arr = arr.filter(v => v !== opt);
                         else arr.push(opt);
                         handleFieldChange(field.id, arr);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-[20px] border-[1.5px] border-slate-900 transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-white shadow-[0_4px_0_rgba(15,23,42,1)] scale-[1.01]' 
                        : 'bg-white/50 hover:bg-white hover:shadow-[0_2px_0_rgba(15,23,42,1)] hover:translate-y-[-2px]'
                    }`}
                  >
                    <span className={`font-bold ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{opt}</span>
                    <div className={`w-6 h-6 rounded-full border-[1.5px] border-slate-900 flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-slate-900' : 'bg-white'
                    }`}>
                      {isSelected && field.type === 'radio' && <div className="w-2 h-2 bg-white rounded-full" />}
                      {isSelected && field.type === 'multicheck' && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
       )
    }

    // Default text/number/date
    return (
      <div key={field.id} className="flex flex-col gap-2 mb-6">
        <label className="text-sm font-bold text-slate-900 ml-1">
          {field.label} {field.required && <span className="text-rose-500">*</span>}
        </label>
        <input
          type={field.type}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleFieldChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
          className={`w-full bg-white border-[1.5px] border-slate-900 rounded-[20px] p-4 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-0 focus:shadow-[0_4px_0_rgba(15,23,42,1)] transition-all`}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F2F5F8] pb-24">
      {/* Header */}
      <div className="bg-[#F2F5F8]/90 backdrop-blur-md px-6 py-6 sticky top-0 z-20 flex items-center justify-between md:pt-10">
        <button 
          onClick={() => router.push('/dpr/reports')}
          className="w-10 h-10 rounded-full border-[1.5px] border-slate-900 bg-white flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors shadow-[0_2px_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-black text-slate-900 tracking-tight capitalize">
          {params.sectionId}
        </h1>
        <button className="w-10 h-10 rounded-full border-[1.5px] border-slate-900 flex items-center justify-center text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-[0_2px_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-0.5">
          <Save size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {sections.map((section, idx) => {
          // Cycle through pastels for section background
          const pastels = ['bg-[#bde0fe]', 'bg-[#ffc8dd]', 'bg-[#fcf6bd]', 'bg-[#d8f3dc]'];
          const bg = pastels[idx % pastels.length];
          
          return (
          <div key={section.id} className={`${bg} rounded-[32px] border-[1.5px] border-slate-900 shadow-[0_4px_0_rgba(15,23,42,1)] p-6 relative overflow-hidden mb-6`}>
             <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white border border-slate-900 flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                {section.title}
             </h2>
             
             {section.fields.map(renderLightField)}
          </div>
        )})}
      </div>
    </div>
  );
}
