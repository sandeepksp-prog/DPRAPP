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
  console.log(`Loaded ${Object.keys(schemes).length} schemes from Firebase.`);

  // Let's analyze what items are present in each scheme
  // We'll aggregate BOQ quantities for key components
  const results = {
    oht: { count: 0, items: new Set(), totalQty: 0 },
    pumphouse: { count: 0, items: new Set(), totalQty: 0 },
    borewell: { count: 0, items: new Set(), totalQty: 0 },
    boundary: { count: 0, items: new Set(), totalQty: 0 },
    solar: { count: 0, items: new Set(), totalQty: 0 },
    sensors: { count: 0, items: new Set(), totalQty: 0 },
    pipeline: { count: 0, items: new Set(), totalQty: 0 },
    fhtc: { count: 0, items: new Set(), totalQty: 0 }
  };

  Object.entries(schemes).forEach(([id, scheme]) => {
    if (!scheme.headings) return;
    Object.values(scheme.headings).forEach(heading => {
      if (!heading.items) return;
      Object.values(heading.items).forEach(item => {
        const itemNo = item.item_no || '';
        const qty = parseFloat(item.boq_qty) || 0;
        if (qty <= 0) return;

        // OHT Staging (32.xx)
        if (itemNo.startsWith('32.')) {
          results.oht.count++;
          results.oht.items.add(itemNo);
          results.oht.totalQty += qty;
        }

        // Pump House (29, 30)
        if (itemNo === '29' || itemNo === '30') {
          results.pumphouse.count++;
          results.pumphouse.items.add(itemNo);
          results.pumphouse.totalQty += qty;
        }

        // Submersible pumps / Borewells (7.xx or 2.xx Rig)
        if (itemNo.startsWith('7.') && itemNo !== '7.15') {
          results.borewell.count++;
          results.borewell.items.add(itemNo);
          results.borewell.totalQty += qty;
        }

        // Boundary wall (21)
        if (itemNo === '21') {
          results.boundary.count++;
          results.boundary.items.add(itemNo);
          results.boundary.totalQty += qty;
        }

        // Solar (20)
        if (itemNo === '20') {
          results.solar.count++;
          results.solar.items.add(itemNo);
          results.solar.totalQty += qty;
        }

        // Sensors (8, 10, 11, 49)
        if (itemNo === '8' || itemNo === '10' || itemNo === '11' || itemNo === '49') {
          results.sensors.count++;
          results.sensors.items.add(itemNo);
          results.sensors.totalQty += qty;
        }

        // Pipeline (40.xx is DI/CI, 41.xx is HDPE)
        if (itemNo.startsWith('40.') || itemNo.startsWith('41.')) {
          results.pipeline.count++;
          results.pipeline.items.add(itemNo);
          results.pipeline.totalQty += qty;
        }

        // FHTC (53)
        if (itemNo === '53') {
          results.fhtc.count++;
          results.fhtc.items.add(itemNo);
          results.fhtc.totalQty += qty;
        }
      });
    });
  });

  console.log('\n--- AGGREGATED BOQ ANALYSIS ---');
  Object.entries(results).forEach(([cat, res]) => {
    console.log(`${cat.toUpperCase()}:`);
    console.log(`  - Active occurrences in schemes: ${res.count}`);
    console.log(`  - Unique item codes matched: ${Array.from(res.items).sort().join(', ')}`);
    console.log(`  - Total BOQ Quantity across all schemes: ${res.totalQty}`);
  });

  // Let's print a few schemes and their counts of pumphouses, oht and pumps
  console.log('\n--- SAMPLE SCHEMES DETAILED COUNTS ---');
  let printCount = 0;
  Object.entries(schemes).forEach(([id, scheme]) => {
    if (printCount >= 10) return;
    let ohtCount = 0;
    let pHouseCount = 0;
    let pumpCount = 0;
    let fhtcCount = 0;
    let pipelineLength = 0;

    if (scheme.headings) {
      Object.values(scheme.headings).forEach(heading => {
        if (!heading.items) return;
        Object.values(heading.items).forEach(item => {
          const itemNo = item.item_no || '';
          const qty = parseFloat(item.boq_qty) || 0;
          if (qty <= 0) return;

          if (itemNo.startsWith('32.')) ohtCount += qty;
          if (itemNo === '29' || itemNo === '30') pHouseCount += qty;
          if (itemNo.startsWith('7.') && itemNo !== '7.15') pumpCount += qty;
          if (itemNo === '53') fhtcCount += qty;
          if (itemNo.startsWith('40.') || itemNo.startsWith('41.')) pipelineLength += qty; // in meters
        });
      });
    }

    console.log(`Scheme [${id}] - Name: ${scheme.scheme_name} (Tank: ${scheme.tank_category})`);
    console.log(`  - OHT count: ${ohtCount}`);
    console.log(`  - Pump House count: ${pHouseCount}`);
    console.log(`  - Pump count (Borewell): ${pumpCount}`);
    console.log(`  - FHTC connection count: ${fhtcCount}`);
    console.log(`  - Pipeline length: ${(pipelineLength / 1000).toFixed(2)} km`);
    printCount++;
  });

  process.exit(0);
}

run().catch(console.error);
