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
    console.log('--- STARTING AI-READY HIERARCHICAL DATABASE SEEDING V5 ---');
    
    // Fetch existing master items to preserve stage names
    let existingMasterItems = {};
    const snap = await db.ref('billing/master_items').once('value');
    if (snap.exists()) {
        existingMasterItems = snap.val();
        console.log(`Fetched ${Object.keys(existingMasterItems).length} existing master items to preserve descriptions.`);
    }

    const filePath = 'd:\\KSPL\\DPR-APP\\BILLING DATA\\KSPL PMS-DATA.xlsx';
    console.log(`Reading Excel file: ${filePath}`);
    const workbook = xlsx.readFile(filePath);
    const sheetName = 'BOQ';
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found!`);
    }

    const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
    
    console.log('Extracting scheme metadata...');
    const schemes = [];
    const numSchemes = 49;
    
    for (let i = 0; i < numSchemes; i++) {
        // Data shifted by 1 col
        const colIdx = 7 + (i * 3);
        const total_amount = data[3]?.[colIdx];
        const scheme_id = data[4]?.[colIdx];
        const block_name = data[5]?.[colIdx];
        const scheme_name = data[6]?.[colIdx];
        const scheme_no = data[7]?.[colIdx];
        
        if (scheme_id) {
            schemes.push({
                index: i,
                colStart: colIdx,
                id: String(scheme_id).trim(),
                block_name: block_name || '',
                scheme_name: scheme_name || '',
                scheme_no: scheme_no || '',
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
            if (parseFloat(row[7 + i*3]) > 0) has_any_qty = true;
        }

        // Force treatment as an item if it has BOQ quantities, despite being mislabeled
        if (has_any_qty && !rowType.includes('item')) {
            rowType = 'item';
        }

        // Check if it's a structural row
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
            // It's an item!
            if (!itemNoRaw) continue;

            const fullDescription = descriptionRaw || 'Unknown Description';
            const parentHeadingStr = current_item_desc || current_sub_heading || current_heading || 'Uncategorized';

            if (!headingToIdMap[parentHeadingStr]) {
                headingToIdMap[parentHeadingStr] = `heading_${headingCounter++}`;
            }
            const headingId = headingToIdMap[parentHeadingStr];
            const sanitizedItemKey = sanitizeKey(itemNoRaw);
            const masterKey = `ITEM_${sanitizedItemKey}`;

            // Parse Breakup logic with smart template matching
            let finalBreakups = [];
            if (breakupStr && breakupStr !== 'null') {
                const percentages = breakupStr.split('/').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                const templateMap = {
                    '55/20/10/5/5/5': ['Transportaion & Delivery of Boring Machine', 'Borewell Drilling', 'Tubewell Lowering', 'Tubewell Development (Compressor & OP)', 'Testing', 'Commissioning'],
                    '70/20/5/5': ['Supply & Delivery of Material', 'Completion of Erection fixing & Jointing', 'Testing', 'Commissioning'],
                    '100': ['Completion of Work'],
                    '15/25/35/15/10': ['Earthwork & PCC', 'RCC up to Plinth', 'RCC above Plinth', 'Finishing & Plastering', 'Testing & Commissioning'],
                    '50/25/25': ['Survey', 'Design', 'Approval']
                };
                
                const templateMatch = templateMap[percentages.join('/')];
                
                finalBreakups = percentages.map((p, idx) => {
                    let stageName = templateMatch ? templateMatch[idx] : `Stage ${idx + 1}`;
                    return { percentage: p, stage: stageName };
                });
            }

            // Find the global rate for this item (from any scheme where it is populated)
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
                    
                    scheme.headings[headingId].items[sanitizedItemKey] = {
                        item_no: itemNoRaw,
                        dept: dept,
                        description: fullDescription,
                        uom: uomRaw,
                        boq_qty: parsed_qty,
                        swsm_rate: parseFloat(swsm_rate) || 0,
                        boq_amount: parseFloat(boq_amount) || 0,
                        row_index: rowIdx
                    };
                    extractedForAnyScheme = true;
                }
            }
            if (extractedForAnyScheme) item_count++;
        }
    }

    // Phase 2: Propagate breakups group-wise for items that missed out
    console.log('Propagating Breakups Segment-wise...');
    const groupBreakups = {};
    Object.values(masterItemsData).forEach(item => {
        const major = item.item_no.split('.')[0];
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
