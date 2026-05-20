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
  const snapshot = await db.ref().once('value');
  const root = snapshot.val() || {};
  console.log(`Database top-level keys:`, Object.keys(root));
  
  // check if there is an igrs key or issues key
  if (root.igrs) {
    console.log(`igrs count:`, Object.keys(root.igrs).length);
  }
  if (root.issues) {
    console.log(`issues count:`, Object.keys(root.issues).length);
  }
  
  process.exit(0);
}

run().catch(console.error);
