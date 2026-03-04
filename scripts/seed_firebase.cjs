const xlsx = require('xlsx');
const admin = require('firebase-admin');

// Initialize Firebase Admin using the secure service account credentials
const serviceAccount = require('d:/KSPL/DPR-APP/DATA/kspl-pmx-firebase-adminsdk-fbsvc-a6df2e5acf.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kspl-pmx-default-rtdb.firebaseio.com" // Update this if your RTDB URL differs
});

const db = admin.database();

async function seedDatabase() {
    console.log('Reading SCHEME DETAILS.xlsx...');
    const workbook = xlsx.readFile('d:/KSPL/DPR-APP/DATA/SCHEME DETAILS.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    console.log(`Found ${rawData.length} rows. Processing payload...`);

    const schemesPayload = {};

    rawData.forEach(row => {
        if (!row['Scheme ID'] || !row['Schemes']) return;

        // Generate the standard Firebase Key
        const schemeKey = "SCHEME_ID_" + row['Scheme ID'];

        let rawBlock = row['Block'] || 'UNKNOWN';
        let normalizedBlock = rawBlock.toString().trim().toUpperCase();
        if (normalizedBlock === 'MARHERA') {
            normalizedBlock = 'MAREHRA';
        }

        schemesPayload[schemeKey] = {
            basic_info: {
                id: row['Scheme ID'],
                name: row['Schemes'],
                block: normalizedBlock,
                priority: row['PRIORITY'] ? parseInt(row['PRIORITY'], 10) : 99,
                status: 'ACTIVE'
            },
            // Generating baseline scopes (can be updated later by real forms, simulating JJM scope matrix)
            scope_matrix: {
                oht: 1,
                pump_house: 1,
                borewell: 1,
                boundary_wall: 1,
                solar: 1
            },
            achieved: {
                oht: 0,
                pump_house: 0,
                borewell: 0,
                boundary_wall: 0,
                solar: 0
            },
            issues: {
                total: 0
            }
        };
    });

    console.log(`Writing ${Object.keys(schemesPayload).length} schemes directly to Firebase Realtime Database...`);

    try {
        await db.ref('schemes').set(schemesPayload);
        console.log('✅ Successfully seeded Firebase DB with Scheme Details!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to seed Firebase:', error);
        process.exit(1);
    }
}

seedDatabase();
