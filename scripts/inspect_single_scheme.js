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
  const snapshot = await db.ref('schemes').once('value');
  const schemes = snapshot.val() || {};
  const keys = Object.keys(schemes);
  console.log('Total schemes in database:', keys.length);
  if (keys.length > 0) {
    const firstKey = keys[0];
    console.log('First scheme key:', firstKey);
    console.log('First scheme metadata:', {
      scheme_name: schemes[firstKey].scheme_name,
      block_name: schemes[firstKey].block_name,
      total_amount: schemes[firstKey].total_amount,
      basic_info: schemes[firstKey].basic_info
    });
    if (schemes[firstKey].headings) {
      const headingsKeys = Object.keys(schemes[firstKey].headings);
      console.log('Headings keys:', headingsKeys);
      const firstHeadingKey = headingsKeys[0];
      const heading = schemes[firstKey].headings[firstHeadingKey];
      console.log('First heading metadata:', {
        name: heading.name,
        code: heading.code
      });
      if (heading.items) {
        const itemsKeys = Object.keys(heading.items);
        console.log('Items keys under first heading:', itemsKeys);
        console.log('First item:', heading.items[itemsKeys[0]]);
      }
    }
  }

  // Also inspect ra_records for the first key if they exist
  const raSnapshot = await db.ref(`billing/ra_records/${keys[0]}`).once('value');
  if (raSnapshot.exists()) {
    console.log('RA records exist for first scheme. Sample:', JSON.stringify(raSnapshot.val()).substring(0, 1000));
  } else {
    console.log('No RA records for first scheme in database.');
  }

  process.exit(0);
}

run().catch(console.error);
