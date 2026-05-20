const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  });
}

const db = admin.database();

async function run() {
  const snapshot = await db.ref('billing/ra_records').once('value');
  const records = snapshot.val() || {};
  console.log(`Loaded RA records from Firebase.`);

  const itemProgress = {};

  Object.entries(records).forEach(([schemeId, divisions]) => {
    Object.entries(divisions).forEach(([divName, raRecords]) => {
      Object.entries(raRecords).forEach(([raId, record]) => {
        // Only count submitted/approved records or all?
        // Let's count them if they have items
        if (!record.items) return;
        record.items.forEach(item => {
          const itemNo = item.item_no || '';
          if (!itemNo) return;
          const eq = parseFloat(item.eq) || 0; // executed quantity in this RA
          if (eq <= 0) return;

          if (!itemProgress[itemNo]) {
            itemProgress[itemNo] = {
              schemes: new Set(),
              totalExecuted: 0
            };
          }
          itemProgress[itemNo].schemes.add(schemeId);
          itemProgress[itemNo].totalExecuted += eq;
        });
      });
    });
  });

  console.log('\n--- LIVE EXECUTION PROGRESS FROM RA RECORDS ---');
  if (Object.keys(itemProgress).length === 0) {
    console.log("No execution progress found in RA records.");
  } else {
    Object.entries(itemProgress).sort().forEach(([itemNo, data]) => {
      console.log(`Item [${itemNo}]:`);
      console.log(`  - Schemes with progress: ${Array.from(data.schemes).join(', ')}`);
      console.log(`  - Total Executed Qty: ${data.totalExecuted}`);
    });
  }

  process.exit(0);
}

run().catch(console.error);
