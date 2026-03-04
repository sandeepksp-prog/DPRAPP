const admin = require('firebase-admin');
const serviceAccount = require('d:/KSPL/DPR-APP/DATA/kspl-pmx-firebase-adminsdk-fbsvc-a6df2e5acf.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kspl-pmx-default-rtdb.firebaseio.com"
});

const db = admin.database();

const rules = {
    rules: {
        ".read": true,
        ".write": true
    }
};

db.setRules(rules).then(() => {
    console.log('✅ Firebase RTDB rules updated to public Read/Write.');
    process.exit(0);
}).catch(err => {
    console.error('❌ Error updating rules:', err);
    process.exit(1);
});
