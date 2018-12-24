import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { UserRecord } from "firebase-functions/lib/providers/auth";

admin.initializeApp();
const auth = admin.auth();

/**
 * Disables users after they sign up. This prevents random people (somehow succeeded to sign up) from logging in.
 */
export const disableUserAfterSignUp = functions.auth.user().onCreate((user: UserRecord): void => {
    auth.updateUser(user.uid, {
        disabled: true,
    });
});
