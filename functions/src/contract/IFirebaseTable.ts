import { firestore } from "firebase-admin";

export interface IFirebaseTable {
    id?: string;
    createdTimestamp?: firestore.Timestamp;
    updatedTimestamp?: firestore.Timestamp;
}
