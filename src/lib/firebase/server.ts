import * as admin from 'firebase-admin';

function getFirebaseAdmin() {
    if (!admin.apps.length) {
        try {
            const projectId = process.env.FIREBASE_PROJECT_ID;
            const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
            const privateKey = process.env.FIREBASE_PRIVATE_KEY;

            if (projectId && clientEmail && privateKey) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId,
                        clientEmail,
                        privateKey: privateKey.replace(/\\n/g, '\n'),
                    }),
                    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
                    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                });
                console.log('Firebase Admin SDK Initialized Successfully');
            } else {
                console.warn('Firebase Admin SDK: Missing credentials (expected during build time)');
            }
        } catch (error) {
            console.error('Firebase Admin Initialization Error:', error);
        }
    }
    return admin;
}

export const db = {
    ref(path?: string) {
        getFirebaseAdmin();
        if (!admin.apps.length) {
            console.warn("Firebase Admin not initialized, returning mock ref for path:", path);
            return {
                once: async () => ({
                    exists: () => false,
                    val: () => ({})
                })
            } as any;
        }
        return admin.database().ref(path);
    }
} as admin.database.Database;

export const storage = {
    bucket(name?: string) {
        getFirebaseAdmin();
        if (!admin.apps.length) {
            return {} as any;
        }
        return admin.storage().bucket(name);
    }
} as any;

export default admin;
