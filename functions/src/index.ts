import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { UserRecord } from "firebase-functions/lib/providers/auth";
import { CallableContext, HttpsError } from "firebase-functions/lib/providers/https";
import { schoolsCollection } from "./shared/firebase/firestoreConstants";
import { IFirebaseFunctionParam as Param } from "./shared/firebase/interfaces";
import { ISchool, validateSchool } from "./shared/models/School";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

///////////////
// Utilities //
///////////////

function checkAuthentication(context: CallableContext): void {
    if (!context.auth) {
        throw new HttpsError("unauthenticated", "You need permissions"); // TODO: translate
    }
}

function errorCallback(details: any): void {
    throw new HttpsError("unknown", "Something went wrong... Please try again later!", details); // TODO: translate
}

/////////////////////////
// Database operations //
/////////////////////////

export const addSchool = functions.https.onCall((param: Param<ISchool>, context): Promise<ISchool> => {
    checkAuthentication(context);

    return new Promise<ISchool>(((resolve) => {
        const validated = validateSchool(param.data);
        if (validated.hasErrors()) {
            throw new HttpsError("invalid-argument", "Fields are not correct", validated); // TODO: translate
        } else {
            db.collection(schoolsCollection).add(param.data)
                .then((ref) => {
                    return ref.get();
                })
                .then((doc) => {
                    const school = {
                        ...doc.data(),
                        id: doc.id,
                    };
                    resolve(school as ISchool);
                })
                .catch(errorCallback);
        }
    }));
});

/////////////////////////////
// Authentication triggers //
/////////////////////////////

/**
 * Disables users after they sign up. This prevents random people somehow succeeded to sign up from logging in.
 */
export const disableUserAfterSignUp = functions.auth.user().onCreate((user: UserRecord): void => {
    auth.updateUser(user.uid, {
        disabled: true,
    });
});
