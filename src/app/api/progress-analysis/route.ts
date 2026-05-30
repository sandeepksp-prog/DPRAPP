import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/firebase/server';

// Note: Ensure GEMINI_API_KEY is set in your .env.local file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default_user';
    
    const snapshot = await db.ref(`dpr_app/ai_cache/${userId}/weekly_analysis`).once('value');
    if (snapshot.exists()) {
      return NextResponse.json({ success: true, analysis: snapshot.val() });
    }
    return NextResponse.json({ success: false, error: 'No cache found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetData, currentProgress, boqData, userId = "default_user" } = body;

    // Construct the context-aware prompt for the AI acting as a Project Manager
    const prompt = `
      You are an expert Civil Engineering Project Manager analyzing daily progress reports (DPR) for a JJM (Jal Jeevan Mission) project.
      
      Your goal is to perform a work-time problem analysis to calculate the best possible approach to complete the target on time, using BOQ (Bill of Quantities) standards.

      ### Provided Data
      **1. Management Weekly Target:**
      - Description: ${targetData?.description || "250m CC restoration"}
      - Target Metric: ${targetData?.metric || 250} ${targetData?.unit || "m"}
      - Days Remaining: ${targetData?.daysRemaining || 4}

      **2. Current Progress (Burn Rate):**
      - Completed so far: ${currentProgress?.completed || 80} ${targetData?.unit || "m"}
      - Days used: ${currentProgress?.daysUsed || 2}
      - Manpower currently used: ${currentProgress?.manpower || "2 Masons, 4 Helpers"}

      **3. Standard BOQ Data (per unit):**
      - Item: ${boqData?.description || "CC restoration"}
      - Standard Manpower: ${boqData?.standardManpower || "1 Mason, 2 Helpers per 40m per day"}

      ### Required Analysis:
      Based on the current burn rate vs standard BOQ rate, calculate:
      1. Can they finish the remaining target in the remaining days with the current manpower?
      2. If not, what is the exact recommended manpower increase needed to complete the target on time?
      3. What is the probability of completion (%)?
      4. Give a short, step-by-step bottleneck suggestion to speed up the work.

      Format your response EXACTLY as a raw JSON object (no markdown formatting, no code blocks).
      Example JSON Structure:
      {
        "probabilityOfCompletion": 95,
        "remainingWork": "170m in 4 days",
        "currentBurnRate": "40m/day",
        "requiredBurnRate": "42.5m/day",
        "manpowerSuggestion": "Increase to 2 Masons, 6 Helpers",
        "bottlenecks": [
          "Ensure raw materials (cement, sand) are stockpiled directly near the work zone.",
          "Add 2 extra helpers specifically for mixing and transport."
        ]
      }
    `;

    // Call Gemini API using the new @google/genai SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2, // Keep it analytical and deterministic
        responseMimeType: "application/json",
      }
    });

    const textResponse = response.text || "{}";
    let analysis;
    try {
      analysis = JSON.parse(textResponse);
      
      // Cache the result in Firebase
      try {
        await db.ref(`dpr_app/ai_cache/${userId}/weekly_analysis`).set({
          ...analysis,
          timestamp: Date.now()
        });
      } catch (cacheError) {
        console.error("Failed to write AI cache to Firebase:", cacheError);
      }
      
    } catch (e) {
      console.error("Failed to parse JSON from AI:", textResponse);
      // Fallback response if parsing fails
      analysis = {
        probabilityOfCompletion: 80,
        remainingWork: "Analysis failed to parse",
        currentBurnRate: "N/A",
        requiredBurnRate: "N/A",
        manpowerSuggestion: "Maintain current pace",
        bottlenecks: ["AI response formatting error"]
      };
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error("Error in progress-analysis route:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
