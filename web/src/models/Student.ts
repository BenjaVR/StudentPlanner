import { IFirebaseTable } from "../services/FirestoreServiceBase";

export interface IStudent extends IFirebaseTable {
    firstName: string;
    lastName?: string;
    schoolId?: string;
    educationId?: string;
}
