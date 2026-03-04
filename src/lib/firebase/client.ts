import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    // Injecting fallback configuration for immediate local testing
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kspl-pmx",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://kspl-pmx-default-rtdb.firebaseio.com",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "kspl-pmx.appspot.com",
};

// Initialize Firebase efficiently to prevent Next.js HMR duplication
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const storage = getStorage(app);

export { app, db, storage };
