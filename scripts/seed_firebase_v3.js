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
    console.log('--- STARTING AI-READY HIERARCHICAL DATABASE SEEDING V3 ---');
    const filePath = 'd:\\KSPL\\DPR-APP\\BILLING DATA\\KSPL PMS-DATA.xlsx';
    console.log(`Reading Excel file: ${filePath}`);
    const workbook = xlsx.readFile(filePath);
    const sheetName = 'BOQ';
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        throw new Error(`Sheet ${sheetName} not found!`);
    }

    const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
    
    // Parse Schemes (Cols G to EW)
    console.log('Extracting scheme metadata...');
    const schemes = [];
    const numSchemes = 49;
    
    for (let i = 0; i < numSchemes; i++) {
        const colIdx = 6 + (i * 3);
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
    
    // Extract BOQ Items
    console.log('Extracting Master BOQ & Hierarchies (Row 12+)...');
    
    const major_headings = {};
    let current_sub_headings = [];
    let prev_was_heading = false;

    let item_count = 0;
    
    const headingToIdMap = {};
    let headingCounter = 1;

    for (let rowIdx = 11; rowIdx < data.length; rowIdx++) {
        const row = data[rowIdx];
        if (!row || row.length === 0) continue;
        
        const dept = row[1];
        const itemNoRaw = row[3];
        const descriptionRaw = row[4];
        const uomRaw = row[5];
        
        const cleanItemNo = itemNoRaw ? String(itemNoRaw).trim() : '';
        const cleanDescription = descriptionRaw ? String(descriptionRaw).trim() : '';
        const cleanUom = uomRaw ? String(uomRaw).trim() : '';
        const cleanDept = dept ? String(dept).trim() : '';
        
        // Determine if it is a heading
        // Rate from the first scheme (col H is index 7) to check if rate is null
        let rate_is_null = true;
        for (let i = 0; i < numSchemes; i++) {
            if (row[6 + (i * 3) + 1]) {
                rate_is_null = false;
                break;
            }
        }
        
        const isHeading = (cleanUom.toUpperCase() === 'HEAD') || 
                          (!cleanItemNo && cleanDescription) || 
                          (cleanItemNo && cleanDescription && rate_is_null);
        
        if (isHeading) {
            if (!cleanItemNo || !cleanItemNo.includes('.')) {
                // Major Heading
                const majorKey = cleanItemNo || `UNCATEGORIZED_${rowIdx}`;
                major_headings[majorKey] = cleanDescription;
                current_sub_headings = [];
            } else {
                // Sub Heading
                if (prev_was_heading) {
                    current_sub_headings.push(cleanDescription);
                } else {
                    current_sub_headings.pop();
                    current_sub_headings.push(cleanDescription);
                }
            }
            prev_was_heading = true;
            continue;
        }
        
        // It's an item!
        prev_was_heading = false;
        
        if (!cleanItemNo) continue;

        // Build the full description based on hierarchy
        const majorKey = cleanItemNo.split('.')[0];
        const majorDesc = major_headings[majorKey] || '';
        
        let fullDescriptionParts = [];
        if (majorDesc) fullDescriptionParts.push(majorDesc);
        if (current_sub_headings.length > 0) fullDescriptionParts.push(...current_sub_headings);
        fullDescriptionParts.push(cleanDescription);
        
        const fullDescription = fullDescriptionParts.join(' - ');
        const parentHeadingStr = current_sub_headings.length > 0 ? current_sub_headings[current_sub_headings.length - 1] : (majorDesc || 'Uncategorized');

        if (!headingToIdMap[parentHeadingStr]) {
            headingToIdMap[parentHeadingStr] = `heading_${headingCounter++}`;
        }
        const headingId = headingToIdMap[parentHeadingStr];
        const sanitizedItemKey = sanitizeKey(cleanItemNo);
        
        let extractedForAnyScheme = false;
        for (const scheme of schemes) {
            const boq_qty = row[scheme.colStart];
            const swsm_rate = row[scheme.colStart + 1];
            const boq_amount = row[scheme.colStart + 2];
            
            // Only add if there is qty or rate or amount
            if (boq_qty || swsm_rate || boq_amount) {
                if (!scheme.headings[headingId]) {
                    scheme.headings[headingId] = { 
                        original_heading: parentHeadingStr,
                        items: {} 
                    };
                }
                
                scheme.headings[headingId].items[sanitizedItemKey] = {
                    item_no: cleanItemNo,
                    dept: cleanDept,
                    description: fullDescription, // STORE FULL DESCRIPTION HERE!
                    uom: cleanUom,
                    boq_qty: parseFloat(boq_qty) || 0,
                    swsm_rate: parseFloat(swsm_rate) || 0,
                    boq_amount: parseFloat(boq_amount) || 0
                };
                extractedForAnyScheme = true;
            }
        }
        if (extractedForAnyScheme) item_count++;
    }
    
    console.log(`Parsed items with data: ${item_count}`);
    
    console.log('Wiping existing /schemes and /billing/master_items from Firebase...');
    await db.ref('schemes').remove();
    // We also must wipe master_items because the old one doesn't have the full descriptions!
    // Actually, since MasterDatabaseSetup reads description from schemes now, we don't strictly need to wipe it.
    
    console.log('Pushing parsed data to Firebase...');
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
    console.log('--- SEEDING COMPLETE ---');
    process.exit(0);
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});
