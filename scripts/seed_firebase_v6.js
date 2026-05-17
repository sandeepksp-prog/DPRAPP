const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const admin = require('firebase-admin');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
});

const db = admin.database();

function sanitizeKey(key) {
    if (!key) return 'Unknown';
    return String(key).replace(/[\.\#\$\[\]\/]/g, '_').trim();
}

async function seed() {
    console.log('--- STARTING AI-READY HIERARCHICAL DATABASE SEEDING V6 ---');
    
    // 1. Parse Percentage Breakup Templates
    console.log('Parsing Percentage Breakup Templates...');
    const breakupFilePath = 'd:\\KSPL\\DPR-APP\\BILLING DATA\\PRECENTAGE BREAKUP.xlsx';
    const breakupWb = xlsx.readFile(breakupFilePath);
    const breakupData = xlsx.utils.sheet_to_json(breakupWb.Sheets[breakupWb.SheetNames[0]], { header: 1, defval: null });
    
    const templates = {};
    breakupData.slice(1).forEach(r => {
        const type = String(r[0] || '').trim();
        if (!type || type === 'null') return;
        if (!templates[type]) templates[type] = [];
        templates[type].push({
            percentage: Math.round(parseFloat(r[1]) * 100),
            stage: String(r[2] || '').trim()
        });
    });

    const patternMap = {};
    Object.keys(templates).forEach(k => {
        const pat = templates[k].map(x => x.percentage).join('/');
        patternMap[pat] = templates[k];
    });

    console.log(`Loaded ${Object.keys(templates).length} templates.`);

    // 2. Parse Main BOQ Data
    const filePath = 'd:\\KSPL\\DPR-APP\\BILLING DATA\\KSPL PMS-DATA.xlsx';
    console.log(`Reading Excel file: ${filePath}`);
    const workbook = xlsx.readFile(filePath);
    const sheetName = 'BOQ';
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) throw new Error(`Sheet ${sheetName} not found!`);

    const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
    
    console.log('Extracting scheme metadata...');
    const schemes = [];
    const numSchemes = 49;
    
    const type6_schemes = ['20070355', '20086120', '20086089', '20070351', '20086097', '20086150', '20086107', '20018647', '20018940', '20033428'];

    for (let i = 0; i < numSchemes; i++) {
        const colIdx = 7 + (i * 3);
        const total_amount = data[3]?.[colIdx];
        const scheme_id = data[4]?.[colIdx];
        const block_name = data[5]?.[colIdx];
        const scheme_name = data[6]?.[colIdx];
        const scheme_no = data[7]?.[colIdx];
        
        if (scheme_id) {
            const sid = String(scheme_id).trim();
            schemes.push({
                index: i,
                colStart: colIdx,
                id: sid,
                block_name: block_name || '',
                scheme_name: scheme_name || '',
                scheme_no: scheme_no || '',
                tank_category: type6_schemes.includes(sid) ? 'Conventional' : 'Zinc Alum Steel',
                total_amount: parseFloat(total_amount) || 0,
                headings: {}
            });
        }
    }
    
    console.log(`Found ${schemes.length} schemes.`);
    console.log('Extracting Master BOQ & Hierarchies (Row 12+)...');
    
    let current_heading = null;
    let current_sub_heading = null;
    let current_item_desc = null;
    let item_count = 0;
    
    const headingToIdMap = {};
    let headingCounter = 1;
    const masterItemsData = {};

    for (let rowIdx = 11; rowIdx < data.length; rowIdx++) {
        const row = data[rowIdx];
        if (!row || row.length === 0) continue;

        let rowType = String(row[0] || '').trim().toLowerCase();
        const breakupStr = String(row[1] || '').trim();
        const dept = String(row[2] || '').trim();
        const itemNoRaw = String(row[4] || '').trim();
        const descriptionRaw = String(row[5] || '').trim();
        const uomRaw = String(row[6] || '').trim();

        let has_any_qty = false;
        for (let i = 0; i < numSchemes; i++) {
            if (parseFloat(row[7 + i*3]) > 0) {
                has_any_qty = true;
                break;
            }
        }

        // Force treatment as an item if it has BOQ quantities
        if (has_any_qty && !rowType.includes('item')) {
            rowType = 'item';
        }

        if (rowType.includes('heading') && !rowType.includes('sub')) {
            current_heading = descriptionRaw;
            current_sub_heading = null;
            current_item_desc = null;
            continue;
        } else if (rowType.includes('sub heading')) {
            current_sub_heading = descriptionRaw;
            current_item_desc = null;
            continue;
        } else if (rowType.includes('item description')) {
            current_item_desc = descriptionRaw;
            continue;
        } else if (rowType.includes('item') || (itemNoRaw && descriptionRaw)) {
            if (!itemNoRaw) continue;

            const fullDescription = descriptionRaw || 'Unknown Description';
            const parentHeadingStr = current_item_desc || current_sub_heading || current_heading || 'Uncategorized';

            if (!headingToIdMap[parentHeadingStr]) {
                headingToIdMap[parentHeadingStr] = `heading_${headingCounter++}`;
            }
            const headingId = headingToIdMap[parentHeadingStr];
            const sanitizedItemKey = sanitizeKey(itemNoRaw);
            const masterKey = `ITEM_${sanitizedItemKey}`;
            const majorKey = String(itemNoRaw).split('.')[0];

            let finalBreakups = [];
            // If they provided Type X or a pattern 70/20/5/5
            if (breakupStr && breakupStr !== 'null') {
                if (templates[breakupStr]) {
                    finalBreakups = templates[breakupStr];
                } else if (patternMap[breakupStr]) {
                    finalBreakups = patternMap[breakupStr];
                } else {
                    const percentages = breakupStr.split('/').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                    finalBreakups = percentages.map((p, idx) => ({ percentage: p, stage: `Stage ${idx + 1}` }));
                }
            }

            // Apply global rate
            let global_rate = 0;
            for (let i = 0; i < numSchemes; i++) {
                const swsm_rate = row[7 + (i * 3) + 1];
                if (swsm_rate && !isNaN(parseFloat(swsm_rate))) {
                    global_rate = parseFloat(swsm_rate);
                    break;
                }
            }

            masterItemsData[masterKey] = {
                item_no: itemNoRaw,
                description: fullDescription,
                unit: uomRaw,
                rate: global_rate,
                dept: dept,
                is_heading: false,
                row_index: rowIdx,
                percentage_breakup: finalBreakups.length > 0 ? finalBreakups : null
            };

            let extractedForAnyScheme = false;
            for (const scheme of schemes) {
                const boq_qty = row[scheme.colStart];
                const swsm_rate = row[scheme.colStart + 1];
                const boq_amount = row[scheme.colStart + 2];
                const parsed_qty = parseFloat(boq_qty) || 0;

                if (parsed_qty > 0) {
                    if (!scheme.headings[headingId]) {
                        scheme.headings[headingId] = { 
                            original_heading: parentHeadingStr,
                            items: {} 
                        };
                    }
                    
                    let schemeBreakups = finalBreakups.length > 0 ? finalBreakups : null;
                    
                    // Specific override for Item 32 logic
                    if (majorKey === '32') {
                        if (scheme.tank_category === 'Conventional' && templates['Type 6']) {
                            schemeBreakups = templates['Type 6'];
                        } else if (scheme.tank_category === 'Zinc Alum Steel' && templates['Type 7']) {
                            schemeBreakups = templates['Type 7'];
                        }
                    }

                    scheme.headings[headingId].items[sanitizedItemKey] = {
                        item_no: itemNoRaw,
                        dept: dept,
                        description: fullDescription,
                        uom: uomRaw,
                        boq_qty: parsed_qty,
                        swsm_rate: parseFloat(swsm_rate) || 0,
                        boq_amount: parseFloat(boq_amount) || 0,
                        row_index: rowIdx,
                        percentage_breakup: schemeBreakups
                    };
                    extractedForAnyScheme = true;
                }
            }
            if (extractedForAnyScheme) item_count++;
        }
    }

    console.log('Propagating Breakups Segment-wise for Master Items...');
    const groupBreakups = {};
    Object.values(masterItemsData).forEach(item => {
        const major = item.item_no.split('.')[0];
        // If master has no breakup but it's major 32, default it to Type 7 in master list
        if (major === '32' && !item.percentage_breakup && templates['Type 7']) {
            item.percentage_breakup = templates['Type 7'];
        }
        if (item.percentage_breakup && item.percentage_breakup.length > 0 && !groupBreakups[major]) {
            groupBreakups[major] = item.percentage_breakup;
        }
    });

    Object.values(masterItemsData).forEach(item => {
        const major = item.item_no.split('.')[0];
        if (!item.percentage_breakup && groupBreakups[major]) {
            item.percentage_breakup = groupBreakups[major];
        }
    });
    
    // Also propagate to schemes where it was missed
    schemes.forEach(s => {
        Object.values(s.headings).forEach(h => {
            Object.values(h.items).forEach(item => {
                if (!item.percentage_breakup) {
                    const major = String(item.item_no).split('.')[0];
                    if (groupBreakups[major]) {
                        item.percentage_breakup = groupBreakups[major];
                    }
                }
            });
        });
    });
    
    console.log(`Parsed items with >0 BOQ QTY in at least one scheme: ${item_count}`);
    console.log(`Total Master Items Generated: ${Object.keys(masterItemsData).length}`);
    
    console.log('Wiping existing /schemes and /billing/master_items from Firebase...');
    await db.ref('schemes').remove();
    await db.ref('billing/master_items').remove();
    
    console.log('Pushing parsed data to Firebase schemes...');
    const uploadData = {};
    schemes.forEach(s => {
        uploadData[s.id] = {
            block_name: s.block_name,
            scheme_name: s.scheme_name,
            scheme_no: s.scheme_no,
            tank_category: s.tank_category,
            total_amount: s.total_amount,
            headings: s.headings
        };
    });
    await db.ref('schemes').set(uploadData);

    console.log('Pushing parsed data to Firebase master_items...');
    await db.ref('billing/master_items').set(masterItemsData);

    console.log('--- SEEDING COMPLETE ---');
    process.exit(0);
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});
