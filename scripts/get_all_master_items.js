const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
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
  const snapshot = await db.ref('billing/master_items').once('value');
  const items = snapshot.val() || {};
  
  const sortedItems = Object.values(items).sort((a, b) => {
    return a.item_no.localeCompare(b.item_no, undefined, { numeric: true, sensitivity: 'base' });
  });

  let output = '';
  sortedItems.forEach(item => {
    output += `[${item.item_no}] (${item.unit}) [Rate: ${item.rate}] (Dept: ${item.dept || ''}) - ${item.item_name}\n`;
  });

  fs.writeFileSync('scripts/all_master_items_dump.txt', output);
  console.log(`Saved ${sortedItems.length} items to scripts/all_master_items_dump.txt`);
  process.exit(0);
}

run().catch(console.error);
