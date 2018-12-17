import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { CallableContext, HttpsError } from "firebase-functions/lib/providers/https";
import { ISchool, validateSchool } from "shared/dist/models/School";
import { IFirebaseFunctionParam } from "shared/dist/firebase/interfaces";

const db = admin.firestore();

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
