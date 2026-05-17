const admin = require('firebase-admin');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
});

const db = admin.database();

async function buildMetaIndex() {
    console.log('Building lightweight /scheme_list index...');
    const snap = await db.ref('schemes').once('value');
    if (!snap.exists()) { console.log('No schemes found.'); process.exit(1); }

    const data = snap.val();
    const metaList = {};
    Object.keys(data).forEach(id => {
        const s = data[id];
        // Count items
        let itemCount = 0;
        const headings = s.headings || {};
        Object.values(headings).forEach((h) => {
            itemCount += Object.keys(h.items || {}).length;
        });
        metaList[id] = {
            scheme_name:   s.scheme_name   || '',
            block_name:    s.block_name    || '',
            scheme_no:     s.scheme_no     || '',
            tank_category: s.tank_category || '',
            total_amount:  s.total_amount  || 0,
            item_count:    itemCount
        };
    });

    await db.ref('scheme_list').set(metaList);
    console.log(`Built scheme_list with ${Object.keys(metaList).length} entries.`);
    process.exit(0);
}

buildMetaIndex().catch(e => { console.error(e); process.exit(1); });
