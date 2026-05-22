import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase/server";
import * as fs from "fs";
import { execSync } from "child_process";

// Mark this route as dynamic so it doesn't try to statically build
export const dynamic = "force-dynamic";

import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history = [], context = {} } = body;
        const { activeTab = "summary", activeSchemeId = null, activeBranch = "UP" } = context;

        const lowercaseMsg = (message || "").toLowerCase();


        // 1. Fetch all live grounding data from Firebase Database root nodes
        let allSchemes: any = {};
        let allRaRecords: any = {};
        const databaseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://kspl-pmx-default-rtdb.firebaseio.com";
        
        try {
            // Use ultra-fast direct REST calls to bypass Google OAuth2/DNS token timeouts on slow or restricted networks
            const schemesRes = await fetch(`${databaseUrl}/schemes.json`);
            if (schemesRes.ok) {
                allSchemes = await schemesRes.json() || {};
            } else {
                throw new Error(`REST schemes returned status: ${schemesRes.status}`);
            }
            
            const raRes = await fetch(`${databaseUrl}/billing/ra_records.json`);
            if (raRes.ok) {
                allRaRecords = await raRes.json() || {};
            } else {
                throw new Error(`REST billing returned status: ${raRes.status}`);
            }
        } catch (restErr) {
            console.warn("Firebase REST fetch failed, falling back to Admin SDK:", restErr);
            try {
                const schemesSnapshot = await db.ref("schemes").once("value");
                if (schemesSnapshot.exists()) {
                    allSchemes = schemesSnapshot.val();
                }
                const raSnapshot = await db.ref("billing/ra_records").once("value");
                if (raSnapshot.exists()) {
                    allRaRecords = raSnapshot.val();
                }
            } catch (fbErr) {
                console.error("Firebase overall database grounding fetch failed:", fbErr);
            }
        }

        // 1.1. Dynamic search: Detect if any scheme names are mentioned in the user query
        const mentionedSchemeIds: string[] = [];
        let mentionedSchemeBOQPrompt = "";
        
        const messageUpper = (message || "").toUpperCase();
        Object.entries(allSchemes).forEach(([id, scheme]: [string, any]) => {
            const schemeName = (scheme.scheme_name || scheme.name || "").toUpperCase();
            if (schemeName && schemeName.length > 3 && messageUpper.includes(schemeName)) {
                if (!mentionedSchemeIds.includes(id)) {
                    mentionedSchemeIds.push(id);
                }
            }
        });

        // 1.2. Load full detailed BOQ items for all target schemes (either mentioned, or fallback to active scheme)
        const targetBoqSchemeIds = mentionedSchemeIds.length > 0 ? mentionedSchemeIds : (activeSchemeId ? [String(activeSchemeId)] : []);
        for (const targetBoqSchemeId of targetBoqSchemeIds) {
            if (allSchemes[targetBoqSchemeId]) {
                try {
                    const detailResponse = await fetch(`${databaseUrl}/schemes/${targetBoqSchemeId}.json`);
                    if (detailResponse.ok) {
                        const fullSchemeData = await detailResponse.json();
                        if (fullSchemeData && fullSchemeData.headings) {
                            mentionedSchemeBOQPrompt += `\nDETAILED BILL OF QUANTITIES (BOQ) ITEMS FOR THE SCHEME "${fullSchemeData.scheme_name || "Unnamed"}" (ID: ${targetBoqSchemeId}):\n`;
                            Object.entries(fullSchemeData.headings).forEach(([hKey, heading]: [string, any]) => {
                                if (heading && heading.items) {
                                    Object.entries(heading.items).forEach(([iKey, item]: [string, any]) => {
                                        const desc = item.description || item.item_name || "";
                                        const qty = item.boq_qty || item.qty || 0;
                                        const unit = item.unit || "";
                                        const rate = item.swsm_rate || item.rate || 0;
                                        const amt = item.boq_amount || item.amount || 0;
                                        let breakupStr = "";
                                        if (item.percentage_breakup && Array.isArray(item.percentage_breakup)) {
                                            breakupStr = " | Billing Breakup: " + item.percentage_breakup.map((b: any) => `${b.percentage}% (${b.stage})`).join(", ");
                                        }
                                        mentionedSchemeBOQPrompt += `- Item ${item.item_no || iKey} under Heading "${heading.name || heading.heading_name || hKey}": "${desc}" | Qty = ${qty} ${unit} | Rate = ₹${rate} | Amount = ₹${amt}${breakupStr}\n`;
                                    });
                                }
                            });
                        }
                    }
                } catch (err) {
                    console.error(`Error fetching detailed BOQ items for scheme ${targetBoqSchemeId}:`, err);
                }
            }
        }
        // 1.3. Load dynamic knowledge module grounding
        let knowledgeModulePrompt = "";
        try {
            const knowledgePath = "C:\\Users\\gamin\\.gemini\\antigravity\\knowledge\\pico_knowledge_module.json";
            if (fs.existsSync(knowledgePath)) {
                const moduleContent = fs.readFileSync(knowledgePath, "utf-8");
                const parsedModule = JSON.parse(moduleContent);
                knowledgeModulePrompt = `
OFFICIAL PROJECT AUDIT KNOWLEDGE GROUNDING (DYNAMIC KNOWLEDGE MODULE v${parsedModule.version || "1.0"}):
Here is the official operational knowledge module grounding loaded from disk. You must STRICTLY abide by these domain facts, core rules, and mistake-recovery guidelines:
- Module Name: ${parsedModule.module_name || "N/A"}
- PICO Identity: Created by ${parsedModule.identity?.created_by || "Sandeep Sir"} | Platform: ${parsedModule.identity?.platform || "PMX"} | Purpose: ${parsedModule.identity?.purpose || "Operations Intelligence"}
- Casual Intro (use when asked 'who are you'): ${parsedModule.identity?.casual_intro || ""}
- Company: ${parsedModule.company_structure?.company_name || "KSPPL"} | Mission: ${parsedModule.company_structure?.mission || "JJM"}
- Operational States: ${JSON.stringify(parsedModule.company_structure?.operational_states || parsedModule.domain_grounding?.operational_branches || {})}
- Tank Limits: RCC Max = ${parsedModule.domain_grounding?.technical_specs?.conventional_rcc_tank_max_capacity || "400 KL"}, Zinc Alum Max = ${parsedModule.domain_grounding?.technical_specs?.zinc_alum_steel_tank_max_capacity || "250 KL"}
- Core Operational Rules:
${Array.isArray(parsedModule.core_operational_rules) ? parsedModule.core_operational_rules.map((r: string) => `  * ${r}`).join("\n") : ""}
- Comparative Guidelines & Mistakes to Avoid:
${Array.isArray(parsedModule.comparative_rules_and_mistakes_to_avoid) ? parsedModule.comparative_rules_and_mistakes_to_avoid.map((g: any) => `  * [${g.guideline}]: ${g.description}`).join("\n") : ""}
`;
            }
        } catch (err) {
            console.error("Failed to read dynamic knowledge module:", err);
        }


        // 2. Perform deep aggregation for block-level and district-wide stats
        const normalizeBlockName = (name: string): string => {
            let n = (name || "UNKNOWN").toUpperCase().trim();
            if (n === "NIDHAULIKALAN" || n === "NIDHAULI_KALAN") {
                return "NIDHAULI KALAN";
            }
            if (n === "MAREHRA" || n === "MARERA") {
                return "MARHERA";
            }
            if (n === "JAITRA" || n === "JAITHARA") {
                return "JAITHRA";
            }
            if (n === "SAKEET") {
                return "SAKIT";
            }
            return n;
        };

        const blockStats: Record<string, {
            schemesCount: number;
            fhtcTarget: number;
            fhtcExecuted: number;
            pipeTarget: number;
            pipeExecuted: number;
            totalAmount: number;
            statusCounts: Record<string, number>;
            schemesList: Array<{ id: string; name: string; status: string; fhtcTarget: number; fhtcExecuted: number; pipeTarget: number; pipeExecuted: number; totalAmount: number }>;
        }> = {};

        // Helper to initialize block stats
        const getBlockStats = (blockName: string) => {
            const normalized = normalizeBlockName(blockName);
            if (!blockStats[normalized]) {
                blockStats[normalized] = {
                    schemesCount: 0,
                    fhtcTarget: 0,
                    fhtcExecuted: 0,
                    pipeTarget: 0,
                    pipeExecuted: 0,
                    totalAmount: 0,
                    statusCounts: {},
                    schemesList: []
                };
            }
            return blockStats[normalized];
        };


        // Populate block stats and compute metrics
        Object.entries(allSchemes).forEach(([id, scheme]: [string, any]) => {
            const blockName = scheme.block_name || scheme.block || "UNKNOWN";
            const stats = getBlockStats(blockName);

            stats.schemesCount++;
            const fhtcT = parseInt(scheme.fhtc_target) || 0;
            const fhtcE = parseInt(scheme.fhtc_executed) || 0;
            const pipeT = parseInt(scheme.pipe_target) || 0;
            const pipeE = parseInt(scheme.pipe_executed) || 0;
            const totalAmt = parseFloat(scheme.total_amount) || 0;
            const status = scheme.status || "ACTIVE";

            stats.fhtcTarget += fhtcT;
            stats.fhtcExecuted += fhtcE;
            stats.pipeTarget += pipeT;
            stats.pipeExecuted += pipeE;
            stats.totalAmount += totalAmt;
            stats.statusCounts[status] = (stats.statusCounts[status] || 0) + 1;

            stats.schemesList.push({
                id,
                name: scheme.scheme_name || scheme.name || "Unnamed Scheme",
                status,
                fhtcTarget: fhtcT,
                fhtcExecuted: fhtcE,
                pipeTarget: pipeT,
                pipeExecuted: pipeE,
                totalAmount: totalAmt
            });
        });

        // Compute overall totals across everything
        let overallSchemesCount = 0;
        let overallFhtcTarget = 0;
        let overallFhtcExecuted = 0;
        let overallPipeTarget = 0;
        let overallPipeExecuted = 0;
        let overallTotalAmount = 0;

        Object.values(blockStats).forEach(stats => {
            overallSchemesCount += stats.schemesCount;
            overallFhtcTarget += stats.fhtcTarget;
            overallFhtcExecuted += stats.fhtcExecuted;
            overallPipeTarget += stats.pipeTarget;
            overallPipeExecuted += stats.pipeExecuted;
            overallTotalAmount += stats.totalAmount;
        });

        // Compute Billed Financials
        let overallBilledAmt = 0;
        const blockBilledAmt: Record<string, number> = {};
        
        Object.entries(allRaRecords).forEach(([schemeId, schemeRaData]: [string, any]) => {
            const scheme = allSchemes[schemeId];
            const blockName = normalizeBlockName(scheme?.block_name || scheme?.block || "UNKNOWN");
            
            Object.values(schemeRaData).forEach((divRecords: any) => {
                Object.values(divRecords).forEach((ra: any) => {
                    if (ra.status === 'SUBMITTED' || ra.status === 'APPROVED') {
                        const amt = parseFloat(ra.grossAmount) || parseFloat(ra.netAmount) || 0;
                        overallBilledAmt += amt;
                        blockBilledAmt[blockName] = (blockBilledAmt[blockName] || 0) + amt;
                    }
                });
            });
        });

        // ======= DYNAMIC CHART SKILL ENGINE =======
        // Check if the conversation has been in a comparative context recently
        const recentHistory = history.slice(-4); // Look at last 4 messages
        const wasRecentlyComparative = recentHistory.some((msg: any) => {
            const content = (msg.content || "").toLowerCase();
            return [
                "compare", "varying", "variation", "infographic", "chart",
                "bar graph", "graphs", "insights", "difference", "which block",
                "versus", "vs", "across blocks", "across schemes", "side by side",
                "vary", "varies", "distribution", "allocation", "allocations",
                "comparison", "progress", "estimated vs billed", "target vs executed",
                "scheme-wise", "block-wise", "scheme to scheme", "block to block",
                "how do they vary", "/charts/"
            ].some(kw => content.includes(kw));
        });

        // Detect comparative intent and classify which chart to produce
        const isComparative = [
            "compare", "varying", "variation", "infographic", "chart",
            "bar graph", "graphs", "insights", "difference", "which block",
            "versus", "vs", "across blocks", "across schemes", "side by side",
            "vary", "varies", "distribution", "allocation", "allocations",
            "comparison", "progress", "estimated vs billed", "target vs executed",
            "scheme-wise", "block-wise", "scheme to scheme", "block to block",
            "how do they vary"
        ].some(kw => lowercaseMsg.includes(kw)) || 
        /(how|what|show|get|give|display).*(vary|varies|variation|varying|compare|comparison|difference|chart|graph|infographic|distribution|allocation)/i.test(lowercaseMsg) ||
        (wasRecentlyComparative && (
            lowercaseMsg.includes("what about") ||
            lowercaseMsg.includes("how about") ||
            lowercaseMsg.includes("and for") ||
            lowercaseMsg.includes("what of") ||
            lowercaseMsg.includes("check")
        ));

        let generatedChartFilename = "";
        let generatedChartAlt = "";

        if (isComparative) {
            // Check previous chart context from history to maintain continuation of metrics in follow-up queries
            let previousChartMetric = ""; // "fhtc" | "pipe" | "billing" | "financial"
            for (let i = history.length - 1; i >= 0; i--) {
                const content = (history[i].content || "").toLowerCase();
                if (content.includes("fhtc_progress") || content.includes("scheme_fhtc_progress")) {
                    previousChartMetric = "fhtc";
                    break;
                } else if (content.includes("pipe_progress") || content.includes("scheme_pipe_progress")) {
                    previousChartMetric = "pipe";
                    break;
                } else if (content.includes("billing_comparison")) {
                    previousChartMetric = "billing";
                    break;
                } else if (content.includes("scheme_comparison") || content.includes("block_allocations")) {
                    previousChartMetric = "financial";
                    break;
                }
            }

            // Classify chart type from query content or carry over from history
            const hasFhtcInMsg = /fhtc|functional|household|tap|connection/i.test(lowercaseMsg);
            const hasPipeInMsg = /pipe|laying|pipeline|meter/i.test(lowercaseMsg);
            const hasBillingInMsg = /bill|billed|payment|realized|ra\b/i.test(lowercaseMsg);
            
            const mentionsFhtc = hasFhtcInMsg || (!hasPipeInMsg && !hasBillingInMsg && previousChartMetric === "fhtc");
            const mentionsPipe = hasPipeInMsg || (!hasFhtcInMsg && !hasBillingInMsg && previousChartMetric === "pipe");
            const mentionsBilling = hasBillingInMsg || (!hasFhtcInMsg && !hasPipeInMsg && previousChartMetric === "billing");
            
            const mentionsScheme = /scheme|schemes/i.test(lowercaseMsg) || wasRecentlyComparative;
            const mentionsBlock = /block|blocks/i.test(lowercaseMsg);
            const mentionsAmount = /amount|cost|value|budget|allocation|financial|money|lakhs|crore/i.test(lowercaseMsg);
            const mentionsProgress = /progress|execution|target|achievement|completion/i.test(lowercaseMsg);

            // Sort blocks by totalAmount descending for consistent ordering
            const sortedBlocks = Object.entries(blockStats)
                .sort(([,a], [,b]) => b.totalAmount - a.totalAmount);
            const blockNames = sortedBlocks.map(([name]) => name);

            // Check if user mentioned a specific block in the query
            let matchedBlockName = "";
            for (const blockName of Object.keys(blockStats)) {
                if (lowercaseMsg.includes(blockName.toLowerCase())) {
                    matchedBlockName = blockName;
                    break;
                }
            }

            // Handle variations in query block names (misspellings/spelling variants)
            if (!matchedBlockName) {
                if (lowercaseMsg.includes("jaithara") || lowercaseMsg.includes("jaitra")) {
                    matchedBlockName = "JAITHRA";
                } else if (lowercaseMsg.includes("sakeet")) {
                    matchedBlockName = "SAKIT";
                } else if (lowercaseMsg.includes("marehra") || lowercaseMsg.includes("marera")) {
                    matchedBlockName = "MARHERA";
                } else if (lowercaseMsg.includes("nidhauli")) {
                    matchedBlockName = "NIDHAULI KALAN";
                } else if (lowercaseMsg.includes("shitalpur") || lowercaseMsg.includes("sheetalpur")) {
                    matchedBlockName = "SHITALPUR";
                }
            }

            // Fallback: If no block is explicitly mentioned in the text, check if there is an active scheme
            // and use its block, but only if they are asking about scheme-level variation/comparison.
            let targetBlockName = matchedBlockName;
            if (!targetBlockName && mentionsScheme) {
                const targetActiveSchemeId = (mentionedSchemeIds.length > 0 ? mentionedSchemeIds[0] : null) || activeSchemeId;
                if (targetActiveSchemeId && allSchemes[targetActiveSchemeId]) {
                    targetBlockName = normalizeBlockName(allSchemes[targetActiveSchemeId].block_name || allSchemes[targetActiveSchemeId].block || "");
                }
            }

            let chartConfig: any = null;

            if (targetBlockName && blockStats[targetBlockName]) {
                // User is asking about scheme-level comparison/progress/variation within a SPECIFIC block!
                const blockData = blockStats[targetBlockName];
                const schemesInBlock = [...blockData.schemesList].sort((a, b) => b.totalAmount - a.totalAmount);
                const schemeNames = schemesInBlock.map(s => s.name.length > 18 ? s.name.substring(0, 18) + ".." : s.name);

                if (mentionsFhtc) {
                    // Scheme-wise FHTC progress in this specific block
                    chartConfig = {
                        chart_type: "progress",
                        title: `${targetBlockName} BLOCK — SCHEME-WISE FHTC TARGET vs EXECUTED`,
                        labels: schemeNames,
                        values: schemesInBlock.map(s => s.fhtcTarget),
                        values2: schemesInBlock.map(s => s.fhtcExecuted),
                        series1_name: "Target FHTC",
                        series2_name: "Executed FHTC",
                        unit: "Nos.",
                        output_filename: "scheme_fhtc_progress.png"
                    };
                    generatedChartFilename = "scheme_fhtc_progress.png";
                    generatedChartAlt = `${targetBlockName} Block — Scheme-wise FHTC Progress`;
                } else if (mentionsPipe) {
                    // Scheme-wise Pipe laying progress in this specific block
                    chartConfig = {
                        chart_type: "progress",
                        title: `${targetBlockName} BLOCK — SCHEME-WISE PIPE TARGET vs EXECUTED`,
                        labels: schemeNames,
                        values: schemesInBlock.map(s => s.pipeTarget),
                        values2: schemesInBlock.map(s => s.pipeExecuted),
                        series1_name: "Target Pipe",
                        series2_name: "Executed Pipe",
                        unit: "Meters",
                        output_filename: "scheme_pipe_progress.png"
                    };
                    generatedChartFilename = "scheme_pipe_progress.png";
                    generatedChartAlt = `${targetBlockName} Block — Scheme-wise Pipe Laying Progress`;
                } else {
                    // Scheme-wise financial variation in this specific block
                    chartConfig = {
                        chart_type: "bar",
                        title: `${targetBlockName} BLOCK — SCHEME-WISE FINANCIAL ALLOCATION`,
                        labels: schemeNames,
                        values: schemesInBlock.map(s => parseFloat((s.totalAmount / 100000).toFixed(2))),
                        unit: "₹ Lakhs",
                        sub_labels: schemesInBlock.map(s => s.status),
                        output_filename: "scheme_comparison.png"
                    };
                    generatedChartFilename = "scheme_comparison.png";
                    generatedChartAlt = `${targetBlockName} Block — Scheme-wise Allocation Chart`;
                }
            } else if (mentionsFhtc && (mentionsProgress || !mentionsAmount)) {
                // FHTC Target vs Executed progress chart
                chartConfig = {
                    chart_type: "progress",
                    title: "ETAH DISTRICT — FHTC TARGET vs EXECUTED (BLOCK-WISE)",
                    labels: blockNames,
                    values: sortedBlocks.map(([,s]) => s.fhtcTarget),
                    values2: sortedBlocks.map(([,s]) => s.fhtcExecuted),
                    series1_name: "FHTC Target",
                    series2_name: "FHTC Executed",
                    unit: "Nos.",
                    output_filename: "fhtc_progress.png"
                };
                generatedChartFilename = "fhtc_progress.png";
                generatedChartAlt = "ETAH JJM FHTC Progress — Target vs Executed";
            } else if (mentionsPipe && (mentionsProgress || !mentionsAmount)) {
                // Pipe laying progress chart
                chartConfig = {
                    chart_type: "progress",
                    title: "ETAH DISTRICT — PIPE LAYING TARGET vs EXECUTED (BLOCK-WISE)",
                    labels: blockNames,
                    values: sortedBlocks.map(([,s]) => s.pipeTarget),
                    values2: sortedBlocks.map(([,s]) => s.pipeExecuted),
                    series1_name: "Pipe Target",
                    series2_name: "Pipe Executed",
                    unit: "Meters",
                    output_filename: "pipe_progress.png"
                };
                generatedChartFilename = "pipe_progress.png";
                generatedChartAlt = "ETAH JJM Pipe Laying Progress — Target vs Executed";
            } else if (mentionsBilling) {
                // Billing comparison: Estimated vs Billed per block
                chartConfig = {
                    chart_type: "grouped_bar",
                    title: "ETAH DISTRICT — ESTIMATED vs BILLED AMOUNT (BLOCK-WISE)",
                    labels: blockNames,
                    values: sortedBlocks.map(([,s]) => parseFloat((s.totalAmount / 100000).toFixed(2))),
                    values2: sortedBlocks.map(([name]) => parseFloat(((blockBilledAmt[name] || 0) / 100000).toFixed(2))),
                    series1_name: "Estimated (₹ Lakhs)",
                    series2_name: "Billed (₹ Lakhs)",
                    unit: "₹ Lakhs",
                    output_filename: "billing_comparison.png"
                };
                generatedChartFilename = "billing_comparison.png";
                generatedChartAlt = "ETAH JJM Billing Analysis — Estimated vs Realized";
            } else if (mentionsScheme) {
                // Scheme-level comparison within active block or largest
                const targetBlock = sortedBlocks[0];
                const schemesInBlock = [...targetBlock[1].schemesList].sort((a, b) => b.totalAmount - a.totalAmount);
                const schemeNames = schemesInBlock.map(s => s.name.length > 18 ? s.name.substring(0, 18) + ".." : s.name);
                chartConfig = {
                    chart_type: "bar",
                    title: `${targetBlock[0]} BLOCK — SCHEME-WISE FINANCIAL ALLOCATION`,
                    labels: schemeNames,
                    values: schemesInBlock.map(s => parseFloat((s.totalAmount / 100000).toFixed(2))),
                    unit: "₹ Lakhs",
                    sub_labels: schemesInBlock.map(s => s.status),
                    output_filename: "scheme_comparison.png"
                };
                generatedChartFilename = "scheme_comparison.png";
                generatedChartAlt = `${targetBlock[0]} Block — Scheme-wise Allocation Chart`;
            } else {
                // Default: Block-wise financial allocation
                chartConfig = {
                    chart_type: "bar",
                    title: "ETAH DISTRICT — JJM BLOCK ALLOCATION & VARIANCE ANALYSIS",
                    labels: blockNames,
                    values: sortedBlocks.map(([,s]) => parseFloat((s.totalAmount / 100000).toFixed(2))),
                    unit: "₹ Lakhs",
                    sub_labels: sortedBlocks.map(([,s]) => `${s.schemesCount} Schemes`),
                    output_filename: "block_allocations.png"
                };
                generatedChartFilename = "block_allocations.png";
                generatedChartAlt = "ETAH JJM Block Allocations Chart";
            }

            // Write config and invoke the universal chart generator
            if (chartConfig) {
                try {
                    const configPath = "D:\\KSPL\\DPR-APP\\infra-os\\public\\charts\\chart_config.json";
                    fs.writeFileSync(configPath, JSON.stringify(chartConfig, null, 2), "utf-8");
                    execSync("python C:\\Users\\gamin\\.gemini\\antigravity\\scratch\\generate_chart.py");
                    console.log(`Dynamic chart generated: ${generatedChartFilename}`);
                } catch (execErr) {
                    console.error("Chart generation error:", execErr);
                    generatedChartFilename = "";
                }
            }
        }

        // 3. Build detailed multi-level database grounding prompt
        let blockGroundingPrompt = `
OVERALL DISTRICT-LEVEL SUMMARY (ALL BLOCKS):
- Total Schemes (District): ${overallSchemesCount}
- Total District FHTC Scope: Target = ${overallFhtcTarget}, Executed = ${overallFhtcExecuted} (${overallFhtcTarget > 0 ? ((overallFhtcExecuted / overallFhtcTarget) * 100).toFixed(2) : 0}% Complete)
- Total District Pipe Laying Scope: Target = ${overallPipeTarget} m, Executed = ${overallPipeExecuted} m (${overallPipeTarget > 0 ? ((overallPipeExecuted / overallPipeTarget) * 100).toFixed(2) : 0}% Complete)
- Total District Billed Financials: ₹${(overallBilledAmt / 100000).toFixed(2)} Lakhs (approx ₹${overallBilledAmt.toLocaleString('en-IN')})
- Highest Tank Capacities in District (Global Fact): Conventional Tank (R.C.C.) highest capacity is 400 KL. Zinc Alum Steel Tank highest capacity is 250 KL.

BLOCK-LEVEL DETAILED AGGREGATIONS AND SCOPE:
`;

        Object.entries(blockStats).forEach(([blockName, stats]) => {
            const fhtcPercent = stats.fhtcTarget > 0 ? ((stats.fhtcExecuted / stats.fhtcTarget) * 100).toFixed(2) : "0.00";
            const pipePercent = stats.pipeTarget > 0 ? ((stats.pipeExecuted / stats.pipeTarget) * 100).toFixed(2) : "0.00";
            const billedAmt = blockBilledAmt[blockName] || 0;
            blockGroundingPrompt += `
Block: **${blockName}**
- Schemes Count: ${stats.schemesCount}
- FHTC Scope: Target = ${stats.fhtcTarget}, Executed = ${stats.fhtcExecuted} (${fhtcPercent}% Complete)
- Pipe Laying Scope: Target = ${stats.pipeTarget} m, Executed = ${stats.pipeExecuted} m (${pipePercent}% Complete)
- Financial Scope: Total Scheme Estimated Cost = ₹${(stats.totalAmount / 100000).toFixed(2)} Lakhs, Realized/Billed Amount = ₹${(billedAmt / 100000).toFixed(2)} Lakhs
- Scheme Statuses: ${Object.entries(stats.statusCounts).map(([status, count]) => `${status}: ${count}`).join(", ")}
- Schemes List under ${blockName}:
${stats.schemesList.map(s => `  * ${s.name} (ID: ${s.id}): Status = ${s.status}, Estimated Cost = ₹${(s.totalAmount / 100000).toFixed(2)} Lakhs, FHTC Progress = ${s.fhtcExecuted}/${s.fhtcTarget} (${s.fhtcTarget > 0 ? ((s.fhtcExecuted / s.fhtcTarget) * 100).toFixed(1) : 0}%), Pipe Laying Progress = ${s.pipeExecuted}/${s.pipeTarget} m (${s.pipeTarget > 0 ? ((s.pipeExecuted / s.pipeTarget) * 100).toFixed(1) : 0}%)`).join("\n")}
`;
        });

        // Setup active scheme detailed context if focused
        let activeSchemePrompt = "";
        const targetActiveSchemeId = (mentionedSchemeIds.length > 0 ? mentionedSchemeIds[0] : null) || activeSchemeId;
        if (targetActiveSchemeId && allSchemes[targetActiveSchemeId]) {
            const schemeData = allSchemes[targetActiveSchemeId];
            const schemeRa = allRaRecords[targetActiveSchemeId];
            
            let activeRaCount = 0;
            let activeBilledAmt = 0;
            if (schemeRa) {
                Object.values(schemeRa).forEach((divRecords: any) => {
                    Object.values(divRecords).forEach((ra: any) => {
                        if (ra.status === 'SUBMITTED' || ra.status === 'APPROVED') {
                            activeRaCount++;
                            activeBilledAmt += parseFloat(ra.grossAmount) || parseFloat(ra.netAmount) || 0;
                        }
                    });
                });
            }

            activeSchemePrompt = `
CURRENTLY SELECTED SCHEME ON USER'S DASHBOARD (this is NOT the company's primary focus — it is simply the scheme the user last clicked or selected on the portal):
- Selected Scheme Name: "${schemeData.scheme_name || schemeData.name || "Unknown"}"
- ID: ${targetActiveSchemeId}
- Block: "${schemeData.block_name || schemeData.block || "UNKNOWN"}"
- District: "ETAH"
- Overall Status: "${schemeData.status || "ACTIVE"}"
- Progress Details:
  - FHTC Scope: Target = ${schemeData.fhtc_target || 0}, Executed = ${schemeData.fhtc_executed || 0} (${schemeData.fhtc_target > 0 ? (((schemeData.fhtc_executed || 0) / schemeData.fhtc_target) * 100).toFixed(2) : 0}% complete)
  - Pipe Laying Scope: Target = ${schemeData.pipe_target || 0} m, Executed = ${schemeData.pipe_executed || 0} m (${schemeData.pipe_target > 0 ? (((schemeData.pipe_executed || 0) / schemeData.pipe_target) * 100).toFixed(2) : 0}% complete)
  - Structures: Boundary Wall = "${schemeData.boundary_wall || "N/A"}", Pump House = "${schemeData.pump_house || "N/A"}", OHT = "${schemeData.oht || "N/A"}"
  - Financial Scope: Total Estimated Scheme Value = ₹${schemeData.total_amount ? schemeData.total_amount.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : 0} (approx ₹${schemeData.total_amount ? (schemeData.total_amount / 100000).toFixed(2) : 0} Lakhs)
  - Billing Financials: Submitted/Approved Bills = ${activeRaCount}, Total Realized Amount = ₹${(activeBilledAmt / 100000).toFixed(2)} Lakhs
`;
        } else {
            activeSchemePrompt = `
CURRENTLY SELECTED SCHEME ON USER'S DASHBOARD:
- No specific scheme is selected. The user is browsing at the block level or district level.
`;
        }

        const systemInstruction = `
You are "PICO" (Personalized Intelligence for Construction Operations), an AI operations agent and structural project auditor created by **Sandeep Sir** for the **PMX (Project Management Experience)** portal, built specifically for **Keystone Infra & Engineering (KSPPL)** to coordinate, structure, audit, and monitor "Jal Jeevan Mission" (JJM) water supply projects.

COMPANY PRESENCE: KSPPL operates across **TWO states** — Uttar Pradesh (District: Etah, ACTIVE working site) and Kerala (District: Alappuzha, WORK SUSPENDED). Etah is the current active site.

As PICO, you provide super admins, project managers, and billing engineers with deep, context-aware operational intelligence. You are connected to the live database and the portal front-end context.

OPERATIONAL PARAMETERS & LIVE REAL-TIME DATABASE CONTEXT:
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

${activeSchemePrompt}

${blockGroundingPrompt}

${mentionedSchemeBOQPrompt}

${knowledgeModulePrompt}

SPECIAL RULES & CONSTRAINTS:
1. KERALA PROJECT STATUS: If activeBranch is "KERALA", immediately inform the user politely that all operations in the Alappuzha, Kerala branch are currently halted and site activities are suspended. No data edits or updates can occur until the freeze is lifted.
2. CRITICAL TRUTH & GROUNDING: Ground your answers entirely in the live context provided above. You have 100% of the live database in your context. Always cite exact numbers, percentages, and metrics. If a block or scheme is referenced, search the live context for matches. If the user asks about an unavailable block or scheme, state that it is not present in the current Jal Jeevan Mission dataset.
3. BOQ SCOPE INTELLIGENCE (CRITICAL): If the user asks about the "scope", "count", or "quantity" of physical structures (like FHTC, valves, or pipes) for a scheme, deeply analyze the "DETAILED BILL OF QUANTITIES (BOQ)" section and sum up the physical quantities. HOWEVER, if the user asks for the "Scheme Value", "Financial Scope", or "Cost", ALWAYS use the high-level "Total Estimated Scheme Value" provided in the context (which represents the exact total value). NEVER manually sum the BOQ amounts for financial values. Act intelligently like an expert structural engineer analyzing the real DB.
4. MATHEMATICAL COMPUTATIONS: If requested to compute run rates, forecasts, or BOQ vs EQ variances, calculate them precisely based on the provided numbers. (e.g. if Pipe Target is 10,000m and Executed is 4,000m, completion is exactly 40% and remaining is 60%).
5. DESIGN AND PRESENTATION: Format reports as a neat, clean plain-text list or structured message. Do NOT write long paragraphs. Never use markdown headers (hashes like '#') or markdown tables. Instead, use double asterisks (**major info**) to highlight key metrics, titles, and major details in bold blue text. Keep answers professional, concise, and direct.
6. NO EXPOSURE: Do not expose raw API keys, database paths, or service credentials under any circumstances.
7. NO META-COMMENTARY (CRITICAL): NEVER explain your internal reasoning, context mix-ups, or thought processes. Do NOT say things like "Note: the user asked about X but the active scheme is Y" or "This is derived from Item Z". Just process the data silently and provide the exact answer directly. Frame it neatly and respectfully, e.g., "Yes Sir, the FHTC scope for Virampur Etah scheme is 284." Stick EXACTLY to the line of the question.
8. CONTEXT SCOPE AWARENESS: Do NOT force every question to be about the "ACTIVE SCHEME" just because it is in focus. If the user asks a general question (e.g., "what are the top capacity tanks?", "overall scope in district"), zoom out and use the general/block-level data. Only restrict to the active scheme if the question is specifically about it or naturally follows it.
9. CLARIFY, DON'T HALLUCINATE: If you lack the exact data to answer a question (e.g., you are asked about all Zinc tanks but that data is not in your context), or if the question is ambiguous, do NOT confidently give a false or restricted answer. Instead, politely ask a reverse question to clarify (e.g., "Sir, I do not have the complete district-wide tank list loaded. Do you want me to check for a specific block or scheme?").
10. RESPECTFUL TONE (MANDATORY): You must maintain an extremely respectful and formal tone at all times. You MUST begin EVERY single response with a respectful address such as "Sir,", "Yes Sir,", "Please note, Sir,", or "Certainly Sir,". Never provide an answer without this level of respect.
11. BILLING PERCENTAGE BREAKUPS (CRITICAL): If the user asks for the "billing percentage breakup", "payment stages", or "billing stages" for an item, do NOT calculate mathematical percentages of the item's cost vs the scheme value. Instead, look at the "Billing Breakup" property appended to that specific item in the BOQ (e.g., "70% (Supply & Delivery)"). You MUST list the percentage stages and mathematically calculate the exact monetary amount for each stage based on the item's total Amount. Display the item's total amount for clarity, but do NOT include the Scheme Name or Total Estimated Scheme Value. Format it neatly (e.g., "70% Supply & Delivery: ₹30,184").
12. CHAT UI RENDERING RULES: The chat user interface has custom parsing rules:
- NEAT BULLET POINTS: Use lines starting with '- ' to create clean bullet lists when needed (e.g., "- First item", "- Second item").
- NEAT NUMBERED LISTS: Use standard numbering like "1. ", "2. " to create clean numbered lists.
- BLUE HIGHLIGHTING FOR MAJOR INFO (CRITICAL): Wrap key numbers, values, and major details in double asterisks (e.g., **₹23,000.00** or **12.5 HP**) to highlight them in bold blue in the UI.
- STRICTLY BAN TABLES AND HEADERS: NEVER use markdown headers (no '#', '##', '###') or markdown tables (no '|', '---', ':---'). If you need a section title, just write it in plain UPPERCASE text on its own line.
13. PHYSICAL VS FINANCIAL ISOLATION (CRITICAL): If the user asks a physical, site-related, or general project doubt (e.g., "How many pumps?", "What is the pipe length?", "Show me the boundary wall specs"), you must NEVER include financial amounts, item rates, unit rates, total costs, or block values in your response. Provide ONLY the physical count, capacities, specs, and quantities. You are only allowed to show financial amounts/costs if the user explicitly includes words like "cost", "amount", "value", "financials", "rate", or "money" in their question.
14. DYNAMIC INFOGRAPHIC CHARTS & VISUALIZATIONS (CRITICAL): If the user asks ANY comparative question (block amounts, FHTC progress, pipe laying, billing, scheme comparison, or any cross-metric analysis):
- NO ASCII GRAPH SCRIBBLES (CRITICAL): Never generate text-based ASCII tracing graphs using slashes, backslashes, dots, or peak nodes (strictly ban characters like '[o]', '\\', '/', '~~', or '--' in graphs). They look like scribble on a white pad and are extremely messy and unprofessional.
- EMBED THE DYNAMICALLY GENERATED CHART: A chart has ALREADY been generated dynamically on the server based on the user's exact question. Immediately following your respectful address, embed it using:
  ${generatedChartFilename ? `![${generatedChartAlt}](/charts/${generatedChartFilename}?t=${Date.now()})` : "(No chart was generated for this query)"}
  IMPORTANT: Use EXACTLY the image syntax above — do NOT change the path or filename. The chart already reflects the correct data for the user's question.
- NO RELATIVE BUDGET BASELINES (CRITICAL): You must NEVER designate any block (like SAKIT) as a "100% baseline" or claim there is a standard baseline target. Every block has unique geographic and demographic needs. Present all comparisons using absolute values in their respective units.
- CONCISE ANALYSIS ONLY: Below the image, provide a short, crisp plain-text bullet summary of the key insights (top performer, lowest, gap, average). Do NOT repeat all the raw numbers that are already visible in the chart. Keep it insightful, not repetitive.
- Present comparisons using a clear plain-text list structure (no headers, no tables). Wrap compared metrics, block names, and key values in double asterisks to highlight in bold blue in the UI.
15. CASUAL GREETINGS & SMALL TALK (CRITICAL): If the user sends a casual greeting like "hi", "hello", "hey pico", "how are you", "good morning", "what's up", etc., respond in MAXIMUM 1-2 short sentences. Just greet back warmly and ask how you can help. Do NOT dump any operational stats, active scheme details, block names, system status, or dashboard context. Example good response: "Sir, I am doing well! How can I assist you today?"
16. IDENTITY QUESTIONS (CRITICAL): If the user asks "who are you?", "what are you?", "introduce yourself", etc., respond in MAXIMUM 2-3 sentences. Say you are **PICO**, the PMX tool created by **Sandeep Sir** for **Keystone Infra & Engineering's** Jal Jeevan Mission operations. Do NOT list all blocks, scheme counts, or financial scopes when introducing yourself.
17. RESPONSE DEPTH MATCHING (CRITICAL): Always match your response depth to the question's depth. A one-line question deserves a concise answer. A greeting gets a greeting. A simple count question gets just the count and maybe one supporting detail. NEVER volunteer unrequested details like financial breakdowns, billing status, operational parameters, or system internals unless the user specifically asks for them.
`;

        // 3. Initialize Gemini
        const apiKey = process.env.SPL_AI_KEY;
        if (!apiKey) {
            return new Response("Missing SPL_AI_KEY in server environment.", { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: systemInstruction,
        });

        // 4. Map client history to Gemini        // Prepare history for Gemini - ensure it starts with a 'user' message
        let geminiHistory = history
            .filter((msg: any) => msg.content && msg.content.trim())
            .map((msg: any) => ({
                role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
                parts: [{ text: msg.content }],
            }));
            
        // Gemini API requires the history to start with a 'user' message
        while (geminiHistory.length > 0 && geminiHistory[0].role === "model") {
            geminiHistory.shift(); // Remove the leading model message (like the initial greeting)
        }

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
