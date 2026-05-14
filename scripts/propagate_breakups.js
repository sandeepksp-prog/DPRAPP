const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
});

admin.database().ref('billing/master_items').once('value').then(snap => {
  const data = snap.val() || {};
  const groupBreakups = {};
  
  Object.values(data).forEach(item => {
    const major = item.item_no.split('.')[0];
    if (item.percentage_breakup && item.percentage_breakup.length > 0 && !groupBreakups[major]) {
      groupBreakups[major] = item.percentage_breakup;
    }
  });

  let updatedCount = 0;
  const updates = {};
  
  Object.keys(data).forEach(k => {
    const item = data[k];
    const major = item.item_no.split('.')[0];
    
    if (groupBreakups[major]) {
      if (!item.percentage_breakup || JSON.stringify(item.percentage_breakup) !== JSON.stringify(groupBreakups[major])) {
        updates['billing/master_items/' + k + '/percentage_breakup'] = groupBreakups[major];
        updatedCount++;
      }
    }
  });

  if (updatedCount > 0) {
    admin.database().ref().update(updates).then(() => {
      console.log('Successfully updated', updatedCount, 'items with propagated breakups!');
      process.exit(0);
    }).catch(e => {
      console.error(e);
      process.exit(1);
    });
  } else {
    console.log('No items needed updating.');
    process.exit(0);
  }
});
