"use client";

import React, { useState, useEffect } from 'react';
import { Zap, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface AnalysisResult {
  probabilityOfCompletion: number;
  remainingWork: string;
  currentBurnRate: string;
  requiredBurnRate: string;
  manpowerSuggestion: string;
  bottlenecks: string[];
}

export default function ProgressAnalysisBlock() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        // In a real app, you would pass the employee's ID and current target here
        const response = await fetch('/api/progress-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetData: { description: "250m CC restoration at Sarnau", metric: 250, unit: "m", daysRemaining: 4 },
            currentProgress: { completed: 80, daysUsed: 2, manpower: "2 Masons, 4 Helpers" },
            boqData: { description: "CC restoration", standardManpower: "1 Mason, 2 Helpers per 40m per day" }
          })
        });
        
        const data = await response.json();
        if (data.success && data.analysis) {
          setAnalysis(data.analysis);
        } else {
          throw new Error("Failed to get successful response from AI");
        }
      } catch (error) {
        console.error("Error fetching analysis:", error);
        // Fallback data if API fails or no API key is present
        setAnalysis({
          probabilityOfCompletion: 80,
          remainingWork: "170m in 4 days",
          currentBurnRate: "40m/day",
          requiredBurnRate: "42.5m/day",
          manpowerSuggestion: "Increase to 2 Masons, 6 Helpers",
          bottlenecks: ["Ensure raw materials are stockpiled near the work zone."]
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#ffc8dd] border-[1.5px] border-slate-900 rounded-[24px] p-5 relative overflow-hidden shadow-[0_4px_0_rgba(15,23,42,1)] animate-pulse h-[260px]">
        <div className="h-4 w-1/3 bg-slate-900/10 rounded mb-4"></div>
        <div className="h-20 w-full bg-white/50 border-[1.5px] border-slate-900 rounded-[16px] mb-3"></div>
        <div className="h-4 w-full bg-slate-900/10 rounded mb-2"></div>
        <div className="h-10 w-full bg-slate-900/10 rounded mt-4"></div>
      </div>
    );
  }

  const prob = analysis?.probabilityOfCompletion || 0;
  const isAtRisk = prob < 75;

  return (
    <Link href="/dpr/this-week" className="block">
      <div className="w-full bg-[#ffc8dd] border-[1.5px] border-slate-900 rounded-[24px] p-5 relative overflow-hidden shadow-[0_4px_0_rgba(15,23,42,1)] hover:scale-[1.01] transition-transform active:translate-y-1 active:shadow-none">
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-white border border-slate-900 flex items-center justify-center">
            <Zap size={14} className="text-slate-900" strokeWidth={2.5} />
          </div>
          <span className="text-[12px] font-black text-slate-900 uppercase tracking-wide">This Week Progress</span>
        </div>

        <div className="bg-white/50 border-[1.5px] border-slate-900 rounded-[16px] p-4 mb-3">
          <p className="text-xs font-bold text-slate-800 leading-relaxed">
            Target fixed: <span className="font-black text-slate-900">250m CC restoration</span> at Sarnau.<br/>
            Current progress: <span className="font-black text-slate-900">80m CC</span> (2 Masons, 4 Helpers).<br/>
            Remaining: <span className="text-rose-600 font-black">{analysis?.remainingWork || "170m in 4 days"}</span>.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span>Probability of Completion</span>
            <span className={isAtRisk ? 'text-rose-600 font-black' : 'text-emerald-700 font-black'}>{prob}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white border-[1.5px] border-slate-900 rounded-full overflow-hidden">
             <div 
               className={`h-full border-r-[1.5px] border-slate-900 transition-all duration-1000 ${isAtRisk ? 'bg-amber-400' : 'bg-emerald-500'}`} 
               style={{ width: `${Math.max(20, prob)}%` }}
             ></div>
          </div>
          
          <p className="text-[10px] font-bold text-slate-700 mt-2 leading-tight">
            * <span className="text-slate-900 font-black">AI Insight:</span> {analysis?.manpowerSuggestion}<br/>
            {analysis?.bottlenecks && analysis.bottlenecks[0] && (
              <span>* {analysis.bottlenecks[0]}</span>
            )}
          </p>
        </div>
        
      </div>
    </Link>
  );
}
