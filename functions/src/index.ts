import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import { HttpsError } from 'firebase-functions/lib/providers/https';

cors({ origin: true });

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((_request, response) => {
    response.send("Hello from Firebase Cloud Functions!");
});

export const test = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new HttpsError("permission-denied", "You need permissions");
    }
});
