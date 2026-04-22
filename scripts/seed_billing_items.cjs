const xlsx = require('xlsx');
const admin = require('firebase-admin');

// Initialize Firebase Admin using the secure service account credentials
const serviceAccount = require('d:/KSPL/DPR-APP/DATA/kspl-pmx-firebase-adminsdk-fbsvc-a6df2e5acf.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kspl-pmx-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function seedBillingItems() {
    console.log('Reading KSPL PMS ITEM LIST.xlsx...');
    const workbook = xlsx.readFile('d:/KSPL/DPR-APP/BILLING DATA/KSPL PMS ITEM LIST.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Start from row 2 essentially, skipping headers if we define them manually, or use header: 1
    const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    console.log(`Found ${rawData.length} rows. Processing payload...`);

    const itemsPayload = {};
    let currentParentHeading = null;
    let validItemCount = 0;
    let headingCount = 0;

    // Row 0 is the heading row ["S.No.", "Item No", "DESCRIPTION", "UNIT", "RATE"]
    for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length < 2) continue; // Skip totally empty rows

        const itemNo = row[1] !== undefined ? String(row[1]).trim() : '';
        const description = row[2] !== undefined ? String(row[2]).trim() : '';
        const unit = row[3] !== undefined ? String(row[3]).trim() : '';
        const rate = row[4] !== undefined ? parseFloat(row[4]) : 0;

        if (!itemNo || !description) continue;

        // Determine if this is a Billable Item or a Category/Heading
        const isBillable = (unit !== '' || rate > 0);
        
        // Clean key (Firebase keys cannot contain ., #, $, [, or ])
        const safeItemKey = "ITEM_" + itemNo.replace(/\./g, '_');

        if (!isBillable) {
            // It's a heading
            currentParentHeading = itemNo;
            itemsPayload[safeItemKey] = {
                item_no: itemNo,
                description: description,
                is_heading: true,
                children: [] // Optional tracking array
            };
            headingCount++;
        } else {
            // It's a billable item
            itemsPayload[safeItemKey] = {
                item_no: itemNo,
                description: description,
                unit: unit,
                rate: rate,
                is_heading: false,
                parent_heading: currentParentHeading || "ROOT"
            };
            validItemCount++;
            
            // Optionally link child to parent
            if (currentParentHeading) {
                const parentKey = "ITEM_" + currentParentHeading.replace(/\./g, '_');
                if (itemsPayload[parentKey] && itemsPayload[parentKey].children) {
                    itemsPayload[parentKey].children.push(itemNo);
                }
            }
        }
    }

    console.log(`Extraction Complete: ${headingCount} Headings, ${validItemCount} Billable Items.`);
    console.log(`Writing ${Object.keys(itemsPayload).length} total nodes directly to Firebase Realtime Database...`);

    try {
        await db.ref('billing/master_items').set(itemsPayload);
        console.log('✅ Successfully seeded Firebase DB with Billing Master Items!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to seed Firebase:', error);
        process.exit(1);
    }
}

seedBillingItems();
