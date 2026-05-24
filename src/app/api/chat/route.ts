import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Global In-Memory Cache for raw database
let globalSchemesCache: any = null;

// Initialize Google Generative AI natively
const genAI = new GoogleGenerativeAI(process.env.SPL_AI_KEY || process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { message, history, context } = await req.json();

        // Convert history for native Gemini SDK
        let geminiHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content.replace(/```json\n\{\n  "type": "chart"[\s\S]*?\n\}\n```/g, "[Chart Rendered in UI]") }]
        }));

        // Gemini native SDK requires history to start with 'user'
        if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
            geminiHistory.shift();
        }

        const systemPrompt = `You are Agentic PICO, an elite AI data analyst for KSPPL's internal ERP created by Sandeep for JJM operations and project management. You are connected to a dynamic BOQ database tool.
        
CRITICAL RULES:
1. RESPECT: Start your initial response with "Yes sir", "Sure sir", or "Right away sir".
2. CRISP & CLEVER: Keep your responses concise and intelligent. Use bullet points and **bold text**.
3. NEVER guess data. Always use your provided tools to query the database.
4. If a user asks for visual insights or a chart (e.g., 'show me a pie chart of block-wise expenditure'), you MUST output a specific JSON block at the very end of your response. Do NOT use markdown images.
Output exactly this JSON format:
\`\`\`json
{
  "type": "chart",
  "chartType": "bar",
  "data": [
     {"name": "SCHEME 1", "value": 100},
     {"name": "SCHEME 2", "value": 200}
  ],
  "title": "Chart Title Here"
}
\`\`\`
Note: "chartType" can be "bar" or "pie".
5. Use the "pre_calculated_totals" exactly as provided. Do not do math yourself.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: systemPrompt,
            tools: [{
                functionDeclarations: [
                    {
                        name: "get_scheme_summary",
                        description: "Queries the database for total financial allocations (boq values/costs) and scheme summaries. Use when asked for block-wise expenditure, total schemes, or overall financial analysis.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                block_name: { type: "STRING", description: "The name of the block (e.g. JALESAR, SAKIT, ALIGANJ)" },
                                scheme_name: { type: "STRING", description: "Optional. Specific scheme name." }
                            },
                            required: ["block_name"]
                        }
                    },
                    {
                        name: "get_boq_item_details",
                        description: "Queries the database for granular physical quantities of specific items (e.g., sluice valves, pipes) across schemes.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                block_name: { type: "STRING", description: "The name of the block (e.g. JALESAR)" },
                                item_keyword: { type: "STRING", description: "The physical item to search (e.g. 'sluice valve', 'hdpe pipe')" }
                            },
                            required: ["block_name", "item_keyword"]
                        }
                    }
                ]
            }]
        });

        const chat = model.startChat({ history: geminiHistory });
        console.log("Sending message to Gemini:", message);
        
        let result: any = null;
        const MAX_RETRIES = 2;
        for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
            try {
                result = await chat.sendMessage(message);
                break;
            } catch (error: any) {
                const msg = error.message || '';
                const isQuota = msg.includes('429') || msg.includes('quota');
                const isOverload = msg.includes('503');
                console.error(`PICO Error (attempt ${attempt}):`, msg.substring(0, 200));
                
                // Parse Google's suggested retry delay
                const retryMatch = msg.match(/retry in ([\d.]+)s/);
                const googleDelay = retryMatch ? parseFloat(retryMatch[1]) : 0;
                
                // If quota says wait > 30s, it's a daily limit — don't hang, fail fast with a helpful message
                if (isQuota && googleDelay > 30) {
                    return new Response(JSON.stringify({ error: 'quota_exhausted' }), { 
                        status: 429, 
                        headers: { 'Content-Type': 'application/json' } 
                    });
                }
                
                if (attempt > MAX_RETRIES || (!isQuota && !isOverload)) throw error;
                const delay = isQuota && googleDelay > 0 ? Math.ceil(googleDelay * 1000) + 1000 : 3000;
                console.log(`Retrying in ${delay/1000}s...`);
                await new Promise(res => setTimeout(res, delay));
            }
        }

        const calls = result.response.functionCalls();
        console.log("Gemini Response Function Calls:", JSON.stringify(calls));
        
        let finalStream: any;

        // Fetch raw database using in-memory global cache
        if (!globalSchemesCache) {
            console.log("Downloading schemes database into memory cache...");
            const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://kspl-pmx-default-rtdb.firebaseio.com";
            const res = await fetch(`${dbUrl}/schemes.json`);
            globalSchemesCache = await res.json();
        }
        const allSchemes = globalSchemesCache;

        // Process Tool Calls
        if (calls && calls.length > 0) {
            const call = calls[0];
            const args = call.args as any;
            
            const schemeTotals: Record<string, number> = {};
            const diaTotals: Record<string, Record<string, number>> = {};
            let rawCount = 0;

            if (call.name === "get_scheme_summary") {
                const blockArgs = (args.block_name || "").toUpperCase();
                
                for (const [id, schemeObj] of Object.entries(allSchemes)) {
                    const scheme = schemeObj as any;
                    let schemeBlock = (scheme.block_name || scheme.block || "UNKNOWN").toUpperCase();
                    // Normalization
                    if (schemeBlock === "NIDHAULIKALAN" || schemeBlock === "NIDHAULI_KALAN") schemeBlock = "NIDHAULI KALAN";
                    if (schemeBlock === "MAREHRA" || schemeBlock === "MARERA") schemeBlock = "MARHERA";
                    if (schemeBlock === "JAITRA" || schemeBlock === "JAITHARA") schemeBlock = "JAITHRA";
                    if (schemeBlock === "SAKEET") schemeBlock = "SAKIT";

                    if (schemeBlock === blockArgs) {
                        const sName = scheme.scheme_name || scheme.name || "Unknown";
                        if (args.scheme_name && !sName.toLowerCase().includes(args.scheme_name.toLowerCase())) continue;

                        const totalVal = parseFloat(scheme.total_amount || scheme.amount || 0);
                        if (totalVal > 0) {
                            schemeTotals[sName] = totalVal;
                            rawCount++;
                        }
                    }
                }
            } else if (call.name === "get_boq_item_details") {
                const blockArgs = (args.block_name || "").toUpperCase();
                const itemArgs = (args.item_keyword || "").toLowerCase().replace(/s$/i, "");

                for (const [id, schemeObj] of Object.entries(allSchemes)) {
                    const scheme = schemeObj as any;
                    let schemeBlock = (scheme.block_name || scheme.block || "UNKNOWN").toUpperCase();
                    // Normalization
                    if (schemeBlock === "NIDHAULIKALAN" || schemeBlock === "NIDHAULI_KALAN") schemeBlock = "NIDHAULI KALAN";
                    if (schemeBlock === "MAREHRA" || schemeBlock === "MARERA") schemeBlock = "MARHERA";
                    if (schemeBlock === "JAITRA" || schemeBlock === "JAITHARA") schemeBlock = "JAITHRA";
                    if (schemeBlock === "SAKEET") schemeBlock = "SAKIT";

                    if (schemeBlock === blockArgs && scheme.headings) {
                        for (const heading of Object.values(scheme.headings)) {
                            if ((heading as any).items) {
                                for (const lineItem of Object.values((heading as any).items)) {
                                    const desc = ((lineItem as any).description || (lineItem as any).item_name || "").toLowerCase();
                                    const qty = parseFloat((lineItem as any).boq_qty || (lineItem as any).qty || 0);
                                    
                                    let isMatch = false;
                                    if (desc.includes(itemArgs)) {
                                        isMatch = true;
                                        // INTELLIGENT FILTERING
                                        if (itemArgs === "sluice valve") {
                                            if (desc.includes("chamber") || desc.includes("fire hydrant") || desc.includes("dismantling") || desc.includes("surface box")) {
                                                isMatch = false;
                                            }
                                        }
                                    }

                                    if (qty > 0 && isMatch) {
                                        rawCount++;
                                        const sName = scheme.scheme_name || scheme.name || "Unknown";
                                        schemeTotals[sName] = (schemeTotals[sName] || 0) + qty;
                                        
                                        // DIA WISE EXTRACTION
                                        let diaMatch = desc.match(/(\d+)\s*mm/i);
                                        let diaKey = diaMatch ? `${diaMatch[1]} mm` : "Other";
                                        if (!diaTotals[diaKey]) diaTotals[diaKey] = {};
                                        diaTotals[diaKey][sName] = (diaTotals[diaKey][sName] || 0) + qty;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            const functionResponseData = {
                message: `Found ${rawCount} matching elements. IMPORTANT: DO NOT do math yourself. Output the pre_calculated_totals EXACTLY as provided.`,
                pre_calculated_totals: schemeTotals,
                ...(Object.keys(diaTotals).length > 0 ? { dia_breakdown: diaTotals } : {})
            };

            let pass2Result: any = null;
            for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
                try {
                    pass2Result = await chat.sendMessageStream([{
                        functionResponse: { name: call.name, response: functionResponseData }
                    }]);
                    break;
                } catch (error: any) {
                    const msg = error.message || '';
                    const isQuota = msg.includes('429') || msg.includes('quota');
                    const isOverload = msg.includes('503');
                    console.error(`PICO Stream Error (attempt ${attempt}):`, msg.substring(0, 200));
                    
                    const retryMatch = msg.match(/retry in ([\d.]+)s/);
                    const googleDelay = retryMatch ? parseFloat(retryMatch[1]) : 0;
                    
                    if (isQuota && googleDelay > 30) {
                        return new Response(JSON.stringify({ error: 'quota_exhausted' }), { 
                            status: 429, 
                            headers: { 'Content-Type': 'application/json' } 
                        });
                    }
                    
                    if (attempt > MAX_RETRIES || (!isQuota && !isOverload)) throw error;
                    const delay = isQuota && googleDelay > 0 ? Math.ceil(googleDelay * 1000) + 1000 : 3000;
                    console.log(`Stream retrying in ${delay/1000}s...`);
                    await new Promise(res => setTimeout(res, delay));
                }
            }
            finalStream = pass2Result!.stream;

        } else {
            // For standard follow-up questions
            const text = result.response.text();
            finalStream = [{ text: () => text }];
        }

        // Stream back to client
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                
                try {
                    for await (const chunk of finalStream) {
                        let chunkText = typeof chunk.text === 'function' ? chunk.text() : chunk.text;
                        if (chunkText) {
                            controller.enqueue(encoder.encode(chunkText));
                        }
                    }
                } catch (e) {
                    controller.error(e);
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" }
        });

    } catch (err: any) {
        console.error("API error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
