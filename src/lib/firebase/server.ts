import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle newlines securely passed through .env format
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
        console.log('Firebase Admin SDK Initialized Successfully');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

export const db = admin.database();
export const storage = admin.storage().bucket();
export default admin;
