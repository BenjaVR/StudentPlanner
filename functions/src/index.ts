import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { CallableContext, HttpsError } from "firebase-functions/lib/providers/https";
import { ISchool, validateSchool } from "./shared/models/School";
import { IFirebaseFunctionParam } from "./shared/firebase/interfaces";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

export const test = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new HttpsError("permission-denied", "You need permissions");
    }
});

export const addSchool = functions.https.onCall((param: IFirebaseFunctionParam<ISchool>, context: CallableContext) => {
    return new Promise(((resolve, reject) => {
        if (validateSchool(param.data).hasErrors) {
            // TODO: failed!
        }
    }));
});

/////////////////////////////
// Authentication triggers //
/////////////////////////////

/**
 * Disables users after they sign up. This prevents random people somehow succeeded to sign up from logging in.
 */
export const disableUserAfterSignUp = functions.auth.user().onCreate((user: admin.auth.UserRecord): void => {
    auth.updateUser(user.uid, {
        disabled: true,
    });
});
