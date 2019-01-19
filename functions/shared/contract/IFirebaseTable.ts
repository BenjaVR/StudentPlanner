import { Timestamp } from "@google-cloud/firestore";

export interface IFirebaseTable {
    id?: string;
    createdTimestamp?: Timestamp;
    updatedTimestamp?: Timestamp;
}
