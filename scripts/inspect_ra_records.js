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
  console.log(`Loaded RA records. Keys present:`, Object.keys(records));

  // Let's print the structure of one of the records, if any exist
  const firstScheme = Object.keys(records)[0];
  if (firstScheme) {
    console.log(`\nSample records for scheme: ${firstScheme}`);
    console.log(JSON.stringify(records[firstScheme], null, 2).substring(0, 1500));
  } else {
    console.log("No RA records found in billing/ra_records.");
  }

  process.exit(0);
}

run().catch(console.error);
