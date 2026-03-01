import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local explicitly since Next.js doesn't run this automatically in standalone scripts
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Setup Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
}
const db = admin.database();

/**
 * Mocks the initial state flattening for Firebase NoSQL schema
 * This script serves to hydrate tracking tables
 */
async function seedFirebase() {
    console.log("Seeding Firebase Realtime Database...");

    // The raw structure for Firebase based on the NoSQL flattened plan
    const initialData = {
        schemes: {
            "SCHEME_20070355": {
                basic_info: { name: "DADUPUR KHURD", block: "ALIGANJ", district: "ETAH", status: "ACTIVE" },
                scope_matrix: { oht: 1, pump_house: 1, fhtc_target: 450 },
                achieved: { oht: 1, pump_house: 0, fhtc_done: 450 }
            },
            "SCHEME_20070442": {
                basic_info: { name: "MUMIYA KHERA", block: "ALIGANJ", district: "ETAH", status: "ACTIVE" },
                scope_matrix: { oht: 1, pump_house: 1, fhtc_target: 320 },
                achieved: { oht: 0, pump_house: 0, fhtc_done: 100 }
            }
        },
        financials: {
            "SCHEME_20070355": {
                total_budget: 15000000,
                capital_spent: 12500000,
                pending_vendor_po: 450000,
                jmr_approved_value: 8500000
            }
        },
        issues: {
            "ISSUE_101": {
                scheme_id: "SCHEME_20070442",
                category: "LAND_DISPUTE",
                severity: "CRITICAL",
                status: "OPEN",
                logged_date: Date.now() - 86400000 * 5, // 5 days ago
                doc_ref_url: ""
            }
        }
    };

    try {
        await db.ref('/').update(initialData);
        console.log("Firebase Database populated successfully with flattened Scheme Structure!");
    } catch (err) {
        console.error("Firebase write error:", err);
    } finally {
        process.exit(0);
    }
}

seedFirebase();
