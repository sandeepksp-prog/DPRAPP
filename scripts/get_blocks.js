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
  
  const blocks = new Set();
  Object.values(schemes).forEach(s => {
    if (s.block_name) blocks.add(s.block_name);
  });
  
  console.log('Distinct blocks in database:', Array.from(blocks));
  process.exit(0);
}

run().catch(console.error);
