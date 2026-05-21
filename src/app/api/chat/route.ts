import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase/server";

// Mark this route as dynamic so it doesn't try to statically build
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history = [], context = {} } = body;
        const { activeTab = "summary", activeSchemeId = null, activeBranch = "UP" } = context;

        // 1. Fetch live grounding data from Firebase Database if activeSchemeId is selected
        let schemeData: any = null;
        let raRecords: any = null;

        if (activeSchemeId) {
            try {
                const schemeSnapshot = await db.ref(`schemes/${activeSchemeId}`).once("value");
                if (schemeSnapshot.exists()) {
                    schemeData = schemeSnapshot.val();
                }

                const raSnapshot = await db.ref(`billing/ra_records/${activeSchemeId}`).once("value");
                if (raSnapshot.exists()) {
                    raRecords = raSnapshot.val();
                }
            } catch (fbErr) {
                console.error("Firebase grounding fetch failed:", fbErr);
            }
        }

        // 2. Formulate highly detailed, contextual system instructions
        let schemeInfoPrompt = "";
        if (schemeData) {
            schemeInfoPrompt = `
ACTIVE SCHEME REAL-TIME CONTEXT:
- Scheme Name: "${schemeData.scheme_name || "Unknown Scheme"}"
- Scheme ID: ${activeSchemeId}
- Block: "${schemeData.block_name || "ALIGANJ"}"
- District: "ETAH"
- Overall Status: "${schemeData.status || "ACTIVE"}"
- Physical Progress Metrics:
  - FHTC Target: ${schemeData.fhtc_target || 0}
  - FHTC Executed: ${schemeData.fhtc_executed || 0}
  - Pipe Laying Target: ${schemeData.pipe_target || 0} meters
  - Pipe Laying Executed: ${schemeData.pipe_executed || 0} meters
  - Boundary Wall: "${schemeData.boundary_wall || "N/A"}"
  - Pump House status: "${schemeData.pump_house || "N/A"}"
  - OHT (Overhead Tank): "${schemeData.oht || "N/A"}"
`;
            
            if (raRecords) {
                let raCount = 0;
                let totalBillingAmt = 0;
                // Parse RA billing records
                Object.values(raRecords).forEach((divRecords: any) => {
                    Object.values(divRecords).forEach((ra: any) => {
                        if (ra.status === 'SUBMITTED' || ra.status === 'APPROVED') {
                            raCount++;
                            totalBillingAmt += parseFloat(ra.grossAmount) || parseFloat(ra.netAmount) || 0;
                        }
                    });
                });
                schemeInfoPrompt += `- RA Billing Metrics:
  - Number of Active/Submitted RA Bills: ${raCount}
  - Total Gross Amount Billed: ₹${(totalBillingAmt / 100000).toFixed(2)} Lakhs (approx ₹${totalBillingAmt.toLocaleString('en-IN')})
`;
            }
        } else {
            schemeInfoPrompt = `
ACTIVE SCHEME REAL-TIME CONTEXT:
- No scheme is currently focused. The user is browsing overall block-level dashboards.
`;
        }

        const systemInstruction = `
You are the "JJM PMX Copilot", an elite, context-aware AI operations assistant built specifically for Keystone Infra & Engineering (KSPPL) to coordinate and monitor "Jal Jeevan Mission" (JJM) water supply projects.

Your objective is to provide project managers, super admins, and billing engineers with ultra-precise, data-driven operational insights.

OPERATIONAL PARAMETERS & LIVE CONTEXT:
- Active Branch: ${activeBranch === "UP" ? "Uttar Pradesh (Etah Branch) - ACTIVE" : "Kerala (Alappuzha Branch) - WORK SUSPENDED / LOCKED"}
- Active Tab View: "${activeTab}" (User is currently looking at the ${
            activeTab === "summary" 
                ? "Overall Operations Executive Summary" 
                : activeTab === "scheme" 
                ? "Work Progress Dashboard View" 
                : activeTab === "store" 
                ? "Store Inventory & Stock Ledger View" 
                : activeTab === "billing" 
                ? "RA Billing & Financial Summary View" 
                : activeTab === "employee" 
                ? "Staff Attendance & HR Directory" 
                : activeTab === "issues" 
                ? "Site Issues & Red-flag Resolution Board" 
                : activeTab
        } screen)
${schemeInfoPrompt}

SPECIAL RULES & CONSTRAINTS:
1. KERALA PROJECT STATUS: If activeBranch is "KERALA", immediately inform the user politely that all operations in the Alappuzha, Kerala branch are currently halted and site activities are suspended. No data edits or updates can occur until the freeze is lifted.
2. CRITICAL TRUTH & GROUNDING: Ground your answers entirely in the live context provided above. Always prioritize numbers, percentages, and metrics. If the user asks about a specific scheme or record that is not in the live context, state clearly that you do not have that specific record loaded, but answer using general project principles.
3. MATHEMATICAL COMPUTATIONS: If requested to compute run rates, forecasts, or BOQ vs EQ variances, calculate them precisely based on the provided numbers. (e.g. if Pipe Target is 10,000m and Executed is 4,000m, completion is exactly 40% and remaining is 60%).
4. DESIGN AND PRESENTATION: Use compact Markdown tables, clear bullet points, and bold text headers to format reports. Never write long paragraphs of text. Make it look like a premium administrative dashboard readout (like an OS report). Keep answers professional, concise, and direct.
5. NO EXPOSURE: Do not expose raw API keys, database paths, or service credentials under any circumstances.
`;

        // 3. Initialize Gemini
        const apiKey = process.env.SPL_AI_KEY;
        if (!apiKey) {
            return new Response("Missing SPL_AI_KEY in server environment.", { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction,
        });

        // 4. Map client history to Gemini format and start chat
        const geminiHistory = history
            .filter((h: any) => h.role === "user" || h.role === "assistant")
            .map((h: any) => ({
                role: h.role === "user" ? "user" : "model",
                parts: [{ text: h.content }],
            }));

        const chat = model.startChat({
            history: geminiHistory,
        });

        // 5. Send message and obtain streaming response
        const result = await chat.sendMessageStream(message);

        // 6. Return standard ReadableStream for Server-Sent completion
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        if (text) {
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                } catch (streamErr) {
                    console.error("Error streaming tokens from Gemini:", streamErr);
                    controller.error(streamErr);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });

    } catch (err: any) {
        console.error("Chat API route error:", err);
        return new Response(
            JSON.stringify({ error: err.message || "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
