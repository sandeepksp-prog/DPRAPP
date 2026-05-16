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
    console.log('--- STARTING AI-READY HIERARCHICAL DATABASE SEEDING ---');
    const filePath = 'd:\\KSPL\\DPR-APP\\BILLING DATA\\KSPL PMS-DATA.xlsx';
    console.log(`Reading Excel file: ${filePath}`);
    const workbook = xlsx.readFile(filePath);
    const sheetName = 'Schemewise_DPR_Qty&Rate';
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
    let current_active_heading = null;
    let item_count = 0;
    
    // Create a mapping from full heading text to short ID
    const headingToIdMap = {};
    let headingCounter = 1;

    for (let rowIdx = 11; rowIdx < data.length; rowIdx++) {
        const row = data[rowIdx];
        if (!row || row.length === 0) continue;
        
        const dept = row[1];
        const itemNo = row[3];
        const description = row[4];
        const uom = row[5];
        
        // Check for head
        if (String(uom).trim().toUpperCase() === 'HEAD' || (!itemNo && description && typeof description === 'string' && description.trim() !== '')) {
            current_active_heading = description ? String(description).trim() : current_active_heading;
            continue;
        }
        
        if (!itemNo || String(itemNo).trim() === '') continue;
        
        const cleanItemNo = String(itemNo).trim();
        const cleanDescription = description ? String(description).trim() : '';
        const cleanUom = uom ? String(uom).trim() : '';
        const cleanDept = dept ? String(dept).trim() : '';
        const cleanHeading = current_active_heading ? current_active_heading.trim() : 'Uncategorized';
        
        if (!headingToIdMap[cleanHeading]) {
            headingToIdMap[cleanHeading] = `heading_${headingCounter++}`;
        }
        const headingId = headingToIdMap[cleanHeading];

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
                        original_heading: cleanHeading,
                        items: {} 
                    };
                }
                
                scheme.headings[headingId].items[sanitizedItemKey] = {
                    item_no: cleanItemNo,
                    dept: cleanDept,
                    description: cleanDescription,
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
    
    console.log('Wiping existing /schemes from Firebase...');
    await db.ref('schemes').remove();
    
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
