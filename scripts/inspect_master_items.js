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
  const snapshot = await db.ref('billing/master_items').once('value');
  const items = snapshot.val() || {};
  console.log(`Loaded ${Object.keys(items).length} master items.`);
  
  // Let's print some items with their numbers and names
  const sortedItems = Object.values(items).sort((a, b) => {
    // compare item numbers numerically/alphabetically
    return a.item_no.localeCompare(b.item_no, undefined, { numeric: true, sensitivity: 'base' });
  });

  console.log('\n--- FIRST 100 MASTER ITEMS ---');
  sortedItems.slice(0, 100).forEach(item => {
    console.log(`[${item.item_no}] (${item.unit}) [Rates: ${item.rate}] - ${item.item_name.substring(0, 80)}`);
  });

  // Let's find specific keywords
  console.log('\n--- DETECTING KEYWORDS ---');
  const keywords = ['oht', 'tank', 'pump', 'borewell', 'tubewell', 'boundary', 'solar', 'sensor', 'automation', 'pipe', 'fhtc', 'connection', 'house'];
  keywords.forEach(kw => {
    const matches = sortedItems.filter(item => item.item_name.toLowerCase().includes(kw));
    console.log(`Keyword "${kw}": ${matches.length} items. Example:`);
    matches.slice(0, 3).forEach(m => console.log(`  - [${m.item_no}] ${m.item_name.substring(0, 60)}`));
  });

  process.exit(0);
}

run().catch(console.error);
